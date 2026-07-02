import { useState, useEffect, useCallback } from 'react'
import StaffNoteGuide from './StaffNoteGuide'
import { useBadges } from '../../hooks/useBadges'
import {
  QUIZ_NOTE_POOL,
  READ_MUSIC_FREQUENCIES,
} from '../../data/readMusicData'
import { playTone } from '../../utils/playTone'

// ── Mnemonic hint data ────────────────────────────────────────────────────────
const MNEMONIC_LINE = {
  words: ['Every', 'Good', 'Boy', 'Deserves', 'Fruit'],
  notes: ['E4',    'G4',   'B4',  'D5',        'F5'],
}

const FACE_COLORS = { F4: '#83E7FF', A4: '#006EE9', C5: '#D0FFA3', E5: '#E7A0FE' }

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestions() {
  // 9 notes, need 10 questions — shuffle all 9 then add one random repeat
  const shuffled = shuffle([...QUIZ_NOTE_POOL])
  const extra    = QUIZ_NOTE_POOL[Math.floor(Math.random() * QUIZ_NOTE_POOL.length)]
  return [...shuffled, extra]
}

function getChoices(correct) {
  const others     = QUIZ_NOTE_POOL.filter(n => n !== correct)
  const distractors = shuffle(others).slice(0, 3)
  return shuffle([correct, ...distractors])
}

function getLetter(noteId) { return noteId.replace(/\d/, '') }

// ── Mnemonic hint rendered inline ─────────────────────────────────────────────
function MnemonicHint({ noteId }) {
  const lineIdx  = MNEMONIC_LINE.notes.indexOf(noteId)
  const isLine   = lineIdx !== -1
  const faceColor = FACE_COLORS[noteId]

  if (isLine) {
    return (
      <div style={{
        background: '#FFF8EE',
        border: '1.5px solid #006EE9',
        borderRadius: 12,
        padding: '10px 14px',
        marginTop: 12,
        textAlign: 'center',
        fontFamily: 'Nunito, sans-serif',
      }}>
        <p style={{ fontSize: 13, color: '#999999', margin: '0 0 6px', fontWeight: 600 }}>
          Hint — Lines mnemonic:
        </p>
        <p style={{ fontSize: 16, margin: 0, fontWeight: 700, lineHeight: 1.6 }}>
          {MNEMONIC_LINE.words.map((word, i) => (
            <span
              key={word}
              style={{
                color: MNEMONIC_LINE.notes[i] === noteId ? '#006EE9' : '#2D2D2D',
                fontWeight: MNEMONIC_LINE.notes[i] === noteId ? 900 : 600,
                marginRight: i < 4 ? 6 : 0,
              }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    )
  }

  // Space note — FACE hint
  const faceLetters = [
    { l: 'F', noteId: 'F4', color: FACE_COLORS.F4 },
    { l: 'A', noteId: 'A4', color: FACE_COLORS.A4 },
    { l: 'C', noteId: 'C5', color: FACE_COLORS.C5 },
    { l: 'E', noteId: 'E5', color: FACE_COLORS.E5 },
  ]

  return (
    <div style={{
      background: '#FFF8EE',
      border: '1.5px solid #006EE9',
      borderRadius: 12,
      padding: '10px 14px',
      marginTop: 12,
      textAlign: 'center',
      fontFamily: 'Nunito, sans-serif',
    }}>
      <p style={{ fontSize: 13, color: '#999999', margin: '0 0 8px', fontWeight: 600 }}>
        Hint — the spaces spell:
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        {faceLetters.map(({ l, noteId: nId, color }) => (
          <span
            key={l}
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: nId === noteId ? color : '#CCCCCC',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function NoteNameQuiz() {
  const { earnBadge } = useBadges()

  const [phase,         setPhase]         = useState('idle')    // 'idle' | 'playing' | 'complete'
  const [questions,     setQuestions]     = useState([])        // string[] of noteIds
  const [currentIdx,    setCurrentIdx]    = useState(0)
  const [choices,       setChoices]       = useState([])        // 4 note IDs for current question
  const [score,         setScore]         = useState(0)
  const [isLocked,      setIsLocked]      = useState(false)     // block taps during feedback
  const [feedback,      setFeedback]      = useState(null)      // null | 'correct' | 'wrong'
  const [selectedChoice, setSelectedChoice] = useState(null)    // which button was tapped
  const [shakeKey,      setShakeKey]      = useState(0)         // force shake re-trigger
  const [badgeEarned,   setBadgeEarned]   = useState(false)

  const currentNoteId = questions[currentIdx]

  // ── Start / restart quiz ──────────────────────────────────────────────────
  const startQuiz = useCallback(() => {
    const qs = generateQuestions()
    setQuestions(qs)
    setCurrentIdx(0)
    setChoices(getChoices(qs[0]))
    setScore(0)
    setFeedback(null)
    setSelectedChoice(null)
    setIsLocked(false)
    setBadgeEarned(false)
    setPhase('playing')
  }, [])

  // Update choices when question advances
  useEffect(() => {
    if (phase === 'playing' && questions.length > 0) {
      setChoices(getChoices(questions[currentIdx]))
    }
  }, [currentIdx, questions, phase])

  // ── Handle a choice tap ───────────────────────────────────────────────────
  const handleChoice = useCallback((choiceId) => {
    if (isLocked || phase !== 'playing') return

    const isCorrect = getLetter(choiceId) === getLetter(currentNoteId)
    setSelectedChoice(choiceId)
    setIsLocked(true)

    if (isCorrect) {
      setFeedback('correct')
      setScore(s => s + 1)
      playTone(READ_MUSIC_FREQUENCIES[currentNoteId], 0.6)
      setTimeout(() => {
        if (currentIdx === 9) {
          setPhase('complete')
        } else {
          setCurrentIdx(i => i + 1)
          setFeedback(null)
          setSelectedChoice(null)
          setIsLocked(false)
        }
      }, 900)
    } else {
      setFeedback('wrong')
      setShakeKey(k => k + 1)
      setTimeout(() => {
        setFeedback(null)
        setSelectedChoice(null)
        setIsLocked(false)
        // Advance anyway after wrong — quiz is 10 fixed questions
        if (currentIdx === 9) {
          setPhase('complete')
        } else {
          setCurrentIdx(i => i + 1)
        }
      }, 1100)
    }
  }, [isLocked, phase, currentNoteId, currentIdx])

  // ── Award badge when quiz completes with perfect score ────────────────────
  useEffect(() => {
    if (phase !== 'complete') return
    if (score === 10) {
      earnBadge('note_reader')
      setBadgeEarned(true)
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render: idle ──────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '28px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎼</div>
        <h2 style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 800,
          fontSize: 22,
          color: '#2D2D2D',
          margin: '0 0 8px',
        }}>
          Note Name Quiz
        </h2>
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 600,
          fontSize: 16,
          color: '#666666',
          margin: '0 0 24px',
          lineHeight: 1.5,
        }}>
          10 questions — name each note on the staff.
          Score 10/10 to earn a badge! 🏆
        </p>
        <button
          onClick={startQuiz}
          style={{
            height: 52,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 999,
            border: 'none',
            background: 'linear-gradient(to right, #006EE9, #0056C7)',
            color: '#FFFFFF',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          Start Quiz →
        </button>
      </div>
    )
  }

  // ── Render: complete ──────────────────────────────────────────────────────
  if (phase === 'complete') {
    const isPerfect = score === 10
    return (
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '28px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>
          {isPerfect ? '🎉' : '🎵'}
        </div>
        <h2 style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 800,
          fontSize: 24,
          color: '#2D2D2D',
          margin: '0 0 8px',
        }}>
          {isPerfect ? 'Perfect score!' : 'Good effort!'}
        </h2>
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: 36,
          color: isPerfect ? '#4CAF50' : '#006EE9',
          margin: '8px 0 16px',
        }}>
          {score} / 10
        </p>

        {badgeEarned && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#FFF8EE',
            border: '2px solid #006EE9',
            borderRadius: 12,
            padding: '10px 18px',
            marginBottom: 20,
            animation: 'f-badge-in 0.4s ease',
          }}>
            <span style={{ fontSize: 28 }}>🎼</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: 15,
                color: '#2D2D2D',
                margin: 0,
              }}>
                Badge earned: Note Reader!
              </p>
              <p style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: 13,
                color: '#999999',
                margin: 0,
              }}>
                Named every note on the staff
              </p>
            </div>
          </div>
        )}

        {!isPerfect && (
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 16,
            color: '#666666',
            margin: '0 0 20px',
          }}>
            Try again to get a perfect score and earn the badge!
          </p>
        )}

        <button
          onClick={startQuiz}
          style={{
            height: 52,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 999,
            border: 'none',
            background: 'linear-gradient(to right, #006EE9, #0056C7)',
            color: '#FFFFFF',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          Play Again →
        </button>
      </div>
    )
  }

  // ── Render: playing ───────────────────────────────────────────────────────
  const isCorrectReveal = feedback === 'correct'
  const isWrongReveal   = feedback === 'wrong'

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 16,
      padding: '20px 16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      {/* Progress + score */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        fontFamily: 'Nunito, sans-serif',
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#999999' }}>
          Question {currentIdx + 1} / 10
        </span>
        <span style={{
          fontSize: 15, fontWeight: 800, color: '#2D2D2D',
          background: '#FAF4EE', borderRadius: 20, padding: '3px 12px',
        }}>
          Score: {score}
        </span>
      </div>

      {/* Staff — single note, no label until correct */}
      <div style={{ marginBottom: 12 }}>
        <StaffNoteGuide
          noteIds={[currentNoteId]}
          tappedNotes={new Set()}
          revealNote={isCorrectReveal ? currentNoteId : null}
          showAllLabels={false}
        />
      </div>

      {/* Prompt */}
      <p style={{
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 700,
        fontSize: 18,
        color: '#2D2D2D',
        textAlign: 'center',
        margin: '0 0 16px',
      }}>
        What note is this?
      </p>

      {/* 2 × 2 answer grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        marginBottom: 12,
      }}>
        {choices.map(choiceId => {
          const letter = getLetter(choiceId)
          const isSelected = selectedChoice === choiceId
          const isThisCorrect = isSelected && isCorrectReveal
          const isThisWrong   = isSelected && isWrongReveal

          return (
            <button
              key={`${choiceId}-${isThisWrong ? shakeKey : 'stable'}`}
              onClick={() => handleChoice(choiceId)}
              className={isThisWrong ? 'rm-shake' : ''}
              disabled={isLocked && !isSelected}
              style={{
                height: 56,
                borderRadius: 14,
                border: isThisCorrect ? 'none'
                  : isThisWrong ? 'none'
                  : '2px solid #EEEEEE',
                background: isThisCorrect ? '#4CAF50'
                  : isThisWrong ? '#FFAAAA'
                  : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#2D2D2D',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: 22,
                cursor: isLocked ? 'default' : 'pointer',
                opacity: (isLocked && !isSelected) ? 0.45 : 1,
                transition: 'background 0.12s ease',
              }}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {/* Feedback message */}
      {feedback === 'correct' && (
        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 800,
          fontSize: 18,
          color: '#4CAF50',
          textAlign: 'center',
          margin: 0,
          animation: 'f-pop 0.3s ease',
        }}>
          That's right! 🎵
        </p>
      )}

      {feedback === 'wrong' && (
        <>
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            color: '#666666',
            textAlign: 'center',
            margin: 0,
          }}>
            Nearly! Look at the mnemonic 👇
          </p>
          <MnemonicHint noteId={currentNoteId} />
        </>
      )}
    </div>
  )
}
