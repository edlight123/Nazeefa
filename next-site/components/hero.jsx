"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-[70vh] lg:min-h-[90vh] grid lg:grid-cols-2">
      <div className="flex items-center">
        <div className="max-w-3xl mx-auto container-px py-16 lg:py-28">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-balance"
          >
            I’m a New York–based multimedia reporter and student at the Craig Newark Graduate School of Journalism.
          </motion.h1>
          <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
            I’ve covered emerging research at <em>Science Magazine</em> and campus affairs as editor-in-chief of my undergraduate student newspaper.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="mailto:nazeefa.ahm@gmail.com" className="inline-flex items-center rounded-lg bg-accent text-white px-5 py-3 font-semibold shadow-sm hover:bg-accent/90 transition">
              Email me
            </a>
            <a href="https://www.linkedin.com/in/nazeefa-ahmed/" target="_blank" rel="noopener" className="prose-link">LinkedIn</a>
            <a href="https://substack.com/@nazeefaahmed" target="_blank" rel="noopener" className="prose-link">Substack</a>
          </div>
        </div>
      </div>
      <div className="relative min-h-[40vh] lg:min-h-0">
        <Image
          src="https://nazeefaca.wordpress.com/wp-content/uploads/2025/05/nazeefa-headshot-1.jpg"
          alt="Nazeefa Ahmed"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
      </div>
    </section>
  );
}
