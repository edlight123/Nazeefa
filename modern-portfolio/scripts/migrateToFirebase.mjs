import { createHash } from 'node:crypto';
import path from 'node:path';
import { Buffer } from 'node:buffer';

import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function parseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY');

  const maybeJson = raw.trim().startsWith('{')
    ? raw
    : Buffer.from(raw, 'base64').toString('utf8');

  const parsed = JSON.parse(maybeJson);
  if (parsed.private_key && typeof parsed.private_key === 'string') {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  }
  return parsed;
}

function getAdmin() {
  if (getApps().length) return getApps()[0];
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!storageBucket) throw new Error('Missing FIREBASE_STORAGE_BUCKET');

  return initializeApp({
    credential: cert(parseServiceAccount()),
    storageBucket
  });
}

function guessExt(url, contentType) {
  const u = new URL(url);
  const extFromPath = path.extname(u.pathname);
  if (extFromPath) return extFromPath;
  if (contentType?.includes('jpeg')) return '.jpg';
  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('webp')) return '.webp';
  return '.bin';
}

function stableIdFromHref(href) {
  return createHash('sha256').update(String(href)).digest('hex').slice(0, 24);
}

async function main() {
  getAdmin();
  const db = getFirestore();
  const bucket = getStorage().bucket();

  // Existing content comes from current repo defaults.
  const { DataStore: LocalStore } = await import('../lib/dataStoreVercel.js');

  const articles = LocalStore.getArticles();
  const photos = LocalStore.getPhotos();

  console.log(`Found ${articles.length} articles, ${photos.length} photos in current store`);

  // Articles
  {
    const batch = db.batch();
    for (const a of articles) {
      const id = a.id && a.id.length < 64 ? a.id : stableIdFromHref(a.href);
      batch.set(
        db.collection('articles').doc(id),
        {
          title: a.title ?? '',
          href: a.href ?? '',
          outlet: a.outlet ?? '',
          date: a.date ?? '',
          order: typeof a.order === 'number' ? a.order : 0,
          migratedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    }
    await batch.commit();
    console.log('Migrated articles → Firestore');
  }

  // Photos: download and upload
  {
    for (const p of photos) {
      const photoId = p.id && p.id.length < 64 ? p.id : stableIdFromHref(p.src);
      let storagePath = null;
      let publicUrl = p.src;

      try {
        const res = await fetch(p.src, { method: 'GET' });
        if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
        const contentType = res.headers.get('content-type') || 'application/octet-stream';
        const buf = Buffer.from(await res.arrayBuffer());
        const ext = guessExt(p.src, contentType);

        storagePath = `photos/${photoId}${ext}`;
        const file = bucket.file(storagePath);

        await file.save(buf, {
          resumable: false,
          metadata: {
            contentType,
            cacheControl: 'public, max-age=31536000, immutable'
          }
        });

        await file.makePublic();
        publicUrl = file.publicUrl();
      } catch (e) {
        console.warn(`Photo upload skipped for ${p.src}: ${e.message}`);
      }

      await db
        .collection('photos')
        .doc(photoId)
        .set(
          {
            src: publicUrl,
            alt: p.alt ?? 'Photography by Nazeefa Ahmed',
            storagePath,
            order: typeof p.order === 'number' ? p.order : 0,
            migratedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
          },
          { merge: true }
        );
    }

    console.log('Migrated photos → Storage + Firestore');
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
