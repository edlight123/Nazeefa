'use client';

import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const DraggableArticle = ({ article, index, moveArticle, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'article',
    item: { id: article.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'article',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveArticle(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`card p-4 cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-ocean-500 uppercase tracking-wider">
              {article.outlet}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {article.date}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            {article.title}
          </h3>
          <a
            href={article.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ocean-500 hover:text-ocean-600 truncate block"
          >
            {article.href}
          </a>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(article)}
            className="p-2 text-slate-400 hover:text-ocean-500 transition-colors"
            title="Edit article"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(article.id)}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Delete article"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ArticleForm = ({ article, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    href: article?.href || '',
    outlet: article?.outlet || '',
    date: article?.date || new Date().getFullYear().toString(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
        {article ? 'Edit Article' : 'Add New Article'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            URL
          </label>
          <input
            type="url"
            value={formData.href}
            onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Outlet
            </label>
            <input
              type="text"
              value={formData.outlet}
              onChange={(e) => setFormData(prev => ({ ...prev, outlet: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Year
            </label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              required
            />
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {article ? 'Update Article' : 'Add Article'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default function ArticleManager() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/articles');
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const moveArticle = (dragIndex, hoverIndex) => {
    const draggedArticle = articles[dragIndex];
    const newArticles = [...articles];
    newArticles.splice(dragIndex, 1);
    newArticles.splice(hoverIndex, 0, draggedArticle);
    setArticles(newArticles);
  };

  const saveOrder = async () => {
    try {
      const orderedIds = articles.map(article => article.id);
      await fetch('/api/admin/articles/reorder', {
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
      const url = editingArticle ? '/api/admin/articles' : '/api/admin/articles';
      const method = editingArticle ? 'PUT' : 'POST';
      const body = editingArticle 
        ? JSON.stringify({ id: editingArticle.id, ...formData })
        : JSON.stringify(formData);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        fetchArticles();
        setEditingArticle(null);
        setShowForm(false);
      } else {
        alert('Failed to save article');
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Failed to save article');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`/api/admin/articles?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchArticles();
        } else {
          alert('Failed to delete article');
        }
      } catch (error) {
        console.error('Failed to delete article:', error);
        alert('Failed to delete article');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading articles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Article Management
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
            Add Article
          </button>
        </div>
      </div>

      {(showForm || editingArticle) && (
        <ArticleForm
          article={editingArticle}
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditingArticle(null);
            setShowForm(false);
          }}
        />
      )}

      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Drag and drop articles to reorder them, then click "Save Order"
        </p>
        
        {articles.map((article, index) => (
          <DraggableArticle
            key={article.id}
            article={article}
            index={index}
            moveArticle={moveArticle}
            onEdit={setEditingArticle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}