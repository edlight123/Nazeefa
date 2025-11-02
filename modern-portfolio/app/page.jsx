import Image from 'next/image';
import Hero from '../components/hero';

const bylines = [
  {
    title: "Genome-wide study makes 'quantum leap' in understanding stuttering",
    href: 'https://www.science.org/content/article/genome-wide-study-makes-quantum-leap-understanding-stuttering',
    outlet: 'Science Magazine',
    date: '2024',
  },
  {
    title: 'Why do some moms have more boys than girls—or vice versa? New study provides clues',
    href: 'https://www.science.org/content/article/why-do-some-moms-have-more-boys-girls-or-vice-versa-new-study-provides-clues',
    outlet: 'Science Magazine',
    date: '2024',
  },
  {
    title: "Comprehensive look at U.S. children's health finds 'steady decline'",
    href: 'https://www.science.org/content/article/comprehensive-look-u-s-children-s-health-finds-steady-decline',
    outlet: 'Science Magazine',
    date: '2024',
  },
  {
    title: "Using electrons to make art, this scientist's biology images grace rock albums and stamps",
    href: 'https://www.science.org/content/article/using-electrons-make-art-scientist-s-biology-images-grace-rock-albums-and-stamps',
    outlet: 'Science Magazine',
    date: '2024',
  },
  {
    title: 'Giant virus with record-long tail discovered in Pacific Ocean',
    href: 'https://www.science.org/content/article/giant-virus-record-long-tail-discovered-pacific-ocean',
    outlet: 'Science Magazine',
    date: '2024',
  },
  {
    title: 'Social media attacks on public health agencies are eroding trust',
    href: 'https://www.science.org/content/article/social-media-attacks-public-health-agencies-are-eroding-trust',
    outlet: 'Science Magazine',
    date: '2024',
  },
  {
    title: "University of Calgary's Aquatic Centre struggling with aging infrastructure",
    href: 'https://thegauntlet.ca/2025/01/31/university-of-calgarys-aquatic-centre-struggling-with-aging-infrastructure-and-high-demand-mirroring-citywide-pool-challenges/',
    outlet: 'The Gauntlet',
    date: '2025',
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
      <Hero />

      {/* Featured Work Section */}
      <section className="py-24 lg:py-32" id="work">
        <div className="max-w-7xl mx-auto container-px">
          <div className="mb-12">
            <h2 className="section-title">Featured Work</h2>
            <p className="text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl">
              Stories that matter, told with precision and care
            </p>
          </div>

          <div className="grid gap-6 lg:gap-8">
            {bylines.map((article, idx) => (
              <a
                key={article.href}
                href={article.href}
                target="_blank"
                rel="noopener"
                className="group card card-hover p-8"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-ocean-500 uppercase tracking-wider">
                        {article.outlet}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {article.date}
                      </span>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-semibold mb-2 group-hover:text-ocean-500 transition-colors">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Photography Section */}
      <section className="py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-900/30" id="photos">
        <div className="max-w-7xl mx-auto container-px">
          <div className="mb-12">
            <h2 className="section-title">Photography</h2>
            <p className="text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl">
              Visual stories from the field
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((src, idx) => (
              <div
                key={src}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Image
                  src={src}
                  alt="Photography by Nazeefa Ahmed"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 dark:ring-white/10 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto container-px">
          <div className="mb-12">
            <h2 className="section-title">Audio & Print</h2>
            <p className="text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl">
              Beyond the written word
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Podcast Card */}
            <div className="card p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Podcast Feature</h3>
              <p className="text-slate-600 dark:text-slate-400">
                How water pollution enters the air by the Tijuana River
              </p>
              <a
                href="https://www.science.org/content/podcast/mother-lode-mexican-mammoths-how-water-pollution-enters-air-and-book-playing-dead"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-ocean-500 font-medium hover:gap-3 transition-all"
              >
                Listen now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Print Edition Card */}
            <div className="card p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Print Edition</h3>
              <p className="text-slate-600 dark:text-slate-400">
                The Gauntlet — January 2025 Issue
              </p>
              <a
                href="https://nazeefaahmed.com/wp-content/uploads/2025/05/gauntlet-jan-2025.pdf"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-ocean-500 font-medium hover:gap-3 transition-all"
              >
                Download PDF
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social/TikTok Section */}
      <section className="py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto container-px">
          <div className="mb-12 text-center">
            <h2 className="section-title">Social Media</h2>
            <p className="text-3xl lg:text-4xl font-bold tracking-tight">
              Stories for every platform
            </p>
          </div>

          <div className="card p-8">
            <div className="aspect-[9/16] max-w-sm mx-auto rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.tiktok.com/embed/7537326976789400862"
                className="w-full h-full"
                allowFullScreen
                scrolling="no"
                allow="encrypted-media;"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 lg:py-32" id="contact">
        <div className="max-w-4xl mx-auto container-px">
          <div className="text-center card p-12 lg:p-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Let's collaborate
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
              Available for freelance assignments, collaborations, and storytelling opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:nazeefa.ahm@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-full font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                nazeefa.ahm@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
