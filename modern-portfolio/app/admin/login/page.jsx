'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirebaseClientAuth } from '../../../lib/firebaseClient';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const auth = getFirebaseClientAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch('/api/admin/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        try {
          await signOut(auth);
        } catch (_) {
          // ignore
        }
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/admin/dashboard');
    } catch (e) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Admin Login
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Sign in to manage your website content
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-ocean-500 hover:bg-ocean-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}