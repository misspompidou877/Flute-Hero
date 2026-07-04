import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMicrophone } from '../hooks/useMicrophone'
import { useProgress } from '../context/ProgressContext'
import { FingeringDiagramForNote } from '../components/FingeringDiagrams'
import { playTone } from '../utils/playTone'
import { NOTES } from '../notes'
import BadgeToast from '../components/BadgeToast'

const ALL_NOTES_ORDERED = ['B4', 'A4', 'G4', 'C5', 'D5', 'E5', 'F5', 'Bb4', 'A5', 'B5', 'C6', 'E4', 'F4']

const NOTE_SUBTITLES = {
  B4: 'Si — your first note',
  A4: 'La — one step lower',
  G4: 'Sol — a low and rich sound',
  C5: 'Do — just above middle C',
  D5: 'Re — fifth above middle C',
  E5: 'Mi — bright and clear',
  F5: 'Fa — needs a careful embouchure',
  Bb4: 'Si flat — watch the B♭ key',
  A5: 'La — upper octave',
  B5: 'Si — reaching up high',
  C6: 'Do — top of the beginner range',
  E4: 'Mi — the lowest notes',
  F4: 'Fa — almost the lowest',
}

function BackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000180" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function TuningBar({ cents, isActive }) {
  const inTune = isActive && cents !== null && Math.abs(cents) <= 20
  const close = isActive && cents !== null && Math.abs(cents) <= 40 && !inTune
  const off = isActive && cents !== null && Math.abs(cents) > 40

  const indicatorLeft = cents !== null
    ? Math.max(5, Math.min(95, 50 + cents))
    : 50

  const indicatorColor = inTune ? '#006EE9' : close ? '#006EE9' : off ? '#006EE9' : '#D3D1C7'

  const statusText = !isActive
    ? 'Listening...'
    : cents === null
    ? 'Listening...'
    : inTune
    ? 'Hold steady'
    : cents < 0
    ? 'A bit flat'
    : 'A bit sharp'

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#000180', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          Your Turn
        </p>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#666666' }}>{statusText}</p>
      </div>

      {/* Bar */}
      <div
        style={{
          position: 'relative',
          height: 22,
          background: '#F1EFE8',
          borderRadius: 11,
          overflow: 'visible',
        }}
      >
        {/* In-tune zone */}
        <div
          style={{
            position: 'absolute',
            top: 3,
            bottom: 3,
            left: '35%',
            right: '35%',
            background: '#D0FFA3',
            borderRadius: 8,
          }}
        />
        {/* Centre line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: 1,
            background: 'rgba(0,1,128,0.3)',
          }}
        />
        {/* Indicator pill */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${indicatorLeft}%`,
            transform: 'translate(-50%, -50%)',
            width: 20,
            height: 28,
            background: indicatorColor,
            border: '2.5px solid white',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,110,233,0.35)',
            transition: 'left 0.1s ease',
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between" style={{ marginTop: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#000180' }}>Flat</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#000180' }}>In tune</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#000180' }}>Sharp</span>
      </div>

      {/* Pitch correction hint */}
      {isActive && cents !== null && Math.abs(cents) > 20 && (
        <p style={{ fontSize: 11, fontWeight: 500, color: '#666666', marginTop: 8, textAlign: 'center', lineHeight: 1.4 }}>
          {cents < 0
            ? 'Try faster airflow or roll the flute forward'
            : 'Try slower airflow or roll the flute back'}
        </p>
      )}
    </div>
  )
}

export default function LessonPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { progress, markNoteMastered } = useProgress()
  const { note, cents, isActive, startListening, stopListening, earnedBadge, clearEarnedBadge } = useMicrophone()

  const noteParam = searchParams.get('note')
  const currentNoteId = (noteParam && NOTES[noteParam])
    ? noteParam
    : ALL_NOTES_ORDERED.find(n => !progress.masteredNotes.includes(n)) ?? 'B4'

  const noteData = NOTES[currentNoteId]
  const noteLabel = noteData?.label ?? currentNoteId.replace(/\d/, '')
  const noteOctave = currentNoteId.match(/\d/)?.[0] ?? ''
  const subtitle = NOTE_SUBTITLES[currentNoteId] ?? ''

  const noteIndex = ALL_NOTES_ORDERED.indexOf(currentNoteId)
  const totalNotes = ALL_NOTES_ORDERED.length

  const [masteryDots, setMasteryDots] = useState(0)
  const inTuneStartRef = useRef(null)
  const consecutiveRef = useRef(0)

  // Reset mastery state when note changes
  useEffect(() => {
    setMasteryDots(0)
    inTuneStartRef.current = null
    consecutiveRef.current = 0
  }, [currentNoteId])

  // Mastery tracking: 3 × 500ms in-tune holds
  useEffect(() => {
    if (!isActive) {
      inTuneStartRef.current = null
      return
    }
    if (cents === null) {
      inTuneStartRef.current = null
      return
    }

    if (Math.abs(cents) <= 20) {
      if (inTuneStartRef.current === null) {
        inTuneStartRef.current = Date.now()
      } else if (Date.now() - inTuneStartRef.current >= 500) {
        inTuneStartRef.current = null
        consecutiveRef.current = Math.min(consecutiveRef.current + 1, 3)
        setMasteryDots(consecutiveRef.current)
        if (consecutiveRef.current >= 3) {
          consecutiveRef.current = 0
          markNoteMastered(currentNoteId)
        }
      }
    } else {
      if (consecutiveRef.current > 0) {
        consecutiveRef.current = 0
        setMasteryDots(0)
      }
      inTuneStartRef.current = null
    }
  }, [cents, isActive, currentNoteId, markNoteMastered])

  function handleHearNote() {
    if (noteData?.freq) {
      playTone(noteData.freq, 1.2)
    }
  }

  function handleToggleMic() {
    if (isActive) stopListening()
    else startListening()
  }

  return (
    <div className="flex flex-col" style={{ background: '#FAFAF8', minHeight: '100%' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between" style={{ padding: 'calc(14px + env(safe-area-inset-top)) 16px 6px' }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full bg-white active:scale-95 transition-transform"
          style={{ width: 44, height: 44, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          aria-label="Go back"
        >
          <BackIcon />
        </button>

        <div className="text-center">
          <p style={{ fontSize: 10, fontWeight: 600, color: '#000180', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            Learning Note
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#000180', lineHeight: 1.1 }}>
            Note {noteIndex + 1} of {totalNotes}
          </p>
        </div>

        <button
          className="flex items-center justify-center rounded-full active:scale-95 transition-transform"
          style={{
            width: 44,
            height: 44,
            background: 'linear-gradient(to right, #83E7FF, #00C5E5)',
            boxShadow: '0 2px 8px rgba(131, 231, 255, 0.25)',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="Mark as favourite"
        >
          <StarIcon />
        </button>
      </div>

      {/* Big note name */}
      <div className="flex flex-col items-center" style={{ margin: '4px 0 10px' }}>
        <div className="flex items-start">
          <span style={{ fontSize: 64, fontWeight: 800, color: '#006EE9', lineHeight: 1 }}>
            {noteLabel}
          </span>
          {noteOctave && (
            <span style={{ fontSize: 32, fontWeight: 800, color: '#000180', verticalAlign: 'super', lineHeight: 1, marginTop: 4 }}>
              {noteOctave}
            </span>
          )}
        </div>
        {subtitle && (
          <p style={{ fontSize: 12, fontWeight: 500, color: '#000180', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>

      {/* Fingering card */}
      <div style={{ margin: '0 14px 10px' }}>
        <FingeringDiagramForNote noteId={currentNoteId} />
      </div>

      {/* Hear this note button */}
      <div style={{ margin: '0 14px 10px' }}>
        <button
          onClick={handleHearNote}
          className="w-full flex items-center gap-3 rounded-xl active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(to right, #83E7FF, #00C5E5)',
            boxShadow: '0 2px 8px rgba(131, 231, 255, 0.25)',
            padding: '12px 14px',
            minHeight: 44,
            border: 'none',
            cursor: 'pointer',
            color: '#000180',
          }}
        >
          <SpeakerIcon />
          <span style={{ fontSize: 13, fontWeight: 700 }}>Hear this note</span>
        </button>
      </div>

      {/* Live tuning card */}
      <div
        className="bg-white"
        style={{ margin: '0 14px 10px', borderRadius: 16, padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        <TuningBar cents={cents} isActive={isActive} />

        <button
          onClick={handleToggleMic}
          className="w-full flex items-center justify-center gap-2 rounded-xl active:scale-95 transition-transform"
          style={{
            marginTop: 12,
            minHeight: 44,
            background: isActive ? '#F1EFE8' : 'linear-gradient(to right, #006EE9, #0056C7)',
            color: isActive ? '#000180' : 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 12,
          }}
          aria-label={isActive ? 'Stop microphone' : 'Start microphone'}
        >
          {isActive ? 'Stop listening' : 'Start listening'}
        </button>
      </div>

      {/* Mastery progress nudge */}
      <div
        className="flex flex-col items-center"
        style={{
          margin: '0 14px 10px',
          borderRadius: 12,
          padding: '10px 14px',
          background: 'rgba(208, 255, 163, 0.25)',
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 600, color: '#000180', marginBottom: 8 }}>
          Hold steady — 3 in a row for mastery
        </p>
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: i < masteryDots ? '#D0FFA3' : 'white',
                border: `2px solid ${i < masteryDots ? '#006EE9' : '#D3D1C7'}`,
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
            />
          ))}
        </div>
      </div>

      <BadgeToast badge={earnedBadge} onDismiss={clearEarnedBadge} />
    </div>
  )
}
