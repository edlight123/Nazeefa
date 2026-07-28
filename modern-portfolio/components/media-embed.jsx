'use client';

import { useEffect, useRef, useState } from 'react';

// Renders each gallery item as the social post it actually is: the platform's
// own embed, shown whole — avatar, handle, caption and like count included.
// Platform is detected from the URL, so anything added through Admin → Media
// lands in the right branch on its own.
//
// An earlier version cropped every platform's chrome away so only the video
// band showed. That looked tidier but hid what these are, and the cropping
// needed the media's aspect ratio, which the embed never tells us — so it was
// inferred from the reported height and got it wrong often enough to slice the
// chyron off news clips. Showing the whole post removes the guesswork.

const MEASURE_TIMEOUT_MS = 4000;

function detectPlatform(url = '') {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  return 'generic';
}

// Tracks the tile's own width. Only TikTok needs it, but it has to follow
// resizes and column-count changes.
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

// Instagram's embed is responsive and reports its rendered height back over
// postMessage, so the only job here is to listen and match it. The height moves
// with the caption, which is why it is taken from the embed rather than
// calculated. Until it answers we hold a plausible height instead of
// collapsing the tile and shifting the rest of the page when it arrives.
const IG_FALLBACK_HEIGHT_PX = 640;

function InstagramFrame({ src, title }) {
  const iframeRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(null);
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

  const measured = frameHeight ?? IG_FALLBACK_HEIGHT_PX;

  return (
    <Tile style={{ height: `${measured}px` }}>
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        scrolling="no"
        className="absolute inset-0 w-full h-full border-0 transition-opacity duration-300"
        style={{ opacity: frameHeight || timedOut ? 1 : 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </Tile>
  );
}

/* ------------------------------------------------------------------- TikTok */

// TikTok's embed does NOT reflow to the width you give it: its card is pinned
// by the embed's own CSS to `width/min-width/max-width: 325px`. Render it in a
// wider iframe and the card just sits centred with white either side. So the
// iframe is given exactly that width and the whole card is scaled to the tile —
// the embed lays itself out as TikTok intends, then we scale it up bodily.
//
// Measured against the live embed, in the embed's own (unscaled) pixels: the
// video is a 9:16 box spanning the column, and the "Watch now" bar, author,
// caption and sound rows stack beneath it.
const TIKTOK_COLUMN_WIDTH = 325;
const TIKTOK_CARD_HEIGHT = 855;

function TikTokFrame({ src, title }) {
  const [containerRef, width] = useElementWidth();

  const scale = width ? width / TIKTOK_COLUMN_WIDTH : null;
  const tileHeight = scale ? Math.round(TIKTOK_CARD_HEIGHT * scale) : null;

  return (
    <Tile
      containerRef={containerRef}
      style={
        tileHeight
          ? { height: `${tileHeight}px` }
          : { aspectRatio: `${TIKTOK_COLUMN_WIDTH} / ${TIKTOK_CARD_HEIGHT}` }
      }
    >
      <iframe
        src={src}
        title={title}
        scrolling="no"
        className="absolute left-0 top-0 border-0"
        style={{
          width: `${TIKTOK_COLUMN_WIDTH}px`,
          height: `${TIKTOK_CARD_HEIGHT}px`,
          transform: scale ? `scale(${scale})` : undefined,
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
      className="relative w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800"
      style={style}
    >
      {children}
      <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 dark:ring-white/10 rounded-2xl pointer-events-none" />
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
