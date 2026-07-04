import { useRef } from 'react'
import { NOTES } from '../notes.js'

const HAND_COLORS = {
  left: '#2563eb',
  right: '#16a34a',
  thumb: '#37A0FE',
}

// Ghost holes represent physical keys that always exist on the flute but are
// never actively pressed for the notes taught in this app. Rendered in light
// grey so students can see the full key layout of a real instrument.
const GHOST_HOLES = [
  { id: 'lhLeft',  cx: 290, cy: 120, r:  8 },  // small key just left of LH1
  { id: 'lhMid',   cx: 355, cy: 120, r: 18 },  // key between LH1 and LH2 — same size as LH2
  { id: 'trill1',  cx: 466, cy: 120, r: 18 },  // trill key 1 — same size as RH1
  { id: 'trill2',  cx: 502, cy: 120, r: 18 },  // trill key 2 — same size as RH1
  { id: 'foot1',   cx: 720, cy: 146, r: 10 },  // foot joint key 1
  { id: 'foot2',   cx: 754, cy: 146, r: 10 },  // foot joint key 2
]

const HOLES = [
  { id: 'thumbBb', cx: 294, cy: 148, r: 11, role: 'thumb', label: '♭' },
  { id: 'thumb',   cx: 320, cy: 155, r: 18, role: 'thumb', label: 'T' },
  { id: 'l1', cx: 320, cy: 120, role: 'left', label: '1' },
  { id: 'l2', cx: 390, cy: 120, role: 'left', label: '2' },
  { id: 'l3', cx: 430, cy: 120, role: 'left', label: '3' },
  { id: 'lp', cx: 430, cy: 162, r: 12, role: 'left', label: '♯' },  // left-pinky G# key
  { id: 'r1', cx: 540, cy: 120, role: 'right', label: '1' },
  { id: 'r2', cx: 588, cy: 120, role: 'right', label: '2' },
  { id: 'r3', cx: 634, cy: 120, role: 'right', label: '3' },
  { id: 'r4', cx: 680, cy: 146, role: 'right', label: '4' },
]

function getClosedHoles(noteId) {
  const note = NOTES[noteId]
  if (!note) return []
  const fingers = note.fingers
  return HOLES.filter(hole => {
    if (hole.id === 'thumbBb') return !!fingers.thumbBb
    if (hole.id === 'thumb') return fingers.thumb
    if (hole.id === 'l1') return fingers.L1
    if (hole.id === 'l2') return fingers.L2
    if (hole.id === 'l3') return fingers.L3
    if (hole.id === 'lp') return fingers.Lp
    if (hole.id === 'r1') return fingers.R1
    if (hole.id === 'r2') return fingers.R2
    if (hole.id === 'r3') return fingers.R3
    if (hole.id === 'r4') return fingers.Rp
    return false
  }).map(hole => hole.id)
}

function playReferenceTone(audioRef, frequency) {
  if (!frequency) return
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return

  if (!audioRef.current) {
    audioRef.current = new AudioContextClass()
  }

  const ctx = audioRef.current
  const now = ctx.currentTime
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = 'triangle'
  oscillator.frequency.value = frequency
  gainNode.gain.setValueAtTime(0.0001, now)
  gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.02)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + 0.95)
}

function FingeringDiagram({ noteName, tip, closedHoles, variantLabel, showGhostKeys = false }) {
  const audioRef = useRef(null)
  const freq = NOTES[noteName]?.freq
  const displayName = NOTES[noteName]?.label ?? noteName

  // Scale all radii down so every adjacent pair has a visible gap (B4 prototype only).
  // 14/18 ≈ 0.78 gives ~6–7px gaps on the tightest pairs.
  const scaleR = showGhostKeys
    ? (r) => Math.max(5, Math.round(r * 14 / 18))
    : (r) => r

  return (
    <article className="fingering-transition rounded-2xl bg-white p-6 shadow-md">
      {/* Note name */}
      <div className="mb-4">
        <h2
          className="text-3xl font-bold text-[#2D2D2D]"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {displayName}
        </h2>
        {variantLabel && (
          <p
            className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#999999]"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {variantLabel}
          </p>
        )}
      </div>

      {/* Fingering diagram SVG — DO NOT restyle the SVG itself */}
      <div className="rounded-xl bg-[#FAF4EE] p-3">
        <svg
          className="h-auto w-full"
          viewBox={showGhostKeys ? "0 0 800 210" : "0 0 740 210"}
          role="img"
          aria-label={`${noteName} flute fingering`}
        >
          <title>{`${noteName} flute fingering diagram`}</title>
          {/* Flute body tube — extended when ghost keys are shown */}
          <rect x="28" y="92" width={showGhostKeys ? 748 : 690} height="56" rx="28" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" />
          <ellipse cx="72" cy="120" rx="21" ry="16" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.5" />
          <text x="72" y="168" textAnchor="middle" fontSize="18" fill="#334155" fontWeight="700">
            Head joint
          </text>

          <text x="375" y="54" textAnchor="middle" fontSize="26" fill="#1d4ed8" fontWeight="800">
            Left Hand
          </text>
          <text x="587" y="54" textAnchor="middle" fontSize="26" fill="#15803d" fontWeight="800">
            Right Hand
          </text>
          <text x="307" y="190" textAnchor="middle" fontSize="18" fill="#37A0FE" fontWeight="700">
            Thumb
          </text>

          {/* Joint separation lines — head joint | body | foot joint */}
          {showGhostKeys && <>
            <line x1="278" y1="89" x2="278" y2="150" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="660" y1="89" x2="660" y2="150" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />
          </>}

          {/* Ghost holes — G# key (left hand), trill keys, and foot joint keys */}
          {showGhostKeys && GHOST_HOLES.map(hole => (
            <circle
              key={hole.id}
              cx={hole.cx}
              cy={hole.cy}
              r={scaleR(hole.r)}
              fill="#F1F5F9"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
          ))}

          {/* Active finger holes */}
          {HOLES.map((hole) => {
            const isClosed = closedHoles.includes(hole.id)
            const fill = isClosed ? HAND_COLORS[hole.role] : '#ffffff'
            const stroke = HAND_COLORS[hole.role]
            const r = scaleR(hole.r ?? 18)
            return (
              <g key={hole.id}>
                <circle
                  cx={hole.cx}
                  cy={hole.cy}
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="3"
                />
                <text
                  x={hole.cx}
                  y={hole.cy + (r < 14 ? 4 : 6)}
                  textAnchor="middle"
                  fontSize={r < 14 ? 10 : 13}
                  fill={isClosed ? '#ffffff' : stroke}
                  fontWeight="700"
                >
                  {hole.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Beginner tip — grey italic, below diagram */}
      {tip && (
        <p
          className="mt-3 text-sm italic text-[#666666]"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {tip}
        </p>
      )}

      {/* Hear It button */}
      {freq && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => playReferenceTone(audioRef, freq)}
            className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition"
            style={{
              background: '#006EE9',
              fontFamily: "'Nunito', sans-serif",
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0056C7' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#006EE9' }}
          >
            ♪ Hear It
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">Left hand · ♯ = G♯ key</span>
        <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">Right hand</span>
        <span className="rounded-full px-3 py-1 font-semibold" style={{ background: '#F3E8FF', color: '#A855F7' }}>T = main thumb · ♭ = B♭ lever</span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-[#666666]">Filled = closed</span>
      </div>
    </article>
  )
}

export function FingeringDiagramForNote({ noteId }) {
  const noteData = NOTES[noteId]
  if (!noteData) return null
  return (
    <FingeringDiagram
      noteName={noteId}
      tip={noteData.tip}
      closedHoles={getClosedHoles(noteId)}
      variantLabel={noteData.variantLabel}
      showGhostKeys={true}
    />
  )
}

export function B4Diagram() {
  return <FingeringDiagram noteName="B4" tip={NOTES.B4.tip} closedHoles={getClosedHoles('B4')} showGhostKeys={true} />
}

export function A4Diagram() {
  return <FingeringDiagram noteName="A4" tip={NOTES.A4.tip} closedHoles={getClosedHoles('A4')} showGhostKeys={true} />
}

export function G4Diagram() {
  return <FingeringDiagram noteName="G4" tip={NOTES.G4.tip} closedHoles={getClosedHoles('G4')} showGhostKeys={true} />
}

export function C5Diagram() {
  return <FingeringDiagram noteName="C5" tip={NOTES.C5.tip} closedHoles={getClosedHoles('C5')} showGhostKeys={true} />
}

export function D5Diagram() {
  return <FingeringDiagram noteName="D5" tip={NOTES.D5.tip} closedHoles={getClosedHoles('D5')} showGhostKeys={true} />
}
