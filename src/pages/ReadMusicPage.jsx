import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StaffNoteGuide from '../components/readMusic/StaffNoteGuide'
import { playTone } from '../utils/playTone'
import { READ_MUSIC_FREQUENCIES } from '../data/readMusicData'

// ── Data ──────────────────────────────────────────────────────────────────────
const INTRO_IDS  = ['E4', 'B4', 'F5']
const FIRST_IDS  = ['G4', 'A4', 'B4']
const LINE_IDS   = ['E4', 'G4', 'B4', 'D5', 'F5']
const SPACE_IDS  = ['F4', 'A4', 'C5', 'E5']

const FIRST_DATA = [
  { id: 'B4', letter: 'B', desc: 'Sits on the middle line of the staff',    bg: '#FFF57E', fg: '#0B3D3A' },
  { id: 'A4', letter: 'A', desc: 'Floats in the space just below B',        bg: '#6AECE1', fg: '#0B3D3A' },
  { id: 'G4', letter: 'G', desc: 'Sits on the second line from the bottom', bg: '#FFB76C', fg: '#0B3D3A' },
]

const LINE_DATA = [
  { id: 'E4', letter: 'E', word: 'Every',    bg: '#6AECE1', fg: '#0B3D3A' },
  { id: 'G4', letter: 'G', word: 'Good',     bg: '#26CCC2', fg: '#0B3D3A', known: true },
  { id: 'B4', letter: 'B', word: 'Boy',      bg: '#FFF57E', fg: '#0B3D3A', known: true },
  { id: 'D5', letter: 'D', word: 'Deserves', bg: '#FFB76C', fg: '#0B3D3A' },
  { id: 'F5', letter: 'F', word: 'Fruit',    bg: '#6AECE1', fg: '#0B3D3A' },
]

const SPACE_DATA = [
  { id: 'F4', letter: 'F', bg: '#6AECE1', fg: '#0B3D3A' },
  { id: 'A4', letter: 'A', bg: '#26CCC2', fg: '#0B3D3A', known: true },
  { id: 'C5', letter: 'C', bg: '#FFB76C', fg: '#0B3D3A' },
  { id: 'E5', letter: 'E', bg: '#FFF57E', fg: '#0B3D3A' },
]

const QUIZ_EASY   = ['B4', 'A4', 'G4']
const QUIZ_ALL    = ['E4', 'G4', 'A4', 'B4', 'D5', 'F5', 'C5']
const ALL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const NOTE_LETTER = {
  E4: 'E', F4: 'F', G4: 'G', A4: 'A', B4: 'B',
  C5: 'C', D5: 'D', E5: 'E', F5: 'F',
}

const FIRST_COLORS  = { G4: '#FFB76C', A4: '#6AECE1', B4: '#FFF57E' }
const LINE_COLORS   = { E4: '#6AECE1', G4: '#26CCC2', B4: '#FFF57E', D5: '#FFB76C', F5: '#6AECE1' }
const SPACE_COLORS  = { F4: '#6AECE1', A4: '#26CCC2', C5: '#FFB76C', E5: '#FFF57E' }

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuizNotes() {
  const easy = shuffle([...QUIZ_EASY])
  const hard = shuffle(QUIZ_ALL.filter(n => !QUIZ_EASY.includes(n))).slice(0, 2)
  return [...easy, ...hard]
}

function getChoices(noteId) {
  const correct = NOTE_LETTER[noteId]
  const others  = shuffle(ALL_LETTERS.filter(l => l !== correct))
  return shuffle([correct, ...others.slice(0, 3)])
}

// ── CSS keyframes ─────────────────────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('rm-kf')) {
  const s = document.createElement('style')
  s.id = 'rm-kf'
  s.textContent = `
    @keyframes rm-shake {
      0%,100% { transform:translateX(0); }
      20%     { transform:translateX(-7px); }
      40%     { transform:translateX(7px); }
      60%     { transform:translateX(-4px); }
      80%     { transform:translateX(4px); }
    }
    @keyframes rm-pop {
      0%   { transform:scale(1); }
      50%  { transform:scale(1.05); }
      100% { transform:scale(1); }
    }
    @keyframes rm-fadein {
      from { opacity:0; transform:translateY(6px); }
      to   { opacity:1; transform:translateY(0); }
    }
  `
  document.head.appendChild(s)
}

// ── Shared style shorthand ────────────────────────────────────────────────────
const F = { fontFamily: 'Nunito, sans-serif' }

// ── Shared components ─────────────────────────────────────────────────────────

function StepProgress({ step }) {
  const labels = ['Staff', 'First Notes', 'Lines', 'Spaces', 'Quiz']
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {labels.map((label, i) => (
        <div
          key={i}
          title={label}
          style={{
            flex: i === step ? 3 : 1,
            height: 6,
            borderRadius: 999,
            background: i < step ? '#26CCC2' : i === step ? '#6AECE1' : '#E0E0E0',
            transition: 'flex 0.4s ease, background 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}

function TipCard({ icon = '💡', children }) {
  return (
    <div style={{
      background: 'rgba(106,236,225,0.12)',
      border: '2px solid #6AECE1',
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      <div style={{ ...F, fontSize: 14, fontWeight: 600, color: '#0B3D3A', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  )
}

function KnownCallout({ children }) {
  return (
    <div style={{
      background: 'rgba(255,245,126,0.22)',
      border: '2px solid #FFF57E',
      borderRadius: 14,
      padding: '12px 16px',
      display: 'flex',
      gap: 10,
      alignItems: 'center',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>⭐</span>
      <div style={{ ...F, fontSize: 14, fontWeight: 700, color: '#0B3D3A', lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  )
}

function NavyCard({ title, subtitle }) {
  return (
    <div style={{ background: '#0B3D3A', borderRadius: 16, padding: '18px 16px' }}>
      <p style={{ ...F, fontWeight: 800, fontSize: 18, color: '#FFFFFF', margin: '0 0 6px' }}>
        {title}
      </p>
      <p style={{ ...F, fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.82)', margin: 0, lineHeight: 1.6 }}>
        {subtitle}
      </p>
    </div>
  )
}

// ── Step 0: The staff ─────────────────────────────────────────────────────────
function Step0() {
  const [tapped, setTapped] = useState(new Set())
  const introColors = { E4: '#6AECE1', B4: '#FFF57E', F5: '#FFB76C' }

  const handleClick = useCallback((noteId) => {
    setTapped(prev => { const n = new Set(prev); n.add(noteId); return n })
    playTone(READ_MUSIC_FREQUENCIES[noteId], 0.6)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: '#0B3D3A',
        borderRadius: 16,
        padding: '20px 16px',
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
      }}>
        <div style={{
          width: 6, alignSelf: 'stretch', borderRadius: 999, flexShrink: 0,
          background: 'linear-gradient(to bottom, #6AECE1, #FFF57E, #FFB76C)',
        }} />
        <div>
          <p style={{ ...F, fontWeight: 800, fontSize: 18, color: '#FFFFFF', margin: '0 0 8px' }}>
            Music lives on a staff
          </p>
          <p style={{ ...F, fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.82)', margin: 0, lineHeight: 1.65 }}>
            The staff has <strong style={{ color: '#6AECE1' }}>5 lines</strong>.
            Notes that sit <strong style={{ color: '#FFB76C' }}>higher</strong> on the staff sound higher.
            Notes that sit <strong style={{ color: '#6AECE1' }}>lower</strong> on the staff sound lower.
          </p>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <p style={{ ...F, fontWeight: 700, fontSize: 15, color: '#0B3D3A', margin: '0 0 12px', textAlign: 'center' }}>
          Tap each note — hear how the pitch changes!
        </p>
        <StaffNoteGuide
          noteIds={INTRO_IDS}
          tappedNotes={tapped}
          activeColors={introColors}
          onNoteClick={handleClick}
          showAllLabels={false}
        />
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
          {[
            { label: '⬇ Low',    color: '#6AECE1' },
            { label: '— Middle', color: '#FFF57E' },
            { label: '⬆ High',   color: '#FFB76C' },
          ].map(({ label, color }) => (
            <span key={label} style={{ ...F, fontWeight: 700, fontSize: 13, color }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <TipCard icon="🎵">
        The curly symbol at the left is the <strong>treble clef</strong>.
        It tells us which note is which. All flute music uses treble clef.
      </TipCard>

      <TipCard icon="👆">
        Tap the three notes above — going higher each time. Can you hear the pitch rising?
      </TipCard>
    </div>
  )
}

// ── Step 1: First flute notes ─────────────────────────────────────────────────
function Step1() {
  const [tapped,   setTapped]   = useState(new Set())
  const [selected, setSelected] = useState(null)

  const handleClick = useCallback((noteId) => {
    setTapped(prev => { const n = new Set(prev); n.add(noteId); return n })
    setSelected(noteId)
    playTone(READ_MUSIC_FREQUENCIES[noteId], 0.6)
  }, [])

  const selectedData = FIRST_DATA.find(d => d.id === selected)
  const allTapped    = tapped.size >= 3

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <NavyCard
        title="Your first flute notes: B, A and G"
        subtitle="These are the very first notes you learn on the flute. Tap each one below to hear it!"
      />

      {/* Large note chips */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {FIRST_DATA.map(({ id, letter, bg, fg }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            style={{
              width: 76, height: 76,
              borderRadius: 18,
              border: selected === id ? '3px solid #0B3D3A' : '3px solid transparent',
              background: bg,
              color: fg,
              ...F,
              fontWeight: 900,
              fontSize: 34,
              cursor: 'pointer',
              boxShadow: selected === id
                ? '0 6px 20px rgba(0,0,0,0.22)'
                : '0 2px 10px rgba(0,0,0,0.10)',
              transform: selected === id ? 'scale(1.09)' : 'scale(1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            aria-label={`Play note ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Staff */}
      <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <p style={{ ...F, fontWeight: 700, fontSize: 14, color: '#0B3D3A', margin: '0 0 10px', textAlign: 'center' }}>
          Now tap them on the staff too:
        </p>
        <StaffNoteGuide
          noteIds={FIRST_IDS}
          tappedNotes={tapped}
          activeColors={FIRST_COLORS}
          onNoteClick={handleClick}
          showAllLabels={allTapped}
        />
      </div>

      {/* Selected note callout */}
      {selectedData && (
        <div style={{
          background: selectedData.bg,
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          animation: 'rm-fadein 0.25s ease',
        }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...F, fontWeight: 900, fontSize: 24, color: selectedData.fg,
            flexShrink: 0,
          }}>
            {selectedData.letter}
          </div>
          <div>
            <p style={{ ...F, fontWeight: 800, fontSize: 16, color: selectedData.fg, margin: '0 0 2px' }}>
              Note {selectedData.letter}
            </p>
            <p style={{ ...F, fontWeight: 600, fontSize: 13, color: selectedData.fg, margin: 0, opacity: 0.85 }}>
              {selectedData.desc}
            </p>
          </div>
        </div>
      )}

      <TipCard icon="⬆">
        Tap G, then A, then B in order. Hear how each one sounds a little higher?
        Higher on the staff = higher in pitch!
      </TipCard>
    </div>
  )
}

// ── Step 2: Lines — EGBDF ────────────────────────────────────────────────────
function Step2() {
  const [tapped, setTapped] = useState(new Set())

  const handleClick = useCallback((noteId) => {
    setTapped(prev => { const n = new Set(prev); n.add(noteId); return n })
    playTone(READ_MUSIC_FREQUENCIES[noteId], 0.6)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <NavyCard
        title="The 5 lines — Every Good Boy Deserves Fruit"
        subtitle="Each line carries a note. Remember the sentence — one letter per word, bottom to top."
      />

      {/* Mnemonic chips */}
      <div style={{
        background: '#FFFFFF', borderRadius: 16, padding: '16px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex', justifyContent: 'space-around', gap: 6,
      }}>
        {LINE_DATA.map(({ id, letter, word, bg, fg }) => (
          <div key={id} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              background: bg, borderRadius: 10, padding: '8px 4px',
              boxShadow: tapped.has(id)
                ? '0 4px 14px rgba(0,0,0,0.18)'
                : '0 1px 4px rgba(0,0,0,0.08)',
              transition: 'box-shadow 0.2s ease',
            }}>
              <span style={{ ...F, fontWeight: 900, fontSize: 22, color: fg, display: 'block', lineHeight: 1.2 }}>
                {letter}
              </span>
            </div>
            <span style={{ ...F, fontWeight: 600, fontSize: 10, color: '#666666', display: 'block', marginTop: 4 }}>
              {word}
            </span>
          </div>
        ))}
      </div>

      <KnownCallout>
        You already know G (line 2) and B (line 3) — they're two of your flute notes!
      </KnownCallout>

      {/* Staff */}
      <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <p style={{ ...F, fontWeight: 700, fontSize: 14, color: '#0B3D3A', margin: '0 0 10px', textAlign: 'center' }}>
          Tap each note on the staff to hear it:
        </p>
        <StaffNoteGuide
          noteIds={LINE_IDS}
          tappedNotes={tapped}
          activeColors={LINE_COLORS}
          onNoteClick={handleClick}
          showAllLabels={false}
        />
        <p style={{ ...F, fontWeight: 600, fontSize: 13, color: '#999999', textAlign: 'center', margin: '8px 0 0' }}>
          {tapped.size} of 5 tapped
        </p>
      </div>

      <TipCard>
        A note that sits <strong>on</strong> a line has the line passing through its middle.
        A note that floats <strong>between</strong> lines sits in a space.
      </TipCard>
    </div>
  )
}

// ── Step 3: Spaces — FACE ─────────────────────────────────────────────────────
function Step3() {
  const [tapped, setTapped] = useState(new Set())

  const handleClick = useCallback((noteId) => {
    setTapped(prev => { const n = new Set(prev); n.add(noteId); return n })
    playTone(READ_MUSIC_FREQUENCIES[noteId], 0.6)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <NavyCard
        title="The 4 spaces — FACE"
        subtitle="The gaps between the lines spell the word FACE, from bottom to top."
      />

      {/* Large FACE tiles */}
      <div style={{
        background: '#FFFFFF', borderRadius: 16, padding: '20px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        {SPACE_DATA.map(({ id, letter, bg, fg }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            style={{
              width: 64, height: 64,
              borderRadius: 14,
              background: bg,
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: tapped.has(id) ? '0 6px 18px rgba(0,0,0,0.20)' : '0 2px 8px rgba(0,0,0,0.10)',
              transform: tapped.has(id) ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
            }}
            aria-label={`Hear note ${letter}`}
          >
            <span style={{ ...F, fontWeight: 900, fontSize: 36, color: fg, lineHeight: 1 }}>
              {letter}
            </span>
          </button>
        ))}
      </div>

      <KnownCallout>
        You already know A — it lives in the second space from the bottom, and it's one of your first flute notes!
      </KnownCallout>

      {/* Staff */}
      <div style={{ background: '#FFFFFF', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <p style={{ ...F, fontWeight: 700, fontSize: 14, color: '#0B3D3A', margin: '0 0 10px', textAlign: 'center' }}>
          Tap each space note on the staff:
        </p>
        <StaffNoteGuide
          noteIds={SPACE_IDS}
          tappedNotes={tapped}
          activeColors={SPACE_COLORS}
          onNoteClick={handleClick}
          showAllLabels={false}
        />
        <p style={{ ...F, fontWeight: 600, fontSize: 13, color: '#999999', textAlign: 'center', margin: '8px 0 0' }}>
          {tapped.size} of 4 tapped
        </p>
      </div>

      <TipCard icon="🎼">
        Lines give you <strong>E G B D F</strong> and spaces give you <strong>F A C E</strong>.
        Together they cover all the notes on the staff!
      </TipCard>
    </div>
  )
}

// ── Step 4: Quiz ──────────────────────────────────────────────────────────────
function Step4() {
  const initialNotes              = useRef(generateQuizNotes()).current
  const [notes,    setNotes]      = useState(initialNotes)
  const [choices,  setChoices]    = useState(() => getChoices(initialNotes[0]))
  const [idx,      setIdx]        = useState(0)
  const [score,    setScore]      = useState(0)
  const [feedback, setFeedback]   = useState(null)
  const [done,     setDone]       = useState(false)
  const [shakeKey, setShakeKey]   = useState(0)

  const currentNote = notes[idx]

  useEffect(() => {
    setChoices(getChoices(notes[idx]))
  }, [idx, notes])

  const handleAnswer = (letter) => {
    if (feedback) return
    const correct = NOTE_LETTER[currentNote]
    if (letter === correct) {
      setFeedback('correct')
      playTone(READ_MUSIC_FREQUENCIES[currentNote], 0.6)
      setTimeout(() => {
        setScore(s => s + 1)
        if (idx + 1 >= notes.length) {
          setDone(true)
        } else {
          setIdx(i => i + 1)
          setFeedback(null)
        }
      }, 750)
    } else {
      setFeedback('wrong')
      setShakeKey(k => k + 1)
      setTimeout(() => setFeedback(null), 650)
    }
  }

  const handleRetry = () => {
    const newNotes = generateQuizNotes()
    setNotes(newNotes)
    setChoices(getChoices(newNotes[0]))
    setIdx(0)
    setScore(0)
    setFeedback(null)
    setDone(false)
    setShakeKey(0)
  }

  if (done) {
    const perfect = score + 1 >= notes.length
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 16, padding: '24px 0',
        animation: 'rm-fadein 0.35s ease',
      }}>
        <div style={{
          width: 96, height: 96,
          borderRadius: '50%',
          background: '#FFF57E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52,
        }}>
          🎵
        </div>
        <p style={{ ...F, fontWeight: 800, fontSize: 26, color: '#0B3D3A', margin: 0 }}>
          {perfect ? 'Perfect!' : 'Well done!'}
        </p>
        <div style={{
          background: '#0B3D3A', borderRadius: 999,
          padding: '8px 24px',
        }}>
          <span style={{ ...F, fontWeight: 800, fontSize: 18, color: '#FFF57E' }}>
            {score + 1} / {notes.length} correct
          </span>
        </div>
        <p style={{ ...F, fontWeight: 600, fontSize: 15, color: '#666666', margin: 0, textAlign: 'center', maxWidth: 280 }}>
          {perfect
            ? "You're reading music! Keep practising and it'll become instant."
            : 'Great effort — the more you practise, the faster it clicks.'}
        </p>
        <button
          onClick={handleRetry}
          style={{
            marginTop: 8,
            padding: '14px 36px',
            borderRadius: 14,
            border: '2.5px solid #26CCC2',
            background: '#FFFFFF',
            ...F, fontWeight: 800, fontSize: 16, color: '#26CCC2',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(38,204,194,0.12)',
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header with progress dots */}
      <div style={{
        background: '#0B3D3A', borderRadius: 16, padding: '16px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <p style={{ ...F, fontWeight: 800, fontSize: 16, color: '#FFFFFF', margin: 0 }}>
          What note is this?
        </p>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {notes.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx ? 12 : 8,
                height: i === idx ? 12 : 8,
                borderRadius: '50%',
                background: i < idx ? '#FFF57E' : i === idx ? '#FFFFFF' : 'rgba(255,255,255,0.28)',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Staff — key forces remount so VexFlow re-renders the new note */}
      <StaffNoteGuide
        key={currentNote}
        noteIds={[currentNote]}
        tappedNotes={new Set([currentNote])}
        activeColors={{ [currentNote]: '#26CCC2' }}
        onNoteClick={() => {}}
        showAllLabels={false}
      />

      {/* Answer buttons */}
      <div
        key={shakeKey}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          animation: feedback === 'wrong' ? 'rm-shake 0.4s ease' : 'none',
        }}
      >
        {choices.map((letter) => {
          const isCorrect = letter === NOTE_LETTER[currentNote]
          let bg     = '#FFFFFF'
          let border = '2px solid #E0E0E0'
          let color  = '#0B3D3A'
          if (feedback === 'correct' && isCorrect) {
            bg = '#FFF57E'; border = '2px solid #FFF57E'
          }
          if (feedback === 'wrong' && isCorrect) {
            bg = 'rgba(255,245,126,0.4)'; border = '2px solid #FFF57E'
          }
          return (
            <button
              key={letter}
              onClick={() => handleAnswer(letter)}
              style={{
                minHeight: 60,
                borderRadius: 14,
                border, background: bg, color,
                ...F, fontWeight: 900, fontSize: 26,
                cursor: feedback ? 'default' : 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
            >
              {letter}
            </button>
          )
        })}
      </div>

      <p style={{ ...F, fontWeight: 600, fontSize: 13, color: '#999999', textAlign: 'center', margin: 0 }}>
        Question {idx + 1} of {notes.length}
      </p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const STEP_TITLES = ['The Staff', 'First Notes', 'Lines (EGBDF)', 'Spaces (FACE)', 'Quiz Time']

export default function ReadMusicPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const goBack = () => {
    if (step > 0) setStep(s => s - 1)
    else navigate(-1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#FAFAF8',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <button
            onClick={goBack}
            style={{
              width: 44, height: 44,
              borderRadius: '50%',
              border: '1.5px solid #EEEEEE',
              background: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#0B3D3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ ...F, fontWeight: 800, fontSize: 20, color: '#0B3D3A', margin: 0, lineHeight: 1.2 }}>
              Reading Music 🎼
            </p>
            <p style={{ ...F, fontWeight: 600, fontSize: 13, color: '#999999', margin: 0 }}>
              {STEP_TITLES[step]}
            </p>
          </div>
        </div>
        <StepProgress step={step} />
      </div>

      {/* Step content */}
      <div style={{ flex: 1, paddingBottom: step < 4 ? 96 : 24 }}>
        {step === 0 && <Step0 />}
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
      </div>

      {/* Sticky Next button for steps 0–3 */}
      {step < 4 && (
        <div style={{
          position: 'sticky',
          bottom: 0,
          background: 'linear-gradient(to top, #FAFAF8 75%, transparent)',
          padding: '20px 0 calc(8px + env(safe-area-inset-bottom))',
        }}>
          <button
            onClick={() => setStep(s => s + 1)}
            style={{
              width: '100%',
              minHeight: 52,
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
              color: '#0B3D3A',
              ...F, fontWeight: 800, fontSize: 17,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(38,204,194,0.35)',
            }}
          >
            {step === 3 ? 'Start Quiz →' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}
