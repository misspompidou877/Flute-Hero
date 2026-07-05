/*
 * Step 3 — First-name capture. Big single field, first name only. The value is
 * persisted by the controller to localStorage `profile.firstName`.
 */
import { useState } from 'react';
import { PrimaryButton } from './OnboardingShell';

export default function NameStep({ data, onNext }) {
  const [name, setName] = useState(data.firstName ?? '');
  const trimmed = name.trim();

  const submit = () => {
    if (!trimmed) return;
    onNext({ firstName: trimmed });
  };

  return (
    <div style={{ animation: 'fh-rise 500ms ease both', width: '100%' }}>
      <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0B3D3A', margin: 0 }}>
        What's your name?
      </h2>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#666666', marginTop: 8 }}>
        Just your first name is perfect.
      </p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        placeholder="Your name"
        autoFocus
        autoComplete="off"
        autoCapitalize="words"
        maxLength={20}
        aria-label="Your first name"
        style={{
          width: '100%',
          marginTop: 24,
          minHeight: 60,
          borderRadius: 16,
          border: '2px solid #6AECE1',
          background: '#FFFFFF',
          color: '#0B3D3A',
          fontFamily: "'Nunito', sans-serif",
          fontSize: 24,
          fontWeight: 800,
          textAlign: 'center',
          padding: '0 16px',
          outline: 'none',
        }}
      />

      <div style={{ marginTop: 24 }}>
        <PrimaryButton onClick={submit} disabled={!trimmed}>
          That's me!
        </PrimaryButton>
      </div>
    </div>
  );
}
