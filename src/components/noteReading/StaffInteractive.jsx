// StaffInteractive — custom SVG interactive music staff (no VexFlow)
// Colours match the app palette from STYLE_GUIDE.md

const ALL_NOTES = [
  // Lines (5) — "Every Good Boy Deserves Fruit"
  { id: 'E4', letter: 'E', mnemonic: 'Every',    y: 120,  isLine: true,  line: 1 },
  { id: 'G4', letter: 'G', mnemonic: 'Good',     y: 105,  isLine: true,  line: 2 },
  { id: 'B4', letter: 'B', mnemonic: 'Boy',      y: 90,   isLine: true,  line: 3 },
  { id: 'D5', letter: 'D', mnemonic: 'Deserves', y: 75,   isLine: true,  line: 4 },
  { id: 'F5', letter: 'F', mnemonic: 'Fruit',    y: 60,   isLine: true,  line: 5 },
  // Spaces (4) — "FACE"
  { id: 'F4', letter: 'F', mnemonic: 'F',        y: 112.5, isLine: false, space: 1 },
  { id: 'A4', letter: 'A', mnemonic: 'A',        y: 97.5,  isLine: false, space: 2 },
  { id: 'C5', letter: 'C', mnemonic: 'C',        y: 82.5,  isLine: false, space: 3 },
  { id: 'E5', letter: 'E', mnemonic: 'E',        y: 67.5,  isLine: false, space: 4 },
]

const NOTE_COLORS = {
  E4: '#6AECE1',
  G4: '#26CCC2',
  B4: '#FFF57E',
  D5: '#FFB76C',
  F5: '#6AECE1',
  F4: '#26CCC2',
  A4: '#FFB76C',
  C5: '#FFF57E',
  E5: '#6AECE1',
}

// Text colour that contrasts with each note's fill colour
const NOTE_TEXT_COLORS = {
  E4: '#0B3D3A',
  G4: '#0B3D3A',
  B4: '#0B3D3A',
  D5: '#0B3D3A',
  F5: '#0B3D3A',
  F4: '#0B3D3A',
  A4: '#0B3D3A',
  C5: '#0B3D3A',
  E5: '#0B3D3A',
}

// Mixed mode: pitch order E4→F4→G4→A4→B4→C5→D5→E5→F5
const MIXED_ORDER = ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5']

const LINES_NOTES  = ALL_NOTES.filter(n => n.isLine)
const SPACES_NOTES = ALL_NOTES.filter(n => !n.isLine)
const MIXED_NOTES  = MIXED_ORDER.map(id => ALL_NOTES.find(n => n.id === id))

function getNoteX(mode, idx) {
  if (mode === 0) return 80 + idx * (330 / 4)        // 80 162 245 327 410
  if (mode === 1) return 100 + idx * (300 / 3)       // 100 200 300 400
  return 60 + idx * (370 / 8)                         // 60 106 152 … 430
}

function getNotesForMode(mode) {
  if (mode === 0) return LINES_NOTES
  if (mode === 1) return SPACES_NOTES
  return MIXED_NOTES
}

// Ledger line needed for E4 (it sits on line 1 which is already drawn, so no
// extra ledger needed). No note in our set sits below the staff or above it
// enough to require ledger lines beyond what the 5 staff lines cover.
// F5 is on line 5 (y=60) — within staff. All notes accounted for.

const STAFF_LINES = [60, 75, 90, 105, 120]

export default function StaffInteractive({ mode, tappedCounts, onNoteTap, activeNoteId }) {
  const notes = getNotesForMode(mode)
  const showMnemonics = mode === 0
  const showSpaceLetters = mode === 1

  // Map a tap anywhere on the staff to the closest note by x-position. This gives
  // each note an unambiguous, full-height hit zone — fixing the mixed-mode case
  // where fixed r=26 circles overlapped (spacing ~46 units < 52 diameter) and taps
  // between two notes were ambiguous.
  function handleTap(e) {
    const r = e.currentTarget.getBoundingClientRect()
    if (!r.width) return
    const svgX = ((e.clientX - r.left) / r.width) * 480
    let nearest = null
    let best = Infinity
    notes.forEach((note, idx) => {
      const d = Math.abs(getNoteX(mode, idx) - svgX)
      if (d < best) { best = d; nearest = note }
    })
    if (nearest) onNoteTap(nearest.id)
  }

  return (
    <>
      <style>{`
        @keyframes noteBubblePop {
          0%   { transform: scale(0.4) translateY(6px); opacity: 0; }
          60%  { transform: scale(1.18) translateY(-3px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes glowPulse {
          0%   { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes noteCheckIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <svg
        viewBox="0 0 480 188"
        style={{ width: '100%', display: 'block', overflow: 'visible' }}
        aria-label="Interactive music staff"
      >
        {/* ── Staff lines ── */}
        {STAFF_LINES.map(y => (
          <line key={y} x1="40" y1={y} x2="445" y2={y} stroke="#CCCCCC" strokeWidth="1.4" />
        ))}

        {/* ── Treble clef ── */}
        <text
          x="38"
          y="130"
          fontSize="88"
          fontFamily="serif"
          fill="#AAAAAA"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          𝄞
        </text>

        {/* ── Notes ── */}
        {notes.map((note, idx) => {
          const x = getNoteX(mode, idx)
          const tapCount = tappedCounts.get(note.id) || 0
          const mastered = tapCount >= 3
          const tappedOnce = tapCount > 0
          const isActive = activeNoteId === note.id

          // Fill colour based on state
          let fill = '#CCCCCC'
          let stroke = '#AAAAAA'
          let strokeWidth = 1.2

          if (mastered) {
            fill = '#FFF57E'
            stroke = '#F0D64E'
            strokeWidth = 1.5
          } else if (isActive) {
            fill = NOTE_COLORS[note.id]
            stroke = '#FFFFFF'
            strokeWidth = 2
          } else if (tappedOnce) {
            // Partially coloured — note colour at reduced opacity via hex with 99
            fill = NOTE_COLORS[note.id]
            stroke = NOTE_COLORS[note.id]
            strokeWidth = 1.2
          }

          // Stem direction: notes at or below middle of staff (y>=90) stem up, above stem down
          const stemUp = note.y >= 90
          const stemX = stemUp ? x + 11 : x - 11
          const stemY1 = stemUp ? note.y - 3 : note.y + 3
          const stemY2 = stemUp ? note.y - 34 : note.y + 34

          return (
            <g key={note.id}>
              {/* Glow ring (only when active) */}
              {isActive && (
                <circle
                  cx={x}
                  cy={note.y}
                  r="20"
                  fill={NOTE_COLORS[note.id]}
                  opacity="0.5"
                  style={{
                    transformOrigin: `${x}px ${note.y}px`,
                    animation: 'glowPulse 0.65s ease-out forwards',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Stem */}
              <line
                x1={stemX}
                y1={stemY1}
                x2={stemX}
                y2={stemY2}
                stroke={mastered ? '#F0D64E' : tappedOnce ? '#888888' : '#CCCCCC'}
                strokeWidth="1.6"
                style={{ pointerEvents: 'none' }}
              />

              {/* Note head (ellipse, slightly tilted) */}
              <ellipse
                cx={x}
                cy={note.y}
                rx="11"
                ry="8"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                transform={`rotate(-15, ${x}, ${note.y})`}
                style={{
                  transition: 'fill 0.25s ease, stroke 0.25s ease',
                  pointerEvents: 'none',
                }}
              />

              {/* Mastery checkmark */}
              {mastered && (
                <text
                  x={x}
                  y={note.y - 24}
                  textAnchor="middle"
                  fontSize="15"
                  fill="#26CCC2"
                  fontFamily="Nunito, sans-serif"
                  fontWeight="700"
                  style={{
                    pointerEvents: 'none',
                    animation: 'noteCheckIn 0.35s ease-out',
                  }}
                >
                  ✓
                </text>
              )}

              {/* Note letter + mnemonic hint below staff (Lines mode only) */}
              {showMnemonics && (
                <>
                  <text
                    x={x}
                    y={153}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill={tappedOnce ? NOTE_COLORS[note.id] : '#CCCCCC'}
                    fontFamily="Nunito, sans-serif"
                    style={{
                      pointerEvents: 'none',
                      transition: 'fill 0.25s ease',
                    }}
                  >
                    {note.letter}
                  </text>
                  <text
                    x={x}
                    y={169}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#BBBBBB"
                    fontFamily="Nunito, sans-serif"
                    style={{ pointerEvents: 'none' }}
                  >
                    {note.mnemonic}
                  </text>
                </>
              )}

              {/* FACE letter below note (Spaces mode only) */}
              {showSpaceLetters && (
                <text
                  x={x}
                  y={155}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill={tappedOnce ? NOTE_COLORS[note.id] : '#CCCCCC'}
                  fontFamily="Nunito, sans-serif"
                  style={{
                    pointerEvents: 'none',
                    transition: 'fill 0.25s ease',
                  }}
                >
                  {note.letter}
                </text>
              )}
            </g>
          )
        })}

        {/* ── Active note name bubble ── */}
        {activeNoteId && (() => {
          const note = ALL_NOTES.find(n => n.id === activeNoteId)
          if (!note) return null
          const notesList = getNotesForMode(mode)
          const idx = notesList.findIndex(n => n.id === activeNoteId)
          if (idx < 0) return null
          const x = getNoteX(mode, idx)
          const bgColor = NOTE_COLORS[activeNoteId]
          const textColor = NOTE_TEXT_COLORS[activeNoteId]

          return (
            <g
              style={{
                transformOrigin: `${x}px 30px`,
                animation: 'noteBubblePop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
              }}
            >
              <circle cx={x} cy={30} r="20" fill={bgColor} />
              <text
                x={x}
                y={36}
                textAnchor="middle"
                fontSize="17"
                fontWeight="800"
                fontFamily="Nunito, sans-serif"
                fill={textColor}
                style={{ pointerEvents: 'none' }}
              >
                {note.letter}
              </text>
            </g>
          )
        })()}

        {/* Nearest-note tap layer — sits on top and routes every tap to the
            closest note, so hit zones never overlap or go ambiguous. */}
        <rect
          x="0"
          y="0"
          width="480"
          height="188"
          fill="transparent"
          onClick={handleTap}
          style={{ cursor: 'pointer', pointerEvents: 'all' }}
          aria-label="Tap the closest note"
        />
      </svg>
    </>
  )
}
