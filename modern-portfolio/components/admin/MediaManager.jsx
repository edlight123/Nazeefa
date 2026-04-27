'use client';

import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const toFileLabel = (src = '') => {
  try {
    const url = new URL(src);
    const base = url.pathname.split('/').pop();
    return base || url.hostname;
  } catch {
    return src || 'media';
  }
};

const parseEmbedUrl = (value) => {
  try {
    const parsed = new URL(String(value || '').trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';

    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname;

    if (host.includes('youtube.com') || host === 'youtu.be') {
      if (host === 'youtu.be') {
        const id = path.slice(1).split('/')[0];
        return id ? `https://www.youtube.com/embed/${id}` : '';
      }
      if (path.startsWith('/embed/')) return parsed.toString();
      if (path.startsWith('/shorts/')) {
        const id = path.split('/')[2];
        return id ? `https://www.youtube.com/embed/${id}` : '';
      }
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }

    if (host.includes('vimeo.com')) {
      if (host === 'player.vimeo.com' && path.startsWith('/video/')) {
        return parsed.toString();
      }
      const maybeId = path.split('/').filter(Boolean)[0];
      return maybeId && /^\d+$/.test(maybeId)
        ? `https://player.vimeo.com/video/${maybeId}`
        : '';
    }

    if (host.includes('tiktok.com')) {
      if (path.startsWith('/embed/')) return parsed.toString();
      const match = path.match(/\/video\/(\d+)/);
      return match?.[1] ? `https://www.tiktok.com/embed/v2/${match[1]}` : '';
    }

    return path.includes('/embed/') ? parsed.toString() : '';
  } catch {
    return '';
  }
};

const DraggableMedia = ({ media, index, moveMedia, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'photo',
    item: { id: media.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'photo',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveMedia(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const isVideo = media.type === 'video';
  const embedUrl = isVideo ? media.embedUrl || media.src : '';

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`group relative aspect-[4/3] photo-aspect-4-3 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      {isVideo ? (
        embedUrl ? (
          <iframe
            src={embedUrl}
            title={media.alt || 'Embedded video'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video src={media.src} className="w-full h-full object-cover" controls playsInline preload="metadata" />
        )
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <button
        onClick={() => onDelete(media.id)}
        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        title="Delete media"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
          {isVideo ? 'Video' : 'Photo'} · {toFileLabel(media.src)}
        </p>
      </div>
    </div>
  );
};

const MediaForm = ({ onUploaded, onCancel }) => {
  const [mediaType, setMediaType] = useState('image');
  const [videoInputMode, setVideoInputMode] = useState('upload');
  const [file, setFile] = useState(null);
  const [embedInput, setEmbedInput] = useState('');
  const [alt, setAlt] = useState('Photography by Nazeefa Ahmed');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    setFile(null);
    setEmbedInput('');
    setError('');
    setAlt(mediaType === 'video' ? 'Video by Nazeefa Ahmed' : 'Photography by Nazeefa Ahmed');
  }, [mediaType, videoInputMode]);

  const resetError = () => setError('');

  const validateAndSetFile = (nextFile) => {
    resetError();
    if (!nextFile) return;

    const isVideo = mediaType === 'video';
    const expectedType = isVideo ? 'video/' : 'image/';

    if (!nextFile.type?.startsWith(expectedType)) {
      setError(
        isVideo
          ? 'Please choose a video file (mp4, mov, webm, etc.).'
          : 'Please choose an image file (jpg, png, webp, etc.).'
      );
      return;
    }

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (nextFile.size > maxBytes) {
      setError(isVideo ? 'Video is too large (max 50MB).' : 'Image is too large (max 10MB).');
      return;
    }

    setFile(nextFile);
  };

  const uploadFileMedia = async () => {
    if (!file) {
      setError(
        mediaType === 'video' ? 'Please drop or choose a video file.' : 'Please drop or choose an image file.'
      );
      return;
    }

    const body = new FormData();
    body.append('file', file);
    body.append('alt', alt);
    body.append('mediaType', mediaType);
    body.append('originalName', file.name);

    const response = await fetch('/api/admin/photos/upload', {
      method: 'POST',
      body,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to upload media');
    }

    const data = await response.json();
    onUploaded(data.photo);
  };

  const createEmbeddedVideo = async () => {
    const embedUrl = parseEmbedUrl(embedInput);
    if (!embedUrl) {
      setError('Please paste a valid embeddable URL (YouTube, Vimeo, TikTok, or direct embed link).');
      return;
    }

    const response = await fetch('/api/admin/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'video',
        videoKind: 'embed',
        embedUrl,
        src: embedUrl,
        alt,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to add embedded video');
    }

    const data = await response.json();
    onUploaded(data.photo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetError();

    try {
      setUploading(true);

      if (mediaType === 'video' && videoInputMode === 'embed') {
        await createEmbeddedVideo();
      } else {
        await uploadFileMedia();
      }
    } catch (err) {
      setError(err?.message || 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const embedPreview = mediaType === 'video' && videoInputMode === 'embed' ? parseEmbedUrl(embedInput) : '';

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Add New Media</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Media Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMediaType('image')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                mediaType === 'image'
                  ? 'border-ocean-500 bg-ocean-50 text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-300'
                  : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              Image
            </button>
            <button
              type="button"
              onClick={() => setMediaType('video')}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                mediaType === 'video'
                  ? 'border-ocean-500 bg-ocean-50 text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-300'
                  : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              Video
            </button>
          </div>
        </div>

        {mediaType === 'video' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Video Input</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVideoInputMode('upload')}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  videoInputMode === 'upload'
                    ? 'border-ocean-500 bg-ocean-50 text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-300'
                    : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                Upload file
              </button>
              <button
                type="button"
                onClick={() => setVideoInputMode('embed')}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  videoInputMode === 'embed'
                    ? 'border-ocean-500 bg-ocean-50 text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-300'
                    : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                Embed URL
              </button>
            </div>
          </div>
        )}

        {(mediaType === 'image' || videoInputMode === 'upload') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {mediaType === 'video' ? 'Video File' : 'Image File'}
            </label>

            <div
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDraggingOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDraggingOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDraggingOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDraggingOver(false);
                const dropped = e.dataTransfer?.files?.[0];
                validateAndSetFile(dropped);
              }}
              className={`rounded-xl border-2 border-dashed p-5 transition-colors bg-white dark:bg-slate-800 ${
                isDraggingOver
                  ? 'border-ocean-500 bg-ocean-50/50 dark:bg-ocean-950/20'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Drag & drop a {mediaType === 'video' ? 'video' : 'photo'} here
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Or choose a file (max {mediaType === 'video' ? '50MB' : '10MB'})
                  </p>
                </div>

                <label className="inline-flex items-center justify-center cursor-pointer bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium transition-colors">
                  <input
                    type="file"
                    accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                    className="hidden"
                    onChange={(e) => validateAndSetFile(e.target.files?.[0])}
                  />
                  Choose File
                </label>
              </div>

              {file && (
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 truncate">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {mediaType === 'video' && videoInputMode === 'embed' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Embeddable Video URL</label>
            <input
              type="url"
              value={embedInput}
              onChange={(e) => setEmbedInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              required
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Supports YouTube, Vimeo, TikTok, and direct embed links.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {mediaType === 'video' ? 'Caption' : 'Alt Text'}
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            required
          />
        </div>

        {previewUrl && mediaType === 'image' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preview</label>
            <div className="relative aspect-[4/3] w-48 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
              <Image src={previewUrl} alt={alt} fill className="object-cover" sizes="192px" />
            </div>
          </div>
        )}

        {previewUrl && mediaType === 'video' && videoInputMode === 'upload' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preview</label>
            <video src={previewUrl} className="w-72 rounded-lg bg-slate-900" controls playsInline preload="metadata" />
          </div>
        )}

        {embedPreview && mediaType === 'video' && videoInputMode === 'embed' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preview</label>
            <div className="w-72 aspect-video rounded-lg overflow-hidden bg-slate-900">
              <iframe
                src={embedPreview}
                title="Video embed preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={uploading}
            className="bg-ocean-500 hover:bg-ocean-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {uploading ? 'Saving…' : mediaType === 'image' ? 'Upload Photo' : 'Add Video'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={uploading}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-60 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default function MediaManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/admin/photos');
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const moveMedia = (dragIndex, hoverIndex) => {
    const draggedMedia = photos[dragIndex];
    const newMedia = [...photos];
    newMedia.splice(dragIndex, 1);
    newMedia.splice(hoverIndex, 0, draggedMedia);
    setPhotos(newMedia);
  };

  const saveOrder = async () => {
    try {
      const orderedIds = photos.map((photo) => photo.id);
      await fetch('/api/admin/photos/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      alert('Order saved successfully!');
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('Failed to save order');
    }
  };

  const handleSubmit = async () => {
    try {
      await fetchPhotos();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add media:', error);
      alert('Failed to add media');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this media item?')) {
      try {
        const response = await fetch(`/api/admin/photos?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchPhotos();
        } else {
          alert('Failed to delete media');
        }
      } catch (error) {
        console.error('Failed to delete media:', error);
        alert('Failed to delete media');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading media...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Photo & Video Management</h2>
        <div className="flex gap-3">
          <button
            onClick={saveOrder}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Save Order
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Media
          </button>
        </div>
      </div>

      {showForm && <MediaForm onUploaded={handleSubmit} onCancel={() => setShowForm(false)} />}

      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Drag and drop media items to reorder them, then click "Save Order"
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {photos.map((photo, index) => (
            <DraggableMedia key={photo.id} media={photo} index={index} moveMedia={moveMedia} onDelete={handleDelete} />
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No media yet. Add your first photo or video to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
