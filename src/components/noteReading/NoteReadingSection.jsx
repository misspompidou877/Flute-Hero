import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import StaffInteractive from './StaffInteractive'
import ModeProgressTabs from './ModeProgressTabs'
import ProgressCounter from './ProgressCounter'
import { playTone } from '../../utils/playTone'

// Frequencies for all 9 notes (playTone.js only exports 5; add the rest here)
const ALL_FREQUENCIES = {
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
}

const TAPS_TO_MASTER = 3

// Which note IDs belong to each mode
const MODE_NOTE_IDS = {
  0: ['E4', 'G4', 'B4', 'D5', 'F5'],   // Lines
  1: ['F4', 'A4', 'C5', 'E5'],          // Spaces
  2: ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5'], // Mixed
}

const MODE_INFO = [
  {
    step: 'Step 1',
    title: 'Line Notes',
    subtitle: 'E · G · B · D · F',
    instruction: 'Tap each note to hear it and learn its name. Tap each one 3 times to master it!',
    emoji: '🎵',
  },
  {
    step: 'Step 2',
    title: 'Space Notes',
    subtitle: 'F · A · C · E',
    instruction: 'Space notes sit between the lines. Tap each one 3 times to learn it!',
    emoji: '🎶',
  },
  {
    step: 'Step 3',
    title: 'All Notes',
    subtitle: 'Can you find them all?',
    instruction: 'All 9 notes together — tap each one 3 times. You\'ve got this!',
    emoji: '⭐',
  },
]

// Safe localStorage helpers
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) ?? fallback
  } catch {
    return fallback
  }
}
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('[NoteReadingSection] localStorage error:', e)
  }
}

// Load persisted state from localStorage
function loadPersistedState() {
  const rawCounts = safeGet('noteReading.tappedCounts', {})
  const tappedCounts = new Map(Object.entries(rawCounts).map(([k, v]) => [k, v]))

  const rawModes = safeGet('noteReading.completedModes', [])
  const completedModes = new Set(rawModes.map(Number))

  const currentMode = safeGet('noteReading.currentMode', 0)

  return { tappedCounts, completedModes, currentMode }
}

// ── Intro screen shown once before the interactive modes ──────────────────────
function NoteReadingIntro({ onDone }) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#FAFAF8',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '680px',
        margin: '0 auto',
        padding: '24px 16px',
        paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        gap: '16px',
      }}
    >
      {/* Title */}
      <div>
        <p style={{
          fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 12,
          color: '#26CCC2', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px',
        }}>
          Note Reading
        </p>
        <h1 style={{
          fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 28,
          color: '#0B3D3A', margin: '0 0 4px', lineHeight: 1.2,
        }}>
          Every note has a name
        </h1>
        <p style={{
          fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 16,
          color: '#666666', margin: 0, lineHeight: 1.5,
        }}>
          Here's how music tells you which note to play.
        </p>
      </div>

      {/* Card 1: The staff */}
      <div style={{
        background: '#FFFFFF', borderRadius: 16, padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
          <span style={{ fontSize: 32, flexShrink: 0 }}>🎼</span>
          <div>
            <p style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 18,
              color: '#0B3D3A', margin: '0 0 6px',
            }}>
              Music is written on 5 lines
            </p>
            <p style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 16,
              color: '#555555', margin: 0, lineHeight: 1.6,
            }}>
              This is called the <strong>staff</strong>. Notes sit either <strong>on</strong> a line or in a <strong>space</strong> between lines.
            </p>
          </div>
        </div>
        {/* Mini staff diagram */}
        <svg viewBox="0 0 300 80" style={{ width: '100%', display: 'block' }}>
          {[15, 27, 39, 51, 63].map((y, i) => (
            <line key={y} x1="10" y1={y} x2="290" y2={y} stroke="#CCCCCC" strokeWidth="1.4" />
          ))}
          {/* Note ON a line */}
          <ellipse cx="100" cy="39" rx="10" ry="7" fill="#26CCC2" transform="rotate(-15,100,39)" />
          <line x1="110" y1="39" x2="110" y2="10" stroke="#26CCC2" strokeWidth="1.5" />
          <text x="100" y="75" textAnchor="middle" fontSize="11" fontFamily="Nunito, sans-serif" fill="#26CCC2" fontWeight="700">on a line</text>
          {/* Note IN a space */}
          <ellipse cx="210" cy="45" rx="10" ry="7" fill="#FFB76C" transform="rotate(-15,210,45)" />
          <line x1="220" y1="45" x2="220" y2="16" stroke="#FFB76C" strokeWidth="1.5" />
          <text x="210" y="75" textAnchor="middle" fontSize="11" fontFamily="Nunito, sans-serif" fill="#FFB76C" fontWeight="700">in a space</text>
        </svg>
      </div>

      {/* Card 2: Position = name */}
      <div style={{
        background: '#FFFFFF', borderRadius: 16, padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
          <span style={{ fontSize: 32, flexShrink: 0 }}>📍</span>
          <div>
            <p style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 18,
              color: '#0B3D3A', margin: '0 0 6px',
            }}>
              Where it sits = what it's called
            </p>
            <p style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 16,
              color: '#555555', margin: 0, lineHeight: 1.6,
            }}>
              Each position on the staff has its own letter name — <strong>A, B, C, D, E, F or G</strong>. Move the note up or down and its name changes.
            </p>
          </div>
        </div>
        {/* Ascending notes A B C D E */}
        <svg viewBox="0 0 300 90" style={{ width: '100%', display: 'block' }}>
          {[20, 32, 44, 56, 68].map(y => (
            <line key={y} x1="10" y1={y} x2="290" y2={y} stroke="#CCCCCC" strokeWidth="1.4" />
          ))}
          {[
            { x: 50,  y: 68, letter: 'E', color: '#6AECE1', textColor: '#0B3D3A' },
            { x: 100, y: 62, letter: 'F', color: '#26CCC2', textColor: '#0B3D3A' },
            { x: 150, y: 56, letter: 'G', color: '#FFF57E', textColor: '#0B3D3A' },
            { x: 200, y: 50, letter: 'A', color: '#FFB76C', textColor: '#0B3D3A' },
            { x: 250, y: 44, letter: 'B', color: '#6AECE1', textColor: '#0B3D3A' },
          ].map(({ x, y, letter, color, textColor }) => (
            <g key={letter + x}>
              <ellipse cx={x} cy={y} rx="10" ry="7" fill={color} transform={`rotate(-15,${x},${y})`} />
              <line x1={x + 10} y1={y} x2={x + 10} y2={y - 26} stroke={color} strokeWidth="1.5" />
              <text x={x} y={y + 18} textAnchor="middle" fontSize="13" fontFamily="Nunito, sans-serif" fill={color} fontWeight="800">{letter}</text>
            </g>
          ))}
          <text x="150" y="88" textAnchor="middle" fontSize="10" fontFamily="Nunito, sans-serif" fill="#AAAAAA">higher up = higher sound</text>
        </svg>
      </div>

      {/* Card 3: Why it matters */}
      <div style={{
        background: '#FFFFFF', borderRadius: 16, padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <span style={{ fontSize: 32, flexShrink: 0 }}>💡</span>
          <div>
            <p style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 18,
              color: '#0B3D3A', margin: '0 0 6px',
            }}>
              The name tells you which key to press
            </p>
            <p style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 16,
              color: '#555555', margin: 0, lineHeight: 1.6,
            }}>
              Once you know a note's name, you know exactly which fingering to use on your flute. That's why reading music is so powerful — the dots on the page tell your fingers what to do!
            </p>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={onDone}
        style={{
          width: '100%', height: 56, borderRadius: 28, border: 'none',
          background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
          color: '#0B3D3A', fontFamily: 'Nunito, sans-serif',
          fontWeight: 700, fontSize: 20, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
          marginTop: 8,
        }}
      >
        Show me the notes →
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function NoteReadingSection({ onComplete }) {
  const navigate = useNavigate()

  const [showIntro, setShowIntro] = useState(() => safeGet('noteReading.introDone', false) !== true)

  const [currentMode, setCurrentMode] = useState(() => loadPersistedState().currentMode)
  const [completedModes, setCompletedModes] = useState(() => loadPersistedState().completedModes)
  const [tappedCounts, setTappedCounts] = useState(() => loadPersistedState().tappedCounts)
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [modeJustCompleted, setModeJustCompleted] = useState(false)
  const [allDone, setAllDone] = useState(() => {
    const { completedModes } = loadPersistedState()
    return completedModes.has(0) && completedModes.has(1) && completedModes.has(2)
  })

  // Persist tappedCounts whenever it changes
  useEffect(() => {
    const obj = {}
    tappedCounts.forEach((v, k) => { obj[k] = v })
    safeSet('noteReading.tappedCounts', obj)
  }, [tappedCounts])

  // Persist completedModes whenever it changes
  useEffect(() => {
    safeSet('noteReading.completedModes', Array.from(completedModes))
  }, [completedModes])

  // Persist currentMode
  useEffect(() => {
    safeSet('noteReading.currentMode', currentMode)
  }, [currentMode])

  // Check if current mode is now mastered after tappedCounts changes
  useEffect(() => {
    const modeNoteIds = MODE_NOTE_IDS[currentMode]
    const allMastered = modeNoteIds.every(id => (tappedCounts.get(id) || 0) >= TAPS_TO_MASTER)

    if (allMastered && !completedModes.has(currentMode)) {
      const updated = new Set([...completedModes, currentMode])
      setCompletedModes(updated)
      // Small delay so the last note's animation plays before the completion banner
      setTimeout(() => {
        if (updated.has(0) && updated.has(1) && updated.has(2)) {
          setAllDone(true)
        } else {
          setModeJustCompleted(true)
        }
      }, 700)
    }
  }, [tappedCounts, currentMode, completedModes])

  const handleNoteTap = useCallback((noteId) => {
    setTappedCounts(prev => {
      const next = new Map(prev)
      next.set(noteId, (prev.get(noteId) || 0) + 1)
      return next
    })
    setActiveNoteId(noteId)
    setTimeout(() => setActiveNoteId(null), 800)

    const freq = ALL_FREQUENCIES[noteId]
    if (freq) playTone(freq, 0.7)
  }, [])

  const handleModeSelect = useCallback((mode) => {
    if (mode === currentMode) return
    setCurrentMode(mode)
    setModeJustCompleted(false)
    setActiveNoteId(null)
  }, [currentMode])

  const isLocked = useCallback((mode) => {
    if (mode === 0) return false
    if (mode === 1) return !completedModes.has(0)
    if (mode === 2) return !completedModes.has(1)
    return true
  }, [completedModes])

  const handleNextMode = useCallback(() => {
    const next = currentMode + 1
    if (next <= 2) {
      setCurrentMode(next)
      setModeJustCompleted(false)
    }
  }, [currentMode])

  const modeNoteIds = MODE_NOTE_IDS[currentMode]
  const masteredInMode = modeNoteIds.filter(id => (tappedCounts.get(id) || 0) >= TAPS_TO_MASTER).length

  const info = MODE_INFO[currentMode]
  const canGoNext = completedModes.has(currentMode) && currentMode < 2 && !isLocked(currentMode + 1)

  if (showIntro) {
    return (
      <NoteReadingIntro
        onDone={() => {
          safeSet('noteReading.introDone', true)
          setShowIntro(false)
        }}
      />
    )
  }

  return (
    <>
      <style>{`
        @keyframes sectionFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes completionPop {
          0%   { opacity: 0; transform: scale(0.88) translateY(8px); }
          60%  { transform: scale(1.04) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes nextBtnFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div
        style={{
          minHeight: '100dvh',
          background: '#FAFAF8',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '680px',
          margin: '0 auto',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* ── Header card ── */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '0 0 24px 24px',
            padding: '20px 20px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            marginBottom: '16px',
          }}
        >
          {/* Back button + title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <button
              onClick={() => navigate('/foundations')}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '2px solid #EEEEEE',
                background: '#FFFFFF',
                color: '#666666',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-label="Back to Foundations"
            >
              ←
            </button>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800,
                  fontSize: '26px',
                  color: '#0B3D3A',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Reading Music
              </h1>
              <p
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#888888',
                  margin: '2px 0 0',
                }}
              >
                Tap each note to learn its name
              </p>
            </div>
          </div>

          {/* Mode tabs */}
          <ModeProgressTabs
            currentMode={currentMode}
            completedModes={completedModes}
            onModeSelect={handleModeSelect}
            isLocked={isLocked}
          />
        </div>

        {/* ── Content area ── */}
        <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Mode heading card */}
          <div
            key={currentMode}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px 20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              animation: 'sectionFadeUp 0.3s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '24px' }}>{info.emoji}</span>
              <div>
                <div
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#26CCC2',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {info.step}
                </div>
                <div
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 800,
                    fontSize: '20px',
                    color: '#0B3D3A',
                    lineHeight: 1.2,
                  }}
                >
                  {info.title} — <span style={{ color: '#26CCC2' }}>{info.subtitle}</span>
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                color: '#666666',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {info.instruction}
            </p>
          </div>

          {/* Interactive staff card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px 12px 8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <StaffInteractive
              mode={currentMode}
              tappedCounts={tappedCounts}
              onNoteTap={handleNoteTap}
              activeNoteId={activeNoteId}
            />
          </div>

          {/* Progress counter row */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ProgressCounter
              learned={masteredInMode}
              total={modeNoteIds.length}
            />
          </div>

          {/* Mode completed banner */}
          {modeJustCompleted && completedModes.has(currentMode) && (
            <div
              style={{
                background: '#FFF57E',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                animation: 'completionPop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>
                {currentMode === 0 ? '🎵' : currentMode === 1 ? '🎶' : '⭐'}
              </div>
              <div
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800,
                  fontSize: '22px',
                  color: '#0B3D3A',
                  marginBottom: '4px',
                }}
              >
                {currentMode === 0
                  ? 'Line notes mastered!'
                  : currentMode === 1
                  ? 'Space notes mastered!'
                  : 'All notes mastered!'}
              </div>
              <p
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#0B3D3A',
                  margin: 0,
                }}
              >
                {currentMode < 2
                  ? 'Great work! Ready for the next step?'
                  : 'You know every note on the staff!'}
              </p>
            </div>
          )}

          {/* Next step button */}
          {canGoNext && modeJustCompleted && (
            <button
              onClick={handleNextMode}
              style={{
                width: '100%',
                height: '56px',
                borderRadius: '28px',
                border: 'none',
                background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
                color: '#0B3D3A',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
                animation: 'nextBtnFadeIn 0.4s ease-out',
              }}
            >
              {currentMode === 0 ? 'Learn Space Notes →' : 'Try All Notes →'}
            </button>
          )}

          {/* All done celebration */}
          {allDone && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                animation: 'completionPop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
              }}
            >
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🌟</div>
              <div
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800,
                  fontSize: '26px',
                  color: '#0B3D3A',
                  marginBottom: '8px',
                }}
              >
                Amazing! You know all 9 notes!
              </div>
              <p
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 600,
                  fontSize: '17px',
                  color: '#666666',
                  marginBottom: '28px',
                }}
              >
                You can read music on the treble clef. Time for a quiz!
              </p>
              <button
                onClick={onComplete}
                style={{
                  width: '100%',
                  height: '56px',
                  borderRadius: '28px',
                  border: 'none',
                  background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
                  color: '#0B3D3A',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                  fontSize: '20px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
                }}
              >
                Let's learn about rhythm! →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
