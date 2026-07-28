'use client';

import { useEffect, useRef, useState } from 'react';

// The reel carries no audio track, which is what lets it autoplay at all —
// browsers only permit unattended playback when there is nothing to hear.
//
// Playback starts from script rather than the autoplay attribute so the
// reduced-motion preference is honoured before the first frame moves. A looping
// video behind the page's headline is precisely the ambient motion that setting
// exists to suppress, so those visitors get a still frame and a control instead.
export default function HeroReel({ src, poster }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    video.play().then(
      () => setPaused(false),
      () => setPaused(true) // autoplay refused; leave the control showing
    );
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPaused(false), () => {});
    } else {
      video.pause();
      setPaused(true);
    }
  };

  return (
    <div className="group relative border border-rule bg-tile leading-[0]">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="block w-full h-auto"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? 'Play showreel' : 'Pause showreel'}
        className={`absolute left-3.5 bottom-3.5 flex h-9 w-9 items-center justify-center border border-white/35
                    bg-black/45 text-white transition-opacity duration-200
                    focus-visible:opacity-100 group-hover:opacity-100
                    ${paused ? 'opacity-100' : 'opacity-0'}`}
      >
        {paused ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
