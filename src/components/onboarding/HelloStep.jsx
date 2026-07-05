/*
 * Step 2 — "Hi! I'm Piper!" A single warm CTA, no reading burden.
 */
import { PrimaryButton } from './OnboardingShell';

export default function HelloStep({ onNext }) {
  return (
    <div style={{ animation: 'fh-rise 500ms ease both', width: '100%' }}>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0B3D3A', margin: 0 }}>
        Hi! I'm Piper! 👋
      </h2>
      <p style={{ fontSize: 18, fontWeight: 600, color: '#0B3D3A', marginTop: 14, lineHeight: 1.5 }}>
        I'm your flute friend. Let's make some music together!
      </p>

      <div style={{ marginTop: 32 }}>
        <PrimaryButton onClick={() => onNext()}>Let's go!</PrimaryButton>
      </div>
    </div>
  );
}
