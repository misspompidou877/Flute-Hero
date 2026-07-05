# In-App Nudge Map — Piper's Trial Choreography

**Status:** Documentation of the shared source of truth. Day numbers below are
copied verbatim from `flute-hero-redesign-brief.md` §3 and `src/utils/trial.js`
— nothing here invents a different day. If any other GTM document (lifecycle
emails, GTM plan, ads) states a different in-app day number, **this file and
the brief are correct and the other document is wrong.**

**No backend.** Every nudge below is a client-side UI state change — a Piper
mood + speech bubble rendered from `getTrialDay()` — never a push notification,
never a server-triggered event. There is nothing to "send"; there is only what
renders on screen when the app happens to be opened on that calendar day.

---

## 1. The day-number source of truth

`src/utils/trial.js` owns all trial-day math against exactly one localStorage
key, `trial.startedAt`:

- `TRIAL_DAYS = 10`
- `getTrialDay()` — 1-based calendar day since first open (day 1 = the day the
  trial started, counting today).
- `isTrialActive()` — true while `getTrialDay() <= 10`.
- `daysRemaining()` — `10 - getTrialDay() + 1`, floored at 0.
- `hasFullAccess(isPremium)` — true if premium OR still inside the trial window.

Every nudge below is a pure function of `getTrialDay()`. No other clock, no
separate "engagement score," no server timer.

## 2. Piper's mood API (already built)

`src/components/FluteCharacter.jsx` ships the full mood set named in the brief:
`idle`, `listening`, `celebrate`, `encourage`, plus the three trial-specific
moods — **`wave`** (small tilt + raised note, 700ms), **`sleepy`** (slow float,
closed eyes, 3.6s loop), **`dance`** (happy bob + confetti, 500ms loop). Piper
never mentions money in any mood's speech bubble — see `SPEECH` map in that
file — and none of the three trial moods carry price language.

## 3. The choreography

| Trial day (`getTrialDay()`) | What happens | Piper mood | Surface | Piper says (kid-safe, no price) | Parent-facing follow-through |
|---|---|---|---|---|---|
| **1–3** | **Silent.** No trial-specific UI beyond the always-on "Day X of your 10-day adventure" badge on Home. No nudge, no pressure framing. | `idle` / default greeting `wave` (unchanged from any other day) | — | (no trial-specific copy) | none |
| **4** | **"Show a grown-up" nudge.** First gentle break in the silence — invites the kid to share what they've made so far. | `wave` | Home (and/or end-of-song screen) | *"Hey — want to show a grown-up what you've learned so far? 🎵"* | Encourages the kid to trigger the "Play for a grown-up" flow (see §4 of `churn-save-and-referral.md` for build status) or simply call a parent over. No price mentioned. |
| **5–7** | Silent again — back to normal play, no trial framing beyond the Day-X badge. | `idle` | — | — | none |
| **8** | **Soft heads-up.** The adventure is winding down — framed as anticipation, never a countdown-pressure clock. | `sleepy` | Home | *"Just a couple more days of our adventure — let's make them count! 🌙"* | None yet — this is a kid-facing signal only; no parent screen changes on day 8. |
| **9** | Silent in-app (this is the day the **parent email** trial-ending notice fires — see `trial-lifecycle-emails.md` D9; that is a separate channel, not an in-app nudge). | `idle` | — | — | Parent email only (external channel) |
| **10** | **Trophy + grown-up handoff.** The big moment: Piper celebrates, then the flow routes toward the math-gated parent zone. | `dance` | Home / trophy screen | *"We did it! Let's show a grown-up what you found! 🏆"* | Routes to the math gate → `ParentZonePage.jsx`, which surfaces the progress hero card, the kid's recording (if captured), and the `$24.99` one-time unlock CTA. **Kids never see this price** — it lives only behind the math gate, per `src/data/freemium.js` (`PARENT_PRICE = '$24.99'`, kid-facing `PAYWALL` copy is permanently price-free). |
| **11+** | Trial window closed (`isTrialActive()` is now false). **Level 1 stays free forever.** Levels 2–8, full-length games, and locked Fingering Library notes render the kid-facing lock state (`PAYWALL` copy: "Ask a grown-up") until `progress.isPremium` is set. | `idle` / `encourage` (existing moods, unchanged) | Songs / Practice / Fingering Library | *"The rest of the adventure is waiting — ask a grown-up to open it!"* | Parent zone remains reachable any time via the top-corner "Grown-ups" button on Home; no new day-11-specific UI is required beyond the existing lock screens. |

## 4. Implementation status (engineering handoff note — not a fabrication of "done")

What is **already built** as of this session:
- `src/utils/trial.js` — the full day-math module described in §1, wired into
  `HomePage.jsx` today only as the passive "Day X of your 10-day adventure 🌟"
  badge (visible whenever `isTrialActive()` is true, every day 1–10).
- `src/components/FluteCharacter.jsx` — the complete mood API including `wave`,
  `sleepy`, `dance` with their CSS keyframes and kid-safe speech strings.
- The math-gated parent zone (`ParentZonePage.jsx`) and price-free kid paywall
  copy (`src/data/freemium.js`).

What is **not yet wired** (a gap this document intentionally does not paper
over, since Gate 3 forbids overstating what's built):
- `HomePage.jsx` currently renders Piper with a hard-coded `mood="wave"` greeting
  on every visit — there is no conditional switch yet that reads `getTrialDay()`
  and swaps to `sleepy` on day 8 or `dance` on day 10. Wiring that conditional
  (day 4 → `wave` nudge copy, day 8 → `sleepy`, day 10 → `dance` + route to
  parent zone) is the remaining implementation task; the day numbers and mood
  choices it must use are exactly the ones in the table above.
- The "Play for a grown-up" recording capture referenced in the day-4 and
  day-10 rows is **not yet built** (confirmed in `BUILD_LOG.md`: "Play for a
  grown-up recording capture (MediaRecorder) — NOT built"). `ParentZonePage.jsx`
  already reads `localStorage['recording.latest']` defensively and shows a
  friendly "No recording yet" placeholder when it's absent, so the day-4/day-10
  copy above is written to work whether or not a recording exists. Tracked as a
  `LAUNCH_CHECKLIST.md` item — see `churn-save-and-referral.md` §4.

This section exists so GTM and engineering share one accurate picture; it does
not change any day number or mood choice above.
