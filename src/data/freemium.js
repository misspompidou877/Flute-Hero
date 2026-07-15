// ─── Freemium config + copy ───────────────────────────────────────────────
// Access is content-limited, not time-limited (there is no trial). The two
// songs flagged `free: true` at every level unlock once a grown-up adds an
// email (entitlement.emailUnlocked; see src/utils/entitlements.js). A one-time
// purchase (progress.isPremium) unlocks every song. For notes/games/fingering,
// non-premium users sit at the Level 1 free baseline (FREE_MAX_LEVEL below).
// No backend, no accounts.
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

// ─── Email-gated free-song tier ───────────────────────────────────────────
// There is no time-based trial (that was unenforceable client-side). Instead
// the two songs flagged `free: true` at EVERY level unlock once a grown-up
// adds an email (entitlement.emailUnlocked; see src/utils/entitlements.js).
// A brand-new guest can still play the onboarding "taste" song first. Copy
// below is kid-facing → warm, no prices.
export const FREE_SONGS_PER_LEVEL = 2

export const EMAIL_GATE = {
  eyebrow: 'Unlock your free songs',
  headline: '2 free songs at every level',
  subhead: 'Ask a grown-up to add their email — it opens a free song to play at every level.',
  placeholder: 'Grown-up’s email',
  button: 'Unlock free songs',
  maybeLater: 'Maybe later',
  invalid: 'Please check that email and try again.',
  // Small chip + button shown on a locked free song (needs email)
  lockedTag: 'Free',
  lockedCta: 'Unlock',
}

// ─── Parent-facing pricing (math-gated parent zone ONLY) ──────────────────
// Never import these into a kid-facing screen or component.
export const PARENT_PRICE = '$24.99'
export const PARENT_PRICE_LABEL = 'One-time purchase — yours forever, no subscription'

// Shown on /unlock while real checkout (Lemon Squeezy) is not wired up yet.
// The old placeholder button granted premium for free — now closed off.
export const CHECKOUT_CLOSED_NOTICE =
  'Checkout isn’t open just yet — we’re putting the finishing touches on payments. Check back soon!'
