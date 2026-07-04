import { useState, useRef, useCallback, useEffect } from 'react'
import { Renderer, Stave, StaveNote, Voice, Formatter, Beam } from 'vexflow'
import { playTone, NOTE_FREQUENCIES } from '../../utils/playTone'
import { FOUNDATIONS_CONTENT } from '../../data/foundationsContent'

// ── Staff geometry (matches StaffDisplay.jsx) ──────────────────────────────
const STAVE_X = 10
const STAVE_Y = 0
const SPACING = 15
const TOTAL_HEIGHT = 170

// ── Play sequences ─────────────────────────────────────────────────────────
const SEQUENCES = {
  crotchet: {
    tones: [
      { freq: NOTE_FREQUENCIES.B4, dur: 0.4, gap: 0.1 },
      { freq: NOTE_FREQUENCIES.A4, dur: 0.4, gap: 0.1 },
      { freq: NOTE_FREQUENCIES.G4, dur: 0.4, gap: 0.1 },
      { freq: NOTE_FREQUENCIES.B4, dur: 0.4, gap: 0 },
    ],
    totalDuration: 2,
  },
  minim: {
    tones: [
      { freq: NOTE_FREQUENCIES.B4, dur: 0.9, gap: 0.1 },
      { freq: NOTE_FREQUENCIES.G4, dur: 0.9, gap: 0 },
    ],
    totalDuration: 2,
  },
  quaver: {
    tones: [
      { freq: NOTE_FREQUENCIES.B4, dur: 0.2, gap: 0.05 },
      { freq: NOTE_FREQUENCIES.A4, dur: 0.2, gap: 0.05 },
      { freq: NOTE_FREQUENCIES.G4, dur: 0.2, gap: 0.05 },
      { freq: NOTE_FREQUENCIES.B4, dur: 0.2, gap: 0 },
    ],
    totalDuration: 1,
  },
}

// ── Helper: parse **bold** markers and \n\n paragraph breaks ───────────────
function parseBoldAndBreaks(text) {
  if (!text) return null
  return text.split('\n\n').map((para, pi) => (
    <p key={pi} style={{ margin: pi === 0 ? 0 : '12px 0 0' }}>
      {para.split('**').map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
      )}
    </p>
  ))
}

// ── VexFlow multi-note staff ───────────────────────────────────────────────
// Props:
//   noteKeys        array of VexFlow key strings e.g. ['b/4', 'a/4']
//   duration        VexFlow duration string: 'q' | 'h' | '8'
//   timeSignature   '4/4' | '2/4' | '' (empty = no time signature rendered)
//   showClef        boolean, default true
//   beamGroups      array of arrays of note indices e.g. [[0,1],[2,3]]
//   label           optional caption below the card
function VexStaff({
  noteKeys,
  duration,
  timeSignature = '4/4',
  showClef = true,
  beamGroups = [],
  label,
}) {
  const containerRef = useRef(null)
  const observerRef = useRef(null)

  // Stable primitive deps so the effect only re-runs when content actually changes
  const keysStr = noteKeys.join(',')
  const beamStr = JSON.stringify(beamGroups)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Re-derive arrays from stable strings to avoid stale-closure issues
    const keys = keysStr.split(',')
    const beams = JSON.parse(beamStr)

    const draw = () => {
      el.innerHTML = ''
      const width = Math.max(el.clientWidth || 320, 280)

      const renderer = new Renderer(el, Renderer.Backends.SVG)
      renderer.resize(width, TOTAL_HEIGHT)
      const ctx = renderer.getContext()

      const staveWidth = width - STAVE_X * 2
      const stave = new Stave(STAVE_X, STAVE_Y, staveWidth, {
        spacingBetweenLinesPx: SPACING,
      })
      if (showClef) stave.addClef('treble')
      if (timeSignature) stave.addTimeSignature(timeSignature)
      stave.setContext(ctx).draw()

      // Usable width for notes = space to the right of clef + time signature
      const noteAreaWidth =
        stave.getX() + stave.getWidth() - stave.getNoteStartX() - 10

      const staveNotes = keys.map(key => new StaveNote({ keys: [key], duration }))

      // ── IMPORTANT: create Beam objects BEFORE formatting ──────────────
      // VexFlow marks beamed notes internally when Beam is constructed,
      // which removes their individual flags. If Beam is created after
      // draw(), flags remain on the stems.
      const beamObjects = beams.map(indices =>
        new Beam(indices.map(i => staveNotes[i]))
      )

      // numBeats matches the time signature so Voice knows the bar length
      const numBeats = timeSignature === '2/4' ? 2 : 4
      const voice = new Voice({ numBeats, beatValue: 4 }).setStrict(false)
      voice.addTickables(staveNotes)

      new Formatter().joinVoices([voice]).format([voice], noteAreaWidth)

      staveNotes.forEach(sn => sn.setStave(stave))
      voice.draw(ctx, stave)

      // Draw beams after notes are positioned
      beamObjects.forEach(beam => beam.setContext(ctx).draw())
    }

    draw()
    observerRef.current = new ResizeObserver(() => draw())
    observerRef.current.observe(el)

    return () => {
      observerRef.current?.disconnect()
      if (el) el.innerHTML = ''
    }
  }, [keysStr, beamStr, duration, timeSignature, showClef])

  return (
    <div>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <div ref={containerRef} style={{ width: '100%' }} />
      </div>
      {label && (
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 500,
            fontSize: '16px',
            color: '#666666',
            textAlign: 'center',
          }}
        >
          {label}
        </p>
      )}
    </div>
  )
}

// ── Time signature explainer — collapsible "What's that?" ─────────────────
// variant: '44' | '24'
function TimeSignatureExplainer({ variant }) {
  const [open, setOpen] = useState(false)
  const content =
    FOUNDATIONS_CONTENT.noteReading[
      variant === '44' ? 'timeSignature44' : 'timeSignature24'
    ]

  return (
    <div style={{ marginTop: '12px' }}>
      {/* Pill toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#FFFFFF',
          border: '1px solid #EEEEEE',
          borderRadius: '999px',
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 500,
          fontSize: '16px',
          color: '#006EE9',
          padding: '10px 18px',
          minHeight: '56px',
          cursor: 'pointer',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content.promptLabel}
      </button>

      {/* Collapsible card — CSS max-height transition, no JS animation */}
      <div
        style={{
          maxHeight: open ? '700px' : '0',
          overflow: 'hidden',
          transition: 'max-height 300ms ease-out',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Heading */}
          <div
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: '#2D2D2D',
              marginBottom: '12px',
            }}
          >
            {content.heading}
          </div>

          {/* Body paragraphs with bold support */}
          <div
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              color: '#666666',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}
          >
            {parseBoldAndBreaks(content.body)}
          </div>

          {/* 4/4 fraction visual */}
          {variant === '44' && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 800,
                      fontSize: '48px',
                      color: '#006EE9',
                      lineHeight: 1.1,
                      display: 'block',
                    }}
                  >
                    4
                  </span>
                  <span
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      color: '#999999',
                      display: 'block',
                    }}
                  >
                    beats per bar
                  </span>
                </div>
                <div
                  style={{
                    width: '96px',
                    height: '2px',
                    background: '#EEEEEE',
                    margin: '8px 0',
                  }}
                />
                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 800,
                      fontSize: '48px',
                      color: '#006EE9',
                      lineHeight: 1.1,
                      display: 'block',
                    }}
                  >
                    4
                  </span>
                  <span
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      color: '#999999',
                      display: 'block',
                    }}
                  >
                    crotchet beat
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2/4 comparison visual */}
          {variant === '24' && (
            <div style={{ marginBottom: '20px' }}>
              {[
                { text: '4/4  →  4 beats per bar', active: false },
                { text: '2/4  →  2 beats per bar', active: true },
              ].map(({ text, active }) => (
                <div
                  key={text}
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: active ? '#006EE9' : '#666666',
                    marginBottom: '8px',
                  }}
                >
                  {text}
                </div>
              ))}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            style={{
              background: '#FFFFFF',
              border: '1px solid #EEEEEE',
              borderRadius: '999px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              color: '#4CAF50',
              padding: '10px 18px',
              cursor: 'pointer',
              lineHeight: 1,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {content.close}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Comparison bars ────────────────────────────────────────────────────────
function ComparisonBars({ highlight }) {
  const bars = [
    { key: 'quaver',   label: 'Quaver',   beatLabel: '½ beat — really quick', pct: 25  },
    { key: 'crotchet', label: 'Crotchet', beatLabel: '1 beat',                 pct: 50  },
    { key: 'minim',    label: 'Minim',    beatLabel: '2 beats — hold it',      pct: 100 },
  ]
  return (
    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: '16px',
          color: '#2D2D2D',
          marginBottom: '12px',
        }}
      >
        How long does each note last?
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {bars.map(({ key, label, beatLabel, pct }) => {
          const active = key === highlight
          return (
            <div key={key}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#2D2D2D',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#666666',
                  }}
                >
                  {beatLabel}
                </span>
              </div>
              <div
                style={{
                  height: '14px',
                  background: '#F0F0F0',
                  borderRadius: '7px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: '#006EE9',
                    borderRadius: '7px',
                    opacity: active ? 1 : 0.4,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Two-quaver demo ────────────────────────────────────────────────────────
function TwoQuaverDemo() {
  const [state, setState] = useState('idle')
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handlePlay = useCallback(() => {
    if (state === 'first' || state === 'second') return
    setState('first')
    playTone(NOTE_FREQUENCIES.B4, 0.4)
    timerRef.current = setTimeout(() => {
      setState('second')
      playTone(NOTE_FREQUENCIES.B4, 0.4)
      timerRef.current = setTimeout(() => setState('idle'), 400)
    }, 500)
  }, [state])

  const isPlaying = state === 'first' || state === 'second'

  return (
    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: '16px',
          color: '#2D2D2D',
          marginBottom: '12px',
        }}
      >
        Two quavers = one crotchet
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {[0, 1].map(i => {
          const lit = (i === 0 && state === 'first') || (i === 1 && state === 'second')
          return (
            <div
              key={i}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: lit
                  ? 'linear-gradient(to right, #006EE9, #0056C7)'
                  : 'rgba(0,110,233,0.06)',
                border: `2px solid ${lit ? '#0056C7' : '#006EE9'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                transition: 'background 0.1s, border-color 0.1s',
                userSelect: 'none',
              }}
            >
              ♪
            </div>
          )
        })}
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          style={{
            height: '56px',
            padding: '0 20px',
            borderRadius: '26px',
            border: 'none',
            background: isPlaying
              ? '#CCCCCC'
              : 'linear-gradient(to right, #006EE9, #0056C7)',
            color: '#FFFFFF',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            cursor: isPlaying ? 'default' : 'pointer',
          }}
        >
          {isPlaying ? 'Playing…' : 'Play both'}
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function NoteValueLesson({ noteType }) {
  const seq = SEQUENCES[noteType] || SEQUENCES.crotchet

  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(false)
  const [barPct, setBarPct] = useState(0)
  const [feedback, setFeedback] = useState(false)

  const playingRef = useRef(false)
  const timersRef = useRef([])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  const handlePlay = useCallback(() => {
    if (playingRef.current) return
    playingRef.current = true
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    setPlaying(true)
    setPlayed(true)
    setFeedback(false)

    // Schedule each note in the sequence
    let delay = 0
    seq.tones.forEach(({ freq, dur, gap }) => {
      timersRef.current.push(
        setTimeout(() => playTone(freq, dur), Math.round(delay * 1000))
      )
      delay += dur + gap
    })

    // Snap bar to 100% (no transition), then drain to 0% with CSS transition
    setBarPct(100)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setBarPct(0)
      })
    })

    // After sequence ends, show "Nice! ✓" for 1.5s
    timersRef.current.push(
      setTimeout(() => {
        setPlaying(false)
        playingRef.current = false
        setFeedback(true)
        timersRef.current.push(
          setTimeout(() => setFeedback(false), 1500)
        )
      }, seq.totalDuration * 1000)
    )
  }, [seq])

  const { quaverStaffCLabel } = FOUNDATIONS_CONTENT.noteReading

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif' }}>

      {/* ── Screen 5: Crotchet — 4/4 bar of 4 crotchets ─────────────────── */}
      {noteType === 'crotchet' && (
        <>
          <VexStaff
            noteKeys={['b/4', 'a/4', 'g/4', 'b/4']}
            duration="q"
            timeSignature="4/4"
            label="4 crotchets fill one bar"
          />
          <TimeSignatureExplainer variant="44" />
        </>
      )}

      {/* ── Screen 6: Minim — 4/4 bar of 2 minims ───────────────────────── */}
      {noteType === 'minim' && (
        <VexStaff
          noteKeys={['b/4', 'g/4']}
          duration="h"
          timeSignature="4/4"
          label="2 minims fill one bar"
        />
      )}

      {/* ── Screen 7: Quaver — three staves, explainers, and demo ────────── */}
      {noteType === 'quaver' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Staff A: single quaver — no clef, no time signature */}
          <VexStaff
            noteKeys={['b/4']}
            duration="8"
            timeSignature=""
            showClef={false}
            label="One quaver — on its own, it has a little flag 🚩"
          />

          <p
            style={{
              margin: 0,
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              color: '#2D2D2D',
              textAlign: 'center',
            }}
          >
            When two quavers are next to each other, their flags join into a beam:
          </p>

          {/* Staff B: 2 beamed quavers — 2/4 time */}
          <div>
            <VexStaff
              noteKeys={['b/4', 'a/4']}
              duration="8"
              timeSignature="2/4"
              beamGroups={[[0, 1]]}
              label="Two quavers beamed — same sound, tidier to read 📖"
            />
            <TimeSignatureExplainer variant="24" />
          </div>

          {/* Staff C: 4 quavers in two beamed pairs — 2/4 time */}
          <div>
            <VexStaff
              noteKeys={['b/4', 'a/4', 'g/4', 'b/4']}
              duration="8"
              timeSignature="2/4"
              beamGroups={[[0, 1], [2, 3]]}
              label="4 quavers fill one bar — in two beamed pairs"
            />
            <p
              style={{
                margin: '6px 0 0',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 400,
                fontStyle: 'italic',
                fontSize: '16px',
                color: '#999999',
                textAlign: 'center',
              }}
            >
              {quaverStaffCLabel}
            </p>
          </div>
        </div>
      )}

      {/* ── Play button + duration bar (all screens) ─────────────────────── */}
      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ position: 'relative', width: '72px', height: '72px' }}>
          {playing && (
            <div
              style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                border: '3px solid #006EE9',
                animation: 'play-pulse 1s ease-out infinite',
                pointerEvents: 'none',
              }}
            />
          )}
          <button
            onClick={handlePlay}
            disabled={playing}
            aria-label="Play notes"
            style={{
              position: 'relative',
              zIndex: 1,
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(to right, #006EE9, #0056C7)',
              color: '#FFFFFF',
              fontSize: '28px',
              cursor: playing ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,110,233,0.4)',
            }}
          >
            {playing ? '♪' : '▶'}
          </button>
        </div>

        <div
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            color: feedback ? '#4CAF50' : '#666666',
            minHeight: '28px',
            transition: 'color 0.2s',
          }}
        >
          {feedback ? 'Nice! ✓' : played ? 'Tap to hear it again' : 'Tap to hear it'}
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: '280px',
            height: '12px',
            background: '#F0F0F0',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${barPct}%`,
              background: 'linear-gradient(to right, #006EE9, #0056C7)',
              borderRadius: '6px',
              transition:
                barPct === 0 && played
                  ? `width ${seq.totalDuration}s linear`
                  : 'none',
            }}
          />
        </div>
      </div>

      {/* ── Minim: comparison bars appear after first play ────────────────── */}
      {noteType === 'minim' && played && <ComparisonBars highlight="minim" />}

      {/* ── Quaver: comparison bars + two-quaver demo always shown ───────── */}
      {noteType === 'quaver' && (
        <>
          <ComparisonBars highlight="quaver" />
          <TwoQuaverDemo />
        </>
      )}
    </div>
  )
}
