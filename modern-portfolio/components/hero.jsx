"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient with parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-ocean-500/5 via-transparent to-slate-200/50 dark:from-ocean-500/10 dark:via-transparent dark:to-slate-800/50"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
        }}
      />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-ocean-400/10 dark:bg-ocean-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-slate-300/20 dark:bg-slate-700/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-7xl mx-auto container-px py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full glass text-sm font-medium mb-6"
            >
              📍 New York City
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-display-lg font-bold mb-6 tracking-tight">
              Multimedia
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-500 to-ocean-600">
                Journalist
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl">
              Reporter, researcher, and photographer at the Craig Newmark Graduate School of Journalism. 
              Covering science, health, and campus affairs.
            </p>

            <div className="flex flex-wrap items-center gap-4">
          <a 
            href="mailto:nazeefa.ahm@gmail.com" 
            className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-slate-800 text-cream hover:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-full"
          >
            <span className="font-medium tracking-wide">Get in touch</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>              <div className="flex items-center gap-4">
                <a 
                  href="https://www.linkedin.com/in/nazeefa-ahmed/" 
                  target="_blank" 
                  rel="noopener"
                  className="p-3 rounded-full glass hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all duration-300 hover:-translate-y-0.5"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://substack.com/@nazeefaahmed" 
                  target="_blank" 
                  rel="noopener"
                  className="p-3 rounded-full glass hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all duration-300 hover:-translate-y-0.5"
                  aria-label="Substack"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Image with frame effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 dark:shadow-slate-900/60">
              <Image
                src="https://nazeefaca.wordpress.com/wp-content/uploads/2025/05/nazeefa-headshot-1.jpg"
                alt="Nazeefa Ahmed"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 dark:ring-white/10 rounded-3xl" />
            </div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-6 -right-6 glass px-6 py-4 rounded-2xl shadow-xl"
            >
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Featured in</div>
              <div className="text-lg font-bold">Science Magazine</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
