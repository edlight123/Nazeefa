import Image from 'next/image';
import { motion } from 'framer-motion';

const bylines = [
  {
    title: "Genome-wide study makes 'quantum leap' in understanding stuttering",
    href: 'https://www.science.org/content/article/genome-wide-study-makes-quantum-leap-understanding-stuttering',
    outlet: 'Science Magazine',
  },
  {
    title: 'Why do some moms have more boys than girls—or vice versa? New study provides clues',
    href: 'https://www.science.org/content/article/why-do-some-moms-have-more-boys-girls-or-vice-versa-new-study-provides-clues',
    outlet: 'Science Magazine',
  },
  {
    title: "Comprehensive look at U.S. children's health finds 'steady decline'",
    href: 'https://www.science.org/content/article/comprehensive-look-u-s-children-s-health-finds-steady-decline',
    outlet: 'Science Magazine',
  },
  {
    title: "Using electrons to make art, this scientist's biology images grace rock albums and stamps",
    href: 'https://www.science.org/content/article/using-electrons-make-art-scientist-s-biology-images-grace-rock-albums-and-stamps',
    outlet: 'Science Magazine',
  },
  {
    title: 'Giant virus with record-long tail discovered in Pacific Ocean',
    href: 'https://www.science.org/content/article/giant-virus-record-long-tail-discovered-pacific-ocean',
    outlet: 'Science Magazine',
  },
  {
    title: 'Social media attacks on public health agencies are eroding trust',
    href: 'https://www.science.org/content/article/social-media-attacks-public-health-agencies-are-eroding-trust',
    outlet: 'Science Magazine',
  },
  {
    title: "University of Calgary's Aquatic Centre struggling with aging infrastructure",
    href: 'https://thegauntlet.ca/2025/01/31/university-of-calgarys-aquatic-centre-struggling-with-aging-infrastructure-and-high-demand-mirroring-citywide-pool-challenges/',
    outlet: 'The Gauntlet',
  },
];

const photos = [
  'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4415.jpg',
  'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4402.jpg',
  'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4502.jpg',
  'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4487.jpg',
  'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4516.jpg',
  'https://nazeefaahmed.com/wp-content/uploads/2025/05/img_4434.jpg',
];

export default function Page() {
  return (
    <main>
      {/* Split hero */}
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

      {/* Social */}
      <section className="max-w-6xl mx-auto container-px py-16" id="social">
        <h2 className="section-title mb-6">Social media</h2>
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 shadow-sm">
          <div className="aspect-[9/16] max-w-md mx-auto">
            <iframe
              src="https://www.tiktok.com/embed/7537326976789400862"
              className="w-full h-full rounded-xl"
              allowFullScreen
              scrolling="no"
              allow="encrypted-media;"
            />
          </div>
        </div>
      </section>

      {/* Bylines */}
      <section className="max-w-6xl mx-auto container-px py-8 lg:py-16" id="bylines">
        <h2 className="section-title mb-6">Bylines</h2>
        <ul className="space-y-5">
          {bylines.map((b) => (
            <li key={b.href} className="group">
              <a href={b.href} target="_blank" rel="noopener" className="text-lg font-semibold underline decoration-transparent group-hover:decoration-accent underline-offset-[6px] transition-colors">
                {b.title}
              </a>
              <div className="text-sm text-gray-600 dark:text-gray-400">{b.outlet}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Photos */}
      <section className="max-w-7xl mx-auto container-px py-8 lg:py-16" id="photos">
        <h2 className="section-title mb-6">Photos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((src) => (
            <div key={src} className="group relative overflow-hidden rounded-xl aspect-[3/2] bg-gray-100">
              <Image src={src} alt="Photography by Nazeefa Ahmed" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </section>

      {/* Audio/Print */}
      <section className="max-w-6xl mx-auto container-px py-8 lg:py-16" id="audio">
        <h2 className="section-title mb-6">Audio and print</h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-black/5 dark:border-white/10 p-6 bg-white dark:bg-white/5">
            <p className="font-semibold mb-2">Podcast:</p>
            <a className="prose-link" target="_blank" rel="noopener" href="https://www.science.org/content/podcast/mother-lode-mexican-mammoths-how-water-pollution-enters-air-and-book-playing-dead">
              How water pollution enters the air by the Tijuana River
            </a>
          </div>
          <div className="rounded-xl border border-black/5 dark:border-white/10 p-6 bg-white dark:bg-white/5">
            <p className="font-semibold mb-3">Print Edition:</p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">The Gauntlet - January 2025</p>
            <a className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition" href="https://nazeefaahmed.com/wp-content/uploads/2025/05/gauntlet-jan-2025.pdf" target="_blank" rel="noopener">
              Download PDF
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-6xl mx-auto container-px py-16" id="contact">
        <div className="rounded-2xl border border-black/5 dark:border-white/10 p-10 bg-white dark:bg-white/5 text-center">
          <h3 className="text-2xl font-display font-bold mb-3">Let’s work together</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">For assignments, clips, or collaborations, reach out via email.</p>
          <a href="mailto:nazeefa.ahm@gmail.com" className="inline-flex items-center rounded-lg bg-accent text-white px-5 py-3 font-semibold shadow-sm hover:bg-accent/90 transition">
            nazeefa.ahm@gmail.com
          </a>
        </div>
      </section>
    </main>
  );
}
