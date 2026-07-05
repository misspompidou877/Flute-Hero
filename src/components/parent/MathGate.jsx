import { useState } from 'react'

/*
 * MathGate — a reusable "grown-ups only" adult gate.
 *
 * Poses a simple multiplication problem in words. On a correct answer it calls
 * the `onPass` callback. This is NOT real security — just a light barrier a
 * young child is unlikely to solve, which also satisfies the app-store
 * adult-gate requirement for surfaces that show a price.
 *
 * Palette: v2.0 TEAL only. Text on bright fills = Deep Teal (never white).
 * Wrong answers are gentle — no harsh red, no scolding.
 */

const DEEP_TEAL = '#0B3D3A'
const HINT = '#666666'
const TRACK = '#F1EFE8'
const INACTIVE = '#D3D1C7'
const MANGO = '#FFB76C'

// Two single-digit operands (2–9) keep the product unambiguous for an adult
// but out of reach for the target age group.
function makeProblem() {
  const a = 2 + Math.floor(Math.random() * 8)
  const b = 2 + Math.floor(Math.random() * 8)
  return { a, b, answer: a * b }
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'check']

export default function MathGate({
  onPass,
  title = 'Just for grown-ups',
  subtitle = 'Answer this quick question to continue.',
}) {
  const [problem, setProblem] = useState(makeProblem)
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  function press(key) {
    if (key === 'clear') {
      setValue('')
      setWrong(false)
      return
    }
    if (key === 'check') {
      if (parseInt(value, 10) === problem.answer) {
        onPass()
      } else {
        // Gentle: reset with a fresh problem so guessing doesn't pay off.
        setWrong(true)
        setValue('')
        setProblem(makeProblem())
      }
      return
    }
    if (value.length >= 3) return // products max out at 81
    setValue(prev => prev + key)
    setWrong(false)
  }

  return (
    <div
      style={{
        width: '100%', maxWidth: 360, margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        fontFamily: "'Nunito', sans-serif", textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 40, lineHeight: 1 }} aria-hidden="true">🔒</span>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: DEEP_TEAL, marginTop: 10 }}>
        {title}
      </h1>
      <p style={{ fontSize: 14, fontWeight: 500, color: HINT, marginTop: 6, maxWidth: 300, lineHeight: 1.5 }}>
        {subtitle}
      </p>

      {/* Question */}
      <div
        className="bg-white"
        style={{
          width: '100%', marginTop: 20, borderRadius: 16, padding: '20px 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <p style={{ fontSize: 18, fontWeight: 700, color: DEEP_TEAL }}>
          What is {problem.a} × {problem.b}?
        </p>

        {/* Answer display */}
        <div
          style={{
            marginTop: 14, height: 56, borderRadius: 12,
            background: TRACK, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, letterSpacing: 2,
            color: value ? DEEP_TEAL : INACTIVE,
          }}
          aria-live="polite"
        >
          {value || '?'}
        </div>

        {wrong && (
          <p style={{ fontSize: 13, fontWeight: 700, color: MANGO, marginTop: 10 }}>
            Not quite — here's a fresh one. Give it another go.
          </p>
        )}

        {/* Number pad */}
        <div
          style={{
            marginTop: 14, display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
          }}
        >
          {KEYS.map(key => {
            const isCheck = key === 'check'
            const isClear = key === 'clear'
            const label = isCheck ? '✓' : isClear ? 'Clear' : key
            return (
              <button
                key={key}
                onClick={() => press(key)}
                className="active:scale-95 transition-transform"
                style={{
                  minHeight: 52, borderRadius: 12, cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: isClear ? 15 : 22, fontWeight: 800,
                  border: isCheck || isClear ? 'none' : `1.5px solid ${INACTIVE}`,
                  color: DEEP_TEAL,
                  background: isCheck
                    ? 'linear-gradient(to right, #26CCC2, #1AA89F)'
                    : isClear
                      ? TRACK
                      : '#FFFFFF',
                  boxShadow: isCheck ? '0 4px 16px rgba(38,204,194,0.35)' : 'none',
                }}
                aria-label={isCheck ? 'Check answer' : isClear ? 'Clear' : `Digit ${key}`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
