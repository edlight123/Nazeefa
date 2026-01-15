import { NextResponse } from 'next/server';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

import { createToken } from '../../../../lib/auth';
import { getDb, getFirebaseAdminApp } from '../../../../lib/firebaseAdmin';

async function isAdminEmail(db, email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return false;

  // Support either:
  // 1) doc id = email
  // 2) a doc with field { email: "..." }
  const byId = await db.collection('admin').doc(normalized).get();
  if (byId.exists) return true;

  const byField = await db
    .collection('admin')
    .where('email', '==', normalized)
    .limit(1)
    .get();
  return !byField.empty;
}

export async function POST(request) {
  try {
    const { idToken } = await request.json().catch(() => ({}));
    if (!idToken) {
      return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
    }

    const app = getFirebaseAdminApp();
    const decoded = await getAdminAuth(app).verifyIdToken(idToken);

    const email = decoded?.email;
    if (!email) {
      return NextResponse.json({ error: 'No email on Google account' }, { status: 403 });
    }

    const db = getDb();
    const allowed = await isAdminEmail(db, email);
    if (!allowed) {
      return NextResponse.json(
        { error: 'This Google account is not allowed to access admin' },
        { status: 403 }
      );
    }

    const token = await createToken({ role: 'admin', email: String(email).toLowerCase() });

    const response = NextResponse.json({ success: true });
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json({ error: 'Google login failed' }, { status: 500 });
  }
}
