"use client";
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'system';
    setTheme(stored);
    document.documentElement.classList.toggle('dark', getIsDark(stored));
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', getIsDark(next));
  }

  function getIsDark(value) {
    if (value === 'system') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return value === 'dark';
  }

  return (
    <div className={clsx('min-h-screen bg-background text-primary')}>{children}</div>
  );
}

export function ThemeToggleButton() {
  return (
    <button
      onClick={() => {
        const current = localStorage.getItem('theme') || 'system';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        document.documentElement.classList.toggle('dark', next === 'dark');
      }}
      className="rounded-full border border-black/10 dark:border-white/10 px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition"
      aria-label="Toggle theme"
    >
      Toggle theme
    </button>
  );
}
