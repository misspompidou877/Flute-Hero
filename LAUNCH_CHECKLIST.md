# Flute Hero — Launch Checklist

Everything the orchestrated build could NOT finish itself (needs a human, real data, real
hardware, or an explicit unlock). Grouped by area, each with an owner slot. Generated at
the end of the master-orchestration build; pair with `BUILD_LOG.md` for what WAS done.

Legend: ☐ = to do · `NEEDS_REAL_*` = placeholder in code/docs awaiting real content.

---

## 1. Payments & licensing (blocks real revenue)
The app currently uses a **client-side placeholder unlock** (`unlockPremium()` flips
`progress.isPremium`). No real money is taken yet.

- ☐ Create the **Lemon Squeezy** account + Store + single-payment product "Flute Hero — Full
  Access", price **$24.99**, license keys enabled, activation limit 3, lifetime. *(Owner: ____)*
- ☐ Collect `LEMONSQUEEZY_API_KEY`, `STORE_ID`, `PRODUCT_ID`, `VARIANT_ID` + hosted checkout URL;
  add as **server-side** Vercel env vars (NO `VITE_` prefix). *(Owner: ____)*
- ☐ Build `api/license.js` (stateless serverless validate/activate; verify store/product/variant
  ids to reject foreign keys) + a client `LicenseContext`; replace the `// TODO: real Lemon
  Squeezy checkout` placeholder in `src/pages/UnlockPage.jsx`. *(Owner: ____)*
- ☐ Decide: keep the accepted "client-side unlock is bypassable" trade-off, or add the license
  function above. *(Owner: ____)*

## 2. Deferred features (built around, not built)
- ☐ **"Play for a grown-up" recording capture** — MediaRecorder in Practice writing a data URL to
  localStorage `recording.latest`. Deliberately NOT built to avoid destabilising the working mic
  pipeline mid-overhaul. The Parent Zone already reads/plays `recording.latest` and handles its
  absence. This is the **top conversion asset** — prioritise. *(Owner: ____)*
- ☐ **Referral page** — landing target for a shared kid clip + free-trial CTA (see
  `gtm/workflows/churn-save-and-referral.md`). *(Owner: ____)*
- ☐ **Public marketing landing route** — copy + structure exist at `gtm/assets/landing-page.md`;
  build as an actual route (mind the first-run onboarding gate — likely a separate `/welcome` or
  pre-app entry). *(Owner: ____)*
- ☐ **Legal pages** `/privacy`, `/terms`, `/refund` — not built. Templates described in the
  monetisation brief; each must carry the "starting template — not legal advice" line. *(Owner: ____)*

## 3. Real content / data (Gate 3 — do NOT fabricate)
- ☐ `NEEDS_REAL_PERSON`: founder story, teacher endorsements/testimonials + consent, the Parent
  Zone curriculum-credibility educator, contact/sender emails. *(Owner: ____)*
- ☐ `NEEDS_REAL_DATA`: private-lesson cost comparisons, funnel targets/benchmarks, refund window,
  launch URL, app-store screenshots, OG share image. *(Owner: ____)*
- ☐ Collect real testimonials/clips from the teacher beta BEFORE using any social proof in ads or
  the landing page. *(Owner: ____)*

## 4. Meta / share / PWA polish
- ☐ `index.html` still `<title>Flute Hero</title>` with NO meta description or Open Graph tags —
  add title/description/OG (title/description/image) + a real OG image + favicon. *(Owner: ____)*
- ☐ Lemon Squeezy overlay script (if used) loaded only on `/unlock` / pricing CTA, not globally. *(Owner: ____)*

## 5. Palette / design follow-ups (optional polish)
Core overhaul is done (whole app is teal). Remaining, by explicit exception:
- ☐ **Locked** `FingeringDiagrams.jsx` / `FluteDiagram.jsx` still use v1 blue/cream/slate. CLAUDE.md
  + redesign-prompt forbid touching them — migrating needs an **explicit unlock decision**. *(Owner: ____)*
- ☐ `src/index.css` `@theme` defines off-STYLE_GUIDE `coral-*` (reds) + `sunset-*` (ambers) families
  used for error/warm accents. Reconcile to Mango/Sunshine if strict single-palette is wanted. *(Owner: ____)*
- ☐ Minor: global `:root { color: #2D2D2D }` → Deep Teal `#0B3D3A`. Anatomical mouth/tongue pinks +
  flute-wood browns are intentional realism (leave). *(Owner: ____)*
- ☐ Final **Piper illustration** + coherent **sky-map landmark icon set** — component APIs +
  placeholder SVGs are in place so final art drops in without refactor. *(Owner: illustrator ____)*

## 6. On-device manual QA (Gate 6 — needs real hardware + microphone)
Cannot be automated headlessly (mic-based). Walk as BOTH a 9-year-old and a sceptical parent:
- ☐ First open → first flute **sound** within ~90s; first song within ~5 min; no signup/paywall
  before first success. Mic-permission prompt is friendly. *(Owner: ____)*
- ☐ Trial choreography: verify day-4 "show a grown-up", day-8 sleepy heads-up, day-10 dance +
  handoff chip → `/parent` (temporarily set `trial.startedAt` back-dated to test). *(Owner: ____)*
- ☐ Gating: fresh install has full access (trial); after day 10, Level 1 free + Levels 2–8 show the
  price-free kid lock → math gate → parent zone → $24.99 → unlock. *(Owner: ____)*
- ☐ Practice on iPhone portrait shows rotate prompt; iPad portrait shows full UI; two-line staff +
  tuning meter + fingering render; no console errors. *(Owner: ____)*
- ☐ Safe-area insets on notch/Dynamic Island/home bar; 44px (56px Foundations) targets. *(Owner: ____)*

## 7. Analytics & housekeeping
- ☐ `src/utils/analytics.js` logs events to localStorage only (no backend). Wire to a real sink if
  you want funnel data off-device. *(Owner: ____)*
- ☐ `CLAUDE.md` still says the app name is "Trill"; `STYLE_GUIDE.md` (v2.0) and this build use
  "Flute Hero". Update `CLAUDE.md` to match the decided name. *(Owner: ____)*
- ☐ Move `src/Monetisation and marketing site.md` out of `src/` (it's a brief, not app code). *(Owner: ____)*
- ☐ Commit the feature branch + open PR when ready (not done automatically). *(Owner: ____)*
