import { useState, useEffect, useCallback } from 'react'
import StaffDisplay from './StaffDisplay'
import { playTone, NOTE_FREQUENCIES } from '../../utils/playTone'

const NOTE_COLORS = {
  G4: '#006EE9',
  A4: '#F06292',
  B4: '#A855F7',
  C5: '#4CAF50',
  D5: '#FFC107',
}

const NOTE_POSITIONS = {
  G4: { x: 300, y: 160 },
  A4: { x: 300, y: 145 },
  B4: { x: 300, y: 130 },
  C5: { x: 300, y: 115 },
  D5: { x: 300, y: 100 },
}

const ALL_NOTES = ['G4', 'A4', 'B4', 'C5', 'D5']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getChoices(correct) {
  const others = ALL_NOTES.filter((n) => n !== correct)
  const distractors = shuffle(others).slice(0, 2)
  return shuffle([correct, ...distractors])
}

export default function NameThatNoteGame({ onComplete }) {
  const [questions] = useState(() => shuffle(ALL_NOTES))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [choices, setChoices] = useState(() => getChoices(shuffle(ALL_NOTES)[0]))
  const [feedback, setFeedback] = useState(null)
  const [feedbackNote, setFeedbackNote] = useState(null)
  const [score, setScore] = useState(0)
  const [answeredAll, setAnsweredAll] = useState(false)

  useEffect(() => {
    if (questions[currentIndex]) {
      setChoices(getChoices(questions[currentIndex]))
      setFeedback(null)
      setFeedbackNote(null)
    }
  }, [currentIndex, questions])

  const handleChoice = useCallback(
    (chosen) => {
      if (feedback !== null) return
      const correct = questions[currentIndex]
      if (chosen === correct) {
        playTone(1047, 0.3)
        setFeedback('correct')
        setFeedbackNote(chosen)
        setScore((s) => s + 1)

        setTimeout(() => {
          const nextIndex = currentIndex + 1
          if (nextIndex >= questions.length) {
            setAnsweredAll(true)
            setTimeout(() => {
              onComplete && onComplete()
            }, 500)
          } else {
            setCurrentIndex(nextIndex)
          }
        }, 700)
      } else {
        playTone(200, 0.3)
        setFeedback('wrong')
        setFeedbackNote(chosen)
        setTimeout(() => {
          setFeedback(null)
          setFeedbackNote(null)
        }, 600)
      }
    },
    [feedback, questions, currentIndex, onComplete]
  )

  if (answeredAll) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <div
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: '24px',
            color: '#2D2D2D',
          }}
        >
          You got them all!
        </div>
      </div>
    )
  }

  const currentNote = questions[currentIndex]
  const singleNote = {
    id: currentNote,
    x: NOTE_POSITIONS[currentNote].x,
    y: NOTE_POSITIONS[currentNote].y,
    color: NOTE_COLORS[currentNote],
  }

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <div style={{ fontSize: '16px', color: '#999999' }}>
          Note {currentIndex + 1} of 5
        </div>
        <div style={{ fontSize: '16px', color: '#999999' }}>{score}/5</div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <StaffDisplay mode="single" singleNote={singleNote} />
      </div>

      <div
        style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 600,
          color: '#666666',
          marginBottom: '24px',
        }}
      >
        Which note is this?
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          justifyContent: 'center',
        }}
      >
        {choices.map((choice) => {
          const isCorrectFeedback = feedback === 'correct' && feedbackNote === choice
          const isWrongFeedback = feedback === 'wrong' && feedbackNote === choice

          let bg = '#FFFFFF'
          let color = '#2D2D2D'
          let border = '2px solid #EEEEEE'
          let anim = 'none'

          if (isCorrectFeedback) {
            bg = '#4CAF50'
            color = '#FFFFFF'
            border = 'none'
            anim = 'f-pop 0.3s ease-out'
          } else if (isWrongFeedback) {
            bg = '#FFF8EE'
            color = '#FFFFFF'
            border = 'none'
            anim = 'f-wobble 0.4s ease-out'
          }

          return (
            <button
              key={choice}
              onClick={() => handleChoice(choice)}
              style={{
                height: '56px',
                minWidth: '80px',
                flex: 1,
                borderRadius: '28px',
                border,
                background: bg,
                color,
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: '22px',
                cursor: 'pointer',
                animation: anim,
              }}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}
