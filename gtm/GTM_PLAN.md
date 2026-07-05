# Flute Hero — Go-To-Market Plan

**Owner:** `NEEDS_REAL_PERSON` (Founder / GTM lead)
**Status:** Draft for execution. Executable on day one once the `NEEDS_REAL_*` placeholders are filled.
**Last updated:** 2026-07-05

---

## 0. How to read this document

Every number in this plan that describes *expected* real-world behaviour (conversion
rates, retention rates, cost per install, willingness to pay) is a **hypothesis to be
measured**, not a fact. Those are tagged `NEEDS_REAL_DATA`. Every claim that would need a
real human, quote, or credential to stand behind it is tagged `NEEDS_REAL_PERSON`.

The only figures stated as fact are **product facts** — things that are true because we
built them that way:

- **Price:** one-time **$24.99 USD**. No subscription. No auto-renew.
- **Trial:** **10-day** full-access free trial, starts silently on first open.
- **Free forever:** Level 1 (First Breath) is always free, no card, no account.
- **Curriculum:** 8 levels, **First Breath → Finding My Voice → Middle Path →
  Reaching Higher → Taking Flight → Sharps & Flats → Filling the Gaps → Sky High.**
- **Privacy:** microphone audio is processed **on the device only**. No audio ever
  leaves the device. No account. No data collection. Progress lives in the browser's
  localStorage. (One stateless serverless function validates a license key at purchase;
  it stores nothing.)
- **Payments:** handled by **Lemon Squeezy** as merchant of record (they handle
  checkout, fraud, disputes, and global sales tax / VAT). A license key unlocks the app;
  activation limit of 3 lets a family use a couple of devices.

If anything below ever contradicts these product facts, the product facts win and this
document is wrong and must be corrected.

---

## 1. Positioning

### 1.1 One-liner

> **Flute Hero is the flute tutor that listens.** Your child plays into any tablet or
> phone, and Piper — their flute guide — hears every note and shows them when they're in
> tune, all on the device, with no account and a one-time price.

### 1.2 The two promises

Flute Hero speaks to two people at once. The kid uses it; the parent pays for it. Each
sees a different promise, and the two must never blur.

**Kid promise (what the child feels):**
"I blow into it and it *hears* me. Piper cheers when I get it right. I found a whole sky
of lost songs and I'm the one bringing them back." — playful, no prices, no pressure,
forgiving feedback (green glow / warm yellow, never a red X).

**Parent promise (what the buyer decides on):**
"My child can practise flute *between lessons* and actually know whether she's playing in
tune, without me hovering. It's private — the microphone never leaves the device. It's
one payment, not another subscription. And Level 1 is free, so I can watch her succeed
before I spend a cent." — calm, teacher-voiced, transparent, evidence over hype.

### 1.3 Versus the alternatives

| Alternative | What it gives | Where Flute Hero wins |
|---|---|---|
| **Private flute lessons** | Expert human feedback, ~30–45 min/week | Flute Hero fills the *other 6 days* — daily between-lesson practice with real-time pitch feedback, at a one-time price roughly equal to `NEEDS_REAL_DATA` (one lesson or less). It complements a teacher, it doesn't replace one. |
| **YouTube tutorials** | Free, huge library | Passive video can't *hear* the child. No feedback, no idea if she's in tune, no progression, ad-interrupted, comment sections. Flute Hero is interactive, gated, ad-free, and safe. |
| **Simply Piano / Yousician (generalists)** | Polished, multi-instrument, well-known | They are **subscriptions** built primarily around **keys/strings**; flute is a thin add-on or absent. Flute Hero is **flute-first** (fingering diagrams, embouchure/tonguing foundations, breath cues), **kid-native** (Piper, the Songkeeper's Sky world, age-7 reading level), **one-time price** (no recurring bill), and **on-device private** (no audio leaves the device). |

**The four things only Flute Hero can say together:**
1. **Flute-specific** — not a generalist with a flute mode bolted on.
2. **Kid-native** — designed for 7–12s, not a scaled-down adult app.
3. **One-time $24.99** — not a subscription the parent has to remember to cancel.
4. **On-device privacy** — the microphone genuinely never phones home.

No competitor can claim all four. That intersection is the position.

---

## 2. Ideal Customer Profile (ICP)

### 2.1 Primary — Parents of 7–12s starting a school band / orchestra program

- Child has just been assigned, or is about to choose, **flute** in a school band or
  orchestra program (this is the single biggest source of new beginner flute players).
- Parent is not a musician themselves and can't tell if the child is playing correctly.
- Practice-at-home is a friction point: nagging, boredom, "am I even doing this right?"
- Cost-sensitive to *recurring* commitments; a modest **one-time** cost reads as fair.
- Privacy-aware: cautious about apps that record their child or need an account.

**Why they convert:** they watch the child succeed at free Level 1, they open the
math-gated parent zone, they hear the child's own recording, and $24.99-once is an easy
yes compared to another monthly bill or another lesson.

### 2.2 Secondary — Homeschool music families

- Music is part of a structured home curriculum; parent is the "teacher."
- Value a self-guided, progressive, screen-time-you-feel-good-about tool.
- The 8-level curriculum + Foundations module (note reading, embouchure, tonguing) maps
  onto a homeschool scope-and-sequence.

### 2.3 Channel audience — Flute teachers (as a distribution channel, not the payer)

- Private and school flute teachers who want their students practising well between
  lessons and who are asked by parents "what app should we use?"
- They are not the buyer — they are the **trusted recommender**. Winning a teacher can
  win their whole studio / band cohort. This is why teachers appear in both the ICP and
  the channel plan.

---

## 3. Channels (prioritised)

Ranked by expected efficiency for this product and audience. All efficiency figures are
`NEEDS_REAL_DATA` until measured.

### Channel 1 — School music-teacher partnerships & band-season timing *(highest priority)*

**Why first:** School band/orchestra enrolment is where beginner flute players are
*created*, in a concentrated seasonal wave, funnelled through a single trusted adult (the
band/music teacher) who is already telling parents "your child needs to practise at
home." That is the warmest, most concentrated demand in the entire market.

**Seasonality is the lever.** Flute uptake spikes at the **start of the school year**:
- **US:** **August / September** (new band season).
- **Australia:** **January / February** (Southern-Hemisphere school year start).
Everything else in the calendar bends around hitting these windows with teachers already
onboarded.

**Motion:**
- Offer teachers **free classroom access** (see §5 pricing experiments — teacher/classroom
  pack) so they can recommend it with zero cost or risk to families.
- Give teachers a one-page overview and a "recommend to your class" link/flyer
  (produced under `gtm/assets/` per the master plan D2).
- Lead with the two things teachers care about: **between-lesson practice with real pitch
  feedback**, and **it's private + one-time**, so they're not pushing families onto a
  subscription.

**Risk / honesty note:** we have **no** teacher endorsements yet. Do not imply we do.
Named endorsers are `NEEDS_REAL_PERSON` and must be earned through the teacher beta (§4).

### Channel 2 — Parent-focused paid social (Meta) with kid-progress video creative

**Why second:** Parents of this age group are reachable on Facebook/Instagram, and the
single most persuasive asset we have is **video of a real kid going from noise to a
recognisable song** — which the product naturally produces via the "Play for a grown-up"
recording. Creative here doubles as organic content.

**Motion:**
- Targeting: parents of 7–12s, interests around school band, kids' music, homeschool.
- Creative hooks (full kit in `gtm/assets/`): "first song in 5 minutes," the proud-parent
  recording moment, band-program readiness, screen-time-you-feel-good-about, and a
  private-lessons cost comparison.
- Landing on the parent-facing landing page → **free Level 1** (no card). The trial and
  free level *are* the offer; paid social buys the top of the funnel only.
- All kid footage requires real consent (`NEEDS_REAL_PERSON` + signed release) before any
  spend. No stock "fake testimonial" framing.

### Channel 3 — SEO

**Why third:** High intent, compounding, and cheap over time — but slow to mature, so it
underpins the plan rather than launching it.

**Target clusters:**
- Beginner intent: "learn flute for kids," "how to teach a child flute," "beginner flute
  app."
- Repertoire intent: "beginner flute songs," "easy flute songs for kids," "Hot Cross Buns
  flute," and the curriculum's real song list.
- Band-program adjacent: "school band flute practice," "flute fingering chart for
  beginners," "concert flute vs beginner flute."
- Privacy intent: "flute app no subscription," "flute practice app private / offline."

**Content backed by real product truths:** the 8-level curriculum, the fingering library,
and the on-device privacy story are all genuine and make honest, rankable content — no
fabrication required.

### Channel 4 — Flute-teacher affiliate / referral

**Why fourth:** Turns Channel 1's goodwill into a repeatable loop, but only works *after*
we have teachers who like the product (post-beta). Sequenced after the beta relationships
exist.

**Motion:**
- A simple referral: teachers share a link; families who buy through it credit the
  teacher (mechanism `NEEDS_REAL_DATA` — Lemon Squeezy affiliate support to be confirmed).
- Pair with the in-app **"Play for a grown-up" share → referral page** loop
  (defined in `gtm/workflows/`): a kid's clip lands a friend/relative on a page with the
  clip + a free-Level-1 CTA.

### Channel 5 — App Store Optimisation (ASO)

**Why fifth for now:** Flute Hero ships first as a **PWA on the web** (Vercel), so classic
app-store install isn't the day-one primary. ASO becomes material only when/if the
Capacitor App Store pathway is pursued (a *future* session — not part of this launch).
Listed here so the metadata (title, subtitle, keywords, screenshots) is written once, in
`gtm/assets/`, ready to deploy when that path opens.

---

## 4. Launch sequence

Three stages, each with an exit condition. Do not advance until the exit condition is met.

### Stage 1 — Soft launch *(private / friends-and-family)*
- **Goal:** prove the funnel works end-to-end, on real devices, before spending on
  acquisition.
- Ship the PWA to production behind a quiet URL. No paid spend. No press.
- Recruit a handful of real families (`NEEDS_REAL_PERSON`) to run the full journey:
  first open → first song → the 10-day trial → math-gated parent zone → $24.99 unlock.
- Instrument every step (events named in Workstream B). Watch for the biggest leak (§6).
- **Exit when:** a child can go first-open → first song in under 5 minutes, and a parent
  can go parent-zone → purchased in under 2 minutes, with no blocking friction.

### Stage 2 — Teacher beta *(20–50 teachers, free classroom access)*
- **Goal:** validate the product with the people who create beginner flute players, and
  *earn* the endorsements and testimonials we are forbidden from inventing.
- Recruit **20–50** flute / band teachers (`NEEDS_REAL_PERSON`). Give each **free
  classroom access** for their students.
- Collect: does it help between-lesson practice? Would you recommend it? Real quotes and,
  with consent, real kid-progress clips. Everything gathered here is what later fills the
  `NEEDS_REAL_DATA` / `NEEDS_REAL_PERSON` slots on the landing page and in ads.
- **Exit when:** we have `NEEDS_REAL_DATA` (target: a meaningful share) of beta teachers
  saying they'd recommend it, and at least a few consented testimonials / clips in hand.

### Stage 3 — Public launch *(timed to a band-program season)*
- **Goal:** hit the seasonal demand wave with a proven funnel and real social proof.
- **Time it to a band season:** US **Aug/Sep** or AU **Jan/Feb** — whichever comes first
  after Stage 2 completes. Do not launch cold into an off-season month.
- Turn on paid social (Channel 2), publish the SEO content (Channel 3), open the teacher
  referral loop (Channel 4), and activate teacher partners (Channel 1) to recommend at the
  exact moment they're assigning instruments.
- Press/launch blurb goes out (asset in `gtm/assets/`).

---

## 5. Pricing hypotheses to test

The model is fixed as **one-time, no subscription**. What we test is the *shape* of that
one-time model. These are **experiments**, not claims — each needs real data to resolve.
All are `NEEDS_REAL_DATA` until run.

> Note: any live A/B on price must respect the "no dark patterns / trust is the strategy"
> rule — no showing different people different prices in a way that feels deceptive; test
> across cohorts/time windows, and honour the lower price if ever shown.

| # | Hypothesis | What we vary | What we measure | Decision it drives |
|---|---|---|---|---|
| H1 | **Price point.** $24.99 may not be the revenue-maximising one-time price. | $19.99 vs **$24.99** vs $29.99 | Trial→paid conversion × price = revenue per trial; refund rate | The single anchor price |
| H2 | **Trial length.** 10 days is the current default; shorter may force the decision, longer may build more habit. | 7 vs **10** vs 14 days | Trial-finish rate, D7 retention, trial→paid | The trial duration |
| H3 | **Family / multi-child bundle.** A household with two beginners may pay more once for shared access. | Add an optional one-time "family" unlock (e.g. covers more devices / siblings) above the base price | Attach rate, incremental revenue per buyer | Whether to offer a bundle tier at all |
| H4 | **Teacher / classroom pack.** A one-time (or sponsored) pack lets a teacher unlock a cohort. | Offer a classroom pack at `NEEDS_REAL_DATA` price/terms | Teacher adoption, downstream family purchases, referral volume | Whether the classroom pack is a product or just a beta perk |

**Not to be tested (settled product facts):** whether it's a subscription (**no**),
whether there's auto-renew (**no**), whether Level 1 is free (**always yes**), whether
audio leaves the device (**never**).

---

## 6. Metrics tree

Funnel stages from acquisition to revenue. **Every target below is a hypothesis
(`NEEDS_REAL_DATA`)** — a planning placeholder to be replaced by measured baselines from
the soft launch and beta. They are *not* industry benchmarks and must not be presented as
measured results.

```
                    ┌─────────────────────────────────────────────┐
   Acquisition  →   │  INSTALL / FIRST OPEN                        │  target: NEEDS_REAL_DATA
                    └───────────────────┬─────────────────────────┘
                                        │  (leak: bounce before trying)
                    ┌───────────────────▼─────────────────────────┐
   Activation   →   │  ONBOARDING COMPLETE (first song done)       │  target: NEEDS_REAL_DATA
                    │  product fact: designed for <5 min, no signup │
                    └───────────────────┬─────────────────────────┘
                                        │  (leak: no flute yet / mic setup / drop mid-onboarding)
                    ┌───────────────────▼─────────────────────────┐
   Retention    →   │  D7 RETENTION (came back day 7 of trial)     │  target: NEEDS_REAL_DATA
                    └───────────────────┬─────────────────────────┘
                                        │  (leak: habit not formed → likely BIGGEST leak, see below)
                    ┌───────────────────▼─────────────────────────┐
   Trial end    →   │  TRIAL FINISH (reached day 10 engaged)       │  target: NEEDS_REAL_DATA
                    └───────────────────┬─────────────────────────┘
                                        │  (leak: kid engaged but parent never sees value)
                    ┌───────────────────▼─────────────────────────┐
   Handoff      →   │  PARENT-ZONE VISIT (grown-up opens math gate) │  target: NEEDS_REAL_DATA
                    │  ← the critical kid→parent handoff moment     │
                    └───────────────────┬─────────────────────────┘
                                        │  (leak: parent unconvinced at pricing)
                    ┌───────────────────▼─────────────────────────┐
   Revenue      →   │  PAID ($24.99 one-time unlock)               │  target: NEEDS_REAL_DATA
                    └─────────────────────────────────────────────┘
```

**Where the biggest leak most likely sits (hypothesis, to be confirmed):**

Two candidate leaks dominate, and both should be watched from day one:

1. **D7 retention (habit formation).** Kids' apps live or die on the practice habit
   surviving the first week. If the child doesn't come back, there is no engaged day-10
   trial and no parent handoff. This is the **most likely single biggest leak** and the
   one the in-app trial choreography (day-4 nudge, day-8 heads-up) is explicitly designed
   to defend.
2. **The kid→parent handoff (trial finish → parent-zone visit).** Even a fully engaged
   child produces zero revenue if the grown-up never opens the math-gated parent zone and
   hears the recording. The day-10 "grown-up handoff" and the "Play for a grown-up" share
   exist to force this moment.

**Instrumentation:** all stages map to events already named in Workstream B (onboarding
step viewed/completed/dropped, time-to-first-sound, time-to-first-song, D1/D3/D7 return,
trial→paid). GTM depends on those events firing and being named consistently — do not
rename them here.

---

## 7. 90-day calendar

Owner slots are placeholders (`NEEDS_REAL_PERSON`) to be assigned. Weeks are relative to
kickoff (Week 1). The public-launch window (Weeks 11–13) **must land on a band season** —
if the calendar's Week 11 doesn't fall in US Aug/Sep or AU Jan/Feb, shift the whole plan
so it does; hitting the season matters more than hitting a specific calendar week.

| Weeks | Phase | Key activities | Owner (placeholder) | Depends on |
|---|---|---|---|---|
| **1–2** | Foundation | Finalise product (all 6 QA gates passed); instrument & verify analytics events; write landing page + legal templates; stand up Lemon Squeezy product ($24.99, license keys, activation limit 3). | `NEEDS_REAL_PERSON` (Product/Eng) | Product build complete; Lemon Squeezy account (human setup) |
| **2–3** | Soft launch (Stage 1) | Quiet production deploy; recruit friends-and-family testers; run full journey; capture funnel baselines; fix blocking friction. | `NEEDS_REAL_PERSON` (Founder) | Analytics live; landing page up |
| **3–4** | Asset production | Produce `gtm/assets/`: ad kit, ASO metadata, teacher one-pager, organic scripts, press blurb. Build `gtm/workflows/` lifecycle + referral definitions. | `NEEDS_REAL_PERSON` (Marketing) → Sonnet for volume | Positioning (this doc) locked; real screenshots from soft launch |
| **4–5** | Teacher recruitment | Identify and cold-outreach 20–50 flute/band teachers (3-touch sequence); grant free classroom access. | `NEEDS_REAL_PERSON` (Partnerships) | Teacher kit ready; classroom-access mechanism live |
| **5–9** | Teacher beta (Stage 2) | Teachers run it with students; weekly check-ins; collect consented testimonials + kid-progress clips; measure "would recommend." | `NEEDS_REAL_PERSON` (Partnerships) | Teachers onboarded; consent/release process ready |
| **7–9** | SEO groundwork | Publish curriculum/repertoire/privacy content clusters; technical SEO on landing page. | `NEEDS_REAL_PERSON` (Marketing) | Landing page live; content briefs from §3 |
| **9–10** | Launch readiness | Fold real testimonials/clips into landing + ads (replace `NEEDS_REAL_*`); set up Meta ad account & pixel; finalise pricing-experiment plan (H1–H4); pre-flight QA Gate 6. | `NEEDS_REAL_PERSON` (Marketing + Founder) | Beta results in; ad account approved |
| **11–13** | Public launch (Stage 3) — **band season** | Turn on paid social; publish/boost SEO; open teacher referral loop; activate teacher partners at instrument-assignment moment; send press blurb; run price/trial experiments. | `NEEDS_REAL_PERSON` (Founder + Marketing) | All above; **must be timed to US Aug/Sep or AU Jan/Feb** |

**Hard dependencies (the critical path):**
`Product + analytics` → `soft launch baselines` → `teacher beta (earns real proof)` →
`real proof replaces NEEDS_REAL_* on landing/ads` → `public launch timed to band season`.
No public launch without real proof; no real proof without the beta; no meaningful beta
without a working, instrumented funnel from soft launch.

---

## 8. Honesty ledger (Gate 3 compliance)

Everything asserted in this plan is either a **product fact** (true by construction) or a
**flagged placeholder** to be filled with measured/real inputs. No testimonials, review
counts, star ratings, benchmark rates, or named endorsers are invented anywhere in this
document.

**Stated as fact (product truths, verifiable in the codebase/config):**
- One-time $24.99, no subscription, no auto-renew.
- 10-day full-access trial; Level 1 free forever.
- 8-level curriculum, First Breath → Sky High.
- On-device mic processing; no audio leaves the device; no account; localStorage only.
- Lemon Squeezy as merchant of record; stateless license validation stores nothing.

**Flagged as needing real inputs before use externally:**
- Every funnel target in §6 — `NEEDS_REAL_DATA`.
- All channel efficiency / cost figures in §3 — `NEEDS_REAL_DATA`.
- Pricing-experiment outcomes (H1–H4) in §5 — `NEEDS_REAL_DATA`.
- Teacher endorsements, testimonials, kid-progress clips — `NEEDS_REAL_PERSON` (+ consent).
- Owner names throughout §7 — `NEEDS_REAL_PERSON`.
- Private-lesson cost comparison and referral mechanism specifics — `NEEDS_REAL_DATA`.

The **honest social proof we already own** and may use immediately: the real 8-level
curriculum, the working real-time pitch feedback, and the genuine on-device privacy
story. These require no fabrication and carry the parent-trust message on their own until
real testimonials arrive from the beta.
