import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import {
  PREMIUM_BENEFITS,
  PARENT_PRICE,
  PARENT_PRICE_LABEL,
  PAYWALL,
} from '../data/freemium'

/*
 * UnlockPage — full-screen purchase page at /unlock.
 *
 * PARENT surface: the price is allowed here (reached from the math-gated
 * Parent Zone). Palette is v2.0 TEAL — text on bright fills is Deep Teal,
 * never white.
 *
 * The purchase step is still a placeholder: the button flips the client-side
 * `isPremium` flag via unlockPremium(). No backend, no accounts.
 */

const DEEP_TEAL = '#0B3D3A'
const TEAL_DARK = '#1AA89F'
const HINT = '#666666'
const MUTED = '#999999'

export default function UnlockPage() {
  const navigate = useNavigate()
  const { progress: { isPremium }, unlockPremium } = useProgress()

  function handleUnlock() {
    // TODO: real Lemon Squeezy checkout — see LAUNCH_CHECKLIST.
    // For now this flips the client-side entitlement flag only.
    unlockPremium()
  }

  // Already premium (or just unlocked): confirmation state.
  if (isPremium) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{
          minHeight: 'calc(100dvh - 7rem)', fontFamily: "'Nunito', sans-serif",
          textAlign: 'center', padding: 24,
        }}
      >
        <span style={{ fontSize: 64, lineHeight: 1 }} aria-hidden="true">🎉</span>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: DEEP_TEAL, marginTop: 12 }}>
          {PAYWALL.unlockedHeadline}
        </h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: HINT, marginTop: 6, maxWidth: 320, lineHeight: 1.5 }}>
          {PAYWALL.unlockedSubhead}
        </p>
        <button
          onClick={() => navigate('/songs')}
          className="active:scale-95 transition-transform"
          style={{
            marginTop: 24, padding: '12px 32px', borderRadius: 999, border: 'none',
            background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
            boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
            color: DEEP_TEAL, fontSize: 15, fontWeight: 800, cursor: 'pointer', minHeight: 44,
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Explore all songs →
        </button>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center"
      style={{
        minHeight: 'calc(100dvh - 7rem)', fontFamily: "'Nunito', sans-serif",
        padding: '8px 16px 24px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Hero */}
      <span style={{ fontSize: 52, lineHeight: 1, marginTop: 12 }} aria-hidden="true">🎶</span>
      <p style={{
        fontSize: 12, fontWeight: 700, color: TEAL_DARK,
        textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 12,
      }}>
        One-time unlock
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: DEEP_TEAL, marginTop: 4, textAlign: 'center' }}>
        Unlock all 8 levels — {PARENT_PRICE}, one-time
      </h1>
      <p style={{
        fontSize: 14, fontWeight: 500, color: HINT, marginTop: 8,
        maxWidth: 340, textAlign: 'center', lineHeight: 1.5,
      }}>
        Level 1 stays free forever. One payment opens Levels 2–8 for good —
        no subscription, no auto-renew.
      </p>

      {/* Benefits card */}
      <div
        className="bg-white"
        style={{
          width: '100%', maxWidth: 420, marginTop: 20,
          borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PREMIUM_BENEFITS.map(({ icon, text }) => (
            <li
              key={text}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                fontSize: 14, fontWeight: 600, color: DEEP_TEAL, padding: '8px 0',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden="true">{icon}</span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Purchase CTA (placeholder) */}
      <button
        onClick={handleUnlock}
        className="active:scale-95 transition-transform"
        style={{
          width: '100%', maxWidth: 420, marginTop: 20,
          padding: '14px 24px', borderRadius: 999, border: 'none',
          background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
          boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
          color: DEEP_TEAL, fontSize: 16, fontWeight: 800, cursor: 'pointer', minHeight: 44,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        Unlock all levels — {PARENT_PRICE}
      </button>

      <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginTop: 10 }}>
        {PARENT_PRICE_LABEL}
      </p>

      <button
        onClick={() => navigate(-1)}
        className="active:scale-95 transition-transform"
        style={{
          marginTop: 14, padding: '8px 16px', background: 'none', border: 'none',
          color: HINT, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Nunito', sans-serif", minHeight: 44,
        }}
      >
        {PAYWALL.maybeLater}
      </button>
    </div>
  )
}
