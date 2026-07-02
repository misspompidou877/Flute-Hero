import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'

// The 5 beginner target notes shown in Foundations
const FOUNDATIONS_NOTES = ['B4', 'A4', 'G4', 'C5', 'D5']

// Line notes for the mnemonic preview (Every Good Boy Deserves Fruit)
const LINE_BUBBLES = [
  { letter: 'E', color: '#42A5F5' },
  { letter: 'G', color: '#66BB6A' },
  { letter: 'B', color: '#AB47BC' },
  { letter: 'D', color: '#F5A623' },
  { letter: 'F', color: '#EF5350' },
]

function ChevronRight({ color = '#CCCCCC' }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="9,18 15,12 9,6" />
    </svg>
  )
}

// ── Card 1: Foundations ───────────────────────────────────────────────────────
function FoundationsCard({ masteredNotes }) {
  const masteredCount = FOUNDATIONS_NOTES.filter(n => masteredNotes.includes(n)).length
  const pct = (masteredCount / FOUNDATIONS_NOTES.length) * 100

  return (
    <Link to="/foundations" style={{ display: 'block', textDecoration: 'none' }}>
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          borderLeft: '4px solid #F5A623',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: 16,
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#FFF3E0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 20,
          }}>
            🎵
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, color: '#2D2D2D', margin: 0 }}>
              Foundations
            </p>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 400, fontSize: 13, color: '#666666', margin: 0 }}>
              Learn your first notes
            </p>
          </div>
          <ChevronRight />
        </div>

      </div>
    </Link>
  )
}

// ── Card 2: Read Music ────────────────────────────────────────────────────────
function ReadMusicCard({ isUnlocked }) {
  const navigate = useNavigate()
  const [shaking, setShaking] = useState(false)

  function handleTap() {
    if (isUnlocked) {
      navigate('/read-music')
    } else {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleTap() }}
      className={shaking ? 'rm-shake' : ''}
      style={{
        background: 'white',
        borderRadius: 16,
        borderLeft: '4px solid #4CAF50',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: 16,
        cursor: 'pointer',
        opacity: isUnlocked ? 1 : 0.7,
        userSelect: 'none',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#E8F5E9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 20,
        }}>
          🎼
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, color: '#2D2D2D', margin: 0 }}>
            Read Music
          </p>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 400, fontSize: 13, color: '#666666', margin: 0 }}>
            Note names on the staff
          </p>
        </div>
        {isUnlocked ? (
          <span style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            color: '#4CAF50',
            flexShrink: 0,
          }}>
            Unlocked ✓
          </span>
        ) : (
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
        )}
        {isUnlocked && <ChevronRight />}
      </div>

      {/* Mnemonic preview (unlocked) or locked message */}
      {isUnlocked ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {LINE_BUBBLES.map(({ letter, color }) => (
              <div
                key={letter}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800,
                  fontSize: 13,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 400,
            fontSize: 11,
            color: '#999999',
            margin: '5px 0 0',
            fontStyle: 'italic',
          }}>
            Every Good Boy Deserves Fruit
          </p>
        </div>
      ) : (
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 400,
          fontSize: 13,
          color: '#999999',
          fontStyle: 'italic',
          margin: '8px 0 0',
        }}>
          Complete Foundations to unlock 🎵
        </p>
      )}
    </div>
  )
}

// ── Card 3: Fingering Library ─────────────────────────────────────────────────
function FingeringLibraryCard({ masteredNotes }) {
  const noteCount = masteredNotes.length

  return (
    <Link to="/fingering-library" style={{ display: 'block', textDecoration: 'none' }}>
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          borderLeft: '4px solid #42A5F5',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: 16,
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#E3F2FD',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 20,
          }}>
            👋
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, color: '#2D2D2D', margin: 0 }}>
              Fingering Library
            </p>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 400, fontSize: 13, color: '#666666', margin: 0 }}>
              All your learned fingerings
            </p>
          </div>
          <div style={{
            background: '#E3F2FD',
            borderRadius: 999,
            padding: '3px 10px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            color: '#42A5F5',
            flexShrink: 0,
          }}>
            {noteCount} note{noteCount !== 1 ? 's' : ''}
          </div>
          <ChevronRight />
        </div>

        {/* Note pills */}
        <div style={{ marginTop: 10 }}>
          {noteCount > 0 ? (
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
              {masteredNotes.map(noteId => (
                <div
                  key={noteId}
                  style={{
                    height: 28,
                    borderRadius: 8,
                    padding: '0 8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#FFF8EE',
                    border: '1px solid #F5A623',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 600,
                    fontSize: 12,
                    color: '#E8832A',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {noteId}
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 400,
              fontSize: 13,
              color: '#999999',
              fontStyle: 'italic',
              margin: 0,
            }}>
              No notes yet — start Foundations!
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── BasicsSection ─────────────────────────────────────────────────────────────
export default function BasicsSection() {
  const { progress: { masteredNotes } } = useProgress()

  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem('flutehero_basics_expanded') !== 'false'
    } catch {
      return true
    }
  })

  function toggleOpen() {
    const next = !isOpen
    setIsOpen(next)
    try { localStorage.setItem('flutehero_basics_expanded', String(next)) } catch { /* ignore */ }
  }

  const isReadMusicUnlocked = true  // always accessible — no prerequisites

  return (
    <div>
      {/* Section header */}
      <button
        onClick={toggleOpen}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            color: '#2D2D2D',
          }}>
            My Learning
          </span>
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{
              transition: 'transform 300ms ease',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </div>
        {/* Amber underline */}
        <div style={{ height: 2, background: '#F5A623', borderRadius: 1, marginTop: 4 }} />
      </button>

      {/* Collapsible cards */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? 1200 : 0,
          transition: 'max-height 300ms ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <FoundationsCard masteredNotes={masteredNotes} />
        <ReadMusicCard isUnlocked={isReadMusicUnlocked} />
        <FingeringLibraryCard masteredNotes={masteredNotes} />
      </div>
    </div>
  )
}
