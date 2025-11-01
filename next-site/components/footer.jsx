export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10 mt-20">
      <div className="max-w-6xl mx-auto container-px py-8 text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Nazeefa Ahmed. All rights reserved.
      </div>
    </footer>
  );
}
