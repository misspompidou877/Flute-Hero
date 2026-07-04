import { PREMIUM_BENEFITS, PRICE_LABEL, PAYWALL } from '../../data/freemium'

/*
 * Reusable upgrade card shown in-place wherever a level is premium-locked
 * (Songs, Practice deep-links, Fingering Library). The CTA routes to the full
 * /unlock page rather than unlocking inline, so the "purchase" moment lives in
 * one place. Palette + Nunito per the app style rules — no new colours.
 */
export default function PaywallCard({ levelName, onUnlock, style }) {
  return (
    <div
      className="bg-white"
      style={{
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1.5px solid #F5A623',
        textAlign: 'center',
        fontFamily: "'Nunito', sans-serif",
        ...style,
      }}
    >
      <span style={{ fontSize: 40, lineHeight: 1 }}>🔒</span>

      <p style={{
        fontSize: 11, fontWeight: 700, color: '#F5A623',
        textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: 10,
      }}>
        {PAYWALL.eyebrow}
      </p>

      <p style={{ fontSize: 17, fontWeight: 800, color: '#000180', marginTop: 4 }}>
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
              fontSize: 13, fontWeight: 600, color: '#000180', padding: '5px 0',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
            {text}
          </li>
        ))}
      </ul>

      <button
        onClick={onUnlock}
        className="active:scale-95 transition-transform"
        style={{
          display: 'block', width: '100%', marginTop: 20,
          padding: '12px 24px', borderRadius: 999, border: 'none',
          background: 'linear-gradient(to right, #006EE9, #0056C7)',
          boxShadow: '0 4px 16px rgba(0,110,233,0.35)',
          color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          minHeight: 44,
        }}
      >
        {PAYWALL.cta} →
      </button>

      <p style={{ fontSize: 11, fontWeight: 600, color: '#999999', marginTop: 10 }}>
        {PRICE_LABEL}
      </p>
    </div>
  )
}
