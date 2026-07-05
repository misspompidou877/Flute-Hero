/*
 * Step 9 — Journey reveal. Shows the Songkeeper's Sky map idea with Level 1 lit
 * and the rest of the sky waiting. Framed as a "10-day adventure" — a journey,
 * NOT a countdown. Reuses the existing SkyMap Landmark glyphs (redesign brief §2).
 * Fires `journey_revealed` on view.
 */
import { useEffect } from 'react';
import Landmark, { LANDMARK_NAMES } from '../SkyMap/Landmark';
import { logEvent } from '../../utils/analytics';
import { PrimaryButton } from './OnboardingShell';

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function JourneyStep({ onNext }) {
  useEffect(() => {
    logEvent('journey_revealed');
  }, []);

  return (
    <div style={{ animation: 'fh-rise 500ms ease both', width: '100%' }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0B3D3A', margin: 0 }}>
        Welcome to the sky! 🌤️
      </h2>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#0B3D3A', marginTop: 8, lineHeight: 1.5 }}>
        This is where all your songs are hiding. Your 10-day adventure starts here —
        Level 1 is lit up and waiting for you!
      </p>

      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 22 }}
      >
        {LEVELS.map((level) => {
          const active = level === 1;
          return (
            <div
              key={level}
              className="flex flex-col items-center"
              style={{
                borderRadius: 14,
                padding: '10px 4px',
                background: active ? 'rgba(255,245,126,0.4)' : '#FFFFFF',
                border: active ? '2px solid #26CCC2' : '2px solid #F1EFE8',
                boxShadow: active ? '0 4px 16px rgba(38,204,194,0.25)' : 'none',
              }}
            >
              <Landmark level={level} size={38} muted={!active} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#0B3D3A', marginTop: 4 }}>
                Lvl {level}
              </span>
              <span style={{ fontSize: 9, fontWeight: 600, color: active ? '#1AA89F' : '#999999', lineHeight: 1.2, marginTop: 1 }}>
                {LANDMARK_NAMES[level]}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 26 }}>
        <PrimaryButton onClick={() => onNext()}>Start my adventure!</PrimaryButton>
      </div>
    </div>
  );
}
