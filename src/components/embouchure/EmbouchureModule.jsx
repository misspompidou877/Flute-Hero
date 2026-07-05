import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import LessonCard from '../foundations/LessonCard'
import BadgePopup from '../foundations/BadgePopup'
import MirrorPrompt from '../foundations/MirrorPrompt'
import MicActivityBar from '../foundations/MicActivityBar'
import { useFoundationsProgress } from '../../hooks/useFoundationsProgress'
import LipShapeStep from './LipShapeStep'

const TOTAL_STEPS = 5
const SOUND_REQUIRED_MS = 1000  // 1 second of detected sound → badge
const NO_SOUND_PROMPT_MS = 45000 // 45 seconds with nothing → help prompt

// ── Shared text styles (Foundations scale) ─────────────────────────────────
const H = {
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 800,
  fontSize: '36px',
  color: '#0B3D3A',
  marginBottom: '16px',
  marginTop: 0,
  lineHeight: 1.2,
}
const BODY = {
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 600,
  fontSize: '20px',
  color: '#0B3D3A',
  margin: '0 0 12px',
  lineHeight: 1.5,
}
const BODY2 = {
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 600,
  fontSize: '20px',
  color: '#666666',
  margin: '0 0 24px',
  lineHeight: 1.5,
}

// ── Tip / Warning / Success cards ─────────────────────────────────────────
function TipCard({ children }) {
  return (
    <div
      style={{
        background: '#FAFAF8',
        borderLeft: '3px solid #26CCC2',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '16px',
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 500,
        fontSize: '18px',
        color: '#0B3D3A',
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  )
}

function WarningCard({ children }) {
  return (
    <div
      style={{
        background: '#FFF3F3',
        borderLeft: '3px solid #F06292',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '16px',
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 500,
        fontSize: '18px',
        color: '#0B3D3A',
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  )
}

// ── SVG: Breath comparison ─────────────────────────────────────────────────
function BreathComparison() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        margin: '16px 0 24px',
      }}
    >
      {/* Steady breath */}
      <div
        style={{
          flex: 1,
          background: '#F0FBF0',
          borderLeft: '3px solid #26CCC2',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <svg viewBox="0 0 120 48" style={{ width: '100%', marginBottom: '8px' }} aria-hidden="true">
          <path
            d="M5,24 C20,8 35,40 55,24 C75,8 90,40 115,24"
            stroke="#26CCC2"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="200"
              to="0"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dasharray"
              values="200 200;200 0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <p
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            color: '#26CCC2',
            margin: 0,
          }}
        >
          ✓ Steady
        </p>
        <p
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            color: '#666666',
            margin: '4px 0 0',
            lineHeight: 1.3,
          }}
        >
          beautiful sound
        </p>
      </div>

      {/* Puffed breath */}
      <div
        style={{
          flex: 1,
          background: '#FFF3F3',
          borderLeft: '3px solid #F06292',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <svg viewBox="0 0 120 48" style={{ width: '100%', marginBottom: '8px' }} aria-hidden="true">
          {[5, 22, 38, 55, 72, 88, 105].map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={i % 2 === 0 ? 8 : 38}
              x2={x + 12}
              y2={i % 2 === 0 ? 38 : 8}
              stroke="#F06292"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <p
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            color: '#F06292',
            margin: 0,
          }}
        >
          ✗ Too puffed
        </p>
        <p
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            color: '#666666',
            margin: '4px 0 0',
            lineHeight: 1.3,
          }}
        >
          makes a squeak
        </p>
      </div>
    </div>
  )
}

// ── SVG: Hand position diagram ─────────────────────────────────────────────
function HandPositionDiagram() {
  return (
    <svg
      viewBox="0 0 300 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '300px', display: 'block', margin: '8px auto 24px' }}
      aria-label="Flute hand position diagram showing left hand on top, right hand below"
    >
      {/* Flute body — horizontal tube */}
      <rect x="16" y="80" width="268" height="22" rx="11" fill="#D0D0D0" stroke="#BBBBBB" strokeWidth="1.5" />
      {/* Key holes (simplified circles) */}
      {[80, 110, 140, 170, 200, 230].map((x, i) => (
        <circle key={i} cx={x} cy="91" r="6" fill="#999999" />
      ))}

      {/* Left hand bracket (top area) */}
      <path d="M68,72 L68,58 L175,58 L175,72" stroke="#26CCC2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <text x="122" y="50" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="14" fontWeight="800" fill="#26CCC2">
        LEFT HAND 🫲
      </text>

      {/* Right hand bracket (bottom area) */}
      <path d="M175,110 L175,128 L262,128 L262,110" stroke="#26CCC2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <text x="218" y="146" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="14" fontWeight="800" fill="#26CCC2">
        RIGHT HAND 🫱
      </text>

      {/* Angle arrow — flute points slightly right */}
      <defs>
        <marker id="hand-arr" markerWidth="8" markerHeight="7" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="#888888" />
        </marker>
      </defs>
      <path d="M270,91 Q290,91 290,75" stroke="#888888" strokeWidth="2" markerEnd="url(#hand-arr)" fill="none" />
      <text x="284" y="65" textAnchor="middle" fontFamily="Nunito, sans-serif" fontSize="11" fill="#888888">
        tilt right
      </text>
    </svg>
  )
}

// ── SVG: Large flute for first sound step ─────────────────────────────────
function LargeFluteGraphic() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 20px' }}>
      <svg
        viewBox="0 0 280 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', maxWidth: '280px' }}
        aria-hidden="true"
      >
        <style>{`
          @keyframes flute-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          .flute-group {
            animation: flute-float 2.5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .flute-group { animation: none; }
          }
        `}</style>
        <g className="flute-group">
          {/* Tube */}
          <rect x="10" y="28" width="260" height="24" rx="12" fill="#C8A96E" />
          <rect x="10" y="28" width="260" height="24" rx="12" fill="none" stroke="#A0824A" strokeWidth="1.5" />
          {/* Embouchure hole */}
          <ellipse cx="42" cy="40" rx="14" ry="9" fill="#7A5E2A" />
          {/* Key holes */}
          {[90, 120, 150, 180, 210, 240].map((x, i) => (
            <circle key={i} cx={x} cy="40" r="5" fill="#7A5E2A" />
          ))}
          {/* End cap */}
          <ellipse cx="270" cy="40" rx="9" ry="12" fill="#A0824A" />
          {/* Shine */}
          <rect x="14" y="30" width="250" height="5" rx="2" fill="#E8D4A8" opacity="0.5" />
        </g>
      </svg>
    </div>
  )
}

// ── Main module ────────────────────────────────────────────────────────────
export default function EmbouchureModule() {
  const navigate = useNavigate()
  const { markModuleComplete, saveLastStep } = useFoundationsProgress()

  const [step, setStepRaw] = useState(0)
  const [badgeVisible, setBadgeVisible] = useState(false)

  // Step 1 state
  const [mirrorConfirmed, setMirrorConfirmed] = useState(false)

  // Step 2 state
  const [breathResponse, setBreathResponse] = useState(null) // null | 'yes' | 'puffly'

  // Step 4 state
  const [showHelp, setShowHelp] = useState(false)
  const soundStartRef = useRef(null)
  const badgeShownRef = useRef(false)
  const helpTimerRef = useRef(null)

  const setStep = useCallback(
    (s) => {
      setStepRaw(s)
      saveLastStep('embouchure', s)
    },
    [saveLastStep]
  )

  const handleModuleComplete = useCallback(() => {
    markModuleComplete('embouchure')
    navigate('/foundations')
  }, [markModuleComplete, navigate])

  const handlePrev = useCallback(() => {
    if (step > 0) {
      // Reset step-specific state when going back
      if (step === 1) setMirrorConfirmed(false)
      if (step === 2) setBreathResponse(null)
      if (step === 4) {
        setShowHelp(false)
        soundStartRef.current = null
        badgeShownRef.current = false
        if (helpTimerRef.current) { clearTimeout(helpTimerRef.current); helpTimerRef.current = null }
      }
      setStep(step - 1)
    } else {
      navigate('/foundations')
    }
  }, [step, setStep, navigate])

  // 45-second help timer for step 4
  useEffect(() => {
    if (step !== 4) return
    helpTimerRef.current = setTimeout(() => setShowHelp(true), NO_SOUND_PROMPT_MS)
    return () => {
      if (helpTimerRef.current) { clearTimeout(helpTimerRef.current); helpTimerRef.current = null }
    }
  }, [step])

  // Mic level handler for step 4
  const handleMicLevel = useCallback((rms) => {
    if (badgeShownRef.current) return
    if (rms > 0.018) {
      if (!soundStartRef.current) {
        soundStartRef.current = Date.now()
      } else if (Date.now() - soundStartRef.current >= SOUND_REQUIRED_MS) {
        badgeShownRef.current = true
        if (helpTimerRef.current) { clearTimeout(helpTimerRef.current); helpTimerRef.current = null }
        setBadgeVisible(true)
      }
    } else {
      soundStartRef.current = null
    }
  }, [])

  const sharedCardProps = {
    total: TOTAL_STEPS,
    current: step,
    onPrev: handlePrev,
    showPrev: step > 0,
  }

  // ── Step 0 — Headjoint ──────────────────────────────────────────────────
  if (step === 0) {
    return (
      <LessonCard
        {...sharedCardProps}
        showPrev={false}
        nextLabel="Got it — I'll try!"
        nextDisabled={false}
        onNext={() => setStep(1)}
      >
        <h1 style={H}>Start with just the head joint</h1>
        <p style={BODY}>
          Take off the head joint — the top piece of your flute. Hold it up to your lips.
        </p>
        <img
          src="/images/Headjoint of flute.png"
          alt="The head joint of a flute, showing the mouth plate and embouchure hole"
          style={{
            width: '100%',
            borderRadius: '16px',
            marginBottom: '24px',
            display: 'block',
          }}
        />
        <TipCard>
          Rest it on the bottom edge of your lip — your <strong>bottom lip</strong> should be on the <strong>mouth plate</strong>.
        </TipCard>
        <WarningCard>
          Don't blow straight <strong>INTO</strong> the hole — blow <strong>ACROSS</strong> it, like blowing across the top of a bottle.
        </WarningCard>

        {/* ── Reference photos ── */}
        <p style={{ ...BODY, marginTop: 8, marginBottom: 12 }}>Here's what it should look like:</p>

        {/* Correct embouchure — face view showing lip placement on headjoint */}
        <img
          src="/images/correct-embouchure.png"
          alt="Close-up of a flautist's face showing correct embouchure: lips relaxed and centred on the headjoint"
          style={{
            width: '100%',
            borderRadius: '16px',
            marginBottom: '12px',
            display: 'block',
          }}
        />

        {/* Correct embouchure — close-up of lip-to-hole contact */}
        <img
          src="/images/correct-embouchure-2.png"
          alt="Close-up of lips positioned correctly on the embouchure hole — lower lip resting just below the hole, aperture centred"
          style={{
            width: '100%',
            borderRadius: '16px',
            marginBottom: '8px',
            display: 'block',
          }}
        />
      </LessonCard>
    )
  }

  // ── Step 1 — Lip shape ─────────────────────────────────────────────────
  if (step === 1) {
    return (
      <LessonCard
        {...sharedCardProps}
        nextLabel="Ready to try!"
        nextDisabled={!mirrorConfirmed}
        onNext={() => setStep(2)}
      >
        <h1 style={H}>The lip shape</h1>
        <p style={BODY}>Smile a little with your cheeks feeling a little tight, then make an <strong>ooh</strong> shape with your lips — like you are about to blow out a candle.</p>
        <p style={BODY2}>Your cheek muscles should be working — it's normal to feel like your cheeks are 'tired' after you practise, like you have been smiling too much! Don't worry, your muscles will get stronger every time you practise.</p>
        <LipShapeStep />
        <MirrorPrompt onConfirm={() => setMirrorConfirmed(true)} />
      </LessonCard>
    )
  }

  // ── Step 2 — Breath support ────────────────────────────────────────────
  if (step === 2) {
    return (
      <LessonCard
        {...sharedCardProps}
        nextLabel={breathResponse ? 'Next →' : null}
        nextDisabled={false}
        onNext={() => setStep(3)}
      >
        <h1 style={H}>The breath</h1>
        <p style={BODY}>
          Breathe out slowly and <strong>steadily</strong> — like you could keep going for 5 whole seconds.
        </p>
        <BreathComparison />
        <p style={BODY2}>
          Hold your hand in front of your mouth. Can you feel a smooth, even breeze?
        </p>

        {breathResponse === null && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setBreathResponse('yes')}
              style={{
                height: '56px',
                padding: '0 24px',
                borderRadius: '28px',
                border: 'none',
                background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
                color: '#0B3D3A',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              Yes! I can feel it 💨
            </button>
            <button
              onClick={() => setBreathResponse('puffly')}
              style={{
                height: '56px',
                padding: '0 24px',
                borderRadius: '28px',
                border: '2px solid #EEEEEE',
                background: '#FFFFFF',
                color: '#666666',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              Mine feels puffly
            </button>
          </div>
        )}

        {breathResponse === 'puffly' && (
          <TipCard>
            Try making a <strong>'sssss'</strong> sound instead — that steady hiss is exactly the feeling you're after!
          </TipCard>
        )}

        {breathResponse === 'yes' && (
          <div
            style={{
              background: '#F0FBF0',
              borderLeft: '3px solid #26CCC2',
              borderRadius: '12px',
              padding: '16px 20px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 600,
              fontSize: '18px',
              color: '#2E7D32',
            }}
          >
            Yes! That's it! 🎉
          </div>
        )}
      </LessonCard>
    )
  }

  // ── Step 3 — Hand position ─────────────────────────────────────────────
  if (step === 3) {
    return (
      <LessonCard
        {...sharedCardProps}
        nextLabel="I'm holding it! →"
        nextDisabled={false}
        onNext={() => setStep(4)}
      >
        <h1 style={H}>Hold the flute</h1>
        <p style={BODY}>Put your flute back together now.</p>
        <img
          src="/images/close-up-photo-teenage-boy-playing.png"
          alt="Close-up of a young flute player holding the flute correctly: left hand on top, right hand below"
          style={{
            width: '100%',
            borderRadius: '16px',
            marginBottom: '16px',
            display: 'block',
          }}
        />
        <p style={BODY2}>Left hand goes on top — right hand goes below.</p>
        <TipCard>
          Hold it gently — like you're holding a baby bird 🐣 Not too tight!
        </TipCard>
        <WarningCard>
          Keep the flute pointing slightly to the right — not straight out in front of you.
        </WarningCard>
      </LessonCard>
    )
  }

  // ── Step 4 — First sound ───────────────────────────────────────────────
  if (step === 4) {
    return (
      <>
        <LessonCard
          {...sharedCardProps}
          nextLabel={null}
          nextDisabled={true}
          onNext={null}
        >
          <h1 style={H}>Make your first sound</h1>
          <LargeFluteGraphic />
          <p style={BODY}>Put your flute together. Press <strong>no keys</strong>.</p>
          <p style={BODY2}>Use your soup-cooling air and… blow! 🎵</p>

          {/* Mic activity bar */}
          <MicActivityBar onLevel={handleMicLevel} />

          {/* 45-second help prompt — slides up from below content, not a modal */}
          {showHelp && !badgeVisible && (
            <div
              style={{
                marginTop: '24px',
                background: '#FAFAF8',
                borderRadius: '16px',
                padding: '20px',
                animation: 'f-slide-in 280ms ease-out',
              }}
            >
              <p
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  color: '#0B3D3A',
                  margin: '0 0 12px',
                  lineHeight: 1.5,
                }}
              >
                Still nothing? That's okay — this is the trickiest part.
              </p>
              <p
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '16px',
                  color: '#666666',
                  margin: '0 0 16px',
                  lineHeight: 1.5,
                }}
              >
                A real teacher can fix this in 5 minutes. Keep trying — or come back and try again later!
              </p>
              <button
                onClick={() => navigate('/foundations')}
                style={{
                  height: '48px',
                  padding: '0 24px',
                  borderRadius: '24px',
                  border: '2px solid #EEEEEE',
                  background: '#FFFFFF',
                  color: '#666666',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 600,
                  fontSize: '17px',
                  cursor: 'pointer',
                }}
              >
                ← Back to modules
              </button>
            </div>
          )}
        </LessonCard>

        <BadgePopup
          visible={badgeVisible}
          badgeKey="firstBreath"
          badgeName="First Breath!"
          badgeEmoji="🌬️"
          description="You just played your very first flute note! That's huge! 🎉"
          onContinue={() => {
            setBadgeVisible(false)
            handleModuleComplete()
          }}
        />
      </>
    )
  }

  return null
}
