/*
 * Step 4 — Visual age picker. Ages 7–12 as tappable circles (no dropdown).
 * Tapping a circle selects it; the value is persisted to `profile.age`.
 */
import { useState } from 'react';
import { PrimaryButton } from './OnboardingShell';

const AGES = [7, 8, 9, 10, 11, 12];

export default function AgeStep({ data, onNext }) {
  const [age, setAge] = useState(typeof data.age === 'number' ? data.age : null);

  return (
    <div style={{ animation: 'fh-rise 500ms ease both', width: '100%' }}>
      <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0B3D3A', margin: 0 }}>
        How old are you?
      </h2>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#666666', marginTop: 8 }}>
        Tap your age.
      </p>

      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 24 }}
      >
        {AGES.map((a) => {
          const selected = age === a;
          return (
            <button
              key={a}
              type="button"
              onClick={() => setAge(a)}
              aria-label={`Age ${a}`}
              aria-pressed={selected}
              className="flex items-center justify-center active:scale-95 transition-transform"
              style={{
                aspectRatio: '1',
                minHeight: 72,
                borderRadius: 9999,
                border: selected ? '3px solid #1AA89F' : '2px solid #D3D1C7',
                background: selected ? 'linear-gradient(to right, #26CCC2, #1AA89F)' : '#FFFFFF',
                color: '#0B3D3A',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: selected ? '0 4px 16px rgba(38,204,194,0.35)' : 'none',
              }}
            >
              {a}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 28 }}>
        <PrimaryButton onClick={() => onNext({ age })} disabled={age == null}>
          Next
        </PrimaryButton>
      </div>
    </div>
  );
}
