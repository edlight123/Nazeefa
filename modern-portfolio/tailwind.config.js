/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Palette lives in globals.css as CSS variables so the dark theme is a
      // single block of overrides instead of a `dark:` twin on every element.
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        soft: 'var(--soft)',
        rust: 'var(--rust)',
        rule: 'var(--rule)',
        muted: 'var(--muted)',
        tile: 'var(--tile)',

        // Retained for the admin panel, which is a separate surface and was not
        // part of this restyle. The public pages use the tokens above.
        cream: '#FFFBF5',
        charcoal: '#1A1A1A',
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        ocean: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        'display-xl': ['clamp(44px, 7.5vw, 78px)', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
        'display-lg': ['clamp(40px, 7vw, 72px)', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
        'display-md': ['clamp(30px, 4.5vw, 46px)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
