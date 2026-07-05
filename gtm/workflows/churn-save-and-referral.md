# Re-Engagement & Referral (not "churn-save" — there is no subscription to cancel)

**Why this file is named differently from the original workstream spec:**
`Master orchestration fable 5.md` §5 D3 originally asked for a "churn-save:
cancel-flow survey + pause option (pause beats cancel for seasonal
practicers)." That spec assumes a subscription with a cancel flow. It does
not apply here: `flute-hero-redesign-brief.md` §3 and `GTM_PLAN.md` §0 are
both explicit and settled — **one-time $24.99 purchase, no subscription, no
auto-renew.** There is nothing to cancel and no pause toggle to build. This
file reconciles that mismatch by reframing "churn" as what it actually is for
a one-time-purchase product: **a lapsed practiser who already has full access
and simply stopped opening the app.** The retention target is re-engagement,
not cancellation prevention.

---

## 1. Re-engagement nudge (lapsed practisers)

- **Trigger:** no practice day recorded (`streak.history` / `practiceDays`)
  for **14 consecutive days**, for a family that **has already purchased**
  (`progress.isPremium` true). This is distinct from the trial-window nudges
  in `in-app-nudge-map.md`, which only apply during the first 10 days before
  any purchase decision.
- **Delivery mechanism:** the in-app half is immediate — Home already shows a
  non-shaming streak message ("Pick up your flute to start! 🎵" per
  `HomePage.jsx`, never "You broke your streak!" per `CLAUDE.md`'s Piper voice
  rule) the moment the app is reopened. A proactive nudge that fires *without*
  the app being opened (e.g. an email at day 14) requires the same future
  opt-in email service flagged `NEEDS_BUILD` in `trial-lifecycle-emails.md` §0
  and `post-purchase.md`.
- **Audience:** purchased families only, whichever parent email (if any) was
  captured. Never targets a still-in-trial family — those are covered by the
  day-4/day-8/day-10 in-app choreography instead.
- **Message summary:** warm, no guilt, no streak-shame — matches the existing
  Piper voice rule verbatim ("never streak-shame"). Something like: "Whenever
  you're ready, [child's name]'s flute is waiting — pick up right where you
  left off." No price (they've already paid; nothing to sell here).
- **Goal:** recover engagement without punishing a family for a normal gap
  (school terms, holidays, illness) — matches the brief's explicit rejection
  of dark patterns and countdown pressure.
- **Success metric:** reactivation rate (practice day recorded within 7 days
  of the nudge); `NEEDS_REAL_DATA`.

## 2. Referral loop — "Play for a grown-up" → referral page

This is the actual growth mechanism for a one-time-purchase product: no
recurring billing to protect, so growth comes from advocacy, not retention
economics.

**The intended flow (per `Master orchestration fable 5.md` §5 D3 and
`GTM_PLAN.md` §3 Channel 4):**
1. Child taps "Play for a grown-up" after a song (end-of-song screen, per
   Workstream A's practice-screen spec) → records a short clip.
2. The clip is shared — via device share sheet or a generated link — to a
   parent, relative, or friend.
3. The recipient lands on a **referral page**: the kid's clip front and
   centre, plus a **free-Level-1 / free-trial CTA** (never a hard sell,
   never a price on this page — the recipient is one hop removed from the
   family, closer to a cold prospect than a purchaser).
4. If that recipient's family goes on to install and eventually purchase, the
   original family gets credit — mechanism `NEEDS_REAL_DATA` per
   `GTM_PLAN.md` §3 Channel 4 (Lemon Squeezy affiliate support to be
   confirmed; no tracking mechanism exists yet to attribute this).

### Build status — flag for `LAUNCH_CHECKLIST.md`

**Neither the recording capture nor the referral page exists yet.** Confirmed
directly against the repo:
- `BUILD_LOG.md`: *"Deferred to LAUNCH_CHECKLIST (risk-managed): 'Play for a
  grown-up' recording capture (MediaRecorder) — NOT built, to avoid
  destabilising the working mic pipeline mid-overhaul; ParentZone already
  handles absent `recording.latest` gracefully."*
- `ParentZonePage.jsx` already reads `localStorage['recording.latest']`
  defensively and renders a friendly "No recording yet — after a song, your
  child can tap 'Play for a grown-up' and their performance will appear right
  here" placeholder — so the parent-zone half of this loop is UI-ready and
  waiting on the recording feature.
- No referral-page route exists in `src/App.jsx` today.

**This workflow document describes the intended trigger → audience → message
→ goal → metric shape so engineering and GTM can build to the same spec once
the recording capture ships. It is not claiming the loop is live today.**

| Stage | Trigger | Audience | Message | Goal | Metric |
|---|---|---|---|---|---|
| Capture | Child taps "Play for a grown-up" at end-of-song (not yet built) | The child, in-app | (no marketing message — this is a product moment, Piper-voiced, no price) | Produce the single most persuasive parent-trust asset the product generates (per `GTM_PLAN.md` §1.3) | Recordings captured per active user; `NEEDS_REAL_DATA` |
| Share | Parent/child chooses to share the clip (device share sheet or generated link) | Whoever the family chooses to share with — grandparent, aunt, friend | Pre-filled share text naming the child and the song, never a price | Get the clip in front of a warm, adjacent prospect | Shares sent per purchased family; `NEEDS_REAL_DATA` |
| Landing | Recipient opens the shared link | Cold-to-warm prospect (one hop from an existing family) | Referral page: clip + "Try Level 1 free, no card needed" CTA, no price on this page (a fresh prospect gets the same no-card free-Level-1 offer as any other visitor — never a special referral discount, since no such pricing experiment is currently authorised per `GTM_PLAN.md` §5) | Convert warm referral traffic into a new trial start | Referral-page → trial-start conversion; `NEEDS_REAL_DATA` |
| Attribution | New family eventually purchases | — | — | Credit the original referring family (mechanism TBD) | Attributed referral purchases; `NEEDS_REAL_DATA` (mechanism itself is `NEEDS_REAL_DATA` per `GTM_PLAN.md` §3 Channel 4) |

---

## 3. Coherence checklist for this file

- No cancel/pause/subscription language anywhere — the original workstream
  spec's "cancel-flow survey + pause option" is explicitly not applicable and
  is called out as such in the header, not silently dropped.
- Price stated only where relevant (never on the referral page, never in the
  re-engagement nudge to an already-purchased family) — consistent with
  "kids never see a price" and the parent-trust no-dark-patterns rule.
- The recording-capture and referral-page build gaps are stated plainly, with
  the exact source (`BUILD_LOG.md`) that confirms they're unbuilt, rather than
  presented as live features — required by Gate 3 (no fabrication) and flagged
  as a `LAUNCH_CHECKLIST.md` item.
- All metrics are `NEEDS_REAL_DATA`.
