'use client';

import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const DraggablePhoto = ({ photo, index, movePhoto, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'photo',
    item: { id: photo.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'photo',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        movePhoto(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <button
        onClick={() => onDelete(photo.id)}
        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        title="Delete photo"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
      
      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
          {photo.src.split('/').pop()}
        </p>
      </div>
    </div>
  );
};

const PhotoForm = ({ onUploaded, onCancel }) => {
  const [alt, setAlt] = useState('Photography by Nazeefa Ahmed');
  const [file, setFile] = useState(null);
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

  const resetError = () => setError('');

  const validateAndSetFile = (nextFile) => {
    resetError();
    if (!nextFile) return;

    if (!nextFile.type?.startsWith('image/')) {
      setError('Please choose an image file (jpg, png, webp, etc.).');
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    if (nextFile.size > maxBytes) {
      setError('Image is too large (max 10MB).');
      return;
    }

    setFile(nextFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetError();

    if (!file) {
      setError('Please drop or choose an image file.');
      return;
    }

    try {
      setUploading(true);

      const body = new FormData();
      body.append('file', file);
      body.append('alt', alt);
      body.append('originalName', file.name);

      const response = await fetch('/api/admin/photos/upload', {
        method: 'POST',
        body,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to upload photo');
      }

      const data = await response.json();
      onUploaded(data.photo);
    } catch (err) {
      setError(err?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        Add New Photo
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Image File
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
                  Drag & drop an image here
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Or choose a file (max 10MB)
                </p>
              </div>

              <label className="inline-flex items-center justify-center cursor-pointer bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium transition-colors">
                <input
                  type="file"
                  accept="image/*"
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

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Alt Text
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            required
          />
        </div>

        {previewUrl && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Preview
            </label>
            <div className="relative aspect-[4/3] w-48 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
              <Image src={previewUrl} alt={alt} fill className="object-cover" sizes="192px" />
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
            {uploading ? 'Uploading…' : 'Upload Photo'}
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

export default function PhotoManager() {
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

  const movePhoto = (dragIndex, hoverIndex) => {
    const draggedPhoto = photos[dragIndex];
    const newPhotos = [...photos];
    newPhotos.splice(dragIndex, 1);
    newPhotos.splice(hoverIndex, 0, draggedPhoto);
    setPhotos(newPhotos);
  };

  const saveOrder = async () => {
    try {
      const orderedIds = photos.map(photo => photo.id);
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

  const handleSubmit = async (formData) => {
    try {
      await fetchPhotos();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add photo:', error);
      alert('Failed to add photo');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        const response = await fetch(`/api/admin/photos?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchPhotos();
        } else {
          alert('Failed to delete photo');
        }
      } catch (error) {
        console.error('Failed to delete photo:', error);
        alert('Failed to delete photo');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading photos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Photo Management
        </h2>
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
            Add Photo
          </button>
        </div>
      </div>

      {showForm && (
        <PhotoForm
          onUploaded={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Drag and drop photos to reorder them, then click "Save Order"
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {photos.map((photo, index) => (
            <DraggablePhoto
              key={photo.id}
              photo={photo}
              index={index}
              movePhoto={movePhoto}
              onDelete={handleDelete}
            />
          ))}
        </div>
        
        {photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No photos yet. Add your first photo to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}