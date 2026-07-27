'use client';

import { useEffect, useRef, useState } from 'react';

// Renders any embedded video from the media store, cropping each platform's
// chrome so only the video shows. Platform is detected from the URL, so
// anything added through Admin → Media lands in the right branch on its own.

const PLACEHOLDER_ASPECT = '4 / 5';
const MEASURE_TIMEOUT_MS = 4000;

// The embed cards have a hairline border; bleeding a couple of pixels past each
// edge keeps it outside the visible window.
const EDGE_BLEED_PX = 2;

function detectPlatform(url = '') {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  return 'generic';
}

// Tracks the tile's own width — every crop below is derived from it, so it has
// to follow resizes and column-count changes.
function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setWidth(el.offsetWidth);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

/* ---------------------------------------------------------------- Instagram */

// Instagram's /embed stacks an avatar/username header, the media, then action
// icons, a likes count and a "View more on Instagram" link. We want the media
// band only.
//
// Subtracting a guessed footer height never works reliably — the footer grows
// when a caption wraps. Instead we exploit the fact that Instagram re-crops all
// feed media to one of exactly three aspect ratios: knowing the tile width, the
// media height can only be one of three values, so we snap to the closest. The
// chrome estimate only has to be good enough to pick between candidates that
// are far apart, not exact.
const IG_MEDIA_ASPECTS = [1.91, 1, 0.8]; // landscape, square, portrait (w/h)
const IG_PORTRAIT_ASPECT = 0.8;

// Vertical video is shot 9:16 but Instagram shows feed posts in a 4:5 frame, so
// it pillarboxes with black bars down either side. Those bars are part of what
// the iframe renders, so cropping top/bottom can't reach them — instead the
// iframe is drawn wider than the tile until the video spans it and the bars fall
// outside. Set to IG_PORTRAIT_ASPECT to switch this off.
const IG_PORTRAIT_VIDEO_ASPECT = 9 / 16;

const IG_HEADER_PX = 54;
const IG_CHROME_ESTIMATE_PX = 210; // header + footer, only used to pick a bucket

function InstagramFrame({ src, title }) {
  const [containerRef, width] = useElementWidth();
  const iframeRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(null);
  const [aspect, setAspect] = useState(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!String(event.origin).includes('instagram.com')) return;

      // Several embeds can be on the page; only take the message from ours.
      const frame = iframeRef.current;
      if (!frame || event.source !== frame.contentWindow) return;

      let payload = event.data;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }

      const height = payload?.details?.height ?? payload?.height;
      if (typeof height === 'number' && height > 0) setFrameHeight(height);
    };

    window.addEventListener('message', handleMessage);
    const timer = setTimeout(() => setTimedOut(true), MEASURE_TIMEOUT_MS);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, []);

  // Locked in once decided: widening the iframe below changes the height
  // Instagram reports, and re-deriving from that would feed back on itself.
  useEffect(() => {
    if (aspect !== null || !frameHeight || !width) return;

    const approxMedia = frameHeight - IG_CHROME_ESTIMATE_PX;
    setAspect(
      IG_MEDIA_ASPECTS.reduce((best, candidate) =>
        Math.abs(width / candidate - approxMedia) <
        Math.abs(width / best - approxMedia)
          ? candidate
          : best
      )
    );
  }, [frameHeight, width, aspect]);

  const ready = aspect !== null && width > 0;
  const isPortrait = aspect === IG_PORTRAIT_ASPECT;

  const iframeWidth = ready
    ? isPortrait
      ? width * (IG_PORTRAIT_ASPECT / IG_PORTRAIT_VIDEO_ASPECT)
      : width + EDGE_BLEED_PX * 2
    : null;
  const leftOffset = iframeWidth ? -(iframeWidth - width) / 2 : -EDGE_BLEED_PX;
  const tileHeight = ready
    ? Math.round(width / (isPortrait ? IG_PORTRAIT_VIDEO_ASPECT : aspect))
    : null;

  return (
    <Tile
      containerRef={containerRef}
      style={ready ? { height: `${tileHeight}px` } : { aspectRatio: PLACEHOLDER_ASPECT }}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        scrolling="no"
        className="absolute border-0 transition-opacity duration-300"
        style={{
          top: `-${IG_HEADER_PX}px`,
          left: `${leftOffset}px`,
          width: iframeWidth ? `${iframeWidth}px` : `calc(100% + ${EDGE_BLEED_PX * 2}px)`,
          // Until the embed reports its height we can't know where the media
          // ends, and guessing paints the iframe's white background into the
          // gap — so stay hidden until there's a real number.
          height: frameHeight ? `${frameHeight}px` : '640px',
          opacity: ready || timedOut ? 1 : 0,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </Tile>
  );
}

/* ------------------------------------------------------------------- TikTok */

// TikTok's embed does NOT reflow to the width you give it: its container is
// `width: 540px` fixed (min-width 540 aside, see the embed page's own CSS), so
// rendering it in a narrower tile makes the layout overflow and leaves white
// gaps that no crop value can remove. Instead we give the iframe its full
// natural width and scale the whole thing down to the tile — the embed lays
// itself out exactly as TikTok intends, then we scale and crop.
//
// The header height comes from the embed's own stylesheet, where the video area
// carries `padding-top: 81px`. Both values below are in the embed's own
// (unscaled) pixels.
const TIKTOK_NATURAL_WIDTH = 540;
const TIKTOK_HEADER_PX = 81;
const TIKTOK_VIDEO_ASPECT = 9 / 16; // confirmed via oEmbed: 576x1024 thumbnail

// The iframe height has to be exact, not generous. TikTok's video area is
// `position:absolute; height:100%`, so it stretches to fill whatever height the
// iframe gets, and the video inside is `object-fit: contain` — give the box any
// height other than a true 9:16 and the video letterboxes and visibly shrinks.
// So: header + exactly one 9:16 video, nothing more. The caption and action
// buttons are overlaid on the video by TikTok (as in its own app), not stacked
// below it, so there is no footer band to leave room for.
function TikTokFrame({ src, title }) {
  const [containerRef, width] = useElementWidth();

  const naturalVideoHeight = TIKTOK_NATURAL_WIDTH / TIKTOK_VIDEO_ASPECT;
  const naturalFrameHeight = TIKTOK_HEADER_PX + naturalVideoHeight;
  const scale = width ? width / TIKTOK_NATURAL_WIDTH : null;
  const tileHeight = scale ? Math.round(naturalVideoHeight * scale) : null;

  return (
    <Tile
      containerRef={containerRef}
      style={tileHeight ? { height: `${tileHeight}px` } : { aspectRatio: '9 / 16' }}
    >
      <iframe
        src={src}
        title={title}
        scrolling="no"
        className="absolute left-0 top-0 border-0"
        style={{
          width: `${TIKTOK_NATURAL_WIDTH}px`,
          height: `${naturalFrameHeight}px`,
          // Applied right-to-left: shift the header off the top first, then
          // scale the whole embed down to the tile's width.
          transform: scale
            ? `scale(${scale}) translateY(-${TIKTOK_HEADER_PX}px)`
            : undefined,
          transformOrigin: '0 0',
          opacity: scale ? 1 : 0,
        }}
        allowFullScreen
        allow="encrypted-media;"
      />
    </Tile>
  );
}

/* ------------------------------------------------ YouTube / Vimeo / other */

function GenericFrame({ src, title }) {
  return (
    <Tile style={{ aspectRatio: '16 / 9' }}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </Tile>
  );
}

/* --------------------------------------------------------------------- Tile */

function Tile({ containerRef, style, children }) {
  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-slate-900"
      style={style}
    >
      {children}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
    </div>
  );
}

export default function MediaEmbed({ src, title = 'Embedded video' }) {
  switch (detectPlatform(src)) {
    case 'instagram':
      return <InstagramFrame src={src} title={title} />;
    case 'tiktok':
      return <TikTokFrame src={src} title={title} />;
    default:
      return <GenericFrame src={src} title={title} />;
  }
}
