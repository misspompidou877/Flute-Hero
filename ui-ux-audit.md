# Trill — Responsive & Touch Audit (current code)

_Audit date: 2026-07-04. Scope: every page + interactive component, reviewed against the
CLAUDE.md rules — touch targets ≥44px (core) / ≥56px (Foundations), font ≥14px (core) /
≥16px (Foundations), safe-area insets on fixed/full-bleed screens, `100dvh` over `100vh`,
no horizontal overflow at 375 / 390 / 768–820 / 1180px, portrait **and** landscape on iPad._

## Status

**All items fixed (2026-07-04).** High (H1–H5), Medium (M1–M7), and Low items are done;
build + lint verified (no new issues). Notes:
- **M1 (iPad portrait):** resolved by lowering the practice rotate threshold to 700px, so
  iPad-width screens render the practice layout in portrait; phones still rotate.
- **Not device-verified** — recommend an on-device pass, especially H1 (landscape notch),
  H2 (phone tap accuracy), and M2 (short-landscape tuning card).
- A few intentional non-changes: `LessonCard` footer left as-is (sits inside the
  112px-padded main, so it clears the nav); FingeringDiagrams hole-labels and per-note
  legibility left to the free-standing-label bump (full HTML-overlay refactor deferred).

**Phase 2 prompt (`flute-hero-phase-2-prompt-v2.md`):** verified — all 11 tasks already
satisfied by the current code + the fixes above (the prompt targets an older build with
`#E53935` branding, `#FFF5E1` nav, `pb-28`, and JS hover state that no longer exist). No
changes required.

## What's already correct (verified)

- **`viewport-fit=cover`** is present (`index.html:6`) so `env(safe-area-inset-*)` actually resolves.
- **No `100vh` bugs.** Full-height containers use `100dvh` (EchoGame, FingeringLibrary, Unlock,
  LessonCard, NoteReadingSection, Intro). Only stray unit: `min-h-[80vh]` at `EchoGamePage.jsx:243` (cosmetic).
- **Bottom-nav clearance is handled globally:** `App.jsx:35` pads every non-`/practice` route with
  `calc(7rem + env(safe-area-inset-bottom))`. → The "content hides behind the nav" concern on
  Home/Songs/Basics/Trophies/Foundations is **not a real bug** (shell reserves 112px). PracticePage
  is the one full-bleed route and reserves its own bottom space (`PracticePage.jsx:517`).
- **`TuningMeter.jsx` is dead code** (imported nowhere) — its unstyled ~21px button never ships.
  Either delete it or don't spend time styling it.

---

## Critical / High — fix first

| # | Location | Issue | Fix |
|---|----------|-------|-----|
| H1 | `PracticePage.jsx:465` (+ top bar `473–512`) | The core practice screen is `fixed inset-0` and **runs landscape-only**, but has **no `env(safe-area-inset-left/right/top)`**. On a notched iPhone in landscape the notch overlaps the back button and top bar. | Add `paddingLeft/Right: env(safe-area-inset-left/right)` (and top) to the top bar / body. |
| H2 | `StaffInteractive.jsx:96–206` | Note tap circles are `r=26` in a `480×188` viewBox. On a ~320px phone that scales to a **~34px** hit target (< 56px, < 44px). In **mixed mode** note spacing (~46 units) is *smaller than* the target diameter → **adjacent targets overlap and taps are ambiguous** (no nearest-wins logic, unlike `StaffDisplay`). Phone-only; fine on iPad. | Widen per-note spacing and/or adopt the proximity/nearest-hit approach from `StaffDisplay.jsx`. |
| H3 | Foundations controls (56px rule) | Primary controls below the **56px** Foundations minimum: `ModeProgressTabs.jsx:51` (48px, main step nav), `MirrorPrompt.jsx:62,82,100` (48px), `NoteReadingSection.jsx:397` (Back 44px), `NoteValueLesson.jsx:180–196,340–357` (~36px pills), `NoteValueLesson.jsx:504` (Play 52px), `FoundationsPage.jsx:186` ("Skip to Level 1" ~44px). | Raise each to `minHeight:56` / equivalent padding. |
| H4 | `LessonPage.jsx:138–140` & `FingeringDiagrams.jsx:113–118` | **Legibility for children.** Tuning "Flat / In tune / Sharp" labels are `fontSize:9`. The fingering SVG (`viewBox 0 0 800 210`) scales its 13–20px in-SVG labels down to ~**6–9px** on a phone. | Tuning labels ≥12px (14 preferred). For the diagram, render labels as HTML outside the scaled SVG, or enforce a min render scale on phones. (Do **not** touch the locked blue/green/purple.) |
| H5 | `FingeringDiagrams.jsx:204` | "♪ Hear It" button is `h-10` (40px) — below 44px. Appears on Lesson + Fingering Library. | `h-11` (44px) or `minHeight:44`. |

---

## Medium

| # | Location | Issue | Fix |
|---|----------|-------|-----|
| M1 | `PracticePage.jsx:17–37, 348` | `PRACTICE_MIN_WIDTH = 900` forces **iPad portrait (768/820px) to rotate**, conflicting with CLAUDE.md "must work in both portrait and landscape on iPad" (the music-stand device). | Lower the threshold for tablet widths, or provide a single-column portrait practice layout on iPad. |
| M2 | `PracticePage.jsx:17–37` | Any landscape returns `'ok'`, incl. **iPhone SE landscape 568×320**. In ~215px of height the two-column body + top bar + 44px transport row is very cramped; the right column (`overflowY:auto`, ~594) can push the **live tuning card off-screen** — that's the core feedback loop. | Add a min-landscape-height guard (fall back to rotate/compact), or a single-row compact layout under ~600px width. |
| M3 | `PracticePage.jsx:473–480, 506–512` | Back button and settings gear are **40×40px** (< 44px). | 44×44. |
| M4 | Foundations 16px font rule | Body/label text below **16px**: `FoundationsPage.jsx:109` (14) & `:186` (14), `ModeProgressTabs.jsx:55` (15), `NoteReadingSection.jsx:138,176,221,437` (15). | Raise to 16px. |
| M5 | `LessonPage.jsx:232`, `ReadMusicPage.jsx:694` (sticky `top:0` header) & `:741` (sticky bottom bar) | Sticky/top bars lack `env(safe-area-inset-top/bottom)` (main shell pads bottom but not top). Notch collides with back buttons; bottom Quiz bar sits near the home indicator. | Add the corresponding safe-area inset padding. |
| M6 | `HomePage.jsx:426` ("See all" ~30px), `HomePage.jsx:463` (empty "Go!" ~30px), `EchoGamePage.jsx:576` ("Show me the fingering" ~33px), `BasicsSection.jsx:302` ("My Learning" toggle ~30px) | Sub-44px touch heights. | Add vertical padding / `minHeight:44`. |
| M7 | `SongScore.jsx:8,61,150` | `MIN_WIDTH=300` with no `overflow-x:auto` wrapper: if the container is < 300px the VexFlow staff overflows/clips. (A `ResizeObserver` handles normal widths well.) | Wrap render target in `overflow-x:auto`, or guard the min width. |

---

## Low (polish / systemic)

- **Systemic tiny type for a 7–12 audience.** 8–11px labels are pervasive: `SongsPage.jsx:172` FREE/PRO tag (**8px**, smallest in app), BottomNav labels (9), and many 9–11px eyebrows/captions across Home, Practice, Lesson, Trophies, ReadMusic, FingeringLibrary, PaywallCard, BasicsSection. Individually minor; collectively the biggest readability theme. Consider raising the floor to ~11–12px app-wide.
- `EchoGamePage.jsx:85–95,155–165` — game cards are `cursor-pointer` with hover-lift but **no `onClick`** (only the inner CTA is tappable) — false affordance.
- `EchoGamePage.jsx` (hub `49`) & `PracticePage` song-complete / RotatePrompt — full-bleed/`fixed inset-0` without horizontal safe-area insets (centered content = low risk, but pill/heading can slip under the notch in landscape).
- `BadgePopup.jsx:44–54` — `fixed inset:0` overlay without insets (centered card, low risk).
- `FingeringLibraryPage.jsx:142` — comment says "horizontal scroll on mobile" but `flex-wrap` applies at all breakpoints so `overflow-x-auto` never engages (harmless; comment/intent mismatch).
- `FingeringLibraryPage.jsx:288`, `BasicsSection.jsx:343` — hard-coded `maxHeight` (600 / 1200) on collapsibles could clip if content grows on narrow screens.
- `LessonCard.jsx:42–51` — footer reserves only `16px + inset` (vs 96px in NoteReadingSection). Inside the 112px-padded main so likely fine, but **verify on a real device** it doesn't tuck under the fixed nav.

---

## Cross-cutting themes (what to actually prioritise)

1. **Full-bleed screens need horizontal + top safe-area insets** — Practice (H1) is the real bug; EchoGame hub and sticky headers (M5) are the tail.
2. **Touch targets cluster just under the line** — a sweep to enforce 44px (core) / 56px (Foundations) clears H3, M3, M6 at once.
3. **Phone SVG legibility & tappability** — FingeringDiagrams (H4) and StaffInteractive (H2) both shrink text/targets via a scaled viewBox; needs an HTML-label / min-scale strategy.
4. **iPad portrait practice** (M1) — decide intentionally: force-rotate, or support portrait per the CLAUDE.md rule.
5. **Kid-legibility type floor** (Low, systemic) — one theme-level bump beats 30 individual tweaks.
