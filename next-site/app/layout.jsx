export const metadata = {
  title: 'Nazeefa Ahmed — Reporter • Researcher • Photographer',
  description: 'New York–based multimedia reporter and student at the Craig Newmark Graduate School of Journalism.',
  metadataBase: new URL('https://nazeefaahmed.com'),
  openGraph: {
    title: 'Nazeefa Ahmed',
    description: 'Reporter. Researcher. Photographer.',
    url: 'https://nazeefaahmed.com',
    siteName: 'Nazeefa Ahmed',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nazeefa Ahmed',
    description: 'Reporter. Researcher. Photographer.'
  }
};

import './globals.css';
import { ThemeProvider } from '../components/theme-provider';
import Header from '../components/header';
import Footer from '../components/footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
