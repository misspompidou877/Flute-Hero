import { useState, useEffect, useRef } from 'react'
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow'
import { useProgress } from '../../context/ProgressContext'
import { useBadges } from '../../hooks/useBadges'
import FluteCharacterCelebration from './FluteCharacterCelebration'

// ── Note data ──────────────────────────────────────────────────────────────────

const NOTE_LABELS = {
  E4: 'E', F4: 'F', G4: 'G', A4: 'A', B4: 'B',
  C5: 'C', D5: 'D', E5: 'E', F5: 'F',
}

const NOTE_TO_VEXFLOW = {
  E4: 'e/4', F4: 'f/4', G4: 'g/4', A4: 'a/4', B4: 'b/4',
  C5: 'c/5', D5: 'd/5', E5: 'e/5', F5: 'f/5',
}

// Stem UP (1) for notes below middle line B4; stem DOWN (-1) for B4 and above
const NOTE_STEM_DIR = {
  E4: 1, F4: 1, G4: 1, A4: 1,  // below middle line → up
  B4: -1,                        // middle line → down by convention
  C5: -1, D5: -1, E5: -1, F5: -1,
}

// All 9 notes on the treble clef staff: E4 (line 1) through F5 (line 5)
const QUIZ_POOL = ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5']
const ALL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

// eslint-disable-next-line no-unused-vars
function getQuizPool(_level) {
  return QUIZ_POOL
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestions(pool, count) {
  const qs = []
  for (let i = 0; i < count; i++) {
    const last = qs[qs.length - 1]
    const eligible = last ? pool.filter(n => n !== last) : pool
    qs.push(eligible[Math.floor(Math.random() * eligible.length)])
  }
  return qs
}

function pickChoices(noteId, pool) {
  const correct = NOTE_LABELS[noteId]
  // Pool-aware distractors — prefer letters that appear in the quiz pool
  const poolLetters = [...new Set(pool.map(n => NOTE_LABELS[n]))]
  const distractorsFromPool = shuffle(poolLetters.filter(l => l !== correct))
  // Supplement with ALL_LETTERS if needed
  const extras = shuffle(ALL_LETTERS.filter(l => l !== correct && !distractorsFromPool.includes(l)))
  const combined = [...distractorsFromPool, ...extras]
  return shuffle([correct, ...combined.slice(0, 3)])
}

const MOVES = ['cartwheel', 'karate', 'wiggle', 'jump', 'spin', 'wobble']

function safeLoadBestScore() {
  try { return parseInt(localStorage.getItem('flutehero_notequiz_best') || '0') || 0 }
  catch { return 0 }
}

function saveBestScore(score) {
  try { localStorage.setItem('flutehero_notequiz_best', String(score)) } catch {}
}

// ── Adaptive timer ─────────────────────────────────────────────────────────────
// Slow: fixed 15s. Fast: adaptive (streak-driven). Unlimited: no timer.
function getTimeAllowed(streak, mode) {
  if (mode === 'slow') return 15
  // fast — adaptive
  if (streak >= 8) return 5
  if (streak >= 5) return 6
  if (streak >= 3) return 8
  return 10
}

function getPerformanceMessage(correctCount, total) {
  const pct = correctCount / total
  if (pct === 1)    return "Perfect! You're a Note Reading Star! 🌟"
  if (pct >= 0.8)   return 'Amazing! You really know your notes! 🎵'
  if (pct >= 0.7)   return 'Great work! Keep practising! 🎶'
  return 'Nice try! Play again to improve! 🎸'
}

// ── Keyframes injected once into <head> ───────────────────────────────────────

const GAME_KEYFRAMES_ID = 'notequiz-game-keyframes'
const GAME_KEYFRAME_CSS = `
@keyframes nqg-pop {
  0%   { transform: scale(0.88); opacity: 0.5; }
  55%  { transform: scale(1.04); }
  100% { transform: scale(1);    opacity: 1; }
}
@keyframes nqg-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}
@keyframes nqg-fade-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes nqg-wrong-shake {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-8px); }
  40%     { transform: translateX(8px); }
  60%     { transform: translateX(-5px); }
  80%     { transform: translateX(5px); }
}
`

function injectGameKeyframes() {
  if (document.getElementById(GAME_KEYFRAMES_ID)) return
  const el = document.createElement('style')
  el.id = GAME_KEYFRAMES_ID
  el.textContent = GAME_KEYFRAME_CSS
  document.head.appendChild(el)
}

// ── Single-note VexFlow staff ─────────────────────────────────────────────────

function SingleNoteStaff({ noteId }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !noteId) return
    el.innerHTML = ''

    const width = Math.max(el.clientWidth || 300, 200)
    const height = 110
    const renderer = new Renderer(el, Renderer.Backends.SVG)
    renderer.resize(width, height)
    const ctx = renderer.getContext()

    const stave = new Stave(10, 8, width - 20)
    stave.addClef('treble')
    stave.setContext(ctx).draw()

    const vexKey = NOTE_TO_VEXFLOW[noteId]
    if (!vexKey) return

    const stemDirection = NOTE_STEM_DIR[noteId] ?? 1
    const staveNote = new StaveNote({ keys: [vexKey], duration: 'q', stemDirection })

    const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false)
    voice.addTickables([staveNote])
    new Formatter().joinVoices([voice]).format([voice], width - 50)
    voice.draw(ctx, stave)

    return () => { if (el) el.innerHTML = '' }
  }, [noteId])

  return <div ref={containerRef} style={{ width: '100%' }} />
}

// ── Idle-screen character SVG (always happy, float animation) ─────────────────

function IdleCharacter() {
  return (
    <div style={{ animation: 'nqg-float 2s ease-in-out infinite', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {/* Speech bubble */}
      <div style={{
        background: 'white',
        borderRadius: 14,
        padding: '8px 14px',
        boxShadow: '0 3px 14px rgba(0,0,0,0.18)',
        fontSize: 14,
        fontWeight: 700,
        color: '#0B3D3A',
        fontFamily: "'Nunito', sans-serif",
        whiteSpace: 'nowrap',
        position: 'relative',
      }}>
        Can you name all the notes? 🎼
        <div style={{
          position: 'absolute',
          bottom: -6, left: '50%', transform: 'translateX(-50%)',
          width: 12, height: 7,
          background: 'white',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
        }} />
      </div>
      {/* Character SVG */}
      <svg viewBox="0 0 80 180" width="80" height="180" aria-hidden="true">
        <ellipse cx="40" cy="174" rx="22" ry="5" fill="rgba(0,0,0,0.15)" />
        <rect x="28" y="50" width="24" height="122" rx="12" fill="#6AECE1" />
        <rect x="31" y="54" width="7" height="114" rx="3.5" fill="rgba(255,255,255,0.28)" />
        <circle cx="40" cy="95"  r="5" fill="#26CCC2" />
        <circle cx="40" cy="112" r="5" fill="#26CCC2" />
        <circle cx="40" cy="129" r="5" fill="#26CCC2" />
        <circle cx="40" cy="146" r="5" fill="#26CCC2" />
        <circle cx="40" cy="34" r="26" fill="#6AECE1" />
        <circle cx="32" cy="26" r="7" fill="rgba(255,255,255,0.20)" />
        <circle cx="31" cy="30" r="6.5" fill="white" />
        <circle cx="31.5" cy="30.5" r="3" fill="#0B3D3A" />
        <circle cx="29.5" cy="28.5" r="1.5" fill="white" />
        <circle cx="49" cy="30" r="6.5" fill="white" />
        <circle cx="49.5" cy="30.5" r="3" fill="#0B3D3A" />
        <circle cx="47.5" cy="28.5" r="1.5" fill="white" />
        <path d="M 31 40 Q 40 49 49 40" fill="none" stroke="#0B3D3A" strokeWidth="2.2" strokeLinecap="round" />
        <text x="64" y="30" fontSize="16" fill="#26CCC2" fontWeight="bold">♪</text>
      </svg>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function NoteQuizGame({ onBack }) {
  const { progress: { currentLevel } } = useProgress()
  const { earnBadge } = useBadges()

  // ── Game config state ────────────────────────────────────────────────────────
  const [totalRounds, setTotalRounds] = useState(10)
  const [speedMode, setSpeedMode] = useState('slow') // 'slow' | 'fast' | 'unlimited'

  // ── Game phase ───────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState('idle') // 'idle' | 'playing' | 'game_over'

  // ── Per-game state ───────────────────────────────────────────────────────────
  const [questions,     setQuestions]     = useState([])
  const [roundIdx,      setRoundIdx]      = useState(0)
  const [score,         setScore]         = useState(0)
  const [streak,        setStreak]        = useState(0)
  const [bestStreak,    setBestStreak]    = useState(0)
  const [correctCount,  setCorrectCount]  = useState(0)

  // ── Per-question state ───────────────────────────────────────────────────────
  const [choices,         setChoices]         = useState([])
  const [isLocked,        setIsLocked]        = useState(false)
  const [selectedChoice,  setSelectedChoice]  = useState(null)
  const [feedback,        setFeedback]        = useState(null) // null | 'correct' | 'wrong' | 'timeout'
  const [timeLeft,        setTimeLeft]        = useState(5)
  const [staffAnimKey,    setStaffAnimKey]    = useState(0)

  // ── Celebration state ────────────────────────────────────────────────────────
  const [showCelebration,    setShowCelebration]    = useState(false)
  const [celebrationMove,    setCelebrationMove]    = useState(null)
  const [celebrationScore,   setCelebrationScore]   = useState(10)
  const [celebrationIsBonus, setCelebrationIsBonus] = useState(false)
  const [celebAnimKey,       setCelebAnimKey]       = useState(0)

  // ── Persistent state ─────────────────────────────────────────────────────────
  const [bestScore, setBestScore] = useState(safeLoadBestScore)
  const [isNewBest, setIsNewBest] = useState(false)

  // ── Refs ─────────────────────────────────────────────────────────────────────
  const timerRef         = useRef(null)
  const questionStartRef = useRef(null)
  const lastMoveRef      = useRef(null)
  const timeAllowedRef   = useRef(15)
  const speedModeRef     = useRef('slow')

  const [timeAllowed, setTimeAllowed] = useState(10)
  // These refs mirror state so timer callbacks always see current values
  const isLockedRef      = useRef(false)
  const phaseRef         = useRef('idle')
  const roundIdxRef      = useRef(0)
  const questionsRef     = useRef([])
  const scoreRef         = useRef(0)
  const streakRef        = useRef(0)
  const bestStreakRef     = useRef(0)
  const correctCountRef  = useRef(0)
  const totalRoundsRef   = useRef(10)

  // Keep refs in sync
  useEffect(() => { isLockedRef.current      = isLocked },      [isLocked])
  useEffect(() => { phaseRef.current         = phase },         [phase])
  useEffect(() => { roundIdxRef.current      = roundIdx },      [roundIdx])
  useEffect(() => { questionsRef.current     = questions },     [questions])
  useEffect(() => { scoreRef.current         = score },         [score])
  useEffect(() => { streakRef.current        = streak },        [streak])
  useEffect(() => { bestStreakRef.current     = bestStreak },    [bestStreak])
  useEffect(() => { correctCountRef.current  = correctCount },  [correctCount])
  useEffect(() => { totalRoundsRef.current   = totalRounds },   [totalRounds])
  useEffect(() => { speedModeRef.current     = speedMode },     [speedMode])

  useEffect(() => { injectGameKeyframes() }, [])

  const notePool     = QUIZ_POOL
  const currentNoteId = questions[roundIdx] || null

  // ── Pick a celebration move (avoid repeat) ────────────────────────────────────
  function pickMove() {
    const available = lastMoveRef.current
      ? MOVES.filter(m => m !== lastMoveRef.current)
      : MOVES
    const move = available[Math.floor(Math.random() * available.length)]
    lastMoveRef.current = move
    return move
  }

  // ── Timer management ──────────────────────────────────────────────────────────
  function stopTimer() {
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  function startTimer() {
    if (speedModeRef.current === 'unlimited') return
    stopTimer()
    questionStartRef.current = Date.now()
    const allowed = timeAllowedRef.current
    setTimeLeft(allowed)
    timerRef.current = setInterval(() => {
      if (phaseRef.current !== 'playing' || isLockedRef.current) {
        stopTimer()
        return
      }
      const elapsed   = (Date.now() - questionStartRef.current) / 1000
      const remaining = Math.max(0, allowed - elapsed)
      setTimeLeft(remaining)
      if (remaining <= 0) {
        stopTimer()
        handleTimeout()
      }
    }, 80)
  }

  // ── End game ──────────────────────────────────────────────────────────────────
  function endGame(finalScore, finalCorrect, finalBestStreak) {
    stopTimer()
    setPhase('game_over')
    if (finalCorrect === totalRoundsRef.current) earnBadge('note_reader')
    const prev = safeLoadBestScore()
    if (finalScore > prev) {
      saveBestScore(finalScore)
      setBestScore(finalScore)
      setIsNewBest(true)
    } else {
      setIsNewBest(false)
    }
  }

  // ── Load next question ─────────────────────────────────────────────────────────
  function goToNext(nextIdx, finalScore, finalCorrect, finalBestStreak) {
    if (nextIdx >= totalRoundsRef.current) {
      endGame(finalScore, finalCorrect, finalBestStreak)
      return
    }
    // Recompute time allowance based on speed mode
    if (speedModeRef.current !== 'unlimited') {
      const allowed = getTimeAllowed(streakRef.current, speedModeRef.current)
      timeAllowedRef.current = allowed
      setTimeAllowed(allowed)
    }

    const qs   = questionsRef.current
    const note = qs[nextIdx]
    setRoundIdx(nextIdx)
    setChoices(pickChoices(note, notePool))
    setIsLocked(false)
    setSelectedChoice(null)
    setFeedback(null)
    setStaffAnimKey(k => k + 1)
    startTimer()
  }

  // ── Timeout handler ───────────────────────────────────────────────────────────
  function handleTimeout() {
    if (isLockedRef.current) return
    setIsLocked(true)
    setFeedback('timeout')
    // Reset streak
    const newStreak = 0
    setStreak(0)
    streakRef.current = 0

    setTimeout(() => {
      goToNext(
        roundIdxRef.current + 1,
        scoreRef.current,
        correctCountRef.current,
        bestStreakRef.current,
      )
    }, 800)
  }

  // ── Answer handler ─────────────────────────────────────────────────────────────
  function handleAnswer(choiceLabel) {
    if (isLockedRef.current || phaseRef.current !== 'playing') return
    stopTimer()
    setIsLocked(true)
    setSelectedChoice(choiceLabel)

    const isCorrect = choiceLabel === NOTE_LABELS[currentNoteId]

    if (isCorrect) {
      const elapsed = (Date.now() - questionStartRef.current) / 1000
      const pts     = elapsed < timeAllowedRef.current * 0.4 ? 15 : 10
      const newScore        = scoreRef.current + pts
      const newStreak       = streakRef.current + 1
      const newBestStreak   = Math.max(bestStreakRef.current, newStreak)
      const newCorrectCount = correctCountRef.current + 1

      setScore(newScore)
      setStreak(newStreak)
      setBestStreak(newBestStreak)
      setCorrectCount(newCorrectCount)
      setFeedback('correct')
      scoreRef.current       = newScore
      streakRef.current      = newStreak
      bestStreakRef.current   = newBestStreak
      correctCountRef.current = newCorrectCount

      setCelebrationMove(pickMove())
      setCelebrationScore(pts)
      setCelebrationIsBonus(pts === 15)
      setCelebAnimKey(k => k + 1)
      setShowCelebration(true)

      const nextIdx = roundIdxRef.current + 1
      setTimeout(() => {
        setShowCelebration(false)
        goToNext(nextIdx, newScore, newCorrectCount, newBestStreak)
      }, 1400)
    } else {
      setFeedback('wrong')
      setStreak(0)
      streakRef.current = 0

      const nextIdx = roundIdxRef.current + 1
      setTimeout(() => {
        goToNext(nextIdx, scoreRef.current, correctCountRef.current, bestStreakRef.current)
      }, 800)
    }
  }

  // ── Start game ─────────────────────────────────────────────────────────────────
  function startGame() {
    stopTimer()
    const pool = QUIZ_POOL
    const qs   = generateQuestions(pool, totalRounds)
    questionsRef.current     = qs
    scoreRef.current         = 0
    streakRef.current        = 0
    bestStreakRef.current     = 0
    correctCountRef.current  = 0
    roundIdxRef.current      = 0
    totalRoundsRef.current   = totalRounds
    speedModeRef.current     = speedMode
    const initialTime = speedMode === 'unlimited' ? 0 : getTimeAllowed(0, speedMode)
    timeAllowedRef.current   = initialTime

    setQuestions(qs)
    setRoundIdx(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setCorrectCount(0)
    setTimeAllowed(initialTime)
    setChoices(pickChoices(qs[0], pool))
    setIsLocked(false)
    setSelectedChoice(null)
    setFeedback(null)
    setStaffAnimKey(k => k + 1)
    setShowCelebration(false)
    setIsNewBest(false)
    setPhase('playing')
    phaseRef.current = 'playing'
    startTimer()
  }

  // ── Cleanup on unmount ─────────────────────────────────────────────────────────
  useEffect(() => () => stopTimer(), [])

  // ── Timer bar color ───────────────────────────────────────────────────────────
  const timerColor = timeLeft > 3 ? '#26CCC2' : timeLeft > 1 ? '#FFB76C' : '#FFF57E'

  // ════════════════════════════════════════════════════════════════════════════
  //  RENDER: IDLE SCREEN
  // ════════════════════════════════════════════════════════════════════════════

  if (phase === 'idle') {
    const prevBest = safeLoadBestScore()
    return (
      <div style={{
        background: '#0B3D3A',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        paddingBottom: 'calc(40px + env(safe-area-inset-bottom))',
        gap: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 20, left: 20,
            width: 40, height: 40,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Back to games"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          fontSize: 32,
          color: 'white',
          margin: 0,
          textAlign: 'center',
        }}>
          Catch the Falling Notes
        </h1>

        {/* Character */}
        <IdleCharacter />

        {/* Best score pill */}
        {prevBest > 0 && (
          <div style={{
            background: 'rgba(255,245,126,0.15)',
            border: '1px solid #FFF57E',
            borderRadius: 999,
            padding: '6px 18px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: '#FFF57E',
          }}>
            🏆 Best: {prevBest} pts
          </div>
        )}

        {/* Rounds selector */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 10px',
          }}>
            Number of rounds
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {[5, 10, 15].map(n => (
              <button
                key={n}
                onClick={() => setTotalRounds(n)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 999,
                  border: totalRounds === n ? '2px solid #6AECE1' : '2px solid rgba(106,236,225,0.25)',
                  background: totalRounds === n ? 'rgba(106,236,225,0.2)' : 'transparent',
                  color: totalRounds === n ? '#6AECE1' : 'rgba(255,255,255,0.5)',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  minHeight: 44,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Speed selector */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 10px',
          }}>
            Speed
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {[
              { value: 'slow',      label: '🐢 Slow' },
              { value: 'fast',      label: '⚡ Fast' },
              { value: 'unlimited', label: '♾ No limit' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSpeedMode(value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: speedMode === value ? '2px solid #6AECE1' : '2px solid rgba(106,236,225,0.25)',
                  background: speedMode === value ? 'rgba(106,236,225,0.2)' : 'transparent',
                  color: speedMode === value ? '#6AECE1' : 'rgba(255,255,255,0.5)',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  minHeight: 44,
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={startGame}
          className="active:scale-95 transition-transform"
          style={{
            padding: '16px 48px',
            borderRadius: 16,
            border: 'none',
            background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
            boxShadow: '0 4px 20px rgba(38,204,194,0.5)',
            color: '#0B3D3A',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: 'pointer',
            minHeight: 56,
          }}
        >
          Start Quiz
        </button>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  RENDER: GAME OVER SCREEN
  // ════════════════════════════════════════════════════════════════════════════

  if (phase === 'game_over') {
    const pct        = correctCount / totalRounds
    const isGreat    = pct >= 0.7
    const isPerfect  = correctCount === totalRounds

    return (
      <div style={{
        background: '#0B3D3A',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        paddingBottom: 'calc(40px + env(safe-area-inset-bottom))',
        gap: 20,
        animation: 'nqg-fade-in 400ms ease',
      }}>
        {/* Score card */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: isPerfect ? '2px solid #FFF57E' : '1.5px solid rgba(106,236,225,0.2)',
          borderRadius: 24,
          padding: '32px 28px',
          textAlign: 'center',
          width: '100%',
          maxWidth: 360,
          boxShadow: isPerfect ? '0 0 32px rgba(255,245,126,0.3)' : 'none',
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>
            {isPerfect ? '🌟' : isGreat ? '🎵' : '🎸'}
          </div>

          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: 22,
            color: 'white', margin: '0 0 4px',
          }}>
            {isPerfect ? 'Perfect score!' : isGreat ? 'Well done!' : 'Keep going!'}
          </p>

          {/* Big score */}
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: 52,
            color: isPerfect ? '#FFF57E' : '#FFFFFF',
            margin: '8px 0',
            lineHeight: 1.1,
          }}>
            {score}
            <span style={{ fontSize: 18, fontWeight: 600, opacity: 0.7 }}> pts</span>
          </p>

          {/* Accuracy */}
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, fontSize: 16,
            color: 'rgba(255,255,255,0.8)', margin: '0 0 8px',
          }}>
            {correctCount} of {totalRounds} correct ✓
          </p>

          {/* Best streak */}
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, fontSize: 14,
            color: '#FFF57E', margin: '0 0 12px',
          }}>
            🔥 Best streak: {bestStreak}
          </p>

          {/* Performance message */}
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600, fontSize: 15,
            color: 'rgba(255,255,255,0.7)',
            margin: 0, lineHeight: 1.5,
          }}>
            {getPerformanceMessage(correctCount, totalRounds)}
          </p>
        </div>

        {/* New best banner */}
        {isNewBest && (
          <div style={{
            background: '#FFF57E',
            border: '2px solid #F0D64E',
            borderRadius: 12,
            padding: '10px 24px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: 15,
            color: '#0B3D3A',
            animation: 'nqg-pop 350ms ease',
          }}>
            🏆 New best score!
          </div>
        )}

        {/* Perfect badge earned */}
        {isPerfect && (
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            border: '2px solid #26CCC2',
            borderRadius: 12,
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
            animation: 'nqg-pop 400ms 200ms ease both',
          }}>
            <span style={{ fontSize: 32 }}>🎼</span>
            <div>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 800,
                fontSize: 14, color: 'white', margin: 0,
              }}>
                Badge earned: Note Reader!
              </p>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 12,
                color: 'rgba(255,255,255,0.6)', margin: 0,
              }}>
                Named every note perfectly!
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <button
          onClick={startGame}
          className="active:scale-95 transition-transform"
          style={{
            width: '100%', maxWidth: 360,
            padding: '16px 0',
            borderRadius: 16, border: 'none',
            background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
            boxShadow: '0 4px 16px rgba(38,204,194,0.4)',
            color: '#0B3D3A',
            fontFamily: "'Nunito', sans-serif", fontWeight: 800,
            fontSize: 17, cursor: 'pointer', minHeight: 56,
          }}
        >
          Play Again
        </button>

        <button
          onClick={onBack}
          className="active:scale-95 transition-transform"
          style={{
            width: '100%', maxWidth: 360,
            padding: '14px 0',
            borderRadius: 16,
            border: '2px solid rgba(255,255,255,0.25)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.75)',
            fontFamily: "'Nunito', sans-serif", fontWeight: 700,
            fontSize: 16, cursor: 'pointer', minHeight: 52,
          }}
        >
          Back to Games
        </button>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  RENDER: PLAYING
  // ════════════════════════════════════════════════════════════════════════════

  const timerPct = (timeLeft / timeAllowed) * 100

  return (
    <div style={{
      background: '#0B3D3A',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 0 env(safe-area-inset-bottom)',
    }}>
      {/* ── Top bar ── */}
      <div style={{
        padding: '16px 16px 12px',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Row 1: round + score + streak */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 600,
            fontSize: 14, color: 'rgba(255,255,255,0.6)',
          }}>
            Round {roundIdx + 1} of {totalRounds}
          </span>

          <span style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 800,
            fontSize: 18, color: 'white',
          }}>
            {score} pts
          </span>
        </div>

        {/* Streak counter (only when >= 2) */}
        {streak >= 2 && (
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, fontSize: 14,
            color: '#FFF57E',
            animation: 'nqg-pop 200ms ease',
            textAlign: 'center',
          }}>
            🔥 {streak} in a row!
          </div>
        )}

        {/* Timer bar + time label — hidden in unlimited mode */}
        {speedMode !== 'unlimited' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${timerPct}%`,
                background: timerColor,
                borderRadius: 3,
                transition: 'background 300ms ease',
              }} />
            </div>
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 11, fontWeight: 700,
              color: 'rgba(255,255,255,0.35)',
              minWidth: 24, textAlign: 'right',
            }}>
              {timeAllowed}s
            </span>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: '20px 16px',
        maxWidth: 500,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Staff card */}
        <div
          key={staffAnimKey}
          style={{
            background: 'white',
            borderRadius: 24,
            padding: '8px 8px 4px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            animation: 'nqg-pop 250ms ease',
          }}
        >
          <SingleNoteStaff noteId={currentNoteId} />
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, fontSize: 15,
            color: '#0B3D3A',
            textAlign: 'center',
            margin: '4px 0 8px',
          }}>
            What note is this?
          </p>
        </div>

        {/* ── 2×2 Answer grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          {choices.map((label) => {
            const isSelected       = selectedChoice === label
            const isCorrectLabel   = label === NOTE_LABELS[currentNoteId]
            const showCorrect      = isLocked && isCorrectLabel
            const showWrong        = isLocked && isSelected && !isCorrectLabel
            const isDisabled       = isLocked && !isSelected && !isCorrectLabel

            return (
              <button
                key={label}
                onClick={() => handleAnswer(label)}
                disabled={isLocked}
                style={{
                  minHeight: 56,
                  borderRadius: 14,
                  border: showCorrect
                    ? '2px solid #F0D64E'
                    : showWrong
                      ? '2px solid #FFB76C'
                      : '2px solid rgba(255,255,255,0.15)',
                  background: showCorrect
                    ? '#FFF57E'
                    : showWrong
                      ? 'rgba(255,183,108,0.3)'
                      : 'rgba(255,255,255,0.95)',
                  color: '#0B3D3A',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 22,
                  cursor: isLocked ? 'default' : 'pointer',
                  opacity: isDisabled ? 0.45 : 1,
                  transition: 'background 120ms ease, opacity 120ms ease',
                  boxShadow: showCorrect ? '0 0 12px rgba(255,245,126,0.6)' : '0 2px 8px rgba(0,0,0,0.2)',
                  transform: showCorrect ? 'scale(1.04)' : 'scale(1)',
                  animation: showWrong ? 'nqg-wrong-shake 350ms ease' : 'none',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Feedback message */}
        {feedback === 'timeout' && (
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700, fontSize: 15,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            margin: 0,
            animation: 'nqg-fade-in 200ms ease',
          }}>
            Time's up! The answer was {NOTE_LABELS[currentNoteId]} 🎵
          </p>
        )}
      </div>

      {/* ── Celebration overlay ── */}
      <FluteCharacterCelebration
        visible={showCelebration}
        move={celebrationMove}
        streak={streak}
        scorePoints={celebrationScore}
        isBonus={celebrationIsBonus}
        animKey={celebAnimKey}
      />
    </div>
  )
}
