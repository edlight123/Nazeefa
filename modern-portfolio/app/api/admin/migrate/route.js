import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import path from 'node:path';

import { FieldValue } from 'firebase-admin/firestore';
import { getDb, getBucket } from '../../../../lib/firebaseAdmin';
import { getTokenFromRequest, verifyToken } from '../../../../lib/auth';
import { DataStore as LegacyStore } from '../../../../lib/dataStoreVercel';

async function verifyAuth(request) {
  const token = getTokenFromRequest(request);
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload && payload.role === 'admin';
}

function stableId(input) {
  return createHash('sha256').update(String(input)).digest('hex').slice(0, 24);
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

export async function POST(request) {
  try {
    const isAuthed = await verifyAuth(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = request.headers.get('x-migration-secret');
    if (!process.env.MIGRATION_SECRET || secret !== process.env.MIGRATION_SECRET) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const allowOverwrite = Boolean(body.allowOverwrite);

    const db = getDb();
    const bucket = getBucket();

    const legacyArticles = LegacyStore.getArticles();
    const legacyPhotos = LegacyStore.getPhotos();

    // Avoid accidental double-migrations by default
    if (!allowOverwrite) {
      const a = await db.collection('articles').limit(1).get();
      const p = await db.collection('photos').limit(1).get();
      if (!a.empty || !p.empty) {
        return NextResponse.json(
          {
            success: false,
            message: 'Firestore collections are not empty. Re-run with allowOverwrite=true if you really want to re-migrate.',
            articlesEmpty: a.empty,
            photosEmpty: p.empty
          },
          { status: 409 }
        );
      }
    }

    // Articles
    {
      const batch = db.batch();
      for (const a of legacyArticles) {
        const id = a.id && a.id.length < 64 ? a.id : stableId(a.href);
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
    }

    // Photos: download and upload
    let uploaded = 0;
    let skipped = 0;
    for (const p of legacyPhotos) {
      const photoId = p.id && p.id.length < 64 ? p.id : stableId(p.src);
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
        uploaded += 1;
      } catch (e) {
        skipped += 1;
      }

      await db.collection('photos').doc(photoId).set(
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

    return NextResponse.json({
      success: true,
      migrated: {
        articles: legacyArticles.length,
        photos: legacyPhotos.length,
        photosUploaded: uploaded,
        photosSkipped: skipped
      }
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: error?.message || 'Migration failed' },
      { status: 500 }
    );
  }
}
