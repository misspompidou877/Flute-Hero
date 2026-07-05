import { useEffect, useRef } from 'react'

const CONFETTI_COLORS = ['#FFF57E', '#6AECE1', '#26CCC2', '#FFB76C', '#0B3D3A']

export default function BadgePopup({
  badgeKey,
  badgeName,
  badgeEmoji,
  description,
  onContinue,
  visible,
}) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (visible && badgeKey) {
      try {
        localStorage.setItem(
          `badges.${badgeKey}`,
          JSON.stringify({ earned: true, earnedAt: Date.now() })
        )
      } catch (e) {
        console.warn('[BadgePopup] localStorage error:', e)
      }

      timerRef.current = setTimeout(() => {
        onContinue && onContinue()
      }, 4000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, badgeKey, onContinue])

  if (!visible) return null

  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${(i * 3.2) % 94 + 3}%`,
    animationDelay: `${(i * 0.04).toFixed(2)}s`,
  }))

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      }}
    >
      {confettiPieces.map((piece, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '-10px',
            left: piece.left,
            width: '10px',
            height: '10px',
            borderRadius: '2px',
            background: piece.color,
            animationDelay: piece.animationDelay,
            animation: `confetti-fall 2.5s ease-in ${piece.animationDelay} forwards`,
          }}
        />
      ))}

      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '40px 32px',
          maxWidth: '360px',
          width: 'calc(100% - 32px)',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          animation: 'f-badge-in 380ms cubic-bezier(0.34,1.56,0.64,1) forwards',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: '80px',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          {badgeEmoji}
        </span>

        <div
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: '28px',
            color: '#0B3D3A',
            marginBottom: '8px',
          }}
        >
          {badgeName}
        </div>

        <div
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 400,
            fontSize: '18px',
            color: '#666666',
            marginBottom: '32px',
          }}
        >
          {description}
        </div>

        <button
          onClick={() => {
            if (timerRef.current) clearTimeout(timerRef.current)
            onContinue && onContinue()
          }}
          style={{
            width: '100%',
            background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
            color: '#0B3D3A',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            height: '56px',
            borderRadius: '28px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Keep going! →
        </button>
      </div>
    </div>
  )
}
