import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SONGS } from '../data/songs'
import { useProgress } from '../context/ProgressContext'

const LEVEL_INFO = {
  1: {
    name: 'First Breath',
    notes: 'B · A · G',
    colour: '#006EE9',
    lightBg: 'rgba(0,110,233,0.08)',
    emoji: '🌱',
  },
  2: {
    name: 'Finding My Voice',
    notes: 'B · A · G · C · D',
    colour: '#22C55E',
    lightBg: 'rgba(34,197,94,0.08)',
    emoji: '🌿',
  },
  3: {
    name: 'Middle Path',
    notes: '…+ B♭ · E · F · F♯',
    colour: '#F5A623',
    lightBg: 'rgba(245,166,35,0.08)',
    emoji: '🌻',
  },
  4: {
    name: 'Reaching Higher',
    notes: '…+ G5 · A5 · B♭5 · B5 · C6',
    colour: '#A855F7',
    lightBg: 'rgba(168,85,247,0.08)',
    emoji: '🎇',
  },
  5: {
    name: 'Taking Flight',
    notes: '…+ low E · F · F♯',
    colour: '#E7A0FE',
    lightBg: 'rgba(231,160,254,0.08)',
    emoji: '🦋',
  },
  6: {
    name: 'Sharps & Flats',
    notes: '…+ C♯ · E♭',
    colour: '#00C5E5',
    lightBg: 'rgba(0,197,229,0.10)',
    emoji: '🎨',
  },
  7: {
    name: 'Filling the Gaps',
    notes: '…+ G♯ / A♭',
    colour: '#B8E600',
    lightBg: 'rgba(184,230,0,0.12)',
    emoji: '🌈',
  },
  8: {
    name: 'Sky High',
    notes: '…+ high C♯ · D',
    colour: '#000180',
    lightBg: 'rgba(0,1,128,0.07)',
    emoji: '🚀',
  },
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  )
}

export default function SongsPage() {
  const navigate = useNavigate()
  const { progress: { currentLevel } } = useProgress()

  // Cap display level at 8; treat 99 (dev override) as all unlocked
  const unlockedUpTo = Math.min(currentLevel, 8)

  const [selectedLevel, setSelectedLevel] = useState(() => Math.min(unlockedUpTo, 1) || 1)

  const songsByLevel = useMemo(() => {
    const map = {}
    for (let i = 1; i <= 8; i++) map[i] = SONGS.filter(s => s.level === i)
    return map
  }, [])

  const info = LEVEL_INFO[selectedLevel]
  const songsInLevel = songsByLevel[selectedLevel] ?? []
  const isLevelLocked = selectedLevel > unlockedUpTo

  return (
    <div className="flex flex-col" style={{ minHeight: '100%' }}>

      {/* Page header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#000180', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          Songs
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#000180', marginTop: 2 }}>
          Choose a Level
        </h1>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#666666', marginTop: 2 }}>
          Tap a level to see its songs, then hit Practice to start.
        </p>
      </div>

      {/* Level selector — horizontal scroll if needed */}
      <div
        className="flex gap-2"
        style={{ overflowX: 'auto', paddingBottom: 4, marginBottom: 16, scrollbarWidth: 'none' }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map(lvl => {
          const lvlInfo = LEVEL_INFO[lvl]
          const locked = lvl > unlockedUpTo
          const active = selectedLevel === lvl
          return (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className="flex-shrink-0 flex flex-col items-center active:scale-95 transition-transform"
              style={{
                minWidth: 80,
                padding: '10px 12px',
                borderRadius: 14,
                border: active ? `2px solid ${lvlInfo.colour}` : '2px solid transparent',
                background: active ? lvlInfo.lightBg : 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                cursor: 'pointer',
                opacity: locked ? 0.5 : 1,
              }}
              aria-label={`Level ${lvl}: ${lvlInfo.name}`}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{locked ? '🔒' : lvlInfo.emoji}</span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: active ? lvlInfo.colour : '#000180',
                marginTop: 4,
                lineHeight: 1,
              }}>
                Level {lvl}
              </span>
              <span style={{
                fontSize: 9,
                fontWeight: 500,
                color: active ? lvlInfo.colour : '#666666',
                marginTop: 2,
                lineHeight: 1,
              }}>
                {lvlInfo.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Level info banner */}
      <div
        style={{
          borderRadius: 14,
          padding: '12px 16px',
          background: isLevelLocked ? 'rgba(211,209,199,0.3)' : info.lightBg,
          border: `1.5px solid ${isLevelLocked ? '#D3D1C7' : info.colour}`,
          marginBottom: 14,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p style={{
              fontSize: 13,
              fontWeight: 800,
              color: isLevelLocked ? '#999999' : info.colour,
              lineHeight: 1,
            }}>
              Level {selectedLevel} — {info.name}
            </p>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#666666', marginTop: 4 }}>
              Notes: {info.notes}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#000180' }}>
              {songsInLevel.length} songs
            </p>
            {isLevelLocked && (
              <p style={{ fontSize: 10, fontWeight: 500, color: '#999999', marginTop: 2 }}>
                Master more notes to unlock
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Song list */}
      {isLevelLocked ? (
        <div
          className="flex flex-col items-center justify-center bg-white"
          style={{ borderRadius: 16, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}
        >
          <span style={{ fontSize: 40, lineHeight: 1 }}>🔒</span>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#000180', marginTop: 12 }}>
            Level {selectedLevel} is locked
          </p>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#666666', marginTop: 6, lineHeight: 1.5 }}>
            Keep practising your current notes to unlock these songs.
          </p>
          <button
            onClick={() => navigate('/practice')}
            className="active:scale-95 transition-transform"
            style={{
              marginTop: 16,
              padding: '10px 24px',
              borderRadius: 999,
              border: 'none',
              background: 'linear-gradient(to right, #006EE9, #0056C7)',
              boxShadow: '0 4px 16px rgba(0,110,233,0.35)',
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go to Practice →
          </button>
        </div>
      ) : songsInLevel.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center bg-white"
          style={{ borderRadius: 16, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}
        >
          <span style={{ fontSize: 40, lineHeight: 1 }}>{info.emoji}</span>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#000180', marginTop: 12 }}>
            New notes, songs coming soon
          </p>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#666666', marginTop: 6, lineHeight: 1.5 }}>
            Practise these notes in the Fingering Library while we add songs for this level.
          </p>
          <button
            onClick={() => navigate('/fingering')}
            className="active:scale-95 transition-transform"
            style={{
              marginTop: 16,
              padding: '10px 24px',
              borderRadius: 999,
              border: 'none',
              background: `linear-gradient(to right, ${info.colour}, ${info.colour}cc)`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Open Fingering Library →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {songsInLevel.map((song, i) => (
            <div
              key={song.id}
              className="bg-white flex items-center gap-3"
              style={{
                borderRadius: 14,
                padding: '14px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}
            >
              {/* Number badge */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: info.lightBg,
                  border: `1.5px solid ${info.colour}`,
                  fontSize: 13,
                  fontWeight: 800,
                  color: info.colour,
                }}
              >
                {i + 1}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#000180',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {song.title}
                </p>
                {song.description && (
                  <p style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: '#666666',
                    marginTop: 2,
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {song.description}
                  </p>
                )}
                {song.beatsPerMeasure === 3 && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    color: info.colour,
                    background: info.lightBg,
                    borderRadius: 4,
                    padding: '2px 6px',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase',
                  }}>
                    3/4 waltz
                  </span>
                )}
              </div>

              {/* Practice button */}
              <button
                onClick={() => navigate(`/practice?song=${song.id}`)}
                className="flex items-center justify-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform"
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  padding: '0 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: `linear-gradient(to right, ${info.colour}, ${info.colour}cc)`,
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                aria-label={`Practice ${song.title}`}
              >
                <PlayIcon />
                Practice
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
