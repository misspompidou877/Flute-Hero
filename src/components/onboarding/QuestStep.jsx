/*
 * Step 6 — The quest hook. Two short lines: the wind scattered Piper's songs
 * across the sky; help find them. (Redesign brief §2 — "Songkeeper's Sky".)
 */
import { PrimaryButton } from './OnboardingShell';

export default function QuestStep({ data, onNext }) {
  const name = data.firstName ? `, ${data.firstName}` : '';
  return (
    <div style={{ animation: 'fh-rise 500ms ease both', width: '100%' }}>
      <div style={{ fontSize: 56 }} aria-hidden="true">🌬️</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0B3D3A', marginTop: 8 }}>
        I need your help{name}!
      </h2>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#0B3D3A', marginTop: 14, lineHeight: 1.5 }}>
        The wind blew all my songs up into the sky.
      </p>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#1AA89F', marginTop: 8, lineHeight: 1.5 }}>
        Let's find them again, one at a time!
      </p>

      <div style={{ marginTop: 30 }}>
        <PrimaryButton onClick={() => onNext()}>I'll help you!</PrimaryButton>
      </div>
    </div>
  );
}
