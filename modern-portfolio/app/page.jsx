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

// Label for the link beside a self-hosted clip. Named after wherever it was
// first published, so the link says where it actually goes.
const SOURCE_LABELS = [
  ['instagram.com', 'Instagram'],
  ['tiktok.com', 'TikTok'],
  ['youtube.com', 'YouTube'],
  ['youtu.be', 'YouTube'],
  ['vimeo.com', 'Vimeo'],
];

function sourceLinkLabel(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const match = SOURCE_LABELS.find(([domain]) => host.includes(domain));
    return match ? `Watch on ${match[1]}` : 'Watch the original';
  } catch {
    return 'Watch the original';
  }
}

export default async function Page() {
  const { articles, photos } = await getContent();

  return (
    <main>
      <Hero />

      {/* ------------------------------------------------------- on camera */}
      <section className="max-w-6xl mx-auto container-px pt-20 lg:pt-24" id="photos">
        <h2 className="section-title">On camera</h2>

        {/* Gapless columns: each tile packs straight under the one above, so
            portrait and landscape interlock instead of leaving dead rows. */}
        <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-0 [&>*]:break-inside-avoid [&>*]:leading-[0]">
          {photos.map((photo) => {
            const isVideo = photo.type === 'video';
            // Route on videoKind, not on the presence of a URL — an uploaded
            // clip has no embedUrl and must not be handed to the iframe path.
            // Anything not explicitly an upload is treated as an embed, which
            // keeps records written before videoKind existed on their path.
            const isEmbed = isVideo && photo.videoKind !== 'upload' && Boolean(photo.embedUrl);
            const sourceUrl = isVideo && !isEmbed ? photo.sourceUrl : null;

            if (isEmbed) {
              return (
                <div key={photo.id}>
                  <MediaEmbed src={photo.embedUrl} title={photo.alt || 'Embedded video'} />
                </div>
              );
            }

            if (isVideo) {
              // A clip we host ourselves. Height follows the file: the browser
              // knows its intrinsic size, so there is no ratio to guess at.
              return (
                <figure key={photo.id}>
                  <div className="relative bg-tile">
                    <video
                      src={photo.src}
                      className="block w-full h-auto"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </div>
                  {sourceUrl && (
                    <figcaption className="leading-normal py-2">
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener"
                        className="meta link-rust"
                      >
                        {sourceLinkLabel(sourceUrl)}
                      </a>
                    </figcaption>
                  )}
                </figure>
              );
            }

            return (
              <div key={photo.id} className="relative aspect-[4/3] overflow-hidden bg-tile">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------- reporting & research */}
      <section className="max-w-6xl mx-auto container-px pt-20 lg:pt-24" id="work">
        <h2 className="section-title">Articles</h2>

        <div className="mt-2">
          {articles.map((article) => (
            <a
              key={article.href}
              href={article.href}
              target="_blank"
              rel="noopener"
              className="group block rule-b py-6 transition-colors hover:bg-rust/[0.035]"
            >
              <div className="flex items-baseline gap-4">
                <span className="kicker">{article.outlet}</span>
                <span className="meta ml-auto">{article.date}</span>
              </div>
              <h3 className="hed text-[clamp(19px,2.2vw,25px)] mt-2.5 max-w-[30em] transition-colors group-hover:text-rust">
                {article.title}
              </h3>
            </a>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- audio & print */}
      <section className="max-w-6xl mx-auto container-px pt-20 lg:pt-24">
        <h2 className="section-title">Audio &amp; print</h2>

        <div className="mt-2 grid md:grid-cols-2 md:gap-11">
          <div className="rule-b py-6">
            <span className="kicker">Science Magazine</span>
            <h3 className="hed text-xl mt-2.5">
              How water pollution enters the air by the Tijuana River
            </h3>
            <p className="text-soft text-sm mt-2 leading-relaxed">Podcast feature.</p>
            <a
              href="https://www.science.org/content/podcast/mother-lode-mexican-mammoths-how-water-pollution-enters-air-and-book-playing-dead"
              target="_blank"
              rel="noopener"
              className="link-rust inline-block text-[13px] font-medium mt-3"
            >
              Listen
            </a>
          </div>

          <div className="rule-b py-6">
            <span className="kicker">The Gauntlet</span>
            <h3 className="hed text-xl mt-2.5">January 2025 print edition</h3>
            <p className="text-soft text-sm mt-2 leading-relaxed">Full issue, PDF.</p>
            <a
              href="/gauntlet-jan-2025.pdf"
              target="_blank"
              rel="noopener"
              className="link-rust inline-block text-[13px] font-medium mt-3"
            >
              Download
            </a>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
