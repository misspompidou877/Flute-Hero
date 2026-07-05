import { useNavigate } from 'react-router-dom'
import { PREMIUM_BENEFITS, PAYWALL } from '../../data/freemium'

/*
 * Reusable "locked for now" card shown in-place wherever a level isn't yet
 * open (Songs, Practice deep-links, Fingering Library). This is a kid-facing
 * surface — no prices, no purchase wording (see flute-hero-redesign-brief.md
 * §3, "kids never see a price"). The CTA sends the grown-up to the
 * math-gated parent zone (/parent), where the one-time unlock actually
 * lives. Palette + Nunito per STYLE_GUIDE.md v2.0 TEAL — no off-palette
 * colours.
 */
export default function PaywallCard({ levelName, onUnlock, style }) {
  const navigate = useNavigate()

  const handleClick = () => {
    onUnlock?.()
    navigate('/parent')
  }

  return (
    <div
      className="bg-white"
      style={{
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '2px solid #FFB76C',
        textAlign: 'center',
        fontFamily: "'Nunito', sans-serif",
        ...style,
      }}
    >
      <span style={{ fontSize: 40, lineHeight: 1 }}>🔒</span>

      <p style={{
        fontSize: 11, fontWeight: 700, color: '#FFB76C',
        textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 10,
      }}>
        {PAYWALL.eyebrow}
      </p>

      <p style={{ fontSize: 17, fontWeight: 800, color: '#0B3D3A', marginTop: 4 }}>
        {levelName ? PAYWALL.lockedLevel(levelName) : PAYWALL.headline}
      </p>

      <p style={{ fontSize: 13, fontWeight: 500, color: '#666666', marginTop: 6, lineHeight: 1.5 }}>
        {PAYWALL.subhead}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', textAlign: 'left', display: 'inline-block' }}>
        {PREMIUM_BENEFITS.map(({ icon, text }) => (
          <li
            key={text}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13, fontWeight: 600, color: '#0B3D3A', padding: '5px 0',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
            {text}
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        className="active:scale-95 transition-transform"
        style={{
          display: 'block', width: '100%', marginTop: 20,
          padding: '12px 24px', borderRadius: 999, border: 'none',
          background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
          boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
          color: '#0B3D3A', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          minHeight: 44,
        }}
      >
        {PAYWALL.cta} →
      </button>
    </div>
  )
}
