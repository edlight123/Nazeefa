import { NextResponse } from 'next/server';
import { DataStore } from '../../../../../lib/dataStoreFirebase';
import { getTokenFromRequest, verifyToken } from '../../../../../lib/auth';
import { getBucket } from '../../../../../lib/firebaseAdmin';

async function verifyAuth(request) {
  const token = getTokenFromRequest(request);
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload && payload.role === 'admin';
}

function sanitizeFilenamePart(name) {
  return String(name || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export async function POST(request) {
  try {
    const isAuthed = await verifyAuth(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get('file');
    const alt = form.get('alt') || 'Photography by Nazeefa Ahmed';
    const originalName = form.get('originalName') || (file && file.name) || 'photo';

    if (!file) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    if (typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'Invalid upload' }, { status: 400 });
    }

    const contentType = file.type || 'application/octet-stream';
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const maxBytes = 10 * 1024 * 1024;
    if (bytes.length > maxBytes) {
      return NextResponse.json({ error: 'Image is too large (max 10MB)' }, { status: 400 });
    }

    const safeName = sanitizeFilenamePart(originalName);
    const extFromType = contentType.split('/')[1]?.toLowerCase();
    const contentExt = extFromType && extFromType !== 'jpeg' ? extFromType : 'jpg';
    const hasExt = /\.[a-zA-Z0-9]{2,5}$/.test(safeName);
    const finalName = hasExt ? safeName : `${safeName || 'photo'}.${contentExt}`;

    const bucket = getBucket();
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const rand = Math.random().toString(16).slice(2);

    const storagePath = `photos/${yyyy}/${mm}/${dd}/${Date.now()}-${rand}-${finalName}`;
    const object = bucket.file(storagePath);

    await object.save(bytes, {
      contentType,
      resumable: false,
      metadata: {
        cacheControl: 'public, max-age=31536000, immutable'
      }
    });

    await object.makePublic();
    const publicUrl = object.publicUrl();

    const newPhoto = await DataStore.addPhoto({
      src: publicUrl,
      alt,
      storagePath
    });

    return NextResponse.json({ success: true, photo: newPhoto });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}
