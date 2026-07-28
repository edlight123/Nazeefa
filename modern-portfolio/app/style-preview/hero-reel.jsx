'use client';

import { useEffect, useRef, useState } from 'react';

// The reel has no audio track, which is what lets it autoplay at all — browsers
// only allow unattended playback when there is nothing to hear.
//
// Playback is started from JS rather than the autoplay attribute so the
// reduced-motion preference can be honoured before the first frame moves. A
// looping video behind the page's headline is precisely the ambient motion that
// setting exists to suppress, so those visitors get a still frame and a control
// to start it themselves.
export default function HeroReel({ src }) {
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
    <div className="pv-reel">
      <video ref={ref} src={src} muted loop playsInline preload="auto" />
      <button
        type="button"
        onClick={toggle}
        className={`pv-reel-btn${paused ? ' is-paused' : ''}`}
        aria-label={paused ? 'Play showreel' : 'Pause showreel'}
      >
        {paused ? (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
