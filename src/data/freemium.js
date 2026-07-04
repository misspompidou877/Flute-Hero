// ─── Freemium config + copy ───────────────────────────────────────────────
// The free tier is all of Level 1 (B·A·G). Premium unlocks Levels 2–8.
// Entitlement is a single client-side flag (progress.isPremium) — no backend,
// no accounts. See ProgressContext.jsx for how this maps to currentLevel.

// Highest level a free (non-premium) user can access.
export const FREE_MAX_LEVEL = 1

// Placeholder price copy — easy to swap when a real payment provider is wired in.
export const PRICE_LABEL = 'One-time unlock — no subscription'

// Benefits shown on the paywall card and unlock page.
export const PREMIUM_BENEFITS = [
  { icon: '🎵', text: 'Every song across all 8 levels' },
  { icon: '🎼', text: 'New notes: C, D, and all the way up' },
  { icon: '🎮', text: 'Rhythm and note-reading games' },
  { icon: '🏆', text: 'Every badge and trophy to earn' },
]

// All paywall wording in one place (strings live in src/data/, per repo rules).
export const PAYWALL = {
  eyebrow: 'Trill Premium',
  headline: 'Unlock the full course',
  subhead: 'Level 1 is free forever. Unlock Levels 2–8 to keep the music going.',
  cta: 'Unlock all levels',
  ctaShort: 'Unlock',
  maybeLater: 'Maybe later',
  freeTag: 'Free',
  proTag: 'Premium',
  // headline shown when a specific level is tapped
  lockedLevel: (name) => `“${name}” is part of Trill Premium`,
  // success state after the (placeholder) purchase
  unlockedHeadline: 'You’re all unlocked! 🎉',
  unlockedSubhead: 'Every level and song is now open. Have fun!',
}
