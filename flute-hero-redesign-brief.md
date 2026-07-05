# Flute Hero — Product Vision Brief (Piper · Songkeeper's Sky · Trial→Unlock)

**Status:** DRAFT by orchestrator for sign-off. This is the missing "redesign brief"
that `Master orchestration fable 5.md` (Ground Rule 2) depends on. Once approved, it
is the single source of truth for characters, world, trial, and pricing. Subagents
must not invent anything outside this file, `STYLE_GUIDE.md`, or explicit orchestrator
instruction.

**Authored to reconcile three existing documents:**
- `STYLE_GUIDE.md` — visual law (palette/type/spacing). **Wins on all visuals.**
- `CLAUDE.md` — hard rules: localStorage only, no backend, no accounts.
- `Monetisation and marketing site.md` — one-time $24.99 unlock model.

**Locked decisions (from the user, this session):**
1. Brand name (user-facing): **Flute Hero** — now also confirmed by STYLE_GUIDE.md v2.0.
2. **Visual system: STYLE_GUIDE.md v2.0 (July 2026) — the TEAL palette.** The old
   navy/blue/lime "Trill" palette is **RETIRED**; migrating the app to teal is part of
   this overhaul. Token map:
   - Deep Teal `#0B3D3A` — text, headers, icons, dividers, anchors (replaces Navy)
   - Teal `#26CCC2` — primary CTA / active / progress (replaces Digital Blue); gradient
     `linear-gradient(to right, #26CCC2, #1AA89F)`; primary shadow `0 4px 16px rgba(38,204,194,0.35)`
   - Mint `#6AECE1` — secondary buttons / accents (replaces Frosted Blue); gradient
     `linear-gradient(to right, #6AECE1, #34D6C9)`; shadow `0 2px 8px rgba(106,236,225,0.25)`
   - Sunshine `#FFF57E` — celebration / mastery / streak / in-tune (replaces Lime Cream)
   - Mango `#FFB76C` — decorative / locked badges (replaces Mauve)
   - Page `#FAFAF8`, Card `#FFFFFF`, Track `#F1EFE8`, Inactive `#D3D1C7`, Hint `#666666`,
     Overlay `rgba(11,61,58,0.5)`
   - **GOLDEN RULE: text on any bright colour (Teal/Mint/Sunshine/Mango) = Deep Teal
     `#0B3D3A`, NEVER white.** White text only on a Deep Teal surface.
3. Data model: **client-side only**. No backend, no accounts, no server email. The one
   permitted server file is the stateless license function from the monetisation brief.
4. Monetisation: **10-day free full-access trial → one-time $24.99 forever unlock.**
   No subscription.

---

## 1. THE MASCOT — "Piper"

Piper **is the existing `FluteCharacter` component** (`src/components/FluteCharacter.jsx`)
— a friendly cartoon concert flute with a round face and big eyes. We are **naming** it
Piper, **extending its state API**, and **recolouring its SVG fills to the v2.0 teal
palette** (body → Mint `#6AECE1`, keys → Teal `#26CCC2`, outline/eyes → Deep Teal
`#0B3D3A`, cheeks → Mango `#FFB76C`, floating note → Teal). No structural redraw; final
illustration can drop in later behind the same component API.

**Personality:** warm, encouraging, a little playful. A gentle guide, never a coach who
nags. Celebrates effort over perfection. Curious about music.

**Voice — do:** short, kid-readable (age 7 reading level), first-person, one idea per
line, emoji sparingly. "Let's find the next song!" / "Blow soft, like cooling soup."
**Voice — don't:** sarcasm, pressure, streak-shame ("You broke your streak!"), prices,
purchase language, or anything a kid shouldn't read. Piper never mentions money.

**Animation state set** (component API — extends the existing moods):

| State | Basis in current component | When it fires |
|---|---|---|
| `idle` | existing `idle` (float) | resting on any screen |
| `listening` | existing `listening` | mic is active |
| `celebrate` | existing `complete`/`perfect` (bounce/spin + confetti) | note mastered, song done |
| `encourage` | existing `wrong` (shake) — **reworded gently** | a note is close but not there |
| `wave` | **NEW** — small tilt + raised note | greeting on Home / onboarding hello |
| `sleepy` | **NEW** — slow float + closed eyes | trial winding down, gentle "come back" |
| `dance` | **NEW** — bob + confetti | level-up, day-10 trophy moment |

Existing moods (`correct`, `complete`, `perfect`, `wrong`) keep working — the new names
map onto them so no caller breaks. Placeholder CSS animations for `wave`/`sleepy`/`dance`
are acceptable now; the API ships so richer art/motion drops in later without refactor.

---

## 2. THE WORLD — "Songkeeper's Sky"

**Frame:** The wind scattered Piper's songs across the sky. The child helps Piper find
them again, one song at a time. Learning a song = recovering a lost melody. Mastering a
note = collecting a **note-gem**.

**Sky map = the existing 8-level curriculum, re-skinned** (do NOT invent new levels or
change gating logic; this is a visual/narrative layer over the current progression):

| Level | Curriculum name (unchanged) | Sky-map landmark idea |
|---|---|---|
| 1 | First Breath | Cloudbank start — free forever |
| 2 | Finding My Voice | Breeze Meadow |
| 3 | Middle Path | Windmill Ridge |
| 4 | Reaching Higher | High Cliffs |
| 5 | Taking Flight | Open Sky |
| 6 | Sharps & Flats | Starfields |
| 7 | Filling the Gaps | Moon Arc |
| 8 | Sky High | Summit / Aurora |

- **Landmark icon set** replaces the current mixed emoji — one coherent set, drawn in
  the style-guide palette (Navy line, Digital Blue / Lime accents). Placeholder SVGs ok.
- **Note-gems** are the mastery reward: a gem lights per mastered note, feeding the
  level's existing `masteredNotes` progress. Purely a re-skin of existing mastery state.
- Games re-skinned into the world: "Piper Says" (echo/rhythm), "Catch the Falling Notes."
  Reward = gems that feed level progress. Logic unchanged; visuals + names only.

---

## 3. TRIAL → UNLOCK MODEL (client-side, no backend)

**localStorage keys (new, all client-side):**
- `trial.startedAt` — ISO date, set silently on first app open.
- `trial.dayNumber` — derived (1–10+) from `startedAt` vs today.
- entitlement stays the existing `progress.isPremium` flag (unchanged plumbing).
- license object `fluteHeroLicense { key, instanceId, activatedAt }` when purchased.

**Timeline:**
- **Days 1–10 — full access.** All 8 levels, all songs, all games unlocked. No paywall,
  no signup, no email required. Trial starts silently; framed to the kid as "your
  10-day adventure," never as a countdown clock.
- **Day 4** — gentle in-app "show a grown-up what you made" nudge (Piper `wave`).
- **Day 8** — soft Piper heads-up that the adventure is winding down (`sleepy`).
- **Day 10** — trophy + "grown-up handoff": Piper `dance`, then route the parent (via
  the math gate) to the unlock screen.
- **After day 10 — Level 1 free forever;** Levels 2–8, full-length games, and locked
  Fingering Library notes require the **one-time $24.99 unlock**. This reuses the
  existing `isPremium` gating already wired into Songs/Practice/Fingering/Home.

**Emails are NOT sent by the app** (no backend). The day-6 "recording" email and the
full lifecycle sequence are authored as **GTM templates + an in-app "email this to a
grown-up" share** (opens the device mail client with a prefilled draft). Documented in
`gtm/workflows/`, delivered by the parent's own mail app — nothing leaves the device
automatically.

**Kids never see a price.** All purchase UI lives behind the math-gated parent zone.

---

## 4. DUAL AUDIENCE

- **Kid surfaces** (Home, Practice, Lesson, Songs, Games, onboarding): playful, Piper
  voice, icon-forward, low reading load, **no prices ever**, forgiving feedback
  (green glow / warm yellow — never a red X).
- **Parent surfaces** (parent zone, landing page, pricing, FAQ, legal): calm, credible,
  teacher voice, transparent one-time pricing, math-gated entry. No fabricated
  testimonials, stats, or endorsers — placeholders flagged `NEEDS_REAL_PERSON` /
  `NEEDS_REAL_DATA`.

---

## 5. WHAT STAYS UNTOUCHED (hard guardrails)

- **Pitch/mic logic** (`useMicrophone`, `window._fluteAudio`), **VexFlow** rendering,
  and the **FingeringDiagram internals** — do not modify (see `CLAUDE.md` +
  `flute-hero-redesign-prompt.md`). Re-skin around them only.
- **Gating logic** (`FREE_MAX_LEVEL`, `isPremium`, `ProgressContext`) — extend for the
  trial window, do not rip out.
- **No new npm packages, no backend, no accounts, no `localStorage.clear()`.**
- **Palette:** only `STYLE_GUIDE.md` **v2.0 TEAL** tokens. Name is "Flute Hero". No
  off-palette values; no navy / digital-blue / frosted-blue / lime-cream / mauve (all retired).
