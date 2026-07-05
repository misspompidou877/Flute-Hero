# Trial Lifecycle Emails (Parent-Facing)

**Audience for every email in this file: the parent/grown-up, never the child.**
Piper's kid-facing voice never appears here in the "ask a grown-up" sense —
these are calm, teacher-voiced, transparent-pricing communications, per
`flute-hero-redesign-brief.md` §4 (parent surfaces) and Gate 3 (parent-trust).

## 0. The no-backend constraint — read this before building anything

Flute Hero has **no backend, no accounts, and no server-side email** (`CLAUDE.md`;
`flute-hero-redesign-brief.md` §3). These are not auto-sent transactional emails
in the traditional sense. Two delivery mechanisms are possible today, and every
trigger below must say which one it assumes:

1. **Device-share draft (works today, no new infrastructure).** The app opens
   the parent's own mail client with a prefilled `mailto:` draft (subject +
   body populated from the templates below); the parent reviews and hits send
   themselves. Nothing leaves the device automatically. This is the only
   mechanism that exists in the current build.
2. **Opt-in server delivery (future service, not yet built).** If a parent
   explicitly provides an email address and opts in, a future transactional
   email service (e.g. triggered from the stateless license function's
   infrastructure, or a new lightweight service) could send these on a
   schedule without the parent re-opening the app. **This does not exist yet.**
   Any email below whose trigger depends on "the app being closed on that day"
   (D3, D6, D9, D11) requires this future service — flag as `NEEDS_BUILD`
   until it exists. D0 (sent at the moment of the optional save prompt, app
   open) can use mechanism 1 today.

Every row below states which mechanism it currently assumes.

## 1. Day-number reconciliation with the in-app choreography

The in-app nudges (`in-app-nudge-map.md`) use `getTrialDay()`'s 1-based
convention: day 1 is the day the trial starts. This email sequence uses the
marketing convention "D0" for that same start day. **D0 here = trial day 1 in
`trial.js` — the same calendar day, two different naming conventions**, not a
contradiction. From there the sequence counts forward in real days: D3, D6,
D9 (one day before the in-app day-10 trophy/handoff, giving the parent advance
notice), D11 (one day after the trial has closed on day 10, referencing the
trophy Piper already showed the kid in-app).

## 2. The sequence

### D0 — Welcome ("what your kid will learn")

- **Trigger:** the optional save prompt at the end of onboarding ("So Piper
  remembers you!") — email is optional, guest mode fully supported. Fires only
  if a parent provides an email at that moment.
- **Delivery mechanism:** device-share draft (mechanism 1) or, if a future opt-in
  service exists, an immediate send — both are same-day, so either works today
  in a limited form (mechanism 1 only, until mechanism 2 is built).
- **Audience:** parents who opted in during onboarding. Never sent if no email
  was captured — the trial runs identically either way.
- **Message summary:** warm, teacher-voiced. Confirms the child's first name
  and age band are set up; previews the 8-level curriculum in plain terms
  ("First Breath → Sky High"); states the 10-day full-access trial plainly
  ("your child has full access to every level for 10 days, no card needed");
  states Level 1 is free forever regardless of what happens next. No price
  mentioned yet — D0 is about value, not the ask.
- **Goal:** set correct expectations early (no surprise paywall later) and
  make the parent feel the product is trustworthy from message one.
- **Success metric:** open rate; `NEEDS_REAL_DATA` (no baseline exists pre-launch).

### D3 — First-progress

- **Trigger:** trial day 3 elapsed (`getTrialDay() === 3`), evaluated against
  `trial.startedAt`, independent of whether the app was opened that day.
- **Delivery mechanism:** requires mechanism 2 (opt-in server delivery,
  `NEEDS_BUILD`) — the app cannot know it's day 3 unless it's open. Not
  possible with mechanism 1 alone.
- **Audience:** parents with an email on file, still inside the trial.
- **Message summary:** specific, not generic — reports actual mastered notes
  and any badges earned so far (pulled from `progress.masteredNotes` /
  `progress.badgesEarned` at the moment of send), framed as "here's what
  [child's name] can already do." No price mentioned.
- **Goal:** reinforce the habit forming, give the parent a concrete reason to
  check in on practice (this is also the window the in-app day-4 "show a
  grown-up" nudge sits inside, reinforcing the same message from the kid's side).
- **Success metric:** open rate + click-through to opening the app;
  `NEEDS_REAL_DATA`.

### D6 — Recording email

- **Trigger:** trial day 6, **and only if a recording exists** at
  `localStorage['recording.latest']`.
- **Important build-status note:** the "Play for a grown-up" recording capture
  (MediaRecorder) that would populate this key **is not yet built** — confirmed
  in `BUILD_LOG.md` ("Play for a grown-up recording capture — NOT built").
  `ParentZonePage.jsx` already reads this key defensively and shows a friendly
  "No recording yet" placeholder when it's absent. Until the capture ships,
  this email cannot attach an actual recording; it should either (a) not fire
  until the feature exists, or (b) fire with a CTA to open the parent zone and
  prompt the recording moment live, rather than attaching a file.
- **Delivery mechanism:** the recording itself never leaves the device
  automatically (privacy: on-device processing per `GTM_PLAN.md` §0). The
  email cannot embed the audio/video directly from a server it doesn't have —
  the realistic version of this email is a device-share draft (mechanism 1)
  that the parent sends to themselves or a relative, with the clip attached
  from the device's local storage/downloads at the moment of sharing.
- **Audience:** parents with an email on file, still inside the trial, whose
  child has captured a recording.
- **Message summary:** "listen to what your child sounds like today" — framed
  as a keepsake, not a sales pitch. Still no price.
- **Goal:** the single most persuasive parent-trust asset the product
  generates (per `GTM_PLAN.md` §1.3, Channel 2) — get the parent to actually
  press play.
- **Success metric:** recording play-through rate; `NEEDS_REAL_DATA`.

### D9 — Trial-ending, with the one-time $24.99 plan

- **Trigger:** trial day 9 (one day before the in-app day-10 trophy/handoff).
- **Delivery mechanism:** requires mechanism 2 (`NEEDS_BUILD`).
- **Audience:** parents with an email on file, trial about to end.
- **Message summary:** plain-language notice that the free full-access window
  ends tomorrow; states clearly what changes and what doesn't — **"Level 1
  stays free forever either way. If you'd like the rest of the adventure
  (Levels 2–8, every song, every game), it's a one-time purchase of $24.99 —
  no subscription, no auto-renew, nothing to remember to cancel."** Price and
  terms must match `src/data/freemium.js` (`PARENT_PRICE = '$24.99'`,
  `PARENT_PRICE_LABEL = 'One-time purchase — yours forever, no subscription'`)
  exactly. No countdown-pressure language, no fake scarcity (Gate 3 / no dark
  patterns).
- **Goal:** make sure the parent isn't surprised by the lock on day 11, and
  give them the plain economics before the ask, so the day-10/day-11 handoff
  isn't the first time they hear the price.
- **Success metric:** click-through to the parent zone / unlock page;
  `NEEDS_REAL_DATA`.

### D11 — Win-back, with the kid's trophy

- **Trigger:** trial day 11 — one day after the in-app day-10 trophy moment,
  and only for parents who have **not yet purchased** (`progress.isPremium`
  is not true / no `fluteHeroLicense` in localStorage).
- **Delivery mechanism:** requires mechanism 2 (`NEEDS_BUILD`).
- **Audience:** parents with an email on file, trial ended, not yet converted.
- **Message summary:** leads with the same trophy/celebration moment Piper
  already showed the child in-app on day 10 ("[child's name] just earned
  their [badge name] — take a look"), then repeats the one-time $24.99 offer
  plainly, with a direct link into the math-gated parent zone. Reiterates
  Level 1 remains free forever regardless — this is a nudge, not a threat.
- **Goal:** convert the engaged-but-not-yet-purchased family; recover the
  "kid engaged, parent never saw value" leak named in `GTM_PLAN.md` §6.
- **Success metric:** trial→paid conversion attributable to this email;
  `NEEDS_REAL_DATA`.

## 3. Coherence checklist for this file

- Price stated: **$24.99, one-time, no subscription** — matches
  `flute-hero-redesign-brief.md` §3, `GTM_PLAN.md` §0, and
  `src/data/freemium.js` verbatim.
- In-app day numbers referenced (4, 8, 10) are only ever cross-referenced, never
  redefined — the authoritative version lives in `in-app-nudge-map.md`.
- Email day numbers (0, 3, 6, 9, 11) are a distinct, compatible sequence in the
  same 10-day window plus one day of win-back; none contradict the trial length
  of 10 days from `trial.js` (`TRIAL_DAYS = 10`).
- Every metric target is `NEEDS_REAL_DATA` — no invented rates.
