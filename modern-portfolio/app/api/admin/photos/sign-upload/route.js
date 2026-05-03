import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../../../lib/auth';
import { getBucket } from '../../../../../lib/firebaseAdmin';

// Generous caps now that uploads bypass the Vercel function body limit.
const MAX_IMAGE_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

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

function getValidation(mediaType) {
  if (mediaType === 'video') {
    return {
      prefix: 'video/',
      maxBytes: MAX_VIDEO_BYTES,
      maxLabel: '2GB',
      folder: 'videos',
      fallbackExt: 'mp4'
    };
  }
  return {
    prefix: 'image/',
    maxBytes: MAX_IMAGE_BYTES,
    maxLabel: '25MB',
    folder: 'photos',
    fallbackExt: 'jpg'
  };
}

export async function POST(request) {
  try {
    const isAuthed = await verifyAuth(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const mediaType = body?.mediaType === 'video' ? 'video' : 'image';
    const contentType = String(body?.contentType || '').toLowerCase();
    const size = Number(body?.size || 0);
    const originalName = body?.filename || 'media';

    const { prefix, maxBytes, maxLabel, folder, fallbackExt } = getValidation(mediaType);

    if (!contentType.startsWith(prefix)) {
      return NextResponse.json(
        {
          error:
            mediaType === 'video'
              ? 'Only video uploads are allowed for this upload type'
              : 'Only image uploads are allowed for this upload type'
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: 'Invalid file size' }, { status: 400 });
    }

    if (size > maxBytes) {
      return NextResponse.json(
        { error: `File is too large (max ${maxLabel})` },
        { status: 400 }
      );
    }

    const safeName = sanitizeFilenamePart(originalName);
    const extFromType = contentType.split('/')[1]?.toLowerCase();
    const contentExt = extFromType && extFromType !== 'jpeg' ? extFromType : fallbackExt;
    const hasExt = /\.[a-zA-Z0-9]{2,5}$/.test(safeName);
    const finalName = hasExt ? safeName : `${safeName || 'media'}.${contentExt}`;

    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const rand = Math.random().toString(16).slice(2);
    const storagePath = `${folder}/${yyyy}/${mm}/${dd}/${Date.now()}-${rand}-${finalName}`;

    const bucket = getBucket();
    const file = bucket.file(storagePath);

    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType
    });

    return NextResponse.json({
      uploadUrl,
      storagePath,
      contentType,
      mediaType,
      maxBytes
    });
  } catch (error) {
    console.error('Error creating signed upload URL:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create upload URL' },
      { status: 500 }
    );
  }
}
