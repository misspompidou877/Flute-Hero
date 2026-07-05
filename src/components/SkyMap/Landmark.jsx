/*
 * SkyMap landmark icon set — "Songkeeper's Sky" (redesign brief §2).
 * One coherent, minimal SVG set that replaces the old mixed emoji on the Songs page.
 * Palette law (STYLE_GUIDE v2.0 TEAL): Deep Teal #0B3D3A line, Teal #26CCC2 /
 * Mint #6AECE1 / Sunshine #FFF57E / Mango #FFB76C accents. No off-palette colours.
 * Purely presentational — no logic, no state.
 */

const LINE = '#0B3D3A'      // Deep Teal — all outlines
const TEAL = '#26CCC2'
const MINT = '#6AECE1'
const SUN = '#FFF57E'
const MANGO = '#FFB76C'

// Level → landmark name, kept in one place so the page and icon agree.
export const LANDMARK_NAMES = {
  1: 'Cloudbank',
  2: 'Breeze Meadow',
  3: 'Windmill Ridge',
  4: 'High Cliffs',
  5: 'Open Sky',
  6: 'Starfields',
  7: 'Moon Arc',
  8: 'Summit / Aurora',
}

// ── The eight landmark glyphs (viewBox 0 0 48 48) ───────────────────────────
const GLYPHS = {
  // 1 · Cloudbank — a soft cloud with a peeking sun
  1: (
    <>
      <circle cx="30" cy="18" r="8" fill={SUN} stroke={LINE} strokeWidth="2" />
      <path
        d="M13 36 a8 8 0 0 1 0.5 -15.9 a10 10 0 0 1 19 -1 a7.5 7.5 0 0 1 2 16.9 z"
        fill={MINT}
        stroke={LINE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </>
  ),
  // 2 · Breeze Meadow — a green hill with drifting breeze lines
  2: (
    <>
      <path d="M4 38 q20 -16 40 0 v6 h-40 z" fill={TEAL} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 18 q8 -4 16 0" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <path d="M14 26 q8 -4 16 0" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M24 38 v-6 M31 38 v-5" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  // 3 · Windmill Ridge — a windmill on a ridge
  3: (
    <>
      <path d="M18 44 L24 16 L30 44 z" fill={MINT} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="16" r="2.5" fill={LINE} />
      <path d="M24 16 L10 9 M24 16 L38 9 M24 16 L17 32 M24 16 L31 32" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <path d="M24 16 L10 9 L15 6 z M24 16 L38 9 L33 22 z" fill={SUN} stroke={LINE} strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  // 4 · High Cliffs — stacked cliff blocks
  4: (
    <>
      <path d="M6 44 L6 26 L20 26 L20 44 z" fill={TEAL} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 44 L20 16 L34 16 L34 44 z" fill={MINT} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M34 44 L34 30 L44 30 L44 44 z" fill={TEAL} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="27" cy="10" r="3.5" fill={SUN} stroke={LINE} strokeWidth="1.6" />
    </>
  ),
  // 5 · Open Sky — sun and a gliding bird
  5: (
    <>
      <circle cx="18" cy="20" r="8" fill={SUN} stroke={LINE} strokeWidth="2" />
      <path d="M18 6 v-3 M18 37 v3 M4 20 h-3 M35 20 h3 M8 10 l-2 -2 M28 10 l2 -2" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <path d="M26 34 q5 -6 10 0 q5 -6 10 0" fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  // 6 · Starfields — a scatter of stars
  6: (
    <>
      {[
        [24, 12, 7],
        [12, 30, 5],
        [36, 32, 5],
      ].map(([cx, cy, r], i) => (
        <path
          key={i}
          d={`M${cx} ${cy - r} L${cx + r * 0.3} ${cy - r * 0.3} L${cx + r} ${cy} L${cx + r * 0.3} ${cy + r * 0.3} L${cx} ${cy + r} L${cx - r * 0.3} ${cy + r * 0.3} L${cx - r} ${cy} L${cx - r * 0.3} ${cy - r * 0.3} z`}
          fill={SUN}
          stroke={LINE}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ))}
    </>
  ),
  // 7 · Moon Arc — a crescent moon riding an arc of dots
  7: (
    <>
      <path d="M6 40 q18 -22 36 0" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" opacity="0.7" />
      <path d="M30 12 a12 12 0 1 0 0 22 a9 9 0 1 1 0 -22 z" fill={SUN} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  // 8 · Summit / Aurora — a peak under an aurora, crowned with a star
  8: (
    <>
      <path d="M6 14 q10 -8 18 0 q8 6 18 0" fill="none" stroke={MINT} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 20 q10 -6 16 0 q8 5 16 0" fill="none" stroke={TEAL} strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
      <path d="M6 44 L20 20 L28 32 L34 24 L44 44 z" fill={TEAL} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 20 L24 26 L18 26 z" fill="#FFFFFF" stroke={LINE} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M36 8 l1.6 3.4 L41 12 l-2.7 2.2 0.8 3.6 -3.1 -1.9 -3.1 1.9 0.8 -3.6 -2.7 -2.2 3.4 -0.4 z" fill={SUN} stroke={LINE} strokeWidth="1.3" strokeLinejoin="round" />
    </>
  ),
}

/**
 * Landmark icon for a curriculum level (1–8).
 * `muted` desaturates the accents for locked sections (structure/line preserved).
 */
export default function Landmark({ level, size = 40, muted = false }) {
  const glyph = GLYPHS[level] ?? GLYPHS[1]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      style={{ opacity: muted ? 0.45 : 1, flexShrink: 0, transition: 'opacity 0.2s ease' }}
    >
      {glyph}
    </svg>
  )
}

/**
 * Note-gem indicator — Sunshine when earned/mastered, Inactive grey when not.
 * A pure re-skin of existing mastery/completion state (no logic).
 */
export function Gem({ earned = false, size = 13, title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label={title}
      style={{ flexShrink: 0, transition: 'all 0.2s ease' }}
    >
      <path
        d="M12 2 L21 9 L12 22 L3 9 z"
        fill={earned ? SUN : '#D3D1C7'}
        stroke={earned ? LINE : '#C4C2B8'}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {earned && (
        <path d="M6.5 9 L12 5.5 L17.5 9" fill="none" stroke={LINE} strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
      )}
    </svg>
  )
}
