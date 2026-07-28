"use client";
import { useEmailContact } from '../lib/useEmailContact';

export default function ContactSection() {
  const { showCopied, handleEmailClick } = useEmailContact();

  return (
    <section id="contact" className="max-w-6xl mx-auto container-px mt-16 pt-16 pb-24 border-t border-ink">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
        Contact
      </p>

      <h2 className="font-serif text-display-md font-medium mt-4">
        Available for assignments
        <br />
        and staff roles.
      </h2>

      <div className="relative mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
        <button onClick={handleEmailClick} className="btn-ink">
          nazeefa.ahm@gmail.com
        </button>

        <a
          href="https://www.linkedin.com/in/nazeefa-ahmed/"
          target="_blank"
          rel="noopener noreferrer"
          className="link-rust text-[13px] font-medium"
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/nazreports/"
          target="_blank"
          rel="noopener noreferrer"
          className="link-rust text-[13px] font-medium"
        >
          Instagram
        </a>
        <a
          href="https://substack.com/@nazeefaahmed"
          target="_blank"
          rel="noopener noreferrer"
          className="link-rust text-[13px] font-medium"
        >
          Substack
        </a>

        {showCopied && (
          <span className="meta animate-fade-in">Email copied</span>
        )}
      </div>
    </section>
  );
}
