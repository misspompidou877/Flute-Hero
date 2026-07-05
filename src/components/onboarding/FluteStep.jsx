/*
 * Step 5 — "Do you have a flute yet?" Yes / Not yet.
 * The "Not yet" path never blocks: it continues with encouragement plus a short
 * note a grown-up can read. Value persisted to `profile.hasFlute`.
 */
import { useState } from 'react';
import { PrimaryButton, SecondaryButton } from './OnboardingShell';

export default function FluteStep({ onNext }) {
  // null = question shown; false = "not yet" encouragement shown.
  const [notYet, setNotYet] = useState(false);

  if (notYet) {
    return (
      <div style={{ animation: 'fh-pop 400ms ease both', width: '100%' }}>
        <div style={{ fontSize: 52 }} aria-hidden="true">🌱</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0B3D3A', marginTop: 8 }}>
          No problem at all!
        </h2>
        <p style={{ fontSize: 17, fontWeight: 600, color: '#0B3D3A', marginTop: 12, lineHeight: 1.5 }}>
          You can still learn with me today. When you're ready, a flute of your own
          will make it even more fun!
        </p>

        <div
          style={{
            marginTop: 16,
            background: 'rgba(106,236,225,0.18)',
            borderRadius: 16,
            padding: 14,
            textAlign: 'left',
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 800, color: '#0B3D3A', letterSpacing: '0.3px', textTransform: 'uppercase', margin: 0 }}>
            A note for a grown-up
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#0B3D3A', marginTop: 6, lineHeight: 1.5 }}>
            Any beginner concert flute works great. Until one arrives, your child can
            still practise reading music and learn the basics right here.
          </p>
        </div>

        <div style={{ marginTop: 24 }}>
          <PrimaryButton onClick={() => onNext({ hasFlute: false })}>
            Let's keep going!
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fh-rise 500ms ease both', width: '100%' }}>
      <div style={{ fontSize: 52 }} aria-hidden="true">🎶</div>
      <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0B3D3A', marginTop: 8 }}>
        Do you have a flute yet?
      </h2>

      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <PrimaryButton onClick={() => onNext({ hasFlute: true })}>
          Yes, I do! 🎉
        </PrimaryButton>
        <SecondaryButton onClick={() => setNotYet(true)}>
          Not yet
        </SecondaryButton>
      </div>
    </div>
  );
}
