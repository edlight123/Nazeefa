"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass shadow-lg shadow-slate-200/10 dark:shadow-slate-900/30' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto container-px py-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight hover:text-ocean-500 transition-colors"
        >
          Nazeefa Ahmed
        </Link>
        
        <nav className="flex items-center gap-8">
          <Link href="#work" className="text-sm font-medium link-animated hidden sm:inline-block">
            Work
          </Link>
          <Link href="#photos" className="text-sm font-medium link-animated hidden sm:inline-block">
            Photos
          </Link>
          <Link href="#contact" className="text-sm font-medium link-animated hidden sm:inline-block">
            Contact
          </Link>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="Toggle theme"
          >
            <svg className="w-5 h-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg className="w-5 h-5 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
