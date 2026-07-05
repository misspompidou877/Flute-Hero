/*
 * Step 7 — First-note tutorial: "blow like cooling soup". This is the
 * first-flute-sound moment (target: within ~90s of first open).
 *
 * Mic handling REUSES `useMicrophone` (CLAUDE.md: never reimplement mic logic;
 * audio lives on window._fluteAudio). We treat ANY detected sound as success —
 * we watch the hook's `frequency`/`note` for a non-null value (presence of a
 * pitched sound), NOT correct pitch. A gentle manual fallback appears after a
 * few seconds so a child with no/blocked mic is never stuck.
 */
import { useEffect, useState } from 'react';
import { useMicrophone } from '../../hooks/useMicrophone';
import { logEvent, elapsedSince } from '../../utils/analytics';
import { PrimaryButton, SecondaryButton } from './OnboardingShell';

export default function FirstSoundStep({ onNext, setPiper }) {
  const { note, frequency, isActive, startListening, stopListening } = useMicrophone();
  const [success, setSuccess] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Start the mic on mount; always tear it down on unmount.
  useEffect(() => {
    startListening();
    setPiper?.('listening', 'Blow soft, like cooling soup 🌬️');
    const fallbackTimer = setTimeout(() => setShowFallback(true), 6000);
    return () => {
      clearTimeout(fallbackTimer);
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Any pitched sound (presence, not correctness) = success.
  useEffect(() => {
    if (success) return;
    if (frequency == null && note == null) return;

    setSuccess(true);
    stopListening();
    setPiper?.('celebrate', 'You did it! ✨');

    logEvent('first_sound_success');
    const ms = elapsedSince('onboarding_started');
    if (ms != null) logEvent('time_to_first_sound', { ms });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequency, note, success]);

  // Manual fallback shares the exact same success path (no mic required).
  const markHeard = () => {
    if (success) return;
    setSuccess(true);
    stopListening();
    setPiper?.('celebrate', 'Yay! ✨');
    logEvent('first_sound_success', { fallback: true });
    const ms = elapsedSince('onboarding_started');
    if (ms != null) logEvent('time_to_first_sound', { ms, fallback: true });
  };

  if (success) {
    return (
      <div style={{ animation: 'fh-pop 450ms ease both', width: '100%' }}>
        <div style={{ position: 'relative', fontSize: 64 }} aria-hidden="true">
          ✨
          <span style={{ position: 'absolute', left: '18%', top: 0, fontSize: 28, animation: 'fh-sparkle 900ms ease infinite' }}>✨</span>
          <span style={{ position: 'absolute', right: '18%', top: 6, fontSize: 22, animation: 'fh-sparkle 900ms ease infinite 0.3s' }}>⭐</span>
        </div>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0B3D3A', marginTop: 8 }}>
          You made a sound!
        </h2>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#1AA89F', marginTop: 10 }}>
          That's your very first note. You're a natural! 🎉
        </p>

        <div style={{ marginTop: 28 }}>
          <PrimaryButton onClick={() => onNext()}>Keep going!</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fh-rise 500ms ease both', width: '100%' }}>
      <div
        style={{ fontSize: 60, animation: 'fh-pop 600ms ease both' }}
        aria-hidden="true"
      >
        🥣
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0B3D3A', marginTop: 8 }}>
        Now let's make a sound!
      </h2>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#0B3D3A', marginTop: 12, lineHeight: 1.5 }}>
        Blow across your flute soft and slow — like you're cooling a spoon of soup.
      </p>
      <p style={{ fontSize: 15, fontWeight: 600, color: '#666666', marginTop: 12 }}>
        {isActive ? "I'm listening… any little sound counts! 👂" : 'Getting my ears ready…'}
      </p>

      {showFallback && (
        <div style={{ marginTop: 24 }}>
          <SecondaryButton onClick={markHeard}>I made a sound!</SecondaryButton>
        </div>
      )}
    </div>
  );
}
