/*
 * Step 10 — Unlock the free songs. A grown-up's email opens the 2 free songs
 * at every level (entitlement.emailUnlocked). Email is OPTIONAL and stored
 * ONLY on-device (localStorage `profile.saveEmail`) — no backend, no send
 * (CLAUDE.md). Soft gate: "Maybe later" still finishes onboarding and hands
 * off into the first "taste" song. No prices, no purchase language anywhere.
 *
 * Fires `save_prompt_shown` on view and `save_accepted` when an email is saved.
 * Either path calls onDone() to finish onboarding.
 */
import { useEffect, useState } from 'react';
import { logEvent } from '../../utils/analytics';
import { PrimaryButton, SecondaryButton } from './OnboardingShell';

// Deliberately forgiving check — just enough to avoid obvious typos.
function looksLikeEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

export default function SaveStep({ onDone }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    logEvent('save_prompt_shown');
  }, []);

  const save = () => {
    const trimmed = email.trim();
    if (!looksLikeEmail(trimmed)) return;
    logEvent('save_accepted');
    onDone({ email: trimmed });
  };

  return (
    <div style={{ animation: 'fh-rise 500ms ease both', width: '100%' }}>
      <div style={{ fontSize: 52 }} aria-hidden="true">🔓</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0B3D3A', marginTop: 8 }}>
        Unlock your free songs!
      </h2>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#0B3D3A', marginTop: 10, lineHeight: 1.5 }}>
        Ask a grown-up to add an email and you get a free song to play at every
        level! It's optional — we keep it right here on your device.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
        placeholder="Grown-up's email (optional)"
        autoComplete="email"
        inputMode="email"
        aria-label="Grown-up's email, optional"
        style={{
          width: '100%',
          marginTop: 20,
          minHeight: 56,
          borderRadius: 16,
          border: '2px solid #6AECE1',
          background: '#FFFFFF',
          color: '#0B3D3A',
          fontFamily: "'Nunito', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          textAlign: 'center',
          padding: '0 16px',
          outline: 'none',
        }}
      />

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PrimaryButton onClick={save} disabled={!looksLikeEmail(email)}>
          Unlock free songs!
        </PrimaryButton>
        <SecondaryButton onClick={() => onDone()}>
          Maybe later — let's play!
        </SecondaryButton>
      </div>
    </div>
  );
}
