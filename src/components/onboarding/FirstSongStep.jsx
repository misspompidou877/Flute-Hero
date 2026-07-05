/*
 * Step 8 — First song. This commits the child to their first real song
 * (Hot Cross Buns). The actual hand-off into the real Practice screen happens
 * when the flow finishes (controller navigates to /practice?song=hot-cross-buns
 * so the optional journey + save steps aren't skipped by leaving the SPA).
 *
 * Tapping the CTA fires `first_song_started` and records time_to_first_song
 * (ms from onboarding_started) — the moment the child chooses to play.
 */
import { logEvent, elapsedSince } from '../../utils/analytics';
import { SONGS } from '../../data/songs';
import { PrimaryButton } from './OnboardingShell';

const FIRST_SONG = SONGS.find((s) => s.id === 'hot-cross-buns');

export default function FirstSongStep({ onNext }) {
  const start = () => {
    logEvent('first_song_started', { songId: 'hot-cross-buns' });
    const ms = elapsedSince('onboarding_started');
    if (ms != null) logEvent('time_to_first_song', { ms });
    onNext();
  };

  return (
    <div style={{ animation: 'fh-rise 500ms ease both', width: '100%' }}>
      <div style={{ fontSize: 56 }} aria-hidden="true">🎼</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0B3D3A', marginTop: 8 }}>
        I found your first song!
      </h2>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#0B3D3A', marginTop: 12, lineHeight: 1.5 }}>
        It's <strong style={{ color: '#1AA89F' }}>{FIRST_SONG?.title ?? 'Hot Cross Buns'}</strong> —
        just three notes. Every close note glows. Ready?
      </p>

      <div style={{ marginTop: 28 }}>
        <PrimaryButton onClick={start}>Yes! Let's play 🎵</PrimaryButton>
      </div>
    </div>
  );
}
