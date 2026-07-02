import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import LessonCard from '../foundations/LessonCard'
import BadgePopup from '../foundations/BadgePopup'
import MicActivityBar from '../foundations/MicActivityBar'
import { useFoundationsProgress } from '../../hooks/useFoundationsProgress'

const TOTAL_STEPS     = 5
const ONSET_THRESHOLD = 0.025   // RMS: quiet → loud crossing = onset
const ONSET_COOLDOWN  = 450     // ms: ignore further onsets for this long after one
const BEAT_MS         = 1000    // 60 BPM
const BEAT_TOLERANCE  = 450     // ±ms: within this of a beat = "on time"
const TICKS_NEEDED    = 4       // consecutive on-beat hits for badge
const TIP_THRESHOLD   = 12      // onsets before showing the persistence tip

// ── Shared text styles (Foundations scale — matches EmbouchureModule) ─────
const H = {
  fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '36px',
  color: '#2D2D2D', marginBottom: '16px', marginTop: 0, lineHeight: 1.2,
}
const BODY = {
  fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: '20px',
  color: '#2D2D2D', margin: '0 0 12px', lineHeight: 1.5,
}
const BODY2 = {
  fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: '20px',
  color: '#666666', margin: '0 0 24px', lineHeight: 1.5,
}

// ── Reusable cards ─────────────────────────────────────────────────────────
function TipCard({ children }) {
  return (
    <div style={{
      background: '#FFF8EE', borderLeft: '3px solid #006EE9',
      borderRadius: '12px', padding: '16px 20px', marginBottom: '16px',
      fontFamily: 'Nunito, sans-serif', fontWeight: 500,
      fontSize: '18px', color: '#2D2D2D', lineHeight: 1.5,
    }}>
      {children}
    </div>
  )
}

function SuccessCard({ children }) {
  return (
    <div style={{
      background: '#F0FBF0', borderLeft: '3px solid #4CAF50',
      borderRadius: '12px', padding: '16px 20px', marginBottom: '16px',
      fontFamily: 'Nunito, sans-serif', fontWeight: 600,
      fontSize: '18px', color: '#2E7D32', lineHeight: 1.5,
    }}>
      {children}
    </div>
  )
}

// ── SVG: animated tongue diagram ───────────────────────────────────────────
// Side-on cutaway showing tongue rising to touch top teeth then dropping away.
function TongueDiagram() {
  return (
    <svg
      viewBox="0 0 260 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '260px', display: 'block', margin: '4px auto 24px' }}
      aria-label="Side view of mouth: tongue rises to touch back of top teeth then drops away for each tuh"
    >
      <style>{`
        @keyframes tongue-tap {
          0%, 20%   { transform: translateY(0px);  }
          35%, 50%  { transform: translateY(-18px); }
          65%, 100% { transform: translateY(0px);  }
        }
        .tongue-g {
          transform-origin: 50% 80%;
          animation: tongue-tap 1.5s ease-in-out 3;
        }
      `}</style>

      {/* ── Upper teeth ── */}
      {[38, 68, 98, 128, 158, 188].map((x, i) => (
        <rect key={i} x={x} y="28" width="26" height="32" rx="4"
          fill="#FAFAFA" stroke="#E0E0E0" strokeWidth="1.5" />
      ))}
      {/* gum line */}
      <rect x="32" y="24" width="194" height="12" rx="6" fill="#F48FB1" />

      {/* ── Mouth floor / lower lip ── */}
      <path d="M28,110 Q130,138 232,110" fill="#F8BBD9" stroke="#F48FB1" strokeWidth="2" />

      {/* ── Animated tongue group ── */}
      <g className="tongue-g">
        {/* Tongue body */}
        <ellipse cx="130" cy="126" rx="80" ry="28" fill="#F06292" />
        {/* Tongue tip */}
        <ellipse cx="130" cy="108" rx="26" ry="14" fill="#E91E8C" />
        {/* "here!" label with arrow */}
        <path d="M168,70 Q180,60 190,68" stroke="#006EE9" strokeWidth="2"
          fill="none" strokeLinecap="round" markerEnd="url(#tuh-arr)" />
        <text x="172" y="62" fontFamily="Nunito, sans-serif" fontSize="13"
          fontWeight="800" fill="#006EE9">here!</text>
      </g>

      <defs>
        <marker id="tuh-arr" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 7 3, 0 6" fill="#006EE9" />
        </marker>
      </defs>

      {/* tuh label */}
      <text x="130" y="166" textAnchor="middle" fontFamily="Nunito, sans-serif"
        fontSize="16" fontWeight="800" fill="#888888">
        tongue touches → drops → note starts
      </text>
    </svg>
  )
}

// ── SVG: swinging pendulum metronome ──────────────────────────────────────
// One full swing (left→right) = 1 beat = 1 second at 60 BPM.
function Pendulum() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 20px' }}>
      <svg
        viewBox="0 0 140 180"
        style={{ width: '140px', height: '180px' }}
        aria-label="Metronome pendulum swinging at 60 beats per minute"
      >
        <style>{`
          @keyframes swing {
            0%, 100% { transform: rotate(-32deg); }
            50%       { transform: rotate(32deg);  }
          }
          .pend-arm { transform-origin: 70px 28px; animation: swing 2s ease-in-out infinite; }
        `}</style>

        {/* Cabinet base */}
        <polygon points="28,172 112,172 100,130 40,130"
          fill="#D8D8D8" stroke="#BBBBBB" strokeWidth="1.5" />
        {/* Pivot point */}
        <circle cx="70" cy="28" r="7" fill="#888888" />

        {/* Arm + bob — pivots at 70,28 */}
        <g className="pend-arm">
          <line x1="70" y1="28" x2="70" y2="132"
            stroke="#888888" strokeWidth="4" strokeLinecap="round" />
          {/* Adjustable weight marker */}
          <rect x="56" y="72" width="28" height="18" rx="4"
            fill="#CCCCCC" stroke="#AAAAAA" strokeWidth="1.5" />
          {/* Bob */}
          <circle cx="70" cy="132" r="16"
            fill="#006EE9" stroke="#0056C7" strokeWidth="2.5" />
        </g>

        {/* Beat count label */}
        <text x="70" y="155" textAnchor="middle"
          fontFamily="Nunito, sans-serif" fontSize="12" fontWeight="700" fill="#888888">
          60 BPM
        </text>
      </svg>
    </div>
  )
}

// ── Comparison panel: wrong vs right ──────────────────────────────────────
function ComparePanel({ wrongLabel, wrongDesc, wrongSvg, rightLabel, rightDesc, rightSvg }) {
  return (
    <div style={{ display: 'flex', gap: '10px', margin: '16px 0' }}>
      <div style={{
        flex: 1, background: '#FFF3F3', borderLeft: '3px solid #F06292',
        borderRadius: '12px', padding: '14px', textAlign: 'center',
      }}>
        {wrongSvg}
        <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '15px', color: '#F06292', margin: '0 0 4px' }}>{wrongLabel}</p>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#666666', margin: 0, lineHeight: 1.3 }}>{wrongDesc}</p>
      </div>
      <div style={{
        flex: 1, background: '#F0FBF0', borderLeft: '3px solid #4CAF50',
        borderRadius: '12px', padding: '14px', textAlign: 'center',
      }}>
        {rightSvg}
        <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '15px', color: '#4CAF50', margin: '0 0 4px' }}>{rightLabel}</p>
        <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#666666', margin: 0, lineHeight: 1.3 }}>{rightDesc}</p>
      </div>
    </div>
  )
}

// ── Common wave SVGs for comparison panels ────────────────────────────────
const WaveContinuous = (
  <svg viewBox="0 0 100 36" style={{ width: '100%', marginBottom: 8 }} aria-hidden="true">
    <path d="M4,18 C14,6 24,30 34,18 C44,6 54,30 64,18 C74,6 84,30 96,18"
      stroke="#F06292" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
)
const WaveClean = (
  <svg viewBox="0 0 100 36" style={{ width: '100%', marginBottom: 8 }} aria-hidden="true">
    <line x1="4" y1="18" x2="26" y2="18" stroke="#4CAF50" strokeWidth="2"
      strokeDasharray="2 4" strokeLinecap="round" />
    <line x1="30" y1="6" x2="30" y2="30" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
    <line x1="30" y1="18" x2="96" y2="18" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)
const WaveHard = (
  <svg viewBox="0 0 100 36" style={{ width: '100%', marginBottom: 8 }} aria-hidden="true">
    <line x1="30" y1="2" x2="30" y2="34" stroke="#F06292" strokeWidth="5" strokeLinecap="round" />
    <line x1="30" y1="18" x2="96" y2="18" stroke="#F06292" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)
const WaveGentleTap = (
  <svg viewBox="0 0 100 36" style={{ width: '100%', marginBottom: 8 }} aria-hidden="true">
    <line x1="30" y1="10" x2="30" y2="26" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
    <line x1="30" y1="18" x2="96" y2="18" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)
const WaveBlurred = (
  <svg viewBox="0 0 100 36" style={{ width: '100%', marginBottom: 8 }} aria-hidden="true">
    {[20, 46, 72].map((x, i) => (
      <path key={i} d={`M${x},10 C${x + 6},6 ${x + 14},30 ${x + 20},18`}
        stroke="#F06292" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    ))}
  </svg>
)
const WaveSeparate = (
  <svg viewBox="0 0 100 36" style={{ width: '100%', marginBottom: 8 }} aria-hidden="true">
    {[8, 38, 68].map((x) => (
      <g key={x}>
        <line x1={x} y1="12" x2={x} y2="24" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" />
        <line x1={x} y1="18" x2={x + 20} y2="18" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      </g>
    ))}
  </svg>
)

// ── Module ─────────────────────────────────────────────────────────────────
export default function TonguingModule() {
  const navigate = useNavigate()
  const { markModuleComplete, markFoundationsComplete, saveLastStep } = useFoundationsProgress()

  const [step,          setStepRaw]       = useState(0)
  const [badgeVisible,  setBadgeVisible]  = useState(false)

  // Step 0: 5 tuh circles
  const [tapped, setTapped] = useState(new Set())

  // Step 1: whisper response
  const [handResponse, setHandResponse] = useState(null) // null | 'yes' | 'no'

  // Step 3: metronome + mic beat detection
  const [consecutiveTicks, setConsecutiveTicks] = useState(0)
  const [showTip,          setShowTip]          = useState(false)
  const prevRmsRef       = useRef(0)
  const onsetCooldownRef = useRef(false)
  const consecutiveRef   = useRef(0)
  const beatStartRef     = useRef(null)
  const badgeShownRef    = useRef(false)
  const attemptsRef      = useRef(0)

  // Step 4: which comparison card (0, 1, 2) or 3 = completion
  const [cardIdx, setCardIdx] = useState(0)

  const setStep = useCallback((s) => {
    setStepRaw(s)
    saveLastStep('tonguing', s)
  }, [saveLastStep])

  // Re-initialise beat clock & refs every time step 3 is entered
  useEffect(() => {
    if (step !== 3) return
    beatStartRef.current   = Date.now()
    consecutiveRef.current = 0
    prevRmsRef.current     = 0
    onsetCooldownRef.current = false
    badgeShownRef.current  = false
    attemptsRef.current    = 0
    setConsecutiveTicks(0)
    setShowTip(false)
  }, [step])

  const handleModuleComplete = useCallback(() => {
    markModuleComplete('tonguing')
    markFoundationsComplete()
    navigate('/')
  }, [markModuleComplete, markFoundationsComplete, navigate])

  const handlePrev = useCallback(() => {
    // Going back from the cards sub-screen resets the card index first
    if (step === 4 && cardIdx > 0) { setCardIdx(0); return }
    if (step > 0) {
      if (step === 1) setHandResponse(null)
      if (step === 0) setTapped(new Set())
      setStep(step - 1)
    } else {
      navigate('/foundations')
    }
  }, [step, cardIdx, setStep, navigate])

  // Onset detection: called every animation frame by MicActivityBar.onLevel
  const handleMetronomeLevel = useCallback((rms) => {
    if (badgeShownRef.current) return

    const wasQuiet = prevRmsRef.current <= ONSET_THRESHOLD
    prevRmsRef.current = rms
    const isLoud = rms > ONSET_THRESHOLD

    if (!wasQuiet || !isLoud || onsetCooldownRef.current) return

    // Rising-edge onset detected — debounce
    onsetCooldownRef.current = true
    setTimeout(() => { onsetCooldownRef.current = false }, ONSET_COOLDOWN)

    // Check beat alignment
    const elapsed     = Date.now() - beatStartRef.current
    const nearestBeat = Math.round(elapsed / BEAT_MS) * BEAT_MS
    const delta       = Math.abs(elapsed - nearestBeat)
    const onBeat      = delta <= BEAT_TOLERANCE

    if (onBeat) {
      consecutiveRef.current++
      setConsecutiveTicks(consecutiveRef.current)
      if (consecutiveRef.current >= TICKS_NEEDED) {
        badgeShownRef.current = true
        setBadgeVisible(true)
      }
    } else {
      consecutiveRef.current = 0
      setConsecutiveTicks(0)
    }

    attemptsRef.current++
    if (attemptsRef.current >= TIP_THRESHOLD && !badgeShownRef.current) {
      setShowTip(true)
    }
  }, [])

  const shared = { total: TOTAL_STEPS, current: step, onPrev: handlePrev, showPrev: true }

  // ── Step 0 — Say tuh ────────────────────────────────────────────────────
  if (step === 0) {
    const allFive = tapped.size >= 5
    return (
      <LessonCard
        {...shared}
        showPrev={false}
        nextLabel={allFive ? "I've got it! →" : null}
        nextDisabled={false}
        onNext={() => setStep(1)}
      >
        <h1 style={H}>Say tuh</h1>
        <p style={BODY}>
          Say <strong>tuh</strong> out loud. Feel your tongue touch the back of your top teeth?
        </p>

        <TongueDiagram />

        <p style={BODY2}>Say it 5 times slowly: <em>tuh… tuh… tuh… tuh… tuh…</em></p>

        {/* 5 tap circles — one per tuh */}
        <div style={{
          display: 'flex', gap: '12px', justifyContent: 'center',
          margin: '4px 0 28px', flexWrap: 'wrap',
        }}>
          {[0, 1, 2, 3, 4].map(i => {
            const done = tapped.has(i)
            return (
              <button
                key={i}
                onClick={() => {
                  if (!done) setTapped(prev => { const n = new Set(prev); n.add(i); return n })
                }}
                aria-label={`Tuh ${i + 1}${done ? ' — done' : ''}`}
                style={{
                  width: 64, height: 64,
                  borderRadius: '50%',
                  border: done ? 'none' : '3px solid #EEEEEE',
                  background: done ? '#4CAF50' : '#FFFFFF',
                  color: done ? '#FFFFFF' : '#AAAAAA',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: done ? 'default' : 'pointer',
                  fontSize: done ? '22px' : '20px',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 800,
                  transform: done ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.18s ease',
                  boxShadow: done ? '0 4px 12px rgba(76,175,80,0.3)' : '0 2px 6px rgba(0,0,0,0.07)',
                }}
              >
                {done ? '✓' : i + 1}
              </button>
            )
          })}
        </div>

        {allFive && (
          <SuccessCard>
            Perfect! That tongue movement starts every single flute note. 🎵
          </SuccessCard>
        )}
      </LessonCard>
    )
  }

  // ── Step 1 — Whisper into your hand ─────────────────────────────────────
  if (step === 1) {
    return (
      <LessonCard
        {...shared}
        nextLabel={handResponse ? 'Next →' : null}
        nextDisabled={false}
        onNext={() => setStep(2)}
      >
        <h1 style={H}>Whisper into your hand</h1>
        <p style={BODY}>Hold your hand just in front of your mouth.</p>

        {/* Emoji illustration */}
        <div style={{ textAlign: 'center', margin: '12px 0 24px' }}>
          <span style={{ fontSize: '80px' }}>🤚</span>
          <p style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 600,
            fontSize: '15px', color: '#888888', margin: '8px 0 0',
          }}>
            about 10 cm away
          </p>
        </div>

        <p style={BODY2}>
          Whisper <strong>tuh tuh tuh</strong> and feel a little puff of air on your palm each time.
        </p>
        <TipCard>
          It should feel like a quick, light tap of air — not a big blast.
        </TipCard>

        {handResponse === null && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setHandResponse('yes')}
              style={{
                flex: 1, height: 56, padding: '0 24px', borderRadius: 28, border: 'none',
                background: 'linear-gradient(to right, #006EE9, #0056C7)',
                color: '#FFFFFF', fontFamily: 'Nunito, sans-serif',
                fontWeight: 700, fontSize: '18px', cursor: 'pointer',
              }}
            >
              Yes! I can feel it 👋
            </button>
            <button
              onClick={() => setHandResponse('no')}
              style={{
                flex: 1, height: 56, padding: '0 24px', borderRadius: 28,
                border: '2px solid #EEEEEE', background: '#FFFFFF',
                color: '#666666', fontFamily: 'Nunito, sans-serif',
                fontWeight: 600, fontSize: '18px', cursor: 'pointer',
              }}
            >
              I can't feel anything
            </button>
          </div>
        )}

        {handResponse === 'no' && (
          <TipCard>
            Try saying it a bit more strongly — like spitting out a tiny pip 🫒 Then try again!
          </TipCard>
        )}
        {handResponse === 'yes' && (
          <SuccessCard>
            Brilliant! That puff is your tuh in action 🌬️
          </SuccessCard>
        )}
      </LessonCard>
    )
  }

  // ── Step 2 — Try it on the headjoint ────────────────────────────────────
  if (step === 2) {
    return (
      <LessonCard
        {...shared}
        nextLabel="I'll try it! →"
        nextDisabled={false}
        onNext={() => setStep(3)}
      >
        <h1 style={H}>Try it on the headjoint</h1>
        <p style={BODY}>Use just the headjoint — the top piece — for this step.</p>
        <p style={BODY2}>
          Get your lip shape, start your steady air… then add your tongue: <strong>tuh</strong>
        </p>
        <TipCard>
          The <strong>tuh</strong> starts the note — the breath keeps it going.
          Think of your tongue as a light switch, not a door stopper.
        </TipCard>

        <ComparePanel
          wrongLabel="✗ No tongue"
          wrongDesc="blurry, joined-up sound"
          wrongSvg={WaveContinuous}
          rightLabel="✓ With tongue"
          rightDesc="clean, crisp start"
          rightSvg={WaveClean}
        />
      </LessonCard>
    )
  }

  // ── Step 3 — Tuh in time (metronome + mic) ───────────────────────────────
  if (step === 3) {
    return (
      <>
        <LessonCard
          {...shared}
          nextLabel={null}
          nextDisabled={true}
          onNext={null}
        >
          <h1 style={H}>Tuh in time 🎵</h1>

          {/* B4 fingering reminder */}
          <div style={{
            background: '#FFF8EE', borderRadius: 12, padding: '12px 16px',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>🎶</span>
            <div>
              <p style={{
                fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                fontSize: 16, color: '#2D2D2D', margin: 0,
              }}>
                Finger B — your first note!
              </p>
              <p style={{
                fontFamily: 'Nunito, sans-serif', fontSize: 14,
                color: '#888888', margin: 0,
              }}>
                Left thumb + first finger only. No right-hand keys.
              </p>
            </div>
          </div>

          <p style={BODY}>Put your whole flute together and tongue once per beat:</p>
          <p style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 800,
            fontSize: '22px', color: '#2D2D2D', textAlign: 'center',
            letterSpacing: 6, margin: '0 0 4px',
          }}>
            tuh — tuh — tuh — tuh
          </p>

          <Pendulum />

          {/* 4-tick progress indicator */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '4px 0 20px' }}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  border: i < consecutiveTicks ? 'none' : '2.5px solid #EEEEEE',
                  background: i < consecutiveTicks ? '#4CAF50' : '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, color: '#FFFFFF',
                  boxShadow: i < consecutiveTicks ? '0 3px 10px rgba(76,175,80,0.3)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {i < consecutiveTicks ? '✓' : ''}
              </div>
            ))}
          </div>

          <MicActivityBar onLevel={handleMetronomeLevel} />

          {showTip && !badgeVisible && (
            <div style={{
              marginTop: 20, background: '#FFF8EE',
              borderRadius: 16, padding: '20px 20px',
              animation: 'f-slide-in 280ms ease-out',
            }}>
              <p style={{
                fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                fontSize: 18, color: '#2D2D2D', margin: '0 0 8px', lineHeight: 1.5,
              }}>
                Tip: don't stop your breath between tuhs 💨
              </p>
              <p style={{
                fontFamily: 'Nunito, sans-serif', fontSize: 16,
                color: '#666666', margin: 0, lineHeight: 1.5,
              }}>
                The breath is always flowing — your tongue just <em>taps</em> it once
                per beat to start each note.
              </p>
            </div>
          )}
        </LessonCard>

        <BadgePopup
          visible={badgeVisible}
          badgeKey="cleanTongue"
          badgeName="Clean Tongue!"
          badgeEmoji="👅"
          description="Your tuh is right in time! That's a proper flute technique!"
          onContinue={() => {
            setBadgeVisible(false)
            setCardIdx(0)
            setStep(4)
          }}
        />
      </>
    )
  }

  // ── Step 4 — Watch out for these! ────────────────────────────────────────
  if (step === 4) {
    const CARDS = [
      {
        title: 'The Huh attack',
        tip: "Starting with 'huh' instead of 'tuh' makes the note sound fuzzy. Always start with your tongue!",
        wrongLabel: '✗ Huh', wrongDesc: 'fuzzy, blurry start',  wrongSvg: WaveContinuous,
        rightLabel: '✓ Tuh', rightDesc: 'clean, crisp start',   rightSvg: WaveClean,
      },
      {
        title: 'The Hard T',
        tip: "If your T is too hard it sounds harsh. Keep it light — like a gentle tap, not a punch.",
        wrongLabel: '✗ Too hard', wrongDesc: 'spitty or harsh',     wrongSvg: WaveHard,
        rightLabel: '✓ Gentle',   rightDesc: 'light and clean',    rightSvg: WaveGentleTap,
      },
      {
        title: 'The Late T',
        tip: "If you wait too long between tuhs, notes blur together. Each note needs its own fresh tuh.",
        wrongLabel: '✗ Too slow', wrongDesc: 'notes blend',      wrongSvg: WaveBlurred,
        rightLabel: '✓ In time',  rightDesc: 'each note clear',  rightSvg: WaveSeparate,
      },
    ]

    // Completion screen
    if (cardIdx >= CARDS.length) {
      return (
        <LessonCard
          {...shared}
          nextLabel="Start Level 1! 🎵"
          nextDisabled={false}
          onNext={handleModuleComplete}
        >
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
            <h1 style={{ ...H, textAlign: 'center' }}>You've learned the T attack!</h1>
            <p style={{ ...BODY2, textAlign: 'center' }}>
              You now know everything you need to play your first note. Let's make some music!
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Lip shape', emoji: '💋' },
              { label: 'Steady breath', emoji: '💨' },
              { label: 'Tuh attack', emoji: '👅' },
            ].map(({ label, emoji }) => (
              <div
                key={label}
                style={{
                  background: '#F0FBF0', borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}
              >
                <span style={{ fontSize: 26 }}>{emoji}</span>
                <span style={{
                  fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                  fontSize: 18, color: '#2E7D32',
                }}>
                  {label} ✓
                </span>
              </div>
            ))}
          </div>
        </LessonCard>
      )
    }

    // Cards 0–2
    const card = CARDS[cardIdx]
    return (
      <LessonCard
        {...shared}
        nextLabel={cardIdx < CARDS.length - 1 ? `Next (${cardIdx + 1}/${CARDS.length}) →` : 'Finish →'}
        nextDisabled={false}
        onNext={() => setCardIdx(cardIdx + 1)}
      >
        <h1 style={H}>Watch out for these!</h1>

        <p style={{
          fontFamily: 'Nunito, sans-serif', fontWeight: 600,
          fontSize: '16px', color: '#888888', margin: '0 0 16px',
        }}>
          {cardIdx + 1} of {CARDS.length} — {card.title}
        </p>

        <div style={{
          background: '#FFFFFF', borderRadius: 16, padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 16,
          animation: 'f-slide-in 280ms ease-out',
        }}>
          <p style={{
            fontFamily: 'Nunito, sans-serif', fontWeight: 800,
            fontSize: '20px', color: '#2D2D2D', margin: '0 0 14px',
          }}>
            {card.title}
          </p>
          <ComparePanel
            wrongLabel={card.wrongLabel} wrongDesc={card.wrongDesc} wrongSvg={card.wrongSvg}
            rightLabel={card.rightLabel} rightDesc={card.rightDesc} rightSvg={card.rightSvg}
          />
          <TipCard>{card.tip}</TipCard>
        </div>
      </LessonCard>
    )
  }

  return null
}
