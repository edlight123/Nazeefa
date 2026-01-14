'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ArticleManager from '../../../components/admin/ArticleManager';
import PhotoManager from '../../../components/admin/PhotoManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('articles');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/articles');
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const runMigration = async () => {
    const secret = prompt('Enter MIGRATION_SECRET to run migration');
    if (!secret) return;

    try {
      setIsMigrating(true);
      setMigrationStatus(null);

      const response = await fetch('/api/admin/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-migration-secret': secret
        },
        body: JSON.stringify({ allowOverwrite: false })
      });

      const data = await response.json();
      if (!response.ok) {
        setMigrationStatus({ ok: false, data, status: response.status });
        return;
      }

      setMigrationStatus({ ok: true, data, status: response.status });
    } catch (error) {
      setMigrationStatus({ ok: false, data: { error: error.message }, status: 0 });
    } finally {
      setIsMigrating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-charcoal flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-cream dark:bg-charcoal">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Admin Dashboard
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-ocean-500 text-sm"
                >
                  View Site
                </a>
                <button
                  onClick={handleLogout}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'articles'
                    ? 'border-ocean-500 text-ocean-600 dark:text-ocean-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'photos'
                    ? 'border-ocean-500 text-ocean-600 dark:text-ocean-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setActiveTab('migration')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'migration'
                    ? 'border-ocean-500 text-ocean-600 dark:text-ocean-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Migration
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'articles' && <ArticleManager />}
          {activeTab === 'photos' && <PhotoManager />}
          {activeTab === 'migration' && (
            <div className="card p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Migration</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Push the repo’s default articles/photos into Firestore and upload photos to Firebase Storage.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={runMigration}
                  disabled={isMigrating}
                  className="bg-ocean-500 hover:bg-ocean-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isMigrating ? 'Migrating…' : 'Run Migration'}
                </button>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Requires server env var `MIGRATION_SECRET`.
                </span>
              </div>

              {migrationStatus && (
                <pre className="text-xs bg-slate-900 text-slate-100 rounded-lg p-4 overflow-auto">
{JSON.stringify(migrationStatus, null, 2)}
                </pre>
              )}
            </div>
          )}
        </main>
      </div>
    </DndProvider>
  );
}