import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LessonCard from '../foundations/LessonCard'
import NoteReadingSection from './NoteReadingSection'
import NoteValueLesson from './NoteValueLesson'
import { useFoundationsProgress } from '../../hooks/useFoundationsProgress'

const headingStyle = {
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 800,
  fontSize: '36px',
  color: '#2D2D2D',
  marginBottom: '16px',
  lineHeight: 1.2,
}

const bodyStyle = {
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 600,
  fontSize: '20px',
  color: '#2D2D2D',
  marginBottom: '12px',
  lineHeight: 1.5,
}

const body2Style = {
  fontFamily: 'Nunito, sans-serif',
  fontWeight: 600,
  fontSize: '20px',
  color: '#666666',
  marginBottom: '24px',
  lineHeight: 1.5,
}

// Total phases for the progress dots shown in LessonCard
// Phase 0 is full-screen (no LessonCard wrapper) so dots start from phase 1
const TOTAL_PHASES = 4

export default function NoteReadingModule() {
  const navigate = useNavigate()
  const { markModuleComplete } = useFoundationsProgress()

  const [phase, setPhase] = useState(0)

  // ── Phase 0: Interactive note reading section (full-screen, no LessonCard) ──
  if (phase === 0) {
    return <NoteReadingSection onComplete={() => setPhase(1)} />
  }

  // ── Phase 1: Crotchet ──
  if (phase === 1) {
    return (
      <LessonCard
        total={TOTAL_PHASES}
        current={1}
        onPrev={() => setPhase(0)}
        showPrev
        nextLabel="Next"
        nextDisabled={false}
        onNext={() => setPhase(2)}
      >
        <h1 style={headingStyle}>Note Values: Crotchet</h1>
        <p style={bodyStyle}>A crotchet (quarter note) lasts for 1 beat.</p>
        <p style={body2Style}>Tap the beat as you count "1".</p>
        <NoteValueLesson noteType="crotchet" />
      </LessonCard>
    )
  }

  // ── Phase 2: Minim ──
  if (phase === 2) {
    return (
      <LessonCard
        total={TOTAL_PHASES}
        current={2}
        onPrev={() => setPhase(1)}
        showPrev
        nextLabel="Next"
        nextDisabled={false}
        onNext={() => setPhase(3)}
      >
        <h1 style={headingStyle}>Note Values: Minim</h1>
        <p style={bodyStyle}>A minim (half note) lasts for 2 beats.</p>
        <p style={body2Style}>Hold it twice as long as a crotchet.</p>
        <NoteValueLesson noteType="minim" />
      </LessonCard>
    )
  }

  // ── Phase 3: Quaver (final step) ──
  if (phase === 3) {
    return (
      <LessonCard
        total={TOTAL_PHASES}
        current={3}
        onPrev={() => setPhase(2)}
        showPrev
        nextLabel="Finish"
        nextDisabled={false}
        onNext={() => {
          markModuleComplete('noteReading')
          navigate('/foundations')
        }}
      >
        <h1 style={headingStyle}>Note Values: Quaver</h1>
        <p style={bodyStyle}>A quaver (eighth note) lasts for half a beat.</p>
        <p style={body2Style}>It's twice as fast as a crotchet!</p>
        <NoteValueLesson noteType="quaver" />
      </LessonCard>
    )
  }

  return null
}
