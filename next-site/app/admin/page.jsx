'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal flex items-center justify-center">
      <div className="text-slate-600 dark:text-slate-400">
        Redirecting to admin login...
      </div>
    </div>
  );
}