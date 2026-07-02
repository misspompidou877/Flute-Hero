import { useEffect, useRef } from 'react'

// ── CSS injection ──────────────────────────────────────────────────────────────

const KEYFRAMES_ID = 'notequiz-celebration-keyframes'

const KEYFRAME_CSS = `
@keyframes nq-cartwheel {
  0%   { transform: translateY(100px) rotate(0deg) scale(0.8); opacity: 0; }
  15%  { transform: translateY(0) rotate(0deg) scale(1.1); opacity: 1; }
  50%  { transform: translateY(-20px) rotate(180deg) scale(1.2); }
  85%  { transform: translateY(0) rotate(360deg) scale(1.1); }
  100% { transform: translateY(100px) rotate(360deg) scale(0.8); opacity: 0; }
}
@keyframes nq-karate {
  0%   { transform: translateY(100px) scale(0.8); opacity: 0; }
  20%  { transform: translateY(0) scale(1); opacity: 1; }
  35%  { transform: translateY(0) scale(1) rotate(-15deg); }
  50%  { transform: translateY(-10px) scale(1.1) rotate(25deg); }
  65%  { transform: translateY(0) scale(1) rotate(-10deg); }
  80%  { transform: translateY(0) scale(1) rotate(0deg); }
  100% { transform: translateY(100px) scale(0.8); opacity: 0; }
}
@keyframes nq-wiggle {
  0%   { transform: translateY(100px) scale(0.8); opacity: 0; }
  15%  { transform: translateY(0) scale(1); opacity: 1; }
  25%  { transform: translateY(0) scale(1) rotate(15deg); }
  35%  { transform: translateY(0) scale(1.05) rotate(-15deg); }
  45%  { transform: translateY(0) scale(1) rotate(15deg); }
  55%  { transform: translateY(0) scale(1.05) rotate(-15deg); }
  65%  { transform: translateY(0) scale(1) rotate(10deg); }
  75%  { transform: translateY(0) scale(1) rotate(0deg); }
  100% { transform: translateY(100px) scale(0.8); opacity: 0; }
}
@keyframes nq-jump {
  0%   { transform: translateY(100px) scale(0.8); opacity: 0; }
  15%  { transform: translateY(0) scale(1); opacity: 1; }
  30%  { transform: translateY(-40px) scale(1.2); }
  45%  { transform: translateY(0) scale(0.9); }
  55%  { transform: translateY(-20px) scale(1.1); }
  65%  { transform: translateY(0) scale(1); }
  80%  { transform: translateY(0) scale(1); }
  100% { transform: translateY(100px) scale(0.8); opacity: 0; }
}
@keyframes nq-spin {
  0%   { transform: translateY(100px) rotate(0deg) scale(0.8); opacity: 0; }
  15%  { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
  75%  { transform: translateY(0) rotate(720deg) scale(1.1); }
  85%  { transform: translateY(0) rotate(720deg) scale(1); }
  100% { transform: translateY(100px) rotate(720deg) scale(0.8); opacity: 0; }
}
@keyframes nq-wobble {
  0%   { transform: translateY(100px) scaleX(1) scaleY(0.8); opacity: 0; }
  15%  { transform: translateY(0) scaleX(1) scaleY(1); opacity: 1; }
  25%  { transform: translateY(0) scaleX(1.3) scaleY(0.7); }
  35%  { transform: translateY(0) scaleX(0.8) scaleY(1.2); }
  45%  { transform: translateY(0) scaleX(1.2) scaleY(0.9); }
  55%  { transform: translateY(0) scaleX(0.9) scaleY(1.1); }
  70%  { transform: translateY(0) scaleX(1) scaleY(1); }
  100% { transform: translateY(100px) scaleX(1) scaleY(0.8); opacity: 0; }
}
@keyframes nq-confetti {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--cx), var(--cy)) scale(0.3); opacity: 0; }
}
@keyframes nq-score-float {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-60px); }
}
@keyframes nq-label-fade {
  0%, 65% { opacity: 1; }
  100%     { opacity: 0; }
}
@keyframes nq-flash {
  0%   { opacity: 0; }
  25%  { opacity: 0.1; }
  100% { opacity: 0; }
}
`

// ── Config ─────────────────────────────────────────────────────────────────────

const MOVE_CONFIG = {
  cartwheel: { label: 'Cartwheel! 🤸', duration: 1200, timing: 'ease-in-out' },
  karate:    { label: 'Karate! 🥋',    duration: 1000, timing: 'ease-in-out' },
  wiggle:    { label: 'Wiggle! 💃',    duration: 1100, timing: 'ease-in-out' },
  jump:      { label: 'Jump! 🦘',      duration: 900,  timing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)' },
  spin:      { label: 'Spin! ⭐',      duration: 1100, timing: 'ease-in-out' },
  wobble:    { label: 'Wobble! 🪱',    duration: 1000, timing: 'ease-in-out' },
}

// Base 6 confetti positions, doubled for higher streaks
const CONFETTI_BASE = [
  { cx: 65, cy: -70 }, { cx: -60, cy: -65 }, { cx: 85, cy: -20 },
  { cx: -75, cy: -30 }, { cx: 35, cy: -85 }, { cx: -45, cy: -80 },
]
const CONFETTI_EXTRA = [
  { cx: 50, cy: -45 }, { cx: -50, cy: -50 }, { cx: 90, cy: -55 },
  { cx: -80, cy: -15 }, { cx: 20, cy: -90 }, { cx: -25, cy: -35 },
]
const CONFETTI_COLORS = ['#D0FFA3', '#83E7FF', '#D0FFA3', '#83E7FF', '#D0FFA3', '#83E7FF']

// ── Inline FluteCharacter SVG (happy mood, for celebrations) ──────────────────

function CelebrationSVG({ size }) {
  const bodyHeight = Math.round(size * 2.25)
  return (
    <svg viewBox="0 0 80 180" width={size} height={bodyHeight} aria-hidden="true">
      <ellipse cx="40" cy="174" rx="22" ry="5" fill="rgba(0,0,0,0.10)" />
      <rect x="28" y="50" width="24" height="122" rx="12" fill="#83E7FF" />
      <rect x="31" y="54" width="7" height="114" rx="3.5" fill="rgba(255,255,255,0.28)" />
      <circle cx="40" cy="95"  r="5" fill="#006EE9" />
      <circle cx="40" cy="112" r="5" fill="#006EE9" />
      <circle cx="40" cy="129" r="5" fill="#006EE9" />
      <circle cx="40" cy="146" r="5" fill="#006EE9" />
      <circle cx="40" cy="34" r="26" fill="#83E7FF" />
      <circle cx="32" cy="26" r="7" fill="rgba(255,255,255,0.20)" />
      <circle cx="31" cy="30" r="6.5" fill="white" />
      <circle cx="31.5" cy="30.5" r="3" fill="#1A1A2E" />
      <circle cx="29.5" cy="28.5" r="1.5" fill="white" />
      <circle cx="49" cy="30" r="6.5" fill="white" />
      <circle cx="49.5" cy="30.5" r="3" fill="#1A1A2E" />
      <circle cx="47.5" cy="28.5" r="1.5" fill="white" />
      <path d="M 28 40 Q 40 54 52 40" fill="none" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="24" cy="38" rx="5" ry="3" fill="#F48FB1" opacity="0.5" />
      <ellipse cx="56" cy="38" rx="5" ry="3" fill="#F48FB1" opacity="0.5" />
      <text x="64" y="30" fontSize="16" fill="#006EE9" fontWeight="bold">♪</text>
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
// Props:
//   visible      — bool: whether to show the overlay
//   move         — 'cartwheel'|'karate'|'wiggle'|'jump'|'spin'|'wobble'
//   streak       — number: consecutive correct answers
//   scorePoints  — number: +10 or +15
//   isBonus      — bool: true when +15 (fast answer)
//   animKey      — number: increments on each show to retrigger animation

export default function FluteCharacterCelebration({ visible, move, streak, scorePoints, isBonus, animKey }) {
  const injectedRef = useRef(false)

  useEffect(() => {
    if (injectedRef.current || document.getElementById(KEYFRAMES_ID)) {
      injectedRef.current = true
      return
    }
    const el = document.createElement('style')
    el.id = KEYFRAMES_ID
    el.textContent = KEYFRAME_CSS
    document.head.appendChild(el)
    injectedRef.current = true
  }, [])

  if (!visible || !move) return null

  const config   = MOVE_CONFIG[move] || MOVE_CONFIG.cartwheel
  const charSize = streak >= 5 ? 160 : streak >= 3 ? 140 : 120
  const speedMul = streak >= 3 ? 0.8 : 1
  const duration = Math.round(config.duration * speedMul)
  const iterations = streak >= 5 ? 2 : 1
  const confettiDots = streak >= 3
    ? [...CONFETTI_BASE, ...CONFETTI_EXTRA]
    : CONFETTI_BASE
  const confettiColors = [...CONFETTI_COLORS, ...CONFETTI_COLORS]

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* Screen flash for streak 5+ */}
      {streak >= 5 && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: '#D0FFA3',
          animation: 'nq-flash 200ms ease forwards',
        }} />
      )}

      {/* Score popup */}
      <div style={{
        position: 'absolute',
        top: '28%',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 800,
        fontSize: 28,
        color: '#000180',
        animation: 'nq-score-float 700ms ease forwards',
        whiteSpace: 'nowrap',
      }}>
        {isBonus ? `+${scorePoints} ⚡` : `+${scorePoints}`}
        {streak >= 5 && ' 🔥'}
      </div>

      {/* Centre: confetti + character + label */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Confetti dots */}
        {confettiDots.map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 10, height: 10,
              borderRadius: '50%',
              background: confettiColors[i % confettiColors.length],
              top: 0, left: 0,
              '--cx': `${pos.cx}px`,
              '--cy': `${pos.cy}px`,
              animation: `nq-confetti 600ms ease-out ${i * 40}ms forwards`,
            }}
          />
        ))}

        {/* Character performing move */}
        <div
          key={animKey}
          style={{
            animation: `nq-${move} ${duration}ms ${config.timing} ${iterations} forwards`,
            transformOrigin: 'center bottom',
          }}
        >
          <CelebrationSVG size={charSize} />
        </div>

        {/* Move label */}
        <div style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: '#83E7FF',
          marginTop: 8,
          animation: 'nq-label-fade 500ms ease forwards',
          whiteSpace: 'nowrap',
        }}>
          {config.label}
        </div>
      </div>
    </div>
  )
}
