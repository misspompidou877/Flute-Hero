import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'

function ChevronRight() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#CCCCCC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="9,18 15,12 9,6" />
    </svg>
  )
}

const CARD_BASE = {
  background: 'white',
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: 16,
  display: 'block',
  textDecoration: 'none',
}

function Card({ to, borderColor, iconBg, emoji, title, subtitle, meta }) {
  return (
    <Link to={to} style={{ ...CARD_BASE, borderLeft: `4px solid ${borderColor}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 22,
        }}>
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, color: '#0B3D3A', margin: 0 }}>
            {title}
          </p>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 400, fontSize: 13, color: '#666666', margin: 0 }}>
            {subtitle}
          </p>
        </div>
        {meta && (
          <span style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12,
            color: borderColor, background: iconBg,
            borderRadius: 999, padding: '3px 10px', flexShrink: 0,
          }}>
            {meta}
          </span>
        )}
        <ChevronRight />
      </div>
    </Link>
  )
}

export default function BasicsPage() {
  const { progress: { masteredNotes } } = useProgress()
  const noteCount = masteredNotes.length

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 12px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 24, color: '#0B3D3A', margin: 0 }}>
          Basics
        </p>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 500, fontSize: 14, color: '#666666', margin: '2px 0 0' }}>
          Everything you need to get started
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 16px 24px' }}>
        <Card
          to="/foundations"
          borderColor="#F5A623"
          iconBg="#FFF3E0"
          emoji="🎵"
          title="Foundations"
          subtitle="Learn your first notes and tonguing"
        />
        <Card
          to="/foundations/embouchure"
          borderColor="#A855F7"
          iconBg="#F3E8FF"
          emoji="💋"
          title="Embouchure"
          subtitle="Lip shape, breath support, first sound"
        />
        <Card
          to="/read-music"
          borderColor="#26CCC2"
          iconBg="rgba(106,236,225,0.12)"
          emoji="🎼"
          title="Read Music"
          subtitle="Note names on the staff (EGBDF, FACE)"
        />
        <Card
          to="/fingering-library"
          borderColor="#26CCC2"
          iconBg="rgba(106,236,225,0.12)"
          emoji="👋"
          title="Fingering Library"
          subtitle="All your learned fingerings"
          meta={`${noteCount} note${noteCount !== 1 ? 's' : ''}`}
        />
      </div>
    </div>
  )
}
