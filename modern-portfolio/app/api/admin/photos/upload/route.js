import { NextResponse } from 'next/server';
import { DataStore } from '../../../../../lib/dataStoreFirebase';
import { getTokenFromRequest, verifyToken } from '../../../../../lib/auth';
import { getBucket } from '../../../../../lib/firebaseAdmin';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

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

function parseMediaType(value, fileType = '') {
  if (value === 'video') return 'video';
  if (fileType.startsWith('video/')) return 'video';
  return 'image';
}

function getFileValidation(mediaType) {
  if (mediaType === 'video') {
    return {
      prefix: 'video/',
      maxBytes: MAX_VIDEO_BYTES,
      maxLabel: '500MB',
      folder: 'videos',
      fallbackExt: 'mp4'
    };
  }

  return {
    prefix: 'image/',
    maxBytes: MAX_IMAGE_BYTES,
    maxLabel: '10MB',
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

    const form = await request.formData();
    const file = form.get('file');
    const alt = form.get('alt') || 'Photography by Nazeefa Ahmed';
    const originalName = form.get('originalName') || (file && file.name) || 'media';

    if (!file) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    if (typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'Invalid upload' }, { status: 400 });
    }

    const contentType = file.type || 'application/octet-stream';
    const mediaType = parseMediaType(form.get('mediaType'), contentType);
    const { prefix, maxBytes, maxLabel, folder, fallbackExt } = getFileValidation(mediaType);

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

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length > maxBytes) {
      return NextResponse.json(
        {
          error:
            mediaType === 'video'
              ? `Video is too large (max ${maxLabel})`
              : `Image is too large (max ${maxLabel})`
        },
        { status: 400 }
      );
    }

    const safeName = sanitizeFilenamePart(originalName);
    const extFromType = contentType.split('/')[1]?.toLowerCase();
    const contentExt = extFromType && extFromType !== 'jpeg' ? extFromType : fallbackExt;
    const hasExt = /\.[a-zA-Z0-9]{2,5}$/.test(safeName);
    const finalName = hasExt ? safeName : `${safeName || 'media'}.${contentExt}`;

    const bucket = getBucket();
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const rand = Math.random().toString(16).slice(2);

    const storagePath = `${folder}/${yyyy}/${mm}/${dd}/${Date.now()}-${rand}-${finalName}`;
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
      type: mediaType,
      videoKind: mediaType === 'video' ? 'upload' : null,
      storagePath
    });

    return NextResponse.json({ success: true, photo: newPhoto });
  } catch (error) {
    console.error('Error uploading media:', error);

    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    const isMissingBucket =
      error?.code === 404 ||
      /specified bucket does not exist/i.test(String(error?.message || ''));

    if (isMissingBucket) {
      return NextResponse.json(
        {
          error: 'Firebase Storage bucket does not exist',
          configuredBucket: bucketName || null,
          hint:
            'Enable Firebase Storage for the project and set FIREBASE_STORAGE_BUCKET to the exact bucket name (e.g. your-project.appspot.com). Do not include gs://'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}
