# Flute Hero — Phase 3: Monetization & Marketing Site (Cursor / Claude Code Prompt)

**Objective:** Add a one-time-purchase paywall and a public marketing website on top of the existing Flute Hero PWA so it can be sold to parents. Free Level 1 is the demo; a valid license unlocks Levels 2–5, full Echo Game sequences, and the full Fingering Library.

**Prerequisites:** Phases 1 & 2 (viewport-fit, responsive Practice page, 44px touch targets, safe-area padding) ideally done first, but not strictly required.

**Reference files:** `STYLE_GUIDE.md`, `.cursorrules`, existing pages under `src/pages/`.

---

## Business decisions (locked — build to these)

- **Price:** $24.99 USD, one-time. No subscription.
- **Payments:** Lemon Squeezy as **merchant of record** — it hosts checkout and handles fees, fraud, disputes, and global sales tax / VAT. License keys enabled.
- **Access model:** Level 1 is fully free and playable (the demo). A valid license unlocks Levels 2–5, full-length Echo Game sequences, and locked Fingering Library notes.
- **No accounts, no database.** One deliberate exception to the "no backend" rule: **a single stateless Vercel serverless function** validates license keys so the API key never reaches the browser. It stores nothing. Everything else stays localStorage-only.
- **Branding:** existing Flute Hero palette — blue `#006EE9`, red `#E53935`, cream `#FFF5E1`. Child-friendly, per `STYLE_GUIDE.md`. Marketing copy speaks to **parents** (the buyer); the app speaks to the **child**.
- **Honesty rules:** do **not** fabricate testimonials, review counts, or star ratings. Legal pages are starting templates, flagged as such — not legal advice.

---

## PART A — Human setup (do this yourself before running the agent)

The agent cannot create your payment account. Complete these first:

1. Create a free **Lemon Squeezy** account and a Store (the "Fresh" plan is free — you only pay on sales).
2. Create a **single-payment product**: name "Flute Hero — Full Access", price **$24.99**, with **Generate License Keys** enabled. Set **activation limit** to `3` (lets a family use a couple of devices) and license length **unlimited / lifetime**.
3. From the dashboard, collect:
   - `LEMONSQUEEZY_API_KEY` (Settings → API)
   - `LEMONSQUEEZY_STORE_ID`
   - `LEMONSQUEEZY_PRODUCT_ID`
   - `LEMONSQUEEZY_VARIANT_ID`
   - Your **hosted checkout URL** (Share → checkout link), or the Checkout Overlay / Buy Button snippet.
4. In **Vercel → Project → Settings → Environment Variables**, add all of the above as **server-side** variables. **Do not** prefix any of them with `VITE_` — that would expose them to the browser. The API key in particular must stay server-only.

---

## PART B — Tasks for the agent

### GROUP 1 — License validation (the one serverless function)

#### Task 1a — Create the license serverless function
**File:** `api/license.js` (Vercel serverless function; runs server-side)

- Accept `POST` with JSON `{ action: 'activate' | 'validate', licenseKey, instanceId? }`.
- `activate` → call `https://api.lemonsqueezy.com/v1/licenses/activate` with the license key and an `instance_name` (e.g. `"flute-hero-web"`).
- `validate` → call `https://api.lemonsqueezy.com/v1/licenses/validate` with the key (and `instance_id` if present).
- Read `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_PRODUCT_ID`, `LEMONSQUEEZY_VARIANT_ID` from `process.env`.
- **Guard against foreign keys:** verify the `store_id` / `product_id` / `variant_id` in Lemon Squeezy's response match the env values. If they don't match, treat as invalid — this stops a license key from a different Lemon Squeezy product unlocking the app.
- Return **only** `{ valid: boolean, instanceId?, error? }`. Never forward the raw Lemon Squeezy response or the API key to the client.
- Stateless — no persistence, no database.

**Acceptance:** POST with a real key → `{ valid: true, instanceId }`. Invalid or foreign key → `{ valid: false }`. Browser never sees the API key (verify in Network tab).

#### Task 1b — Client license context
**File:** `src/context/LicenseContext.jsx` (new)

- Expose `{ isLicensed, activate(key), clearLicense() }` via React context; wrap `<App>` in `<LicenseProvider>`.
- On mount, read `fluteHeroLicense` from localStorage (shape: `{ key, instanceId, activatedAt }`). If present, set `isLicensed = true`.
- `activate(key)` → `POST /api/license` (action `activate`). On success, persist the license object to localStorage and set `isLicensed = true`. On failure, surface a short friendly error ("That key didn't work — check for typos or paste it again").
- Optional hardening: on app load, if a license exists, fire a background `validate`; if it returns invalid (e.g. the buyer was refunded), call `clearLicense()`.

**Acceptance:** Activating a valid key persists across reloads; `clearLicense()` re-locks the app.

#### Task 1c — Unlock page
**File:** `src/pages/UnlockPage.jsx` (new), route `/unlock`

- **Not purchased yet** state: headline "Unlock all 5 levels — $24.99, one-time", short benefit list, primary button → Lemon Squeezy checkout (hosted link or overlay), and a link "Already bought? Enter your key".
- **Enter key** state: license key text input + "Activate" button calling `activate()`; show inline success/error.
- On success → redirect to `/` (app home) with a brief celebratory confirmation.
- Brand palette, mobile-first, 44px touch targets.

**Acceptance:** Checkout button opens Lemon Squeezy; key entry activates and redirects; feedback is clear on both success and failure.

---

### GROUP 2 — Demo vs full gating

#### Task 2a — Gate Levels 2–5, Echo, and Fingering Library
- In the level/progression logic: if `!isLicensed`, Level 1 is fully accessible; Levels 2–5 render a **lock overlay** with "Unlock full app" → `/unlock`.
- Echo Game: unlicensed users get the Level-1-length sequences only; longer sequences show the unlock CTA.
- Fingering Library: unlicensed users see Level 1 notes; locked notes show a lock badge + unlock CTA.
- **Level 1 must never be blocked** — the whole conversion strategy is the child succeeding at Level 1 for free, then the parent buying.

**Acceptance:** Unlicensed user can fully complete Level 1; Levels 2–5 / long Echo / locked notes show lock + CTA; licensed user has everything.

---

### GROUP 3 — Marketing landing page

#### Task 3a — Public landing at `/`
**File:** `src/pages/LandingPage.jsx` (new)

**Routing:** unlicensed first-time visitors land here at `/`. "Start free" enters the app (Level 1). Licensed users bypass the landing and go straight to the app home (or the landing shows an "Open app" button).

**Sections** (single vertical scroll, mobile-first, brand palette):

1. **Hero** — benefit-led, parent-facing headline; one-line subhead; primary CTA "Try Level 1 free — no card needed"; secondary "See how it works". Screenshot/mockup of the live tuning meter or an animated fingering diagram.
2. **The promise** — practising between lessons is hard; Flute Hero gives real-time pitch feedback so she knows when she's in tune, on her own.
3. **How it works** — three steps: play into the mic → see live pitch feedback → master notes and earn badges.
4. **Features** — real-time pitch detection, animated fingering diagrams, a 5-level curriculum, classical & folk songs, the Echo rhythm game, badges and streaks.
5. **Why parents trust it** — **private by design: the microphone is processed only on the device, no audio ever leaves it, no account, no data collection.** One-time price, no subscription. Runs in any tablet or phone browser, works offline after first load.
6. **What she'll learn** — the 5-level table: First Breath → Finding My Voice → Middle Path → Reaching Higher → Taking Flight.
7. **Founder story** — short and honest: built by a parent for their own 9-year-old beginner. Use this plus the curriculum as social proof. **No invented reviews or ratings.**
8. **Pricing** — single card: **$24.99 one-time**, "Free Level 1, no card required", what's included, CTA → `/unlock`.
9. **FAQ** — which flute (beginner plastic C concert flute), device/browser needs, mic & privacy, refunds, no subscription, offline use.
10. **Footer** — links to Privacy / Terms / Refund, a contact email placeholder, copyright.

Tone: warm, plain, benefit-led. No hype, no fake urgency or countdowns.

**Acceptance:** Landing is responsive, every CTA routes correctly, contains no fabricated social proof.

---

### GROUP 4 — Legal pages

#### Tasks 4a–4c — `/privacy`, `/terms`, `/refund` (new pages)
- **Privacy:** no accounts, no server storage; microphone processed locally; no audio or personal data transmitted; progress stored only in the browser's localStorage. Note that Lemon Squeezy handles all payment data as merchant of record (link their policy). Note that purchases are made by an adult/parent.
- **Terms:** one-time, personal-use, non-transferable license; provided "as is"; no warranty.
- **Refund:** e.g. 14-day money-back guarantee; refunds processed through Lemon Squeezy.
- Each page shows a visible line: *"This is a starting template — review and adapt it for your jurisdiction. It isn't legal advice."*

---

### GROUP 5 — Meta, deploy, polish

- Update `index.html`: page `<title>`, meta description, and Open Graph tags (title / description / image) so shared links preview well. Add a simple OG image and favicon if missing.
- Load the Lemon Squeezy overlay script (if used) only on `/unlock` and the pricing CTA — not globally.
- Confirm all env vars are set in Vercel, the function reads them, and nothing sensitive is `VITE_`-exposed (check the built client bundle).
- Keep mobile-first + 44px touch targets throughout, consistent with `STYLE_GUIDE.md` and the Phase 1/2 audit.

---

## Validation checklist

- [ ] `api/license.js` validates real keys, rejects foreign/invalid keys, never leaks the API key
- [ ] License persists in localStorage and survives reload; `clearLicense()` re-locks
- [ ] `/unlock` shows both "buy" and "enter key" states and activates correctly
- [ ] Level 1 fully playable with no license
- [ ] Levels 2–5, long Echo sequences, and locked notes show lock + unlock CTA
- [ ] Landing page renders responsively; all CTAs route; no fabricated reviews
- [ ] Privacy / Terms / Refund pages exist, linked from the footer, flagged as templates
- [ ] OG/meta tags present; overlay script scoped, not global
- [ ] No `VITE_`-prefixed secrets in the client bundle
- [ ] No console errors; all new code follows `STYLE_GUIDE.md`

---

## Commit message

```
feat: Phase 3 — monetization (one-time license) + marketing site

Payments & licensing:
- Add Lemon Squeezy one-time purchase ($24.99), license-key unlock
- Add stateless api/license serverless function (validate/activate)
- Verify store/product/variant IDs to reject foreign keys
- LicenseContext + localStorage persistence; no accounts, no DB

Gating:
- Free Level 1 demo; gate Levels 2-5, long Echo sequences, locked notes
- UnlockPage with buy + key-entry states

Marketing & legal:
- Public LandingPage (hero, features, privacy USP, pricing, FAQ)
- Privacy / Terms / Refund template pages
- OG/meta tags for link sharing

All client-side except one stateless license function. localStorage only.
```

---

## Notes for the agent

- The **only** server code is `api/license.js` — stateless, no database, no accounts. Do not add persistence or auth.
- **Never** expose `LEMONSQUEEZY_API_KEY` to the client; it must stay server-side (no `VITE_` prefix). The browser only ever calls same-origin `/api/license`.
- **Level 1 must always be fully playable** without a license — it's the demo that drives conversion.
- **Do not invent** testimonials, review counts, or star ratings. Use the founder story and the real curriculum as social proof.
- Legal pages are templates and must be labelled as such — not legal advice.
- Follow the `STYLE_GUIDE.md` palette (`#006EE9`, `#E53935`, `#FFF5E1`) and the 44px touch-target rule everywhere.
- Any client-side unlock is technically bypassable; that's an accepted trade-off for a low-priced product versus building full accounts.