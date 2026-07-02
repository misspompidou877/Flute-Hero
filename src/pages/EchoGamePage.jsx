import { useState, useEffect, useRef } from 'react'
import { FingeringDiagramForNote } from '../components/FingeringDiagrams'
import BadgeToast from '../components/BadgeToast'
import EchoNoteCard from '../components/EchoNoteCard'
import FluteCharacter from '../components/FluteCharacter'
import NoteQuizGame from '../games/NoteQuiz/NoteQuizGame'
import { useMicrophone } from '../hooks/useMicrophone'
import { useBadges } from '../hooks/useBadges'
import { useProgress } from '../context/ProgressContext'
import { NOTES_BY_LEVEL } from '../notes'

// useMicrophone returns note names like 'F#5' / 'A#4'; notes.js uses 'Fs5' / 'Bb4'
const MIC_TO_NOTE_ID = { 'A#4': 'Bb4', 'A#5': 'Bb5', 'F#5': 'Fs5', 'F#4': 'Fs4' }
function normalizeNote(n) { return n ? (MIC_TO_NOTE_ID[n] ?? n) : null }

// [sequenceLength, maxNoteLevel] per round
const ROUND_CONFIG = [[2, 1], [2, 1], [3, 2], [3, 2], [4, 3]]
const TOTAL_ROUNDS = 5

function getSequenceForRound(round, currentLevel) {
  const [seqLen, maxRoundLevel] = ROUND_CONFIG[Math.min(round - 1, ROUND_CONFIG.length - 1)]
  const effectiveMax = Math.min(maxRoundLevel, currentLevel)
  const eligible = []
  for (let lvl = 1; lvl <= effectiveMax; lvl++) {
    NOTES_BY_LEVEL[lvl]?.forEach(id => { if (!id.includes('_alt')) eligible.push(id) })
  }
  const picked = []
  for (let i = 0; i < seqLen; i++) {
    const pool = picked.length
      ? eligible.filter(id => id !== picked[picked.length - 1])
      : eligible
    picked.push(pool[Math.floor(Math.random() * pool.length)])
  }
  return picked
}

// ── Sparkle: 4-pointed CSS star ───────────────────────────────────────────────
function Sparkle({ color, size, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ position: 'absolute', ...style }}>
      <path d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z" fill={color} />
    </svg>
  )
}

// ── Dark arcade hub (idle game-picker screen) ─────────────────────────────────
function GamesHub({ onStartEcho, onStartQuiz, toastBadge, clearToast }) {
  return (
    <div style={{ background: '#000180', minHeight: '100dvh', paddingBottom: 'calc(96px + env(safe-area-inset-bottom))', position: 'relative', overflow: 'hidden' }}>
      {/* Sparkles */}
      <Sparkle color="#83E7FF" size={14} style={{ top: 60, left: 40, opacity: 0.5 }} />
      <Sparkle color="#D0FFA3" size={10} style={{ top: 120, right: 60, opacity: 0.4 }} />
      <Sparkle color="#D0FFA3" size={12} style={{ bottom: 120, left: 60, opacity: 0.4 }} />
      <Sparkle color="#83E7FF" size={16} style={{ bottom: 80, right: 40, opacity: 0.5 }} />

      {/* Centred content column */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 16px', position: 'relative' }}>

        {/* "GAMES" badge pill */}
        <div style={{
          display: 'block', width: 'fit-content', margin: '0 auto 16px',
          background: '#D0FFA3', color: '#000180',
          fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          borderRadius: 999, padding: '6px 16px',
        }}>
          Games
        </div>

        {/* "Pick a Game" heading */}
        <h1 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 800,
          fontSize: 'clamp(32px, 6vw, 42px)',
          color: '#FFFFFF',
          textShadow: '0 3px 0 rgba(0,1,128,0.5)',
          textAlign: 'center', marginBottom: 32,
        }}>
          Pick a Game
        </h1>

        {/* Game cards — side by side */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>

          {/* ── Card 1: Echo Game ── */}
          <div
            className="hover:-translate-y-1 active:-translate-y-1 transition-all duration-200 cursor-pointer"
            style={{
              flex: '1 1 200px',
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(131,231,255,0.2)',
              borderRadius: 24, padding: '28px 24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Icon circle */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #83E7FF, #00C5E5)',
              boxShadow: '0 4px 20px rgba(131,231,255,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M9 5l12-2" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Title */}
            <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 20, color: '#FFFFFF', marginTop: 16, marginBottom: 0 }}>
              Echo Game
            </p>

            {/* Category badge */}
            <span style={{
              display: 'inline-block', margin: '8px auto',
              background: 'rgba(131,231,255,0.12)', border: '1px solid #83E7FF',
              color: '#83E7FF', fontFamily: "'Nunito', sans-serif",
              fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
              borderRadius: 999, padding: '4px 12px',
            }}>
              Pattern Memory
            </span>

            {/* Description */}
            <p style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 400, fontSize: 14,
              color: 'rgba(255,255,255,0.7)', lineHeight: 1.6,
              margin: '12px 0 20px',
            }}>
              Watch the notes, remember the pattern, and play it back on your flute. Can you clear all 5 rounds?
            </p>

            {/* CTA */}
            <button
              onClick={onStartEcho}
              className="active:scale-95 transition-transform"
              style={{
                width: '100%', marginTop: 'auto',
                background: 'linear-gradient(to right, #83E7FF, #00C5E5)',
                boxShadow: '0 4px 16px rgba(131,231,255,0.35)',
                color: '#000180',
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                border: 'none', borderRadius: 12, padding: '14px 0',
                cursor: 'pointer',
              }}
            >
              Play Now
            </button>
          </div>

          {/* ── Card 2: Note Quiz ── */}
          <div
            className="hover:-translate-y-1 active:-translate-y-1 transition-all duration-200 cursor-pointer"
            style={{
              flex: '1 1 200px',
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(131,231,255,0.2)',
              borderRadius: 24, padding: '28px 24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Icon circle */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #006EE9, #0056C7)',
              boxShadow: '0 4px 20px rgba(0,110,233,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="11" x2="21" y2="11" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="3" y1="19" x2="21" y2="19" />
                <circle cx="8" cy="19" r="2.5" fill="white" stroke="none" />
                <line x1="10.5" y1="19" x2="10.5" y2="9" stroke="white" strokeWidth="1.8" />
              </svg>
            </div>

            {/* Title */}
            <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 20, color: '#FFFFFF', marginTop: 16, marginBottom: 0 }}>
              Note Quiz
            </p>

            {/* Category badge */}
            <span style={{
              display: 'inline-block', margin: '8px auto',
              background: 'rgba(0,110,233,0.15)', border: '1px solid #006EE9',
              color: '#83E7FF', fontFamily: "'Nunito', sans-serif",
              fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
              borderRadius: 999, padding: '4px 12px',
            }}>
              Reading Skill
            </span>

            {/* Description */}
            <p style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 400, fontSize: 14,
              color: 'rgba(255,255,255,0.7)', lineHeight: 1.6,
              margin: '12px 0 20px',
            }}>
              Speed read the notes on the staff! Name as many as you can before the time runs out. Perfect your sight-reading.
            </p>

            {/* CTA */}
            <button
              onClick={onStartQuiz}
              className="active:scale-95 transition-transform"
              style={{
                width: '100%', marginTop: 'auto',
                background: 'linear-gradient(to right, #006EE9, #0056C7)',
                boxShadow: '0 4px 16px rgba(0,110,233,0.35)',
                color: '#FFFFFF',
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                border: 'none', borderRadius: 12, padding: '14px 0',
                cursor: 'pointer',
              }}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      <BadgeToast badge={toastBadge} onDismiss={clearToast} />
    </div>
  )
}

// ── Shared page wrapper ───────────────────────────────────────────────────────
function GamePage({ children, centred = false }) {
  return (
    <div
      style={{ background: '#FAF4EE', minHeight: '100dvh', paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}
      className="pb-24"
    >
      <div
        className={`mx-auto max-w-[680px] px-4 pt-10 ${centred ? 'flex min-h-[80vh] flex-col items-center justify-center' : ''}`}
      >
        {children}
      </div>
    </div>
  )
}

// ── Amber gradient button ─────────────────────────────────────────────────────
function AmberButton({ onClick, children, fullWidth = true, small = false }) {
  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : ''} active:scale-95 transition-transform`}
      style={{
        height: small ? 52 : 64,
        borderRadius: small ? 26 : 32,
        background: 'linear-gradient(to right, #006EE9, #0056C7)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: '0 4px 16px rgba(245,166,35,0.35)',
      }}
    >
      <div
        style={{
          width: small ? 32 : 40,
          height: small ? 32 : 40,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </div>
      <span style={{ color: 'white', fontWeight: 700, fontSize: small ? 17 : 22, fontFamily: "'Nunito', sans-serif" }}>
        {children}
      </span>
      <span style={{ color: 'white', fontSize: 24, fontWeight: 300, lineHeight: 1 }}>›</span>
    </button>
  )
}

function OutlineButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-full active:scale-95 transition-transform"
      style={{
        height: 52,
        borderRadius: 26,
        background: 'white',
        border: '2px solid #E0E0E0',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 15,
        color: '#666666',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {children}
    </button>
  )
}

// ── Inner component: all Echo Game hooks live here, never called conditionally ──
function EchoGame({ onStartQuiz }) {
  const { progress: { currentLevel } } = useProgress()
  const { note, isActive, startListening, earnedBadge: micBadge, clearEarnedBadge: clearMicBadge } = useMicrophone()
  const { earnBadge, earnedBadge: gameBadge, clearEarnedBadge: clearGameBadge } = useBadges()

  const toastBadge = gameBadge || micBadge
  const clearToast = gameBadge ? clearGameBadge : clearMicBadge

  const [gamePhase, setGamePhase] = useState('idle')
  const [roundNumber, setRoundNumber] = useState(1)
  const [sequence, setSequence] = useState([])
  const [memorizeIndex, setMemorizeIndex] = useState(0)
  const [recallIndex, setRecallIndex] = useState(0)
  const [noteResults, setNoteResults] = useState([])
  const [perfectRounds, setPerfectRounds] = useState(0)
  const [anyError, setAnyError] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const memorizeTimerRef = useRef(null)
  const holdTimerRef     = useRef(null)
  const wrongHoldRef     = useRef(null)
  const inGraceRef       = useRef(false)

  useEffect(() => {
    if (gamePhase !== 'memorize') return
    if (memorizeTimerRef.current) clearTimeout(memorizeTimerRef.current)

    if (memorizeIndex < sequence.length) {
      memorizeTimerRef.current = setTimeout(() => setMemorizeIndex(i => i + 1), 1500)
    } else {
      memorizeTimerRef.current = setTimeout(() => {
        setMemorizeIndex(0)
        setRecallIndex(0)
        setNoteResults(sequence.map(() => 'pending'))
        setShowHint(false)
        setGamePhase('recall')
      }, 400)
    }

    return () => clearTimeout(memorizeTimerRef.current)
  }, [gamePhase, memorizeIndex, sequence])

  useEffect(() => {
    if (gamePhase !== 'recall') {
      if (holdTimerRef.current)  { clearTimeout(holdTimerRef.current);  holdTimerRef.current  = null }
      if (wrongHoldRef.current)  { clearTimeout(wrongHoldRef.current);  wrongHoldRef.current  = null }
      return
    }
    if (recallIndex >= sequence.length) return

    const normalized = normalizeNote(note)
    const isMatch = normalized === sequence[recallIndex]

    if (isMatch) {
      if (wrongHoldRef.current) { clearTimeout(wrongHoldRef.current); wrongHoldRef.current = null }
      if (!holdTimerRef.current) {
        holdTimerRef.current = setTimeout(() => {
          holdTimerRef.current = null
          inGraceRef.current = true
          setTimeout(() => { inGraceRef.current = false }, 500)
          setNoteResults(prev => { const n = [...prev]; n[recallIndex] = 'correct'; return n })
          setRecallIndex(i => i + 1)
        }, 500)
      }
    } else {
      if (holdTimerRef.current) { clearTimeout(holdTimerRef.current); holdTimerRef.current = null }
      if (note && !wrongHoldRef.current && !inGraceRef.current) {
        wrongHoldRef.current = setTimeout(() => {
          wrongHoldRef.current = null
          setNoteResults(prev => { const n = [...prev]; n[recallIndex] = 'wrong'; return n })
          setAnyError(true)
          setRecallIndex(i => i + 1)
        }, 300)
      }
      if (!note && wrongHoldRef.current) {
        clearTimeout(wrongHoldRef.current)
        wrongHoldRef.current = null
      }
    }
  }, [note, gamePhase, recallIndex, sequence])

  useEffect(() => {
    if (gamePhase !== 'recall' || sequence.length === 0) return
    if (recallIndex < sequence.length) return

    const roundPerfect = noteResults.every(r => r === 'correct')
    if (roundPerfect) setPerfectRounds(p => p + 1)
    setGamePhase('round_result')
  }, [gamePhase, recallIndex, sequence.length, noteResults])

  useEffect(() => {
    if (gamePhase !== 'game_over') return
    if (!anyError) earnBadge('rhythm_master')
  }, [gamePhase]) // eslint-disable-line react-hooks/exhaustive-deps

  function startGame() {
    if (!isActive) startListening()
    const seq = getSequenceForRound(1, currentLevel)
    setSequence(seq)
    setRoundNumber(1)
    setMemorizeIndex(0)
    setNoteResults([])
    setPerfectRounds(0)
    setAnyError(false)
    setGamePhase('memorize')
  }

  function advanceToNextRound() {
    const next = roundNumber + 1
    if (next > TOTAL_ROUNDS) { setGamePhase('game_over'); return }
    const seq = getSequenceForRound(next, currentLevel)
    setSequence(seq)
    setRoundNumber(next)
    setMemorizeIndex(0)
    setNoteResults([])
    setGamePhase('memorize')
  }

  function retryRound() {
    const seq = getSequenceForRound(roundNumber, currentLevel)
    setSequence(seq)
    setMemorizeIndex(0)
    setNoteResults([])
    setGamePhase('memorize')
  }

  // ═══════════════════════════════════════════════════════════
  //  DERIVE CHARACTER MOOD FROM EXISTING STATE (no logic change)
  // ═══════════════════════════════════════════════════════════
  let characterMood = 'idle'
  let charAnimKey   = gamePhase

  if (gamePhase === 'memorize') {
    characterMood = 'listening'
  } else if (gamePhase === 'recall') {
    const lastResult = recallIndex > 0 ? noteResults[recallIndex - 1] : null
    if (lastResult === 'correct') characterMood = 'correct'
    else if (lastResult === 'wrong') characterMood = 'wrong'
    else characterMood = 'listening'
    charAnimKey = `recall-${recallIndex}`
  } else if (gamePhase === 'round_result') {
    characterMood = noteResults.every(r => r === 'correct') ? 'complete' : 'idle'
  } else if (gamePhase === 'game_over') {
    characterMood = anyError ? 'complete' : 'perfect'
  }

  // ═══════════════════════════════════════════════════════════
  //  PHASE RENDERS — styling only
  // ═══════════════════════════════════════════════════════════

  // ── idle ────────────────────────────────────────────────────────────────────
  if (gamePhase === 'idle') {
    return (
      <GamesHub
        onStartEcho={startGame}
        onStartQuiz={onStartQuiz}
        toastBadge={toastBadge}
        clearToast={clearToast}
      />
    )
  }

  // ── memorize ─────────────────────────────────────────────────────────────────
  if (gamePhase === 'memorize') {
    const currentNote = sequence[memorizeIndex]

    return (
      <GamePage>
        {/* Round header */}
        <div className="mb-2 flex items-center justify-between">
          <p style={{ fontSize: 14, fontWeight: 700, color: '#999999', fontFamily: "'Nunito', sans-serif" }}>
            Round {roundNumber} of {TOTAL_ROUNDS}
          </p>
          <div className="flex gap-2">
            {sequence.map((_, i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full transition-all"
                style={{
                  background: i <= memorizeIndex ? '#006EE9' : '#CCCCCC',
                  boxShadow: i === memorizeIndex ? '0 0 8px rgba(0,110,233,0.6)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#2D2D2D', marginBottom: 24, fontFamily: "'Nunito', sans-serif" }}>
          {memorizeIndex < sequence.length ? 'Watch carefully...' : 'Get ready!'}
        </p>

        {memorizeIndex < sequence.length ? (
          <EchoNoteCard noteId={currentNote} status="active" showFingering size="large" />
        ) : (
          <div style={{ height: 192, background: 'white', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 48 }}>🎵</p>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 14, color: '#999999', marginTop: 16, fontFamily: "'Nunito', sans-serif" }}>
          {memorizeIndex < sequence.length
            ? `Note ${memorizeIndex + 1} of ${sequence.length}`
            : 'Your turn is coming up...'}
        </p>

        <FluteCharacter mood={characterMood} animKey={charAnimKey} />
        <BadgeToast badge={toastBadge} onDismiss={clearToast} />
      </GamePage>
    )
  }

  // ── recall ───────────────────────────────────────────────────────────────────
  if (gamePhase === 'recall') {
    const expectedNoteId = sequence[recallIndex]

    return (
      <GamePage>
        {/* Round header */}
        <div className="mb-2 flex items-center justify-between">
          <p style={{ fontSize: 14, fontWeight: 700, color: '#999999', fontFamily: "'Nunito', sans-serif" }}>
            Round {roundNumber} of {TOTAL_ROUNDS}
          </p>
          <div className="flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#4CAF50' : '#AAAAAA' }}>
            <span className="h-2 w-2 rounded-full" style={{ background: isActive ? '#4CAF50' : '#DDD', animation: isActive ? 'pulse 2s infinite' : 'none' }} />
            {isActive ? 'Mic on' : 'No mic'}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#1A1A2E', marginBottom: 20, fontFamily: "'Nunito', sans-serif" }}>
          Your turn! 🎵
        </p>

        {/* Progress tiles */}
        <div className="mb-6 flex justify-center gap-3">
          {sequence.map((noteId, i) => (
            <EchoNoteCard
              key={i}
              noteId={noteId}
              status={
                i < recallIndex  ? (noteResults[i] ?? 'pending') :
                i === recallIndex ? 'hidden' : 'waiting'
              }
              size="small"
            />
          ))}
        </div>

        {/* Hint card */}
        <div style={{ background: 'white', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', marginBottom: 12 }}>
          <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#666666', marginBottom: 12, fontFamily: "'Nunito', sans-serif" }}>
            Play note {Math.min(recallIndex + 1, sequence.length)} of {sequence.length}
          </p>
          {showHint && expectedNoteId ? (
            <FingeringDiagramForNote noteId={expectedNoteId} />
          ) : (
            <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#DDDDDD' }}>?</p>
            </div>
          )}
          <button
            onClick={() => setShowHint(h => !h)}
            style={{
              marginTop: 12, width: '100%', borderRadius: 12,
              border: '1.5px solid #006EE9', padding: '8px 0',
              fontSize: 14, fontWeight: 700, color: '#0056C7',
              background: showHint ? 'transparent' : '#FFF3E0', cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {showHint ? 'Hide hint' : 'Show me the fingering'}
          </button>
        </div>

        {/* Detected note display */}
        <div style={{ background: 'white', borderRadius: 16, padding: 12, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#AAAAAA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, fontFamily: "'Nunito', sans-serif" }}>Hearing</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: '#2D2D2D', fontFamily: "'Nunito', sans-serif" }}>{note ?? '—'}</p>
        </div>

        <FluteCharacter mood={characterMood} animKey={charAnimKey} />
        <BadgeToast badge={toastBadge} onDismiss={clearToast} />
      </GamePage>
    )
  }

  // ── round_result ─────────────────────────────────────────────────────────────
  if (gamePhase === 'round_result') {
    const roundPerfect = noteResults.every(r => r === 'correct')
    const isLastRound  = roundNumber >= TOTAL_ROUNDS

    return (
      <GamePage centred>
        <div style={{
          background: roundPerfect
            ? 'linear-gradient(135deg, rgba(245,166,35,0.08) 0%, rgba(76,175,80,0.08) 100%)'
            : 'white',
          border: roundPerfect ? '2px solid #4CAF50' : '2px solid #EEEEEE',
          borderRadius: 24, padding: 32,
          boxShadow: roundPerfect
            ? '0 4px 24px rgba(76,175,80,0.2)'
            : '0 4px 24px rgba(0,0,0,0.06)',
          width: '100%', maxWidth: 420,
        }}>
          <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#AAAAAA', marginBottom: 6, fontFamily: "'Nunito', sans-serif" }}>
            Round {roundNumber} of {TOTAL_ROUNDS}
          </p>
          <p style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#2D2D2D', marginBottom: 24, fontFamily: "'Nunito', sans-serif" }}>
            {roundPerfect ? 'Amazing! You nailed it! 🌟' : 'So close! 💪'}
          </p>

          <div className="mb-6 flex justify-center gap-3">
            {sequence.map((noteId, i) => (
              <EchoNoteCard key={i} noteId={noteId} status={noteResults[i] ?? 'pending'} size="small" />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {roundPerfect || isLastRound ? (
              <AmberButton small onClick={isLastRound ? () => setGamePhase('game_over') : advanceToNextRound}>
                {isLastRound ? 'See Results' : 'Next Round'}
              </AmberButton>
            ) : (
              <>
                <AmberButton small onClick={retryRound}>Try Again</AmberButton>
                <OutlineButton onClick={advanceToNextRound}>Skip to Next Round</OutlineButton>
              </>
            )}
          </div>
        </div>

        <FluteCharacter mood={characterMood} animKey={charAnimKey} />
        <BadgeToast badge={toastBadge} onDismiss={clearToast} />
      </GamePage>
    )
  }

  // ── game_over ────────────────────────────────────────────────────────────────
  if (gamePhase === 'game_over') {
    const perfectGame = !anyError

    return (
      <GamePage centred>
        <div style={{
          background: perfectGame
            ? 'linear-gradient(135deg, #FFF3E0 0%, #FFF8EE 100%)'
            : 'white',
          border: perfectGame ? 'none' : '2px solid #EEEEEE',
          borderRadius: 24, padding: 32,
          boxShadow: perfectGame
            ? '0 8px 32px rgba(131,231,255,0.25)'
            : '0 4px 24px rgba(0,0,0,0.06)',
          width: '100%', maxWidth: 420, textAlign: 'center',
        }}>
          <p style={{ fontSize: 56, margin: '0 0 12px' }}>{perfectGame ? '🥁' : '🎵'}</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#2D2D2D', marginBottom: 8, fontFamily: "'Nunito', sans-serif" }}>
            {perfectGame ? 'PERFECT GAME! 🌟' : 'Great practice!'}
          </p>
          <p style={{ fontSize: 15, color: '#666666', marginBottom: 24, fontFamily: "'Nunito', sans-serif" }}>
            {perfectGame
              ? 'You completed every round without a single mistake!'
              : 'Each round makes you stronger. Keep going!'}
          </p>

          {/* Perfect rounds stat */}
          <div style={{ background: perfectGame ? 'rgba(255,255,255,0.45)' : '#FAF4EE', borderRadius: 16, padding: '16px 0', marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#666666', fontFamily: "'Nunito', sans-serif" }}>Perfect rounds</p>
            <p style={{ fontSize: 36, fontWeight: 900, color: '#006EE9', fontFamily: "'Nunito', sans-serif" }}>
              {perfectRounds} / {TOTAL_ROUNDS}
            </p>
          </div>

          {perfectGame && (
            <div style={{ background: 'rgba(255,255,255,0.5)', border: '1.5px solid rgba(0,110,233,0.4)', borderRadius: 14, padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0056C7', fontFamily: "'Nunito', sans-serif" }}>
                🥁 Rhythm Master badge unlocked!
              </p>
            </div>
          )}

          <AmberButton small onClick={() => setGamePhase('idle')}>Play Again</AmberButton>
        </div>

        <FluteCharacter mood={characterMood} animKey={charAnimKey} />
        <BadgeToast badge={toastBadge} onDismiss={clearToast} />
      </GamePage>
    )
  }

  return null
}

// ── Page router: only one useState here, no hooks violation ───────────────────
export default function EchoGamePage() {
  const [gameMode, setGameMode] = useState('echo') // 'echo' | 'quiz'

  if (gameMode === 'quiz') {
    return <NoteQuizGame onBack={() => setGameMode('echo')} />
  }

  return <EchoGame onStartQuiz={() => setGameMode('quiz')} />
}
