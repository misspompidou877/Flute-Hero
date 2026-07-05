// ─── Freemium config + copy ───────────────────────────────────────────────
// The free tier is all of Level 1 (B·A·G). A 10-day free full-access trial
// (src/utils/trial.js) also grants every level while it's active. After the
// trial, Level 1 stays free forever and Levels 2–8 need a one-time unlock
// via the math-gated parent zone. Entitlement is a single client-side flag
// (progress.isPremium) — no backend, no accounts. See ProgressContext.jsx
// for how this maps to currentLevel.
//
// Kids never see a price (flute-hero-redesign-brief.md §3). Every string in
// PAYWALL below is kid-facing and must stay price-free — all purchase
// wording lives behind the parent zone (see PARENT_PRICE* below).

// Highest level a free (non-premium, non-trial) user can access.
export const FREE_MAX_LEVEL = 1

// Benefits shown on the paywall card and unlock page.
export const PREMIUM_BENEFITS = [
  { icon: '🎵', text: 'Every song across all 8 levels' },
  { icon: '🎼', text: 'New notes: C, D, and all the way up' },
  { icon: '🎮', text: 'Rhythm and note-reading games' },
  { icon: '🏆', text: 'Every badge and trophy to earn' },
]

// Kept for src/pages/UnlockPage.jsx, which still imports this — repurposed
// to be price-free (kids never see a price; see PARENT_PRICE* below for the
// real number, shown only behind the parent zone's math gate).
export const PRICE_LABEL = 'One-time unlock from a grown-up — no subscription'

// Kid-facing paywall wording — no prices, ever. Warm, Piper-voice, "ask a
// grown-up" framing (strings live in src/data/, per repo rules).
export const PAYWALL = {
  eyebrow: 'Locked for now',
  headline: 'The rest of the adventure is waiting',
  subhead: 'Ask a grown-up to open the rest of the adventure!',
  cta: 'Ask a grown-up',
  ctaShort: 'Ask',
  maybeLater: 'Maybe later',
  freeTag: 'Free',
  proTag: 'Locked',
  // headline shown when a specific level is tapped
  lockedLevel: (name) => `“${name}” is locked for now`,
  // success state after a grown-up unlocks everything
  unlockedHeadline: 'You’re all unlocked! 🎉',
  unlockedSubhead: 'Every level and song is now open. Have fun!',
}

// ─── Parent-facing pricing (math-gated parent zone ONLY) ──────────────────
// Never import these into a kid-facing screen or component.
export const PARENT_PRICE = '$24.99'
export const PARENT_PRICE_LABEL = 'One-time purchase — yours forever, no subscription'
