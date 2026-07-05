/*
 * Step 1 — Splash (<=2s). Wordmark fades in; Piper (rendered by the controller)
 * waves in from the corner. Auto-advances; no button, no reading required.
 */
import { useEffect } from 'react';

export default function SplashStep({ onNext }) {
  useEffect(() => {
    const t = setTimeout(() => onNext(), 1800);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <div style={{ animation: 'fh-rise 700ms ease both' }}>
      <div style={{ fontSize: 64, marginBottom: 8 }} aria-hidden="true">🎵</div>
      <h1
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: '#0B3D3A',
          letterSpacing: '-1px',
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        FLUTE HERO
      </h1>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#1AA89F', marginTop: 10 }}>
        Always listening. Always improving.
      </p>
    </div>
  );
}
