"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Rooted at "/" rather than bare fragments so these keep reaching the homepage
// sections from any other route.
const NAV_LINKS = [
  { href: '/#photos', label: 'On camera' },
  { href: '/#work', label: 'Articles' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      className={`fixed top-0 left-0 right-0 z-50 bg-paper transition-[border-color] duration-200 ${
        scrolled || menuOpen ? 'border-b border-rule' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto container-px py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg font-semibold tracking-[-0.01em]">
          Nazeefa Ahmed
        </Link>

        <nav className="flex items-center gap-7">
          <div className="hidden sm:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-muted hover:text-rust transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 text-muted hover:text-ink transition-colors"
            aria-label="Toggle theme"
          >
            <svg className="w-4 h-4 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg className="w-4 h-4 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="p-1.5 -mr-1.5 text-muted hover:text-ink transition-colors sm:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {menuOpen && (
        <nav className="sm:hidden border-t border-rule bg-paper">
          <div className="max-w-6xl mx-auto container-px py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-muted py-3.5 rule-b last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
