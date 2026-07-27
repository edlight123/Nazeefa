// Seeds embedded media that used to be hardcoded in the page into Firestore,
// so the gallery has a single source of truth and the admin can manage it.
//
// Safe to re-run: each entry is matched on its embed URL and skipped if already
// present, so it can never create duplicates.
//
// Run from the modern-portfolio directory:
//   node --env-file=.env.local scripts/seedMedia.mjs

import { Buffer } from 'node:buffer';

import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PHOTOS_COLLECTION = 'photos';

// Recovered from git history — the TikTok that lived in its own hardcoded
// section before the gallery became data-driven.
const SEED_MEDIA = [
  {
    embedUrl: 'https://www.tiktok.com/embed/7537326976789400862',
    alt: 'Science Magazine TikTok by Nazeefa Ahmed',
  },
];

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
    storageBucket,
  });
}

async function main() {
  const db = getFirestore(getAdmin());
  const collection = db.collection(PHOTOS_COLLECTION);

  const snapshot = await collection.get();
  const existing = new Set(
    snapshot.docs.map((doc) => doc.get('embedUrl') || doc.get('src')).filter(Boolean)
  );

  let maxOrder = snapshot.empty
    ? -1
    : Math.max(...snapshot.docs.map((doc) => Number(doc.get('order') ?? -1)));

  let added = 0;
  for (const item of SEED_MEDIA) {
    if (existing.has(item.embedUrl)) {
      console.log(`skip (already present)  ${item.embedUrl}`);
      continue;
    }

    maxOrder += 1;
    await collection.add({
      src: item.embedUrl,
      embedUrl: item.embedUrl,
      alt: item.alt,
      type: 'video',
      videoKind: 'embed',
      storagePath: null,
      order: maxOrder,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`added  (order ${maxOrder})  ${item.embedUrl}`);
    added += 1;
  }

  console.log(`\nDone. ${added} added, ${SEED_MEDIA.length - added} skipped.`);
}

main().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
