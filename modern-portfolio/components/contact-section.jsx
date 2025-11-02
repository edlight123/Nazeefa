"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactSection() {
  const [showCopied, setShowCopied] = useState(false);

  const handleEmailClick = () => {
    const email = 'nazeefa.ahm@gmail.com';
    
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile: use mailto to open default email app
      window.location.href = `mailto:${email}`;
    } else {
      // On desktop: open Gmail compose in a new tab
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
      
      // Also copy to clipboard as fallback
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 3000);
        });
      }
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-slate-50 to-cream dark:from-slate-900 dark:to-charcoal">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl lg:text-display-md font-bold mb-6 bg-gradient-to-r from-ocean-500 to-ocean-600 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Available for freelance assignments, collaborations, and storytelling opportunities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleEmailClick}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Me
            </button>
            <a
              href="https://www.linkedin.com/in/nazeefa-ahmed/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            
            {showCopied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute mt-24 px-4 py-2 bg-ocean-500 text-white text-sm rounded-lg shadow-lg"
              >
                ✓ Email copied to clipboard!
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
