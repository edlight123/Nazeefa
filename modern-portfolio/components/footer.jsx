export default function Footer() {
  return (
    <footer className="border-t border-slate-200/50 dark:border-slate-800/50 py-12 bg-slate-50/30 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto container-px">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a 
              href="https://www.linkedin.com/in/nazeefa-ahmed/" 
              target="_blank" 
              rel="noopener"
              className="text-slate-600 dark:text-slate-400 hover:text-ocean-500 dark:hover:text-ocean-400 transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href="https://substack.com/@nazeefaahmed" 
              target="_blank" 
              rel="noopener"
              className="text-slate-600 dark:text-slate-400 hover:text-ocean-500 dark:hover:text-ocean-400 transition-colors"
            >
              Substack
            </a>
            <a 
              href="mailto:nazeefa.ahm@gmail.com"
              className="text-slate-600 dark:text-slate-400 hover:text-ocean-500 dark:hover:text-ocean-400 transition-colors"
            >
              Email
            </a>
          </div>
          
          <div className="text-sm text-slate-600 dark:text-slate-400 text-center md:text-right">
            <div className="mb-1">
              © {new Date().getFullYear()} Nazeefa Ahmed. All rights reserved.
            </div>
            <div className="text-xs">
              Created by{' '}
              <a 
                href="https://www.edlight.org/labs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-ocean-500 dark:hover:text-ocean-400 transition-colors underline"
              >
                EdLight Labs
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
