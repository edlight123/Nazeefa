export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="max-w-6xl mx-auto container-px py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/nazeefa-ahmed/"
              target="_blank"
              rel="noopener"
              className="meta hover:text-rust transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://substack.com/@nazeefaahmed"
              target="_blank"
              rel="noopener"
              className="meta hover:text-rust transition-colors"
            >
              Substack
            </a>
            <a
              href="mailto:nazeefa.ahm@gmail.com"
              className="meta hover:text-rust transition-colors"
            >
              Email
            </a>
          </div>

          <div className="meta md:text-right">
            © {new Date().getFullYear()} Nazeefa Ahmed
          </div>
        </div>
      </div>
    </footer>
  );
}
