import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { EMAIL_GATE, FREE_SONGS_PER_LEVEL } from '../data/freemium'

/*
 * UnlockFreePage — the email gate for the free-song tier, at /unlock-free.
 *
 * A grown-up adds an email and the two `free` songs at every level unlock
 * (entitlement.emailUnlocked). This is the secondary path for anyone who
 * skipped the email during onboarding; it does NOT charge and shows no price.
 * The one-time purchase lives separately behind the math-gated Parent Zone.
 *
 * Palette v2.0 TEAL — text on bright fills is always Deep Teal, never white.
 */

const DEEP_TEAL = '#0B3D3A'
const TEAL_DARK = '#1AA89F'
const HINT = '#666666'

function looksLikeEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value.trim())
}

export default function UnlockFreePage() {
  const navigate = useNavigate()
  const { progress: { isPremium, emailUnlocked }, unlockFreeSongs } = useProgress()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)

  // Already unlocked (email added, or full premium): friendly confirmation.
  if (isPremium || emailUnlocked) {
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
          Your free songs are open!
        </h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: HINT, marginTop: 6, maxWidth: 320, lineHeight: 1.5 }}>
          There’s a free song to play at every level. Have fun!
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
          Explore songs →
        </button>
      </div>
    )
  }

  function handleUnlock() {
    const trimmed = email.trim()
    if (!looksLikeEmail(trimmed)) {
      setError(true)
      return
    }
    unlockFreeSongs(trimmed)
    navigate('/songs')
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
      <span style={{ fontSize: 52, lineHeight: 1, marginTop: 12 }} aria-hidden="true">🔓</span>
      <p style={{
        fontSize: 12, fontWeight: 700, color: TEAL_DARK,
        textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 12,
      }}>
        {EMAIL_GATE.eyebrow}
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: DEEP_TEAL, marginTop: 4, textAlign: 'center' }}>
        {FREE_SONGS_PER_LEVEL} free songs at every level
      </h1>
      <p style={{
        fontSize: 14, fontWeight: 500, color: HINT, marginTop: 8,
        maxWidth: 340, textAlign: 'center', lineHeight: 1.5,
      }}>
        {EMAIL_GATE.subhead} It stays on this device — no account, nothing sent anywhere.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (error) setError(false) }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock() }}
        placeholder={EMAIL_GATE.placeholder}
        autoComplete="email"
        inputMode="email"
        aria-label="Grown-up's email"
        aria-invalid={error ? 'true' : undefined}
        style={{
          width: '100%', maxWidth: 420, marginTop: 20, minHeight: 56,
          borderRadius: 16, border: `2px solid ${error ? '#F5A623' : '#6AECE1'}`,
          background: '#FFFFFF', color: DEEP_TEAL,
          fontFamily: "'Nunito', sans-serif", fontSize: 18, fontWeight: 700,
          textAlign: 'center', padding: '0 16px', outline: 'none',
        }}
      />
      {error && (
        <p role="alert" style={{ fontSize: 13, fontWeight: 700, color: '#F5A623', marginTop: 8 }}>
          {EMAIL_GATE.invalid}
        </p>
      )}

      <button
        onClick={handleUnlock}
        disabled={!looksLikeEmail(email)}
        className="active:scale-95 transition-transform"
        style={{
          width: '100%', maxWidth: 420, marginTop: 16,
          padding: '14px 24px', borderRadius: 999, border: 'none',
          background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
          boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
          color: DEEP_TEAL, fontSize: 16, fontWeight: 800,
          cursor: looksLikeEmail(email) ? 'pointer' : 'not-allowed',
          opacity: looksLikeEmail(email) ? 1 : 0.5,
          minHeight: 44, fontFamily: "'Nunito', sans-serif",
        }}
      >
        {EMAIL_GATE.button}
      </button>

      <button
        onClick={() => navigate(-1)}
        className="active:scale-95 transition-transform"
        style={{
          marginTop: 14, padding: '8px 16px', background: 'none', border: 'none',
          color: HINT, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Nunito', sans-serif", minHeight: 44,
        }}
      >
        {EMAIL_GATE.maybeLater}
      </button>
    </div>
  )
}
