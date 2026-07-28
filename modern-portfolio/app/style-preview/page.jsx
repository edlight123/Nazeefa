import MediaEmbed from '../../components/media-embed';
import HeroReel from './hero-reel';
import { DataStore } from '../../lib/dataStoreFirebase';

export const dynamic = 'force-dynamic';

// PREVIEW ONLY — Direction C ("Business desk") applied to real content so the
// restyle can be judged before it is adopted. Nothing here touches the live
// homepage; delete this route and the site is unchanged.

const css = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..700;1,6..72,300..500&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@300..700&display=swap');

/* Preview-only: hide the live site's header and footer so the redesign can be
   judged without the old chrome sitting on top of it. */
body > div > header, body > div > footer, body > header, body > footer { display:none !important; }
body { background:#FAF9F6 !important; }

.pv { --paper:#FAF9F6; --ink:#15181C; --rust:#9B4A1E; --rule:#E2DFD8; --muted:#8A8578;
      background:var(--paper); color:var(--ink); min-height:100vh;
      font-family:Inter,system-ui,sans-serif; -webkit-font-smoothing:antialiased; }
.pv-wrap { max-width:1120px; margin:0 auto; padding:0 24px; }
@media (min-width:768px){ .pv-wrap { padding:0 48px; } }

.pv-mono { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.1em;
           text-transform:uppercase; font-weight:600; }
.pv-serif { font-family:Newsreader,Georgia,serif; }

/* ---- hero ---- */
.pv-hero { padding:88px 0 0; }
.pv-eyebrow { color:var(--rust); }
.pv-name { font-family:Newsreader,Georgia,serif; font-weight:500; letter-spacing:-.022em;
           line-height:1.02; margin:16px 0 0; font-size:clamp(40px,7vw,72px); }
.pv-role { font-size:clamp(15px,1.6vw,18px); color:#4C535C; margin-top:14px; max-width:34em;
           line-height:1.55; }
.pv-beats { display:flex; flex-wrap:wrap; gap:0; margin-top:34px;
            border-top:1px solid var(--rule); border-bottom:1px solid var(--rule); }
.pv-beat { padding:18px 34px 18px 0; }
.pv-beat b { display:block; font-family:Newsreader,serif; font-size:23px; font-weight:600; line-height:1; }
.pv-beat span { display:block; margin-top:7px; color:var(--muted); font-family:'IBM Plex Mono',monospace;
                font-size:9px; letter-spacing:.08em; text-transform:uppercase; }

/* ---- reel ---- */
.pv-reel { margin-top:38px; border:1px solid var(--rule); background:#12161B; line-height:0;
           position:relative; }
.pv-reel video { display:block; width:100%; height:auto; }
/* Control stays out of the way while playing and asserts itself when paused,
   so the reel never becomes a video you cannot stop. */
.pv-reel-btn { position:absolute; left:14px; bottom:14px; width:38px; height:38px; padding:0;
               display:flex; align-items:center; justify-content:center; cursor:pointer;
               border:1px solid rgba(255,255,255,.35); background:rgba(10,12,15,.45);
               color:#fff; backdrop-filter:blur(3px); opacity:0; transition:opacity .2s ease; }
.pv-reel:hover .pv-reel-btn, .pv-reel-btn:focus-visible { opacity:1; }
.pv-reel-btn.is-paused { opacity:1; }
.pv-reel-btn svg { width:15px; height:15px; }

/* ---- sections ---- */
.pv-sec { padding:72px 0 0; }
.pv-lab { color:var(--muted); padding-bottom:14px; border-bottom:1px solid var(--ink); }

/* Gapless mosaic: columns pack each tile straight under the one above, so
   verticals and horizontals interlock instead of leaving dead rows. */
.pv-mosaic { columns:1; column-gap:0; margin-top:26px; }
@media (min-width:640px){ .pv-mosaic { columns:2; } }
@media (min-width:1020px){ .pv-mosaic { columns:3; } }
.pv-mosaic > * { break-inside:avoid; margin:0; display:block; line-height:0; }
/* square off the shared embed component's rounding so tiles butt cleanly */
.pv-mosaic .rounded-2xl { border-radius:0 !important; }

/* ---- clip list ---- */
.pv-clip { display:block; text-decoration:none; color:inherit; padding:24px 0;
           border-bottom:1px solid var(--rule); transition:background .18s ease; }
.pv-clip:hover { background:rgba(155,74,30,.035); }
.pv-clip:hover .pv-hed { color:var(--rust); }
.pv-clip-top { display:flex; align-items:baseline; gap:14px; }
.pv-outlet { color:var(--rust); }
.pv-date { font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--muted); margin-left:auto; }
.pv-hed { font-family:Newsreader,Georgia,serif; font-size:clamp(19px,2.2vw,25px); font-weight:500;
          line-height:1.26; letter-spacing:-.01em; margin:10px 0 0; max-width:30em;
          transition:color .18s ease; }
.pv-dek { font-size:13.5px; line-height:1.6; color:#5C6470; margin:9px 0 0; max-width:44em; }

/* ---- two-up cards ---- */
.pv-two { display:grid; grid-template-columns:1fr; gap:0; margin-top:8px; }
@media (min-width:760px){ .pv-two { grid-template-columns:1fr 1fr; gap:44px; } }
.pv-item { padding:26px 0; border-bottom:1px solid var(--rule); }
.pv-item h3 { font-family:Newsreader,serif; font-size:20px; font-weight:500; margin:10px 0 8px; }
.pv-item p { font-size:13.5px; line-height:1.6; color:#5C6470; margin:0 0 12px; }
.pv-link { color:var(--rust); font-size:12.5px; font-weight:500; text-decoration:none;
           border-bottom:1px solid rgba(155,74,30,.35); padding-bottom:1px; }

/* ---- contact ---- */
.pv-contact { padding:76px 0 96px; margin-top:64px; border-top:1px solid var(--ink); }
.pv-contact h2 { font-family:Newsreader,serif; font-size:clamp(30px,4.5vw,46px); font-weight:500;
                 letter-spacing:-.02em; margin:18px 0 0; }
.pv-btn { display:inline-block; margin-top:26px; background:var(--ink); color:var(--paper);
          padding:14px 30px; font-size:13px; font-weight:500; text-decoration:none;
          border:1px solid var(--ink); transition:background .18s ease,color .18s ease; }
.pv-btn:hover { background:transparent; color:var(--ink); }

.pv-note { margin-top:14px; font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--muted);
           letter-spacing:.04em; }
.pv-banner { background:#15181C; color:#FAF9F6; font-family:'IBM Plex Mono',monospace; font-size:11px;
             padding:10px 24px; letter-spacing:.05em; }
`;

export default async function StylePreview() {
  let articles = [];
  let photos = [];
  try {
    articles = await DataStore.getArticles();
    photos = await DataStore.getPhotos();
  } catch {
    /* preview still renders without the store */
  }

  return (
    <>
      <style>{css}</style>
      <div className="pv">
        <div className="pv-banner">
          PREVIEW — Direction C · Business desk · not the live site
        </div>

        <div className="pv-wrap">
          {/* ---------------- hero ---------------- */}
          <header className="pv-hero">
            <div className="pv-mono pv-eyebrow">New York City</div>
            <h1 className="pv-name">Nazeefa Ahmed</h1>
            {/* States the job in the first three words. The beats are listed in
                the strip below, so this line stays out of their way. */}
            <p className="pv-role">
              Multimedia business reporter covering the economy, on camera and in print.
            </p>

            <div className="pv-beats">
              <div className="pv-beat"><b>Housing</b><span>Mortgage &amp; markets</span></div>
              <div className="pv-beat"><b>Labor</b><span>Unions &amp; contracts</span></div>
              <div className="pv-beat"><b>Science</b><span>Peer-reviewed beat</span></div>
            </div>

            <HeroReel src="/showreel.mp4" />
          </header>

          {/* ---------------- on camera ---------------- */}
          <section className="pv-sec">
            <div className="pv-mono pv-lab">On camera</div>
            <div className="pv-mosaic">
              {photos.map((photo) => {
                const isEmbed =
                  photo.type === 'video' && photo.videoKind !== 'upload' && Boolean(photo.embedUrl);
                if (!isEmbed) return null;
                return (
                  <div key={photo.id}>
                    <MediaEmbed src={photo.embedUrl} title={photo.alt || 'Video'} />
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------------- reporting ---------------- */}
          <section className="pv-sec">
            <div className="pv-mono pv-lab">Reporting &amp; research</div>
            <div style={{ marginTop: 8 }}>
              {articles.map((a) => (
                <a key={a.href} href={a.href} target="_blank" rel="noopener" className="pv-clip">
                  <div className="pv-clip-top">
                    <span className="pv-mono pv-outlet">{a.outlet}</span>
                    <span className="pv-date">{a.date}</span>
                  </div>
                  <h2 className="pv-hed">{a.title}</h2>
                </a>
              ))}
            </div>
            <div className="pv-note">
              No deck shown — your articles store title, outlet, date and link only.
            </div>
          </section>

          {/* ---------------- audio & print ---------------- */}
          <section className="pv-sec">
            <div className="pv-mono pv-lab">Audio &amp; print</div>
            <div className="pv-two">
              <div className="pv-item">
                <span className="pv-mono pv-outlet">Science Magazine</span>
                <h3>How water pollution enters the air by the Tijuana River</h3>
                <p>Podcast feature.</p>
                <a
                  className="pv-link"
                  href="https://www.science.org/content/podcast/mother-lode-mexican-mammoths-how-water-pollution-enters-air-and-book-playing-dead"
                  target="_blank"
                  rel="noopener"
                >
                  Listen →
                </a>
              </div>
              <div className="pv-item">
                <span className="pv-mono pv-outlet">The Gauntlet</span>
                <h3>January 2025 print edition</h3>
                <p>Full issue, PDF.</p>
                <a className="pv-link" href="/gauntlet-jan-2025.pdf" target="_blank" rel="noopener">
                  Download →
                </a>
              </div>
            </div>
          </section>

          {/* ---------------- contact ---------------- */}
          <section className="pv-contact">
            <div className="pv-mono" style={{ color: 'var(--muted)' }}>Contact</div>
            <h2>Available for assignments<br />and staff roles.</h2>
            <a className="pv-btn" href="mailto:nazeefa.ahm@gmail.com">nazeefa.ahm@gmail.com</a>
          </section>
        </div>
      </div>
    </>
  );
}
