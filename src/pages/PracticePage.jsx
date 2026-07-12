import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMicrophone } from '../hooks/useMicrophone'
import { useStreak } from '../hooks/useStreak'
import { useProgress } from '../context/ProgressContext'
import { SONGS } from '../data/songs'
import { isSongUnlocked } from '../utils/entitlements'
import SongScore, { groupIntoMeasures } from '../components/SongScore'
import { FingeringDiagramForNote } from '../components/FingeringDiagrams'
import BadgeToast from '../components/BadgeToast'
import FluteCharacter from '../components/FluteCharacter'
import PaywallCard from '../components/paywall/PaywallCard'

// Two stacked staff lines of 4 bars each = 8 bars per page (the "reads like real
// sheet music" layout the redesign asks for).
const MEASURES_PER_PAGE = 8
const MEASURES_PER_ROW = 4
// Tablet-width screens (iPad portrait ~744–820px) render the practice layout in
// portrait per the CLAUDE.md "portrait + landscape on iPad" rule; only narrower
// phones in portrait get the rotate prompt. (The redesign prompt's own worked
// example says an iPad in portrait should pass, so the threshold sits below 768.)
const PRACTICE_MIN_WIDTH = 700

// Below this viewport height the vertical staff-over-fingering stack can't fit,
// so we switch to a side-by-side layout (music left, fingering + tuning right).
// This is what a landscape phone (iPhone ~375–430px tall) always hits.
const COMPACT_MAX_HEIGHT = 500

// ── Orientation hook ─────────────────────────────────────────
// Returns { mode, compact }:
//   mode    — 'ok' to render practice, 'rotate' to prompt turning the phone
//   compact — true on short landscape phones, where the layout goes two-column
function usePracticeLayoutMode() {
  const compute = () => {
    if (typeof window === 'undefined') return { mode: 'ok', compact: false }
    const w = window.innerWidth
    const h = window.innerHeight
    const landscape = w > h
    if (w >= PRACTICE_MIN_WIDTH) return { mode: 'ok', compact: landscape && h < COMPACT_MAX_HEIGHT }
    if (landscape) return { mode: 'ok', compact: h < COMPACT_MAX_HEIGHT }
    return { mode: 'rotate', compact: false }
  }
  const [state, setState] = useState(compute)
  useEffect(() => {
    const handler = () => setState(compute())
    window.addEventListener('resize', handler)
    window.addEventListener('orientationchange', handler)
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('orientationchange', handler)
    }
  }, [])
  return state
}

// ── Note conversion helpers ──────────────────────────────────
function vexKeyToNoteId(key) {
  const [notePart, octave] = key.split('/')
  const base = notePart[0].toUpperCase()
  const acc = notePart[1] === '#' ? 's' : notePart[1] === 'b' ? 'b' : ''
  return base + acc + octave
}

const VEX_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
function vexKeyToMidi(key) {
  const [notePart, octave] = key.split('/')
  const base = notePart[0].toUpperCase()
  const acc = notePart[1] === '#' ? '#' : notePart[1] === 'b' ? 'b' : ''
  const noteMap = { Db: 'C#', Eb: 'D#', Fb: 'E', Gb: 'F#', Ab: 'G#', Bb: 'A#', Cb: 'B' }
  const noteName = noteMap[base + acc] ?? (base + acc)
  const idx = VEX_NOTE_NAMES.indexOf(noteName)
  if (idx === -1) return null
  return (parseInt(octave, 10) + 1) * 12 + idx
}

function buildNoteToMeasure(notes, beatsPerMeasure) {
  const measures = groupIntoMeasures(notes, beatsPerMeasure)
  const map = []
  measures.forEach((m, mi) => m.forEach(() => map.push(mi)))
  return map
}

// Strip the trailing octave digit for the big note readouts (e.g. "D5" → "D").
function noteName(n) {
  return n ? n.replace(/\d+$/, '') : n
}

// ── Song confetti (v2 palette) ───────────────────────────────
const SONG_CONFETTI = [
  { color: '#FFF57E', left: '8%',  delay: '0ms' },
  { color: '#FFB76C', left: '18%', delay: '80ms' },
  { color: '#6AECE1', left: '30%', delay: '40ms' },
  { color: '#26CCC2', left: '43%', delay: '120ms' },
  { color: '#FFF57E', left: '55%', delay: '20ms' },
  { color: '#FFB76C', left: '66%', delay: '100ms' },
  { color: '#6AECE1', left: '76%', delay: '60ms' },
  { color: '#26CCC2', left: '87%', delay: '140ms' },
  { color: '#FFF57E', left: '22%', delay: '180ms' },
  { color: '#FFB76C', left: '48%', delay: '200ms' },
]

// ── SVG icons (Deep Teal ink) ────────────────────────────────
function ChevronLeftIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0B3D3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B3D3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function MetronomeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B3D3A" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22V12M8 22l4-10 4 10M5 7l7-5 7 5" />
    </svg>
  )
}

// ── Rotate prompt ────────────────────────────────────────────
function RotatePrompt() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'var(--color-page)', padding: 24 }}
    >
      <div
        className="rounded-2xl bg-white p-8 text-center"
        style={{ boxShadow: 'var(--shadow-card)', maxWidth: 320 }}
      >
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'rgba(38, 204, 194, 0.12)' }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#26CCC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="4" width="14" height="24" rx="2" />
            <path d="M14 24 h4" />
            <path d="M3 16 a13 13 0 0 1 13 -13" strokeDasharray="2 2" />
            <path d="M3 16 l3 -3 m-3 3 l3 3" />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-bold" style={{ color: '#0B3D3A' }}>Rotate to landscape</h2>
        <p className="text-sm" style={{ color: '#0B3D3A', lineHeight: 1.5 }}>
          Practice mode works best when your phone is sideways — that way you can see all of the music at once.
        </p>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────
export default function PracticePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { progress: { isPremium, emailUnlocked } } = useProgress()
  const { mode, compact } = usePracticeLayoutMode()

  const [selectedSongId, setSelectedSongId] = useState(() => searchParams.get('song') ?? null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [masteryDots, setMasteryDots] = useState(0)
  const inTuneStartRef = useRef(null)
  const masteryRef = useRef(0)

  const ent = { isPremium, emailUnlocked }
  const playableSongs = useMemo(
    () => SONGS.filter(s => s.notes?.length && isSongUnlocked(s, ent)),
    [isPremium, emailUnlocked]
  )

  const resolvedSongId = selectedSongId && playableSongs.find(s => s.id === selectedSongId)
    ? selectedSongId
    : playableSongs[0]?.id ?? null

  const song = SONGS.find(s => s.id === resolvedSongId) ?? null
  const beatsPerMeasure = song?.beatsPerMeasure ?? 4

  const noteToMeasure = useMemo(
    () => song ? buildNoteToMeasure(song.notes ?? [], beatsPerMeasure) : [],
    [song?.id, beatsPerMeasure]
  )
  const totalMeasures = useMemo(
    () => song ? groupIntoMeasures(song.notes ?? [], beatsPerMeasure).length : 0,
    [song?.id, beatsPerMeasure]
  )
  const totalPages = Math.ceil(totalMeasures / MEASURES_PER_PAGE)
  const currentBar = (noteToMeasure[currentNoteIndex] ?? 0) + 1

  const { note, frequency, cents, isActive, startListening, stopListening, earnedBadge: noteBadge, clearEarnedBadge: clearNoteBadge } = useMicrophone()
  const { recordPractice, earnedBadge: streakBadge, clearEarnedBadge: clearStreakBadge } = useStreak()

  const toastBadge = noteBadge || streakBadge
  const clearToast = noteBadge ? clearNoteBadge : clearStreakBadge

  useEffect(() => {
    setCurrentNoteIndex(0)
    setCurrentPage(0)
    setMasteryDots(0)
    masteryRef.current = 0
    inTuneStartRef.current = null
  }, [resolvedSongId])

  // Sync page to current note
  useEffect(() => {
    if (!noteToMeasure.length) return
    const measure = noteToMeasure[currentNoteIndex] ?? 0
    setCurrentPage(Math.floor(measure / MEASURES_PER_PAGE))
  }, [currentNoteIndex, noteToMeasure])

  // Note advancement (500ms in-tune hold within 70 cents)
  useEffect(() => {
    if (!song || currentNoteIndex >= (song.notes?.length ?? 0)) return
    if (!frequency) {
      inTuneStartRef.current = null
      return
    }
    const expectedMidi = vexKeyToMidi(song.notes[currentNoteIndex].key)
    if (expectedMidi === null) return
    const expectedFreq = 440 * Math.pow(2, (expectedMidi - 69) / 12)
    const rawCents = Math.round(1200 * Math.log2(frequency / expectedFreq))
    const mod = ((rawCents % 1200) + 1200) % 1200
    const centsFromTarget = mod > 600 ? mod - 1200 : mod
    const inTune = Math.abs(centsFromTarget) <= 70

    if (inTune) {
      if (inTuneStartRef.current === null) {
        inTuneStartRef.current = Date.now()
      } else if (Date.now() - inTuneStartRef.current >= 500) {
        inTuneStartRef.current = null
        setMasteryDots(0)
        masteryRef.current = 0
        setCurrentNoteIndex(i => i + 1)
      }
    } else {
      inTuneStartRef.current = null
    }

    // Mastery pip tracking (≤20 cents = in tune for pip display)
    if (Math.abs(cents ?? 999) <= 20) {
      masteryRef.current = Math.min(masteryRef.current + 1, 3)
      setMasteryDots(masteryRef.current)
    }
  }, [frequency, currentNoteIndex, song, cents])

  const songComplete = !!song && currentNoteIndex >= (song.notes?.length ?? 0)
  const expectedNote = song?.notes?.[currentNoteIndex]
  const expectedNoteId = expectedNote ? vexKeyToNoteId(expectedNote.key) : null

  function handleNextSong() {
    const currentIdx = playableSongs.findIndex(s => s.id === resolvedSongId)
    const nextSong = playableSongs[currentIdx + 1]
    if (nextSong) {
      setSelectedSongId(nextSong.id)
    } else {
      setCurrentNoteIndex(0)
      setCurrentPage(0)
    }
  }

  function handleStart() {
    startListening()
    recordPractice()
  }

  function handleStop() {
    stopListening()
    inTuneStartRef.current = null
  }

  const startMeasure = currentPage * MEASURES_PER_PAGE

  if (mode === 'rotate') return <RotatePrompt />

  // Gated deep link — e.g. ?song=<locked song> opened directly. The song
  // picker already filters, so this only catches direct/stale links. A locked
  // FREE song just needs a grown-up's email; anything else needs the purchase.
  const requestedSong = selectedSongId ? SONGS.find(s => s.id === selectedSongId) : null
  if (requestedSong && !isSongUnlocked(requestedSong, ent)) {
    if (requestedSong.free) {
      return (
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100dvh - 7rem)', padding: 16 }}>
          <div
            className="bg-white"
            style={{ width: '100%', maxWidth: 420, borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid #6AECE1', textAlign: 'center', fontFamily: "'Nunito', sans-serif" }}
          >
            <span style={{ fontSize: 40, lineHeight: 1 }}>🔓</span>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#0B3D3A', marginTop: 10 }}>
              “{requestedSong.title}” is a free song
            </p>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#666666', marginTop: 6, lineHeight: 1.5 }}>
              Ask a grown-up to add an email and it opens right up — along with a free song at every level.
            </p>
            <button
              onClick={() => navigate('/unlock-free')}
              className="active:scale-95 transition-transform"
              style={{
                display: 'block', width: '100%', marginTop: 20, padding: '12px 24px', borderRadius: 999, border: 'none',
                background: 'linear-gradient(to right, #26CCC2, #1AA89F)', boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
                color: '#0B3D3A', fontSize: 14, fontWeight: 800, cursor: 'pointer', minHeight: 44,
              }}
            >
              Unlock free songs →
            </button>
          </div>
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100dvh - 7rem)', padding: 16 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <PaywallCard levelName={requestedSong.title} onUnlock={() => navigate('/unlock')} />
        </div>
      </div>
    )
  }

  // Song complete screen
  if (songComplete) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ background: 'var(--color-page)' }}>
        {SONG_CONFETTI.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', top: 0, left: c.left,
              width: 10, height: 10, borderRadius: '50%',
              background: c.color,
              animation: `confetti-fall 1s ease-out ${c.delay} forwards`,
              pointerEvents: 'none',
            }}
          />
        ))}
        <div style={{ background: 'white', borderRadius: 24, padding: '36px 44px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 72, display: 'block', lineHeight: 1.1 }}>🎉</span>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#0B3D3A', marginTop: 12 }}>Song complete!</p>
          <p style={{ fontSize: 14, color: '#666666', marginTop: 4 }}>Great playing — you nailed every note.</p>
          <button
            onClick={handleNextSong}
            className="active:scale-95 transition-transform"
            style={{
              display: 'block', width: '100%', marginTop: 20,
              padding: '12px 32px', borderRadius: 999, border: 'none',
              background: 'var(--grad-primary)',
              boxShadow: 'var(--shadow-primary)',
              color: '#0B3D3A', fontWeight: 800, fontSize: 15, cursor: 'pointer',
            }}
          >
            Next Song →
          </button>
        </div>
        <FluteCharacter mood="complete" />
        <BadgeToast badge={toastBadge} onDismiss={clearToast} />
      </div>
    )
  }

  // ── Inline tuning meter (redesign spec · Screen 2 · D right column) ──
  function TuningMeterInline() {
    const inTune = isActive && cents !== null && Math.abs(cents) <= 20
    const flat   = isActive && cents !== null && cents < -20
    const sharp  = isActive && cents !== null && cents > 20
    const indicatorLeft = cents !== null ? Math.max(5, Math.min(95, 50 + cents)) : 50
    const statusText = inTune ? 'In tune' : flat ? 'Flat' : sharp ? 'Sharp' : isActive ? 'Listening…' : '—'
    const statusBg  = inTune ? '#FFF57E' : '#F1EFE8'
    const statusDot = inTune ? '#0B3D3A' : '#666666'

    return (
      <div>
        {/* Header: detected note + status pill */}
        <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 600, color: '#0B3D3A', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              You're playing
            </p>
            <div className="flex items-baseline gap-1.5" style={{ marginTop: 1 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#0B3D3A', lineHeight: 1 }}>
                {isActive ? (noteName(note) ?? '—') : '—'}
              </span>
              {isActive && cents !== null && (
                <span style={{ fontSize: 11, fontWeight: 600, color: '#0B3D3A' }}>
                  {cents > 0 ? '+' : ''}{cents}¢
                </span>
              )}
            </div>
          </div>
          <div
            className="flex items-center gap-1.5"
            style={{ background: statusBg, borderRadius: 999, padding: '4px 10px' }}
          >
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusDot }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: inTune ? '#0B3D3A' : '#666666' }}>{statusText}</span>
          </div>
        </div>

        {/* Bar */}
        <div style={{ position: 'relative', height: 22, background: '#F1EFE8', borderRadius: 11, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 3, bottom: 3, left: '35%', right: '35%', background: '#FFF57E', borderRadius: 8 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(11,61,58,0.3)' }} />
          <div style={{
            position: 'absolute',
            top: '50%', left: `${indicatorLeft}%`,
            transform: 'translate(-50%, -50%)',
            width: 20, height: 28,
            background: '#26CCC2',
            border: '2.5px solid white',
            borderRadius: 10,
            boxShadow: 'var(--shadow-primary)',
            transition: 'left 0.1s ease',
            opacity: isActive && cents !== null ? 1 : 0.3,
          }} />
        </div>

        {/* Labels */}
        <div className="flex justify-between" style={{ marginTop: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 500, color: '#0B3D3A' }}>Flat</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: '#0B3D3A' }}>In tune</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: '#0B3D3A' }}>Sharp</span>
        </div>

        {/* Pitch correction hint */}
        {isActive && cents !== null && Math.abs(cents) > 20 && (
          <p style={{ fontSize: 9, fontWeight: 500, color: '#666666', marginTop: 6, textAlign: 'center', lineHeight: 1.4 }}>
            {cents < 0 ? 'Faster air · roll flute forward' : 'Slower air · roll flute back'}
          </p>
        )}
      </div>
    )
  }

  const transportOutlineStyle = {
    minHeight: 44, border: '2px solid #26CCC2', background: 'white',
    color: '#0B3D3A', fontSize: 12, fontWeight: 700, cursor: 'pointer',
    padding: 8, borderRadius: 10,
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--color-page)' }}>

      {/* ── Top bar ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between"
        style={{ padding: 'calc(12px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) 8px calc(16px + env(safe-area-inset-left))' }}
      >
        {/* Left: back + song title */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => navigate('/songs')}
            className="flex items-center justify-center rounded-full bg-white active:scale-95 transition-transform flex-shrink-0"
            style={{ width: 44, height: 44, boxShadow: 'var(--shadow-card)', border: 'none', cursor: 'pointer' }}
            aria-label="Back to songs"
          >
            <ChevronLeftIcon />
          </button>
          <div className="min-w-0">
            <p style={{ fontSize: 9, fontWeight: 600, color: '#0B3D3A', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              Now Practicing
            </p>
            <p className="truncate" style={{ fontSize: 14, fontWeight: 700, color: '#0B3D3A', lineHeight: 1.1 }}>
              {song?.title ?? 'Select a song'}
            </p>
          </div>
        </div>

        {/* Centre: bar count */}
        <p className="flex-shrink-0" style={{ fontSize: 10, fontWeight: 600, color: '#0B3D3A', padding: '0 8px' }}>
          Bar {currentBar} / {totalMeasures}
        </p>

        {/* Right: bpm pill + mastery pip + settings */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="flex items-center gap-1.5"
            style={{ background: 'white', borderRadius: 999, padding: '6px 12px', boxShadow: 'var(--shadow-card)' }}
          >
            <MetronomeIcon />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0B3D3A' }}>80 bpm</span>
          </div>

          <div className="flex items-center gap-1.5" style={{ background: 'rgba(255,245,126,0.4)', borderRadius: 999, padding: '6px 10px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i < masteryDots ? '#FFF57E' : 'white',
                border: `1.5px solid ${i < masteryDots ? '#26CCC2' : '#D3D1C7'}`,
                transition: 'background 0.2s ease',
              }} />
            ))}
          </div>

          <button
            className="flex items-center justify-center rounded-full bg-white active:scale-95 transition-transform"
            style={{ width: 44, height: 44, boxShadow: 'var(--shadow-card)', border: 'none', cursor: 'pointer' }}
            aria-label="Settings"
          >
            <GearIcon />
          </button>
        </div>
      </div>

      {/* ── Main grid ──────────────────────────────────────────────
          Roomy (tablet / tall): staff on top (1fr), fingering + tuning below.
          Compact (landscape phone): two columns — music left at full height,
          fingering + tuning stacked in a right rail. There is no bottom nav on
          the /practice route, so no space is reserved for one. */}
      <div
        style={{
          flex: 1, display: 'grid', gap: 10, minHeight: 0,
          ...(compact
            ? { gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gridTemplateRows: 'minmax(0, 1fr)' }
            : { gridTemplateRows: 'minmax(0, 1fr) auto' }),
          padding: '0 calc(14px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(14px + env(safe-area-inset-left))',
        }}
      >

        {/* ── Music staff card (transport lives inside) ── */}
        <div
          className="bg-white flex flex-col"
          style={{ borderRadius: 16, padding: '16px 20px', boxShadow: 'var(--shadow-card)', minHeight: 0 }}
        >
          {/* Two stacked 4-bar staff lines */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <SongScore
              notes={song?.notes ?? []}
              currentNoteIndex={currentNoteIndex}
              beatsPerMeasure={beatsPerMeasure}
              startMeasure={startMeasure}
              measuresPerPage={MEASURES_PER_PAGE}
              measuresPerRow={MEASURES_PER_ROW}
            />
          </div>

          {/* Transport controls */}
          <div className="flex-shrink-0 flex items-center gap-2" style={{ marginTop: 12 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="flex-1 flex items-center justify-center transition-colors hover:brightness-95 active:bg-[#26CCC2] active:text-[#0B3D3A]"
              style={{ ...transportOutlineStyle, opacity: currentPage === 0 ? 0.3 : 1 }}
            >
              ← Prev bar
            </button>

            <button
              onClick={isActive ? handleStop : handleStart}
              className="flex items-center justify-center gap-2 active:scale-95 transition-transform flex-shrink-0"
              style={{
                minHeight: 44, padding: '0 24px', borderRadius: 999, border: 'none',
                background: isActive ? '#F1EFE8' : 'var(--grad-primary)',
                boxShadow: isActive ? 'none' : 'var(--shadow-primary)',
                color: '#0B3D3A',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
              aria-label={isActive ? 'Stop' : 'Play along'}
            >
              {isActive ? (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="#0B3D3A"><rect x="4" y="4" width="16" height="16" rx="2" /></svg> Stop</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="#0B3D3A"><polygon points="5,3 19,12 5,21" /></svg> Play along</>
              )}
            </button>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="flex-1 flex items-center justify-center transition-colors hover:brightness-95 active:bg-[#26CCC2] active:text-[#0B3D3A]"
              style={{ ...transportOutlineStyle, opacity: currentPage >= totalPages - 1 ? 0.3 : 1 }}
            >
              Next bar →
            </button>
          </div>
        </div>

        {/* ── Fingering + tuning ──────────────────────────────────
            Roomy: side by side under the staff. Compact: stacked in the
            right rail (fingering fills, tuning sits below). */}
        <div
          style={{
            display: 'grid', gap: 10, minHeight: 0,
            ...(compact
              ? { gridTemplateRows: 'minmax(0, 1fr) auto' }
              : { gridTemplateColumns: '1.7fr 1fr' }),
          }}
        >

          {/* Fingering card */}
          <div
            className="bg-white flex flex-col"
            style={{ borderRadius: 14, padding: '12px 14px', boxShadow: 'var(--shadow-card)', minHeight: 0, maxHeight: compact ? 'none' : '38vh' }}
          >
            <div className="flex items-baseline justify-between" style={{ marginBottom: 8 }}>
              <div className="flex items-baseline gap-2">
                <span style={{ fontSize: 9, fontWeight: 600, color: '#0B3D3A', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  Fingering
                </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0B3D3A', lineHeight: 1 }}>
                  {expectedNoteId ?? '—'}
                </span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 500, color: '#666666' }}>Updates with each note</span>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, overflow: 'auto' }}>
              {expectedNoteId ? (
                <FingeringDiagramForNote noteId={expectedNoteId} compact />
              ) : (
                <p style={{ fontSize: 12, color: '#D3D1C7', fontWeight: 600 }}>No note</p>
              )}
            </div>
          </div>

          {/* Tuning meter card */}
          <div
            className="bg-white flex flex-col justify-center"
            style={{ borderRadius: 14, padding: '12px 14px', boxShadow: 'var(--shadow-card)', maxHeight: compact ? 'none' : '38vh' }}
          >
            <TuningMeterInline />
          </div>
        </div>
      </div>

      <BadgeToast badge={toastBadge} onDismiss={clearToast} />
    </div>
  )
}
