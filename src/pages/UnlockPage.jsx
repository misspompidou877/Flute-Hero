import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { PREMIUM_BENEFITS, PRICE_LABEL, PAYWALL } from '../data/freemium'

/*
 * Full-screen paywall / purchase page at /unlock.
 * The purchase step is a placeholder for now — the button flips the client-side
 * `isPremium` flag via unlockPremium(). A real payment provider (or App Store
 * IAP via the planned Capacitor path) gets wired in here later.
 */
export default function UnlockPage() {
  const navigate = useNavigate()
  const { progress: { isPremium }, unlockPremium } = useProgress()

  // Already premium (or just unlocked): confirmation state.
  if (isPremium) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ minHeight: 'calc(100dvh - 7rem)', fontFamily: "'Nunito', sans-serif", textAlign: 'center', padding: 24 }}
      >
        <span style={{ fontSize: 64, lineHeight: 1 }}>🎉</span>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#000180', marginTop: 12 }}>
          {PAYWALL.unlockedHeadline}
        </h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#666666', marginTop: 6, maxWidth: 320, lineHeight: 1.5 }}>
          {PAYWALL.unlockedSubhead}
        </p>
        <button
          onClick={() => navigate('/songs')}
          className="active:scale-95 transition-transform"
          style={{
            marginTop: 24, padding: '12px 32px', borderRadius: 999, border: 'none',
            background: 'linear-gradient(to right, #006EE9, #0056C7)',
            boxShadow: '0 4px 16px rgba(0,110,233,0.35)',
            color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', minHeight: 44,
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
      style={{ minHeight: 'calc(100dvh - 7rem)', fontFamily: "'Nunito', sans-serif", padding: '8px 4px 24px' }}
    >
      {/* Hero */}
      <span style={{ fontSize: 52, lineHeight: 1, marginTop: 12 }}>🎶</span>
      <p style={{
        fontSize: 12, fontWeight: 700, color: '#F5A623',
        textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 12,
      }}>
        {PAYWALL.eyebrow}
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#000180', marginTop: 4, textAlign: 'center' }}>
        {PAYWALL.headline}
      </h1>
      <p style={{
        fontSize: 14, fontWeight: 500, color: '#666666', marginTop: 8,
        maxWidth: 340, textAlign: 'center', lineHeight: 1.5,
      }}>
        {PAYWALL.subhead}
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
                fontSize: 14, fontWeight: 600, color: '#000180', padding: '8px 0',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Purchase CTA (placeholder) */}
      <button
        onClick={unlockPremium}
        className="active:scale-95 transition-transform"
        style={{
          width: '100%', maxWidth: 420, marginTop: 20,
          padding: '14px 24px', borderRadius: 999, border: 'none',
          background: 'linear-gradient(to right, #006EE9, #0056C7)',
          boxShadow: '0 4px 16px rgba(0,110,233,0.35)',
          color: 'white', fontSize: 16, fontWeight: 800, cursor: 'pointer', minHeight: 44,
        }}
      >
        {PAYWALL.cta}
      </button>

      <p style={{ fontSize: 12, fontWeight: 600, color: '#999999', marginTop: 10 }}>
        {PRICE_LABEL}
      </p>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: 14, padding: '8px 16px', background: 'none', border: 'none',
          color: '#666666', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Nunito', sans-serif", minHeight: 44,
        }}
      >
        {PAYWALL.maybeLater}
      </button>
    </div>
  )
}
