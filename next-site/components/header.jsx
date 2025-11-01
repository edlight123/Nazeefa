import Link from 'next/link';
import { ThemeToggleButton } from './theme-provider';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/60 dark:bg-black/30 border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto container-px py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-extrabold tracking-tight text-lg">
          Nazeefa Ahmed
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="#bylines" className="hover:underline underline-offset-4">Bylines</Link>
          <Link href="#photos" className="hover:underline underline-offset-4">Photos</Link>
          <Link href="#audio" className="hover:underline underline-offset-4">Audio/Print</Link>
          <Link href="#contact" className="hover:underline underline-offset-4">Contact</Link>
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
}
