import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMicrophone } from '../hooks/useMicrophone'
import { useStreak } from '../hooks/useStreak'
import { useProgress } from '../context/ProgressContext'
import { SONGS } from '../data/songs'
import SongScore, { groupIntoMeasures } from '../components/SongScore'
import { FingeringDiagramForNote } from '../components/FingeringDiagrams'
import BadgeToast from '../components/BadgeToast'
import FluteCharacter from '../components/FluteCharacter'

const MEASURES_PER_PAGE = 4
const PRACTICE_MIN_WIDTH = 900

// ── Orientation hook ─────────────────────────────────────────
function usePracticeLayoutMode() {
  const compute = () => {
    if (typeof window === 'undefined') return 'ok'
    const w = window.innerWidth
    const h = window.innerHeight
    if (w >= PRACTICE_MIN_WIDTH) return 'ok'
    if (w > h) return 'ok'
    return 'rotate'
  }
  const [mode, setMode] = useState(compute)
  useEffect(() => {
    const handler = () => setMode(compute())
    window.addEventListener('resize', handler)
    window.addEventListener('orientationchange', handler)
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('orientationchange', handler)
    }
  }, [])
  return mode
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

// ── Song confetti ────────────────────────────────────────────
const SONG_CONFETTI = [
  { color: '#D0FFA3', left: '8%',  delay: '0ms' },
  { color: '#E7A0FE', left: '18%', delay: '80ms' },
  { color: '#83E7FF', left: '30%', delay: '40ms' },
  { color: '#006EE9', left: '43%', delay: '120ms' },
  { color: '#D0FFA3', left: '55%', delay: '20ms' },
  { color: '#E7A0FE', left: '66%', delay: '100ms' },
  { color: '#83E7FF', left: '76%', delay: '60ms' },
  { color: '#006EE9', left: '87%', delay: '140ms' },
  { color: '#D0FFA3', left: '22%', delay: '180ms' },
  { color: '#E7A0FE', left: '48%', delay: '200ms' },
]

// ── SVG icons ────────────────────────────────────────────────
function ChevronLeftIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000180" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function MetronomeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000180" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22V12M8 22l4-10 4 10M5 7l7-5 7 5" />
    </svg>
  )
}

// ── Rotate prompt ────────────────────────────────────────────
function RotatePrompt() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#FAFAF8', padding: 24 }}
    >
      <div
        className="rounded-2xl bg-white p-8 text-center"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxWidth: 320 }}
      >
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'rgba(0, 110, 233, 0.1)' }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#006EE9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="4" width="14" height="24" rx="2" />
            <path d="M14 24 h4" />
            <path d="M3 16 a13 13 0 0 1 13 -13" strokeDasharray="2 2" />
            <path d="M3 16 l3 -3 m-3 3 l3 3" />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-bold" style={{ color: '#000180' }}>Rotate to landscape</h2>
        <p className="text-sm" style={{ color: '#000180', lineHeight: 1.5 }}>
          Practice mode works best when your phone is sideways — that way you can see all of the music at once.
        </p>
      </div>
    </div>
  )
}

// ── Tuning bar ───────────────────────────────────────────────
function TuningBar({ cents, isActive, note }) {
  const inTune = isActive && cents !== null && Math.abs(cents) <= 20
  const flat = isActive && cents !== null && cents < -20
  const sharp = isActive && cents !== null && cents > 20

  const indicatorLeft = cents !== null
    ? Math.max(5, Math.min(95, 50 + cents))
    : 50

  const statusText = inTune ? 'In tune' : flat ? 'Flat' : sharp ? 'Sharp' : '—'
  const statusBg = inTune ? '#D0FFA3' : '#F1EFE8'
  const statusDot = inTune ? '#000180' : '#666666'
  const statusColor = inTune ? '#000180' : '#666666'

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between" style={{ marginBottom: 6 }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#000180', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            You're playing
          </p>
          <div className="flex items-baseline gap-1.5" style={{ marginTop: 1 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#000180', lineHeight: 1 }}>
              {isActive ? (note ?? '—') : '—'}
            </span>
            {isActive && cents !== null && (
              <span style={{ fontSize: 11, fontWeight: 600, color: '#000180' }}>
                {cents > 0 ? '+' : ''}{cents}¢
              </span>
            )}
          </div>
        </div>
        <div
          className="flex items-center gap-1.5"
          style={{
            background: statusBg,
            borderRadius: 999,
            padding: '4px 10px',
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusDot }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: statusColor }}>{statusText}</span>
        </div>
      </div>

      {/* Bar */}
      <div style={{ position: 'relative', height: 22, background: '#F1EFE8', borderRadius: 11, overflow: 'visible' }}>
        <div
          style={{
            position: 'absolute',
            top: 3, bottom: 3,
            left: '35%', right: '35%',
            background: '#D0FFA3',
            borderRadius: 8,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: '50%',
            width: 1,
            background: 'rgba(0,1,128,0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${indicatorLeft}%`,
            transform: 'translate(-50%, -50%)',
            width: 20,
            height: 28,
            background: '#006EE9',
            border: '2.5px solid white',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,110,233,0.35)',
            transition: 'left 0.1s ease',
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between" style={{ marginTop: 4 }}>
        <span style={{ fontSize: 9, fontWeight: 500, color: '#000180' }}>Flat</span>
        <span style={{ fontSize: 9, fontWeight: 500, color: '#000180' }}>In tune</span>
        <span style={{ fontSize: 9, fontWeight: 500, color: '#000180' }}>Sharp</span>
      </div>
    </>
  )
}

// ── Main component ───────────────────────────────────────────
export default function PracticePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { progress: { currentLevel } } = useProgress()
  const mode = usePracticeLayoutMode()

  const [selectedSongId, setSelectedSongId] = useState(() => searchParams.get('song') ?? null)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [masteryDots, setMasteryDots] = useState(0)
  const inTuneStartRef = useRef(null)
  const masteryRef = useRef(0)

  const playableSongs = useMemo(() => SONGS.filter(s => s.notes?.length && s.level <= currentLevel), [currentLevel])

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

  // Song complete screen
  if (songComplete) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ background: '#FAFAF8' }}>
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
          <p style={{ fontSize: 24, fontWeight: 800, color: '#000180', marginTop: 12 }}>Song complete!</p>
          <p style={{ fontSize: 14, color: '#666666', marginTop: 4 }}>Great playing — you nailed every note.</p>
          <button
            onClick={handleNextSong}
            className="active:scale-95 transition-transform"
            style={{
              display: 'block', width: '100%', marginTop: 20,
              padding: '12px 32px', borderRadius: 999, border: 'none',
              background: 'linear-gradient(to right, #006EE9, #0056C7)',
              boxShadow: '0 4px 16px rgba(0,110,233,0.35)',
              color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer',
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

  // Compact tuning bar used inside the right panel
  function CompactTuningBar() {
    const inTune = isActive && cents !== null && Math.abs(cents) <= 20
    const flat   = isActive && cents !== null && cents < -20
    const sharp  = isActive && cents !== null && cents > 20
    const indicatorLeft = cents !== null ? Math.max(5, Math.min(95, 50 + cents)) : 50
    const statusText = inTune ? 'In tune ✓' : flat ? 'Flat' : sharp ? 'Sharp' : isActive ? 'Listening…' : '—'
    const statusColor = inTune ? '#006EE9' : '#666666'

    return (
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
          <div className="flex items-baseline gap-1.5">
            <span style={{ fontSize: 20, fontWeight: 800, color: '#000180', lineHeight: 1 }}>
              {isActive ? (note?.replace(/\d+$/, '') ?? '—') : '—'}
            </span>
            {isActive && cents !== null && (
              <span style={{ fontSize: 10, fontWeight: 600, color: '#000180' }}>
                {cents > 0 ? '+' : ''}{cents}¢
              </span>
            )}
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: statusColor }}>{statusText}</span>
        </div>

        {/* Bar */}
        <div style={{ position: 'relative', height: 16, background: '#F1EFE8', borderRadius: 8 }}>
          <div style={{ position: 'absolute', top: 3, bottom: 3, left: '35%', right: '35%', background: '#D0FFA3', borderRadius: 5 }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(0,1,128,0.25)' }} />
          <div style={{
            position: 'absolute',
            top: '50%', left: `${indicatorLeft}%`,
            transform: 'translate(-50%, -50%)',
            width: 14, height: 22,
            background: '#006EE9',
            border: '2.5px solid white',
            borderRadius: 7,
            boxShadow: '0 2px 8px rgba(0,110,233,0.4)',
            transition: 'left 0.1s ease',
            opacity: isActive && cents !== null ? 1 : 0.25,
          }} />
        </div>

        <div className="flex justify-between" style={{ marginTop: 3 }}>
          <span style={{ fontSize: 9, fontWeight: 500, color: '#000180' }}>Flat</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: '#000180' }}>In tune</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: '#000180' }}>Sharp</span>
        </div>

        {/* Pitch correction hint */}
        {isActive && cents !== null && Math.abs(cents) > 20 && (
          <p style={{ fontSize: 9, fontWeight: 500, color: '#666666', marginTop: 5, textAlign: 'center', lineHeight: 1.4 }}>
            {cents < 0
              ? 'Faster air · roll flute forward'
              : 'Slower air · roll flute back'}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: '#FAFAF8' }}>

      {/* ── Top bar ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between"
        style={{ padding: '10px 14px 6px' }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/songs')}
            className="flex items-center justify-center rounded-full bg-white active:scale-95 transition-transform flex-shrink-0"
            style={{ width: 40, height: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer' }}
            aria-label="Back to songs"
          >
            <ChevronLeftIcon />
          </button>
          <div>
            <p style={{ fontSize: 9, fontWeight: 600, color: '#000180', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              Now Practicing
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#000180', lineHeight: 1.1 }}>
              {song?.title ?? 'Select a song'}
            </p>
          </div>
        </div>

        <p style={{ fontSize: 10, fontWeight: 600, color: '#000180' }}>
          Bar {currentBar} / {totalMeasures}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" style={{ background: 'rgba(208,255,163,0.4)', borderRadius: 999, padding: '5px 9px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i < masteryDots ? '#D0FFA3' : 'white',
                border: `1.5px solid ${i < masteryDots ? '#006EE9' : '#D3D1C7'}`,
                transition: 'background 0.2s ease',
              }} />
            ))}
          </div>
          <button
            className="flex items-center justify-center rounded-full bg-white active:scale-95 transition-transform"
            style={{ width: 40, height: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer' }}
            aria-label="Settings"
          >
            <GearIcon />
          </button>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="flex-1 flex gap-2 min-h-0" style={{ padding: '0 10px calc(70px + env(safe-area-inset-bottom))' }}>

        {/* Left column — music staff (60%) */}
        <div className="flex flex-col" style={{ flex: 3, minWidth: 0 }}>

          {/* Staff card */}
          <div
            className="bg-white flex-1"
            style={{
              borderRadius: 14,
              padding: '10px 12px 8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            <SongScore
              notes={song?.notes ?? []}
              currentNoteIndex={currentNoteIndex}
              beatsPerMeasure={beatsPerMeasure}
              startMeasure={startMeasure}
              measuresPerPage={MEASURES_PER_PAGE}
            />
          </div>

          {/* Transport controls */}
          <div className="flex-shrink-0 flex items-center gap-2" style={{ marginTop: 8 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="flex-1 flex items-center justify-center rounded-xl transition-colors active:bg-[#006EE9] active:text-white"
              style={{
                height: 44, border: '2px solid #006EE9', background: 'white',
                color: '#006EE9', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                opacity: currentPage === 0 ? 0.3 : 1,
              }}
            >
              ← Prev
            </button>

            <button
              onClick={isActive ? handleStop : handleStart}
              className="flex items-center justify-center gap-2 active:scale-95 transition-transform flex-shrink-0"
              style={{
                height: 44, padding: '0 24px', borderRadius: 999, border: 'none',
                background: isActive ? '#F1EFE8' : 'linear-gradient(to right, #006EE9, #0056C7)',
                boxShadow: isActive ? 'none' : '0 4px 16px rgba(0,110,233,0.35)',
                color: isActive ? '#000180' : 'white',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
              aria-label={isActive ? 'Stop' : 'Play along'}
            >
              {isActive ? (
                <><svg width="10" height="10" viewBox="0 0 24 24" fill="#000180"><rect x="4" y="4" width="16" height="16" rx="2" /></svg> Stop</>
              ) : (
                <><svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg> Play along</>
              )}
            </button>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="flex-1 flex items-center justify-center rounded-xl transition-colors active:bg-[#006EE9] active:text-white"
              style={{
                height: 44, border: '2px solid #006EE9', background: 'white',
                color: '#006EE9', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                opacity: currentPage === totalPages - 1 ? 0.3 : 1,
              }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Right column — fingering + tuning (40%) */}
        <div
          className="flex flex-col gap-2"
          style={{ flex: 2, minWidth: 0, overflowY: 'auto' }}
        >
          {/* Fingering diagram — scales naturally to the narrower column width */}
          <div style={{ flexShrink: 0 }}>
            {expectedNoteId ? (
              <FingeringDiagramForNote noteId={expectedNoteId} />
            ) : (
              <div
                className="bg-white flex items-center justify-center"
                style={{ borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minHeight: 80 }}
              >
                <p style={{ fontSize: 12, color: '#D3D1C7', fontWeight: 600 }}>No note</p>
              </div>
            )}
          </div>

          {/* Tuning card */}
          <div
            className="bg-white flex-shrink-0"
            style={{ borderRadius: 14, padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <p style={{ fontSize: 9, fontWeight: 600, color: '#000180', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 8 }}>
              Tuning
            </p>
            <CompactTuningBar />
          </div>
        </div>
      </div>

      <BadgeToast badge={toastBadge} onDismiss={clearToast} />
    </div>
  )
}
