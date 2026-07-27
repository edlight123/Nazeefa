import Image from 'next/image';
import Hero from '../components/hero';
import MediaEmbed from '../components/media-embed';
import ContactSection from '../components/contact-section';
import { DataStore } from '../lib/dataStoreFirebase';

export const dynamic = 'force-dynamic';

// Get content from data store
async function getContent() {
  try {
    const articles = await DataStore.getArticles();
    const photos = await DataStore.getPhotos();
    return { articles, photos };
  } catch (error) {
    console.error('Error loading content:', error);
    return { articles: [], photos: [] };
  }
}

export default async function Page() {
  const { articles, photos } = await getContent();

  return (
    <main>
      <Hero />

      {/* Photography Section */}
      <section className="py-24 lg:py-32" id="photos">
        <div className="max-w-7xl mx-auto container-px">
          <div className="mb-12">
            <h2 className="section-title">Photography & Video</h2>
            <p className="text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl">
              Visual stories from the field
            </p>
          </div>

          {/* Multi-column rather than grid: the media here is a mix of portrait,
              square and landscape, and a grid makes every row as tall as its
              tallest tile — leaving dead space under the shorter ones. Columns
              pack each tile directly beneath the previous one instead. */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
            {photos.map((photo, idx) => {
              const isVideo = photo.type === 'video';
              const embedUrl = isVideo ? photo.embedUrl || photo.src : '';

              return (
                <div
                  key={photo.id}
                  className="mb-4 sm:mb-6 break-inside-avoid"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {isVideo && embedUrl ? (
                    // Every embed goes through one component that detects the
                    // platform from its URL and crops that platform's chrome,
                    // so anything added via Admin → Media fits in on its own.
                    <MediaEmbed src={embedUrl} title={photo.alt || 'Embedded video'} />
                  ) : (
                    <div className="group relative aspect-[4/3] photo-aspect-4-3 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                      {isVideo ? (
                        <video
                          src={photo.src}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          priority={idx < 3}
                        />
                      )}
                      <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 dark:ring-white/10 rounded-2xl pointer-events-none" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
            {articles.map((article, idx) => (
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

      {/* Media Section */}
      <section className="py-12 lg:py-16">
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
                href="/gauntlet-jan-2025.pdf"
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

      {/* Contact Section */}
      <ContactSection />
    </main>
  );
}
