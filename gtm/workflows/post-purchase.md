# Post-Purchase Lifecycle (Parent-Facing)

**Scope:** everything that happens *after* a parent has unlocked the app —
i.e. `progress.isPremium` is true / a `fluteHeroLicense` object exists in
localStorage (per `src/Monetisation and marketing site.md` §Task 1b and
`GTM_PLAN.md` §0). There is no subscription to manage here — the purchase is
one-time and final; everything in this file is about retention and advocacy,
not billing.

**No-backend constraint (same as `trial-lifecycle-emails.md` §0):** none of
these are server-triggered emails today. Every trigger below is either (a) a
device-share draft opened from within the app at a specific in-app moment
(mechanism 1, works today), or (b) requires a future opt-in email service that
does not exist yet (mechanism 2, `NEEDS_BUILD`). Each row states which.

---

## 1. Weekly progress email — the retention engine

- **Trigger:** every 7 days after purchase, evaluated from `practiceDays`
  history already tracked by `useStreak()` / `progress.completedSongs` (see
  `CLAUDE.md` localStorage schema — `streak.history`, `progress.completedSongs`).
- **Delivery mechanism:** requires mechanism 2 (`NEEDS_BUILD`) — a weekly
  cadence independent of app-open cannot run without a scheduled sender.
  Until that exists, the closest available substitute is a **weekly in-app
  summary card** on Home (mechanism 1 equivalent: rendered on next open, not
  emailed) plus a manual "share this week's progress" device-share button the
  parent can trigger from the parent zone.
- **Audience:** all purchased families with an email on file who left the
  default opt-in enabled (per Workstream C's "Weekly progress email opt-in —
  default on at subscribe" — reworded here for a one-time purchase: default on
  at unlock, not at "subscribe," since there is no subscription).
- **Message summary:** teacher-voiced, specific: days practised this week,
  notes mastered, current level and song, one specific piece of encouragement.
  Mirrors the `ParentZonePage.jsx` progress hero card content (days practised,
  songs learned, "can now play B, A and G in tune" style specificity) so the
  email and the in-app parent zone never disagree.
- **Goal:** this is named the retention engine deliberately — a one-time
  purchase has no renewal date forcing re-engagement, so the weekly email (or
  its in-app substitute) is the only mechanism keeping a purchased-but-lapsing
  family practising. Directly defends against the "habit not formed" leak in
  `GTM_PLAN.md` §6.
- **Success metric:** week-over-week practice-day retention among purchased
  families; `NEEDS_REAL_DATA`.

## 2. Milestone celebrations

- **Trigger:** any badge-earning event already fired by the existing badge
  system (`src/data/badges.js` — real badge ids in this codebase include
  `first_notes`, `hot_cross_buns`, `marys_lamb`, `ode_to_joy`, `twinkle_star`,
  `streak_3`, `streak_7`, `perfect_pitch`, `five_note_star`, `rhythm_master`,
  `flute_hero`, `note_reader` — use the actual ids from that file, not the
  older list in `CLAUDE.md`'s schema section, which predates some of these),
  or a level-up (`progress.currentLevel` increments).
- **Delivery mechanism:** the celebration itself is **already in-app** (Piper
  `celebrate` mood, per `FluteCharacter.jsx`) — no email needed for the kid
  to feel it. The *parent-facing* echo of that milestone (a short "your child
  just earned X" note) requires mechanism 2 (`NEEDS_BUILD`); until then the
  parent sees it the next time they open the parent zone, which already
  surfaces `progress.badgesEarned` and `progress.currentLevel`.
- **Audience:** purchased families with an email on file.
- **Message summary:** one badge or level per email, named specifically (no
  generic "great job!" — use the real badge name/icon from `badges.js`).
- **Goal:** give the parent recurring, low-effort reasons to feel the purchase
  was worth it — this is the advocacy-building layer beneath the month-2
  referral ask in §3.
- **Success metric:** email open rate on milestone sends vs. the weekly digest;
  `NEEDS_REAL_DATA`.

## 3. Month-2 "invite a friend / sibling"

- **Trigger:** ~60 days after purchase (`fluteHeroLicense.activatedAt` + 60
  days), for families still actively practising (at least one practice day in
  the trailing 2 weeks, per `streak.history`).
- **Delivery mechanism:** requires mechanism 2 for the scheduled trigger
  (`NEEDS_BUILD`). The share action itself, once triggered, uses the device's
  native share sheet or a `mailto:`/link draft (mechanism 1) — there is no
  server-side referral tracking today (see `churn-save-and-referral.md` for
  the referral-page build status, which this ask depends on).
- **Audience:** purchased, actively-practising families only — this is a
  goodwill ask, not a cold outreach, so it should never reach a lapsed family
  (that's the churn-save flow's job, not this one).
- **Message summary:** two variants, both price-transparent and non-pushy:
  1. **Sibling variant:** "If you've got another kid who might want to try
     flute, Level 1 is free for them too, no card needed." (Note: the
     existing license activation limit of 3 per `Monetisation and marketing
     site.md` already covers a second device for the same family without any
     new purchase — the email should clarify this, not imply a second $24.99
     charge is needed for a sibling on the same license.)
  2. **Friend variant:** "Know another family whose kid is starting flute?
     Share Flute Hero — free Level 1, no card needed." Links to the same
     public entry point a cold visitor would use, not a special "referral"
     price (no referral discount is a settled product fact yet — any
     incentive mechanic would be a new pricing experiment, out of scope here).
- **Goal:** low-cost organic growth from the highest-trust source available —
  a parent who already paid and is still using it.
- **Success metric:** shares sent, and downstream trial starts attributable to
  a share (needs the referral-page tracking described in
  `churn-save-and-referral.md`); `NEEDS_REAL_DATA`.

---

## 4. Coherence checklist for this file

- No subscription language anywhere — "purchase," "unlock," "one-time" only;
  never "subscribe," "renew," "billing cycle."
- Price is not re-quoted here as a new ask (these families already paid);
  the only price mention is the sibling clarification in §3, which correctly
  states no new charge is implied by the existing activation-limit-3 license.
- All badge/level references use real ids from `src/data/badges.js` /
  `ProgressContext.jsx`, not invented names.
- Every metric target is `NEEDS_REAL_DATA`.
