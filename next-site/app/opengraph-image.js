import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg,#0b1b3b,#0040ff)',
          color: 'white',
          padding: '64px',
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 800 }}>Nazeefa Ahmed</div>
        <div style={{ fontSize: 24, marginTop: 8, opacity: 0.9 }}>Reporter • Researcher • Photographer</div>
      </div>
    ),
    { ...size }
  );
}
