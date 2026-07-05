import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow'
import { useMicrophone } from '../../hooks/useMicrophone'
import { useFoundationsProgress } from '../../hooks/useFoundationsProgress'
import { FingeringDiagramForNote } from '../FingeringDiagrams'
import { playTone } from '../../utils/playTone'
import { NOTES } from '../../notes'
import { FIRST_NOTES_EXERCISES, FIRST_NOTES_ADVICE } from '../../data/firstNotesContent'

const SELECTABLE_NOTES = ['B4', 'A4', 'G4']
const NOTE_LABELS = { B4: 'B', A4: 'A', G4: 'G' }
const NOTE_VEX_KEYS = { B4: 'b/4', A4: 'a/4', G4: 'g/4' }

function BackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0B3D3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  )
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B3D3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function MiniStaff({ noteId, step }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const noteKey = NOTE_VEX_KEYS[noteId]
    const exercise = FIRST_NOTES_EXERCISES[step]
    const exerciseNotes = Array.from({ length: exercise.count }, () => ({
      key: noteKey,
      duration: exercise.duration,
    }))

    function render() {
      el.innerHTML = ''
      const width = Math.max(el.clientWidth || 280, 240)
      const height = 130

      const renderer = new Renderer(el, Renderer.Backends.SVG)
      renderer.resize(width, height)
      const ctx = renderer.getContext()

      const stave = new Stave(10, 28, width - 20)
      stave.addClef('treble')
      stave.addTimeSignature('4/4')
      stave.setContext(ctx).draw()

      const staveNotes = exerciseNotes.map(({ key, duration }) =>
        new StaveNote({ keys: [key], duration })
      )

      const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false)
      voice.addTickables(staveNotes)
      new Formatter().joinVoices([voice]).format([voice], width - 90)
      voice.draw(ctx, stave)
    }

    render()

    const obs = new ResizeObserver(render)
    obs.observe(el)
    return () => obs.disconnect()
  }, [noteId, step])

  return <div ref={ref} style={{ width: '100%' }} />
}

function TuningBar({ note, cents, isActive }) {
  const hasNote = isActive && note !== null && cents !== null
  const inTune = hasNote && Math.abs(cents) <= 20
  const close = hasNote && Math.abs(cents) <= 40 && !inTune
  const off = hasNote && Math.abs(cents) > 40

  const indicatorLeft = hasNote
    ? Math.max(5, Math.min(95, 50 + cents))
    : 50

  const indicatorColor = inTune ? '#4CAF50' : close ? '#FFC107' : off ? '#F5A623' : '#D3D1C7'

  const statusText = !isActive
    ? 'Press Start to listen'
    : note === null
    ? 'Listening...'
    : inTune
    ? 'In tune!'
    : cents < 0
    ? 'A bit flat'
    : 'A bit sharp'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#0B3D3A', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0, fontFamily: 'Nunito, sans-serif' }}>
          Tuning
        </p>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#666666', margin: 0, fontFamily: 'Nunito, sans-serif' }}>{statusText}</p>
      </div>

      <div style={{ position: 'relative', height: 22, background: '#F1EFE8', borderRadius: 11, overflow: 'visible' }}>
        <div style={{
          position: 'absolute', top: 3, bottom: 3,
          left: '35%', right: '35%',
          background: '#FFF57E', borderRadius: 8,
        }} />
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: '50%', width: 1,
          background: 'rgba(11,61,58,0.3)',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${indicatorLeft}%`,
          transform: 'translate(-50%, -50%)',
          width: 20, height: 28,
          background: indicatorColor,
          border: '2.5px solid white',
          borderRadius: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          transition: 'left 0.1s ease, background 0.2s ease',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 9, fontWeight: 500, color: '#0B3D3A', fontFamily: 'Nunito, sans-serif' }}>Flat</span>
        <span style={{ fontSize: 9, fontWeight: 500, color: '#0B3D3A', fontFamily: 'Nunito, sans-serif' }}>In tune</span>
        <span style={{ fontSize: 9, fontWeight: 500, color: '#0B3D3A', fontFamily: 'Nunito, sans-serif' }}>Sharp</span>
      </div>
    </div>
  )
}

export default function FirstNotesModule() {
  const navigate = useNavigate()
  const { note, cents, isActive, startListening, stopListening } = useMicrophone()
  const { markModuleComplete } = useFoundationsProgress()

  const [selectedNote, setSelectedNote] = useState('B4')
  const [currentStep, setCurrentStep] = useState(0)
  const [adviceText, setAdviceText] = useState(FIRST_NOTES_ADVICE.idle[0])
  const hasMarkedRef = useRef(false)

  const prevZoneRef = useRef(null)
  const sharpIdxRef = useRef(-1)
  const flatIdxRef = useRef(-1)

  const isPlayingNote = isActive && note !== null

  // When a different note is selected, stop mic and reset step
  function handleSelectNote(noteId) {
    if (isActive) stopListening()
    setSelectedNote(noteId)
    setCurrentStep(0)
    prevZoneRef.current = null
  }

  // Idle tip rotation — runs whenever no pitch is being detected
  useEffect(() => {
    if (isPlayingNote) return
    prevZoneRef.current = null
    let i = 0
    setAdviceText(FIRST_NOTES_ADVICE.idle[i])
    const interval = setInterval(() => {
      i = (i + 1) % FIRST_NOTES_ADVICE.idle.length
      setAdviceText(FIRST_NOTES_ADVICE.idle[i])
    }, 4000)
    return () => clearInterval(interval)
  }, [isPlayingNote])

  // Zone-based advice — runs whenever a pitch is being detected
  useEffect(() => {
    if (!isPlayingNote) return

    if (note !== selectedNote) {
      if (prevZoneRef.current !== 'wrongNote') {
        prevZoneRef.current = 'wrongNote'
        setAdviceText(`That doesn't sound like ${NOTE_LABELS[selectedNote]} — double-check your fingers!`)
      }
      return
    }

    if (cents === null) return
    const zone = Math.abs(cents) <= 20 ? 'inTune' : cents > 20 ? 'sharp' : 'flat'
    if (zone === prevZoneRef.current) return
    prevZoneRef.current = zone

    if (zone === 'inTune') {
      const pool = FIRST_NOTES_ADVICE.inTune
      sharpIdxRef.current = (sharpIdxRef.current + 1) % pool.length
      setAdviceText(pool[sharpIdxRef.current])
    } else if (zone === 'sharp') {
      sharpIdxRef.current = (sharpIdxRef.current + 1) % FIRST_NOTES_ADVICE.sharp.length
      setAdviceText(FIRST_NOTES_ADVICE.sharp[sharpIdxRef.current])
    } else {
      flatIdxRef.current = (flatIdxRef.current + 1) % FIRST_NOTES_ADVICE.flat.length
      setAdviceText(FIRST_NOTES_ADVICE.flat[flatIdxRef.current])
    }
  }, [isPlayingNote, note, cents, selectedNote])

  function handleToggleMic() {
    if (isActive) {
      stopListening()
    } else {
      startListening()
      if (!hasMarkedRef.current) {
        hasMarkedRef.current = true
        markModuleComplete('firstNotes')
      }
    }
  }

  function handleHearNote() {
    const freq = NOTES[selectedNote]?.freq
    if (freq) playTone(freq, 1.2)
  }

  const exercise = FIRST_NOTES_EXERCISES[currentStep]

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100%', paddingBottom: 32 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 12px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 44, height: 44, borderRadius: '50%', background: 'white',
            border: 'none', cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
          aria-label="Go back"
        >
          <BackIcon />
        </button>
        <div>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 20, color: '#0B3D3A', margin: 0 }}>
            Play Your First Notes
          </p>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 400, fontSize: 13, color: '#666666', margin: 0 }}>
            B, A and G — let's hear you play!
          </p>
        </div>
      </div>

      {/* Note selector */}
      <div style={{ padding: '0 16px 14px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 12, color: '#999999', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Choose a note
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {SELECTABLE_NOTES.map(noteId => {
            const active = noteId === selectedNote
            return (
              <button
                key={noteId}
                onClick={() => handleSelectNote(noteId)}
                style={{
                  flex: 1, minHeight: 56, borderRadius: 14,
                  border: active ? '2.5px solid #26CCC2' : '2px solid #E5E0D8',
                  background: active ? 'rgba(106,236,225,0.12)' : 'white',
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 28,
                  color: active ? '#26CCC2' : '#888888',
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {NOTE_LABELS[noteId]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Exercise step selector */}
      <div style={{ padding: '0 16px 14px' }}>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 12, color: '#999999', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Exercise
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {FIRST_NOTES_EXERCISES.map((ex, i) => {
            const active = i === currentStep
            return (
              <button
                key={ex.id}
                onClick={() => setCurrentStep(i)}
                style={{
                  flex: 1, minHeight: 56, borderRadius: 12,
                  border: active ? '2.5px solid #26CCC2' : '2px solid #E5E0D8',
                  background: active ? 'rgba(106,236,225,0.12)' : 'white',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2,
                  padding: '6px 4px',
                }}
              >
                <span style={{
                  fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 16,
                  color: active ? '#26CCC2' : '#0B3D3A',
                }}>
                  {ex.stepCount}
                </span>
                <span style={{
                  fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 11,
                  color: active ? '#26CCC2' : '#666666',
                  textAlign: 'center', lineHeight: 1.2,
                }}>
                  {ex.stepLabel}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mini staff card */}
      <div style={{ margin: '0 16px 12px', background: 'white', borderRadius: 16, padding: '16px 16px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <MiniStaff noteId={selectedNote} step={currentStep} />
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, color: '#0B3D3A', margin: 0 }}>
            {exercise.label}
          </p>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 400, fontSize: 13, color: '#666666', margin: '4px 0 0', lineHeight: 1.5 }}>
            {exercise.description}
          </p>
        </div>
      </div>

      {/* Fingering diagram */}
      <div style={{ margin: '0 16px 12px' }}>
        <FingeringDiagramForNote noteId={selectedNote} />
      </div>

      {/* Hear note button */}
      <div style={{ margin: '0 16px 12px' }}>
        <button
          onClick={handleHearNote}
          style={{
            width: '100%', minHeight: 48, borderRadius: 12, border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(to right, #6AECE1, #34D6C9)',
            boxShadow: '0 2px 8px rgba(106, 236, 225, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 14, color: '#0B3D3A',
          }}
        >
          <SpeakerIcon />
          Hear this note — {NOTE_LABELS[selectedNote]}
        </button>
      </div>

      {/* Tuning + advice card */}
      <div style={{ margin: '0 16px', background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

        {/* Advice banner */}
        <div style={{
          background: '#FAFAF8',
          border: '1.5px solid #F5D99E',
          borderRadius: 12,
          padding: '12px 14px',
          marginBottom: 14,
          minHeight: 52,
          display: 'flex',
          alignItems: 'center',
        }}>
          <p style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 13,
            color: '#5C4A00', margin: 0, lineHeight: 1.5,
          }}>
            {adviceText}
          </p>
        </div>

        <TuningBar note={note} cents={cents} isActive={isActive} />

        <button
          onClick={handleToggleMic}
          style={{
            marginTop: 12, width: '100%', minHeight: 52,
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: isActive
              ? '#F1EFE8'
              : 'linear-gradient(to right, #26CCC2, #1AA89F)',
            color: '#0B3D3A',
            fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15,
          }}
          aria-label={isActive ? 'Stop microphone' : 'Start microphone'}
        >
          {isActive ? 'Stop listening' : 'Start listening'}
        </button>
      </div>
    </div>
  )
}
