import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function parseFirebaseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      'Missing FIREBASE_SERVICE_ACCOUNT_KEY env var (JSON string of service account).'
    );
  }

  try {
    // Support both raw JSON and base64-encoded JSON
    const maybeJson = raw.trim().startsWith('{')
      ? raw
      : Buffer.from(raw, 'base64').toString('utf8');
    const parsed = JSON.parse(maybeJson);

    // Service accounts often include literal \n sequences
    if (parsed.private_key && typeof parsed.private_key === 'string') {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }

    return parsed;
  } catch (e) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON (or base64 JSON).'
    );
  }
}

export function getFirebaseAdminApp() {
  if (getApps().length) return getApps()[0];

  const serviceAccount = parseFirebaseServiceAccount();

  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!storageBucket) {
    throw new Error('Missing FIREBASE_STORAGE_BUCKET env var (e.g. your-project.appspot.com).');
  }

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket
  });
}

export function getDb() {
  const app = getFirebaseAdminApp();
  return getFirestore(app);
}

export function getBucket() {
  const app = getFirebaseAdminApp();
  return getStorage(app).bucket();
}
