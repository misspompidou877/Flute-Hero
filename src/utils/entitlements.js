/**
 * entitlements.js — single client-side source of truth for song access.
 *
 * Flute Hero has no backend and no accounts (see CLAUDE.md), so a time-based
 * trial can never be enforced (clearing storage / incognito resets it). The
 * robust model is content-limited instead of time-limited:
 *
 *   • Guest (no email yet): only the onboarding "taste" song is playable.
 *   • Free (grown-up added an email → `entitlement.emailUnlocked`): the two
 *     songs flagged `free: true` at every level unlock.
 *   • Premium (`progress.isPremium`): every song unlocks.
 *
 * Resetting storage only ever drops a user back to the same free slice — you
 * cannot reset your way into more content. This closes casual free-riding;
 * true tamper-proofing would need a backend, which is out of scope.
 *
 * This module owns exactly one localStorage key: `entitlement.emailUnlocked`.
 */

const EMAIL_UNLOCK_KEY = 'entitlement.emailUnlocked';

/**
 * The one song a brand-new guest can play before any email is given — the
 * song onboarding hands off into. Keeps a moment of "it works!" delight
 * before the free-tier email ask (soft gate).
 */
export const GUEST_SAMPLE_SONG_ID = 'hot-cross-buns';

/** True once a grown-up has added an email, unlocking the free-song tier. */
export function isEmailUnlocked() {
  try {
    return localStorage.getItem(EMAIL_UNLOCK_KEY) === 'true';
  } catch {
    return false;
  }
}

/** Persist the email-unlock flag. Degrades silently in private browsing. */
export function markEmailUnlocked() {
  try {
    localStorage.setItem(EMAIL_UNLOCK_KEY, 'true');
  } catch {
    // Ignore — private mode / quota. Entitlement simply won't persist.
  }
}

/**
 * Is a given song currently playable for this user?
 *
 * @param {{ id?: string, free?: boolean } | null} song
 * @param {{ isPremium?: boolean, emailUnlocked?: boolean }} entitlement
 */
export function isSongUnlocked(song, { isPremium, emailUnlocked } = {}) {
  if (isPremium === true) return true;
  if (!song) return false;
  if (song.id === GUEST_SAMPLE_SONG_ID) return true; // guest taste (soft gate)
  if (song.free === true && emailUnlocked === true) return true; // free tier
  return false;
}
