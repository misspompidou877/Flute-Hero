import { useState, useEffect, useRef } from 'react'

// ── CSS keyframes (injected once into the document head) ──────────────────────
const KEYFRAME_CSS = `
@keyframes flute-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}
@keyframes flute-bounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.25); }
  70%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
@keyframes flute-shake {
  0%,100% { transform: rotate(0deg); }
  15%     { transform: rotate(-10deg); }
  35%     { transform: rotate(10deg); }
  55%     { transform: rotate(-8deg); }
  75%     { transform: rotate(8deg); }
}
@keyframes flute-spin {
  from { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.15); }
  to   { transform: rotate(360deg) scale(1); }
}
@keyframes flute-perfect {
  0%   { transform: scale(1) rotate(0deg); }
  20%  { transform: scale(2.2) rotate(90deg); }
  60%  { transform: scale(2.2) rotate(270deg); }
  85%  { transform: scale(1.1) rotate(350deg); }
  100% { transform: scale(1) rotate(360deg); }
}
@keyframes note-rise {
  0%   { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-50px); opacity: 0; }
}
@keyframes bubble-show {
  0%,75% { opacity: 1; transform: scale(1); }
  100%   { opacity: 0; transform: scale(0.9); }
}
@keyframes confetti-fly {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--cx,30px),var(--cy,-40px)) scale(0.3); opacity: 0; }
}
@keyframes note-pop {
  0%   { transform: scale(0.3); opacity: 0; }
  30%  { transform: scale(1.2); opacity: 1; }
  60%  { transform: scale(1);   opacity: 1; }
  100% { transform: scale(1);   opacity: 0; }
}
`

const SPEECH = {
  idle:      'Ready to play? 🎵',
  listening: 'Watch carefully! 👀',
  correct:   'Yes! Great! ✨',
  complete:  'Amazing! 🎉',
  wrong:     'Nearly! Try again 🎵',
  perfect:   "You're a Flute Hero! ⭐",
}

const CONFETTI_DOTS = [
  { color: '#D0FFA3', cx:  50, cy: -55 },
  { color: '#E7A0FE', cx: -45, cy: -50 },
  { color: '#83E7FF', cx:  60, cy: -20 },
  { color: '#006EE9', cx: -55, cy: -30 },
  { color: '#D0FFA3', cx:  30, cy: -65 },
  { color: '#E7A0FE', cx: -60, cy: -15 },
  { color: '#83E7FF', cx: -25, cy: -60 },
  { color: '#006EE9', cx:  55, cy: -45 },
  { color: '#D0FFA3', cx: -40, cy: -65 },
  { color: '#E7A0FE', cx:  65, cy: -38 },
  { color: '#83E7FF', cx: -15, cy: -45 },
  { color: '#006EE9', cx:  40, cy: -70 },
]

// ── SVG cartoon flute character ───────────────────────────────────────────────
function FluteSVG({ mood }) {
  const wideEyes  = mood === 'listening' || mood === 'perfect'
  const oopsMouth = mood === 'wrong'
  const bigSmile  = mood === 'correct' || mood === 'complete' || mood === 'perfect'
  const pupilR    = wideEyes ? 4.5 : 3

  return (
    <svg viewBox="0 0 80 180" width="80" height="180" aria-hidden="true">
      {/* Drop shadow */}
      <ellipse cx="40" cy="174" rx="22" ry="5" fill="rgba(0,0,0,0.10)" />

      {/* Flute body tube */}
      <rect x="28" y="50" width="24" height="122" rx="12" fill="#83E7FF" />

      {/* Tube shine */}
      <rect x="31" y="54" width="7" height="114" rx="3.5" fill="rgba(255,255,255,0.28)" />

      {/* Key holes */}
      <circle cx="40" cy="95"  r="5" fill="#006EE9" />
      <circle cx="40" cy="112" r="5" fill="#006EE9" />
      <circle cx="40" cy="129" r="5" fill="#006EE9" />
      <circle cx="40" cy="146" r="5" fill="#006EE9" />

      {/* Face bulge */}
      <circle cx="40" cy="34" r="26" fill="#83E7FF" />
      {/* Face highlight */}
      <circle cx="32" cy="26" r="7" fill="rgba(255,255,255,0.20)" />

      {/* Left eye */}
      <circle cx="31" cy="30" r={wideEyes ? 8 : 6.5} fill="white" />
      <circle cx={wideEyes ? 32 : 31.5} cy={wideEyes ? 31 : 30.5} r={pupilR} fill="#1A1A2E" />
      <circle cx="29.5" cy="28.5" r="1.5" fill="white" />

      {/* Right eye */}
      <circle cx="49" cy="30" r={wideEyes ? 8 : 6.5} fill="white" />
      <circle cx={wideEyes ? 50 : 49.5} cy={wideEyes ? 31 : 30.5} r={pupilR} fill="#1A1A2E" />
      <circle cx="47.5" cy="28.5" r="1.5" fill="white" />

      {/* Mouth */}
      {oopsMouth ? (
        /* "Oops" circle mouth */
        <circle cx="40" cy="43" r="4.5" fill="none" stroke="#1A1A2E" strokeWidth="2.2" />
      ) : bigSmile ? (
        /* Big grin */
        <path d="M 28 40 Q 40 54 52 40" fill="none" stroke="#1A1A2E" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        /* Neutral smile */
        <path d="M 31 40 Q 40 49 49 40" fill="none" stroke="#1A1A2E" strokeWidth="2.2" strokeLinecap="round" />
      )}

      {/* Blush marks when happy */}
      {(mood === 'correct' || mood === 'complete' || mood === 'perfect') && (
        <>
          <ellipse cx="24" cy="38" rx="5" ry="3" fill="#F48FB1" opacity="0.5" />
          <ellipse cx="56" cy="38" rx="5" ry="3" fill="#F48FB1" opacity="0.5" />
        </>
      )}

      {/* Floating ♪ beside the flute */}
      <text x="64" y="30" fontSize="16" fill="#006EE9" fontWeight="bold">♪</text>
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FluteCharacter({ mood = 'idle', animKey = 0, speech }) {
  const [showBubble, setShowBubble]   = useState(mood === 'idle')
  const [bubbleKey,  setBubbleKey]    = useState(0)
  const prevMoodRef                   = useRef(mood)
  const styleInjectedRef              = useRef(false)

  // Inject keyframes once
  useEffect(() => {
    if (styleInjectedRef.current) return
    if (document.getElementById('flute-char-keyframes')) {
      styleInjectedRef.current = true
      return
    }
    const el = document.createElement('style')
    el.id = 'flute-char-keyframes'
    el.textContent = KEYFRAME_CSS
    document.head.appendChild(el)
    styleInjectedRef.current = true
  }, [])

  // Show / auto-hide speech bubble on mood changes
  useEffect(() => {
    if (mood === 'idle') {
      setShowBubble(true)
      return
    }
    if (prevMoodRef.current !== mood) {
      setBubbleKey(k => k + 1)
      setShowBubble(true)
      const t = setTimeout(() => setShowBubble(false), 2200)
      prevMoodRef.current = mood
      return () => clearTimeout(t)
    }
  }, [mood])

  const getAnimation = () => {
    switch (mood) {
      case 'idle':      return 'flute-float 2s ease-in-out infinite'
      case 'listening': return 'none'
      case 'correct':   return 'flute-bounce 280ms ease both'
      case 'complete':  return 'flute-spin 550ms ease both'
      case 'wrong':     return 'flute-shake 350ms ease both'
      case 'perfect':   return 'flute-perfect 900ms ease both'
      default:          return 'none'
    }
  }

  const showConfetti = mood === 'complete' || mood === 'perfect'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 72,
        right: 12,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
        width: 96,
      }}
    >
      {/* Speech bubble */}
      {showBubble && (
        <div
          key={bubbleKey}
          style={{
            background: 'white',
            borderRadius: 14,
            padding: '7px 12px',
            boxShadow: '0 3px 14px rgba(0,0,0,0.18)',
            fontSize: 12,
            fontWeight: 700,
            color: '#2D2D2D',
            marginBottom: 8,
            whiteSpace: 'nowrap',
            fontFamily: "'Nunito', sans-serif",
            animation: mood === 'idle' ? 'none' : 'bubble-show 2.2s ease forwards',
            position: 'relative',
            right: 10,
          }}
        >
          {speech ?? SPEECH[mood]}
          {/* Bubble tail */}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              right: 20,
              width: 12,
              height: 7,
              background: 'white',
              clipPath: 'polygon(0 0, 100% 0, 60% 100%)',
            }}
          />
        </div>
      )}

      {/* Floating music notes (listening mode) */}
      {mood === 'listening' && (
        <div style={{ position: 'relative', height: 0, width: '100%' }}>
          <span style={{
            position: 'absolute', bottom: 8, left: 5,
            fontSize: 20, color: '#006EE9',
            animation: 'note-rise 1.1s ease-in-out infinite',
          }}>♪</span>
          <span style={{
            position: 'absolute', bottom: 20, right: 0,
            fontSize: 15, color: '#F48FB1',
            animation: 'note-rise 1.1s ease-in-out infinite 0.55s',
          }}>♫</span>
        </div>
      )}

      {/* Confetti burst */}
      {showConfetti && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}>
          {CONFETTI_DOTS.map((dot, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 9, height: 9,
                borderRadius: '50%',
                background: dot.color,
                top: 0, left: 0,
                '--cx': `${dot.cx}px`,
                '--cy': `${dot.cy}px`,
                animation: `confetti-fly 650ms ease-out ${i * 35}ms forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Character with animation — key forces re-mount to retrigger animation */}
      <div
        key={`${mood}-${animKey}`}
        style={{
          animation: getAnimation(),
          transformOrigin: 'center bottom',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FluteSVG mood={mood} />
      </div>
    </div>
  )
}
