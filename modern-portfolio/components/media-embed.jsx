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
// feed media to a small set of aspect ratios: knowing the tile width, the media
// height can only be one of a few values, so we snap to the closest. The chrome
// estimate only has to be good enough to pick between candidates, not exact.
//
// 16:9 is in this list because reels cut for broadcast come back from the embed
// in a true widescreen frame rather than one of the three feed-photo ratios.
// Without it they snapped to 1.91 and the tile came out ~7% short, slicing the
// chyron off the bottom of every news clip.
const IG_MEDIA_ASPECTS = [1.91, 16 / 9, 1, 0.8]; // landscape, widescreen, square, portrait (w/h)
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

// TikTok's embed does NOT reflow to the width you give it: its column is pinned
// by the embed's own CSS to `width/min-width/max-width: 325px`. Render it in a
// wider iframe and the column just sits centred with white either side, which is
// why no crop value alone can clean it up. Instead the iframe is given exactly
// that column width and the whole thing is scaled to the tile — the embed lays
// itself out as TikTok intends, then we scale and crop.
//
// Inside the column the video area is the first thing on the page, inset by the
// card's 1px border, and is a true 9:16 box spanning the full column width. It
// is NOT preceded by a header. Everything after it — the "Watch now" call to
// action, then the author, caption and sound rows — is stacked *below* the
// video, and its height moves with the caption, so it is cropped by sizing the
// tile to the video alone rather than by subtracting a fixed footer.
//
// Measured against the live embed; all values are in the embed's own (unscaled)
// pixels.
const TIKTOK_COLUMN_WIDTH = 325;
const TIKTOK_BORDER_PX = 1;
const TIKTOK_VIDEO_WIDTH = TIKTOK_COLUMN_WIDTH - TIKTOK_BORDER_PX * 2;
const TIKTOK_VIDEO_ASPECT = 9 / 16;

// Room for the chrome below the video so it can never be squeezed back up into
// the video area. Only has to be generous — every pixel of it is cropped off.
const TIKTOK_CHROME_BELOW_PX = 280;

function TikTokFrame({ src, title }) {
  const [containerRef, width] = useElementWidth();

  const naturalVideoHeight = TIKTOK_VIDEO_WIDTH / TIKTOK_VIDEO_ASPECT;
  const naturalFrameHeight =
    TIKTOK_BORDER_PX + naturalVideoHeight + TIKTOK_CHROME_BELOW_PX;
  const scale = width ? width / TIKTOK_VIDEO_WIDTH : null;
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
          width: `${TIKTOK_COLUMN_WIDTH}px`,
          height: `${naturalFrameHeight}px`,
          // Applied right-to-left: pull the card's border off the top and left
          // first, then scale the video area up to fill the tile's width.
          transform: scale
            ? `scale(${scale}) translate(-${TIKTOK_BORDER_PX}px, -${TIKTOK_BORDER_PX}px)`
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
