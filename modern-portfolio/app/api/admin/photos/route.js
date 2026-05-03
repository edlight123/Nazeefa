import { NextResponse } from 'next/server';
import { DataStore } from '../../../../lib/dataStoreFirebase';
import { getTokenFromRequest, verifyToken } from '../../../../lib/auth';
import { getBucket } from '../../../../lib/firebaseAdmin';

async function verifyAuth(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return false;
  }

  const payload = await verifyToken(token);
  return payload && payload.role === 'admin';
}

function ensureHttpUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function extractVideoEmbedUrl(value) {
  const parsed = ensureHttpUrl(value);
  if (!parsed) {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname;

  if (host.includes('youtube.com') || host === 'youtu.be') {
    if (host === 'youtu.be') {
      const id = path.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (path.startsWith('/embed/')) {
      return parsed.toString();
    }

    if (path.startsWith('/shorts/')) {
      const id = path.split('/')[2];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    const id = parsed.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (host.includes('vimeo.com')) {
    if (host === 'player.vimeo.com' && path.startsWith('/video/')) {
      return parsed.toString();
    }

    const maybeId = path.split('/').filter(Boolean)[0];
    if (maybeId && /^\d+$/.test(maybeId)) {
      return `https://player.vimeo.com/video/${maybeId}`;
    }
  }

  if (host.includes('tiktok.com')) {
    if (path.startsWith('/embed/')) {
      return parsed.toString();
    }

    const match = path.match(/\/video\/(\d+)/);
    if (match?.[1]) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
  }

  if (host.includes('instagram.com')) {
    if (path.endsWith('/embed') || path.endsWith('/embed/')) {
      return parsed.toString();
    }

    const match = path.match(/\/(p|reel|reels|tv)\/([^/]+)/);
    if (match?.[2]) {
      const kind = match[1] === 'reels' ? 'reel' : match[1];
      return `https://www.instagram.com/${kind}/${match[2]}/embed`;
    }
  }

  if (path.includes('/embed/')) {
    return parsed.toString();
  }

  return null;
}

export async function GET() {
  try {
    const photos = await DataStore.getPhotos();
    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isAuthed = await verifyAuth(request);
    if (!isAuthed) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const isVideo = payload?.type === 'video';

    if (isVideo) {
      const videoKind = payload?.videoKind === 'embed' ? 'embed' : 'upload';

      if (videoKind !== 'embed') {
        return NextResponse.json(
          { error: 'Only embedded videos can be created from this endpoint' },
          { status: 400 }
        );
      }

      const rawVideoUrl = payload?.embedUrl || payload?.src || payload?.url;
      const embedUrl = extractVideoEmbedUrl(rawVideoUrl);
      if (!embedUrl) {
        return NextResponse.json(
          {
            error:
              'Please provide a valid embeddable video URL (YouTube, Vimeo, TikTok, Instagram, or direct embed URL).'
          },
          { status: 400 }
        );
      }

      const newMedia = await DataStore.addPhoto({
        type: 'video',
        videoKind: 'embed',
        src: embedUrl,
        embedUrl,
        alt: payload?.alt || 'Video by Nazeefa Ahmed',
        storagePath: null
      });

      return NextResponse.json({ success: true, photo: newMedia });
    }

    const imageUrl = ensureHttpUrl(payload?.src || payload?.url);
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'A valid image URL is required' },
        { status: 400 }
      );
    }

    const newPhoto = await DataStore.addPhoto({
      src: imageUrl.toString(),
      alt: payload?.alt || 'Photography by Nazeefa Ahmed',
      type: 'image',
      videoKind: null,
      storagePath: null
    });

    return NextResponse.json({
      success: true,
      photo: newPhoto
    });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to add media' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const isAuthed = await verifyAuth(request);
    if (!isAuthed) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Photo ID is required' },
        { status: 400 }
      );
    }
    
    const existing = (await DataStore.getPhotos()).find((p) => p.id === id);
    if (existing?.storagePath) {
      try {
        const bucket = getBucket();
        await bucket.file(existing.storagePath).delete({ ignoreNotFound: true });
      } catch (e) {
        console.warn('Failed to delete storage object for photo:', e);
      }
    }

    await DataStore.deletePhoto(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Media deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}