import { useState } from 'react'

// ── Image data ────────────────────────────────────────────────────────────────
// Captions derived from filenames per spec caption rules.
// Two images that don't match any rule pattern default to a generic caption —
// see the caption review list at the bottom of this file.

const CORRECT = [
  {
    src: '/images/correct-embouchure.png',
    alt: 'Correct embouchure — relaxed lips, small round opening centred on the headjoint',
    caption: '✓ Correct shape — small round opening, relaxed lips',
  },
  {
    src: '/images/correct-embouchure-2.png',
    alt: 'Correct embouchure close-up — lower lip resting just below the embouchure hole, small centred opening',
    caption: '✓ Correct shape — small round opening, relaxed lips',
  },
]

const INCORRECT = [
  {
    src: '/images/wrong-embouchure-gap-too-wide.png',
    alt: 'Incorrect — lip opening stretched too wide across the headjoint',
    caption: '✕ Opening too wide — narrow it to a small oval',
  },
  {
    src: '/images/wrong-embouchure-puckering.png',
    alt: 'Incorrect — lips pushed forward and puckered away from the teeth',
    caption: '✕ Lips pushed too far forward — relax them back',
  },
  {
    src: '/images/wrong-embouchure-hole-too-wide.png',
    alt: 'Incorrect — embouchure opening too wide, lips spread instead of forming a small oval',
    caption: '✕ Opening too wide — narrow it to a small oval',
  },
  {
    src: '/images/wrong-embouchure-hole-too-wide-2.png',
    alt: 'Incorrect — embouchure opening too wide (second example)',
    caption: '✕ Opening too wide — narrow it to a small oval',
  },
  {
    src: '/images/wrong-embouchure-too-big-gap.png',
    alt: 'Incorrect — gap between lips is too large, needs to be a smaller, rounder opening',
    caption: '✕ Gap too large — make a smaller oval opening',
  },
  {
    src: '/images/wrong-embouchure.png',
    alt: 'Incorrect — lips pressed too tightly against the headjoint, not enough opening',
    caption: '✕ Lips too tense — let them relax and open slightly',
  },
  {
    src: '/images/flute-placement-too-low.png',
    alt: 'Incorrect — headjoint sitting too low on the lip, too much lower lip showing',
    caption: '✕ Headjoint too low — slide it up so it rests just below the lip',
  },
  {
    src: '/images/flute-too-high.png',
    alt: 'Incorrect — headjoint placed too high, entire lower lip covered by the lip plate',
    caption: '✕ Lip plate too high — rest it just below the lip',
  },
]

// ── Photo card ────────────────────────────────────────────────────────────────

function PhotoCard({ src, alt, caption, isCorrect, maxHeight }) {
  const [errored, setErrored] = useState(false)
  const color = isCorrect ? '#4CAF50' : '#F06292'
  const badge = isCorrect ? '✓' : '✕'
  const filename = src.split('/').pop()

  return (
    <div>
      {/* Card with border */}
      <div
        style={{
          position: 'relative',
          borderRadius: '14px',
          overflow: 'hidden',
          border: `2.5px solid ${color}`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
        }}
      >
        {errored ? (
          // Placeholder shown when image fails to load
          <div
            style={{
              background: '#F5F5F5',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              padding: '0 12px',
            }}
          >
            <span
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '16px',
                color: '#CCCCCC',
                textAlign: 'center',
                wordBreak: 'break-word',
              }}
            >
              {filename}
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              objectFit: 'cover',
              maxHeight: `${maxHeight}px`,
              display: 'block',
              borderRadius: '12px',
            }}
            onError={() => setErrored(true)}
          />
        )}

        {/* ✓ / ✕ badge — top-left corner */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '28px',
            height: '28px',
            background: color,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
            userSelect: 'none',
          }}
        >
          {badge}
        </div>
      </div>

      {/* Caption below card */}
      <p
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          color,
          textAlign: 'center',
          margin: '6px 0 16px',
        }}
      >
        {caption}
      </p>
    </div>
  )
}

// ── Photo grid ────────────────────────────────────────────────────────────────

function PhotoGrid({ images, isCorrect }) {
  const count = images.length
  // 1 image → full width; 2 images → side by side; 3+ → 2-column grid
  const cols = count === 1 ? '1fr' : '1fr 1fr'
  const maxHeight = count === 1 ? 280 : 220

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: cols,
        gap: '12px',
      }}
    >
      {images.map(img => (
        <PhotoCard
          key={img.src}
          src={img.src}
          alt={img.alt}
          caption={img.caption}
          isCorrect={isCorrect}
          maxHeight={maxHeight}
        />
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LipShapeStep() {
  return (
    <div style={{ margin: '8px 0 20px' }}>

      {/* Section heading */}
      <p
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: '20px',
          color: '#2D2D2D',
          margin: '0 0 8px',
        }}
      >
        What the right shape looks like 👀
      </p>

      {/* Subheading */}
      <p
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 400,
          fontStyle: 'italic',
          fontSize: '16px',
          color: '#666666',
          margin: '0 0 20px',
        }}
      >
        Look at each picture carefully before you try it yourself.
      </p>

      {/* Correct photos */}
      <PhotoGrid images={CORRECT} isCorrect={true} />

      {/* Divider with centred label */}
      <div style={{ position: 'relative', margin: '8px 0 20px' }}>
        <div style={{ borderTop: '1px solid #EEEEEE' }} />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#FAF4EE',
            padding: '0 12px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            color: '#999999',
            whiteSpace: 'nowrap',
          }}
        >
          And here's what to avoid 👇
        </div>
      </div>

      {/* Incorrect photos */}
      <PhotoGrid images={INCORRECT} isCorrect={false} />

    </div>
  )
}
