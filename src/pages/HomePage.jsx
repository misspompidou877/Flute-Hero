import { Link, useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useStreak } from '../hooks/useStreak'
import { BADGES } from '../data/badges'
import { SONGS } from '../data/songs'
import { NOTES } from '../notes'
import FluteCharacter from '../components/FluteCharacter'
import { isTrialActive, getTrialDay } from '../utils/trial'

const LEVEL_NAMES = {
  1: 'First Breath',
  2: 'Finding My Voice',
  3: 'Middle Path',
  4: 'Reaching Higher',
  5: 'Taking Flight',
  6: 'Sharps & Flats',
  7: 'Filling the Gaps',
  8: 'Sky High',
}

const LEVEL_TOTAL_NOTES = { 1: 3, 2: 5, 3: 8, 4: 11, 5: 14, 6: 16, 7: 18, 8: 20 }
const NOTE_ORDER = ['B4', 'A4', 'G4', 'C5', 'D5', 'E5', 'F5', 'Bb4', 'A5', 'B5', 'C6', 'E4', 'F4', 'Cs5', 'Eb5', 'Gs4', 'Gs5', 'Cs6', 'D6']

// Child's first name — set later by onboarding. Warm generic fallback if absent.
function readFirstName() {
  try {
    const v = localStorage.getItem('profile.firstName')
    if (typeof v === 'string' && v.trim()) return v.trim()
  } catch {
    /* localStorage can throw in private mode — fall through to null */
  }
  return null
}

// ── Streak flame (v2.0 palette: Mango body, Deep Teal outline, Sunshine core) ──
function FlameSVG() {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" aria-hidden="true">
      <path
        d="M22 2 C 31 14, 40 21, 40 33 A 18 18 0 1 1 4 33 C 4 24, 12 22, 14 13 C 18 19, 20 17, 22 2 Z"
        fill="#FFB76C"
        stroke="#0B3D3A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M22 23 C 26 29, 30 32, 30 38 A 8 8 0 1 1 14 38 C 14 33, 18 31, 22 23 Z"
        fill="#FFF57E"
      />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B3D3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const { currentStreak, practiceDays } = useStreak()

  const firstName   = readFirstName()
  const greeting    = firstName ? `Hi, ${firstName}` : 'Hi there'
  const greetingSpeech = firstName ? `Hi, ${firstName}! 🎵` : 'Hi there! 🎵'

  const displayLevel  = Math.min(Math.max(progress.currentLevel === 99 ? 1 : progress.currentLevel, 1), 8)
  const levelName     = LEVEL_NAMES[displayLevel] ?? 'First Breath'
  const masteredCount = progress.masteredNotes.length
  const levelTotal    = LEVEL_TOTAL_NOTES[displayLevel] ?? 3
  const levelPct      = Math.min(masteredCount / levelTotal, 1)

  const earnedBadgeIds = new Set(progress.badgesEarned)
  const earnedBadges   = BADGES.filter(b => earnedBadgeIds.has(b.id))
  const lockedBadges   = BADGES.filter(b => !earnedBadgeIds.has(b.id))
  const recentBadges   = earnedBadges.slice(-4).reverse()
  const displayBadges  = [...recentBadges, ...lockedBadges.slice(0, 4 - recentBadges.length)].slice(0, 4)
  const trophyCount    = earnedBadges.length

  const todayKey       = new Date().toISOString().slice(0, 10)
  const practicedToday = Array.isArray(practiceDays) && practiceDays.includes(todayKey)

  const currentNote      = NOTE_ORDER.find(n => !progress.masteredNotes.includes(n)) ?? 'B4'
  const currentNoteLabel = NOTES[currentNote]?.label ?? currentNote
  const currentSong      = SONGS.find(s => s.level <= displayLevel)?.title ?? 'Hot Cross Buns'

  // Trial: positive "journey" framing while active; renders NOTHING when expired.
  const trialActive = isTrialActive()
  const trialDay    = trialActive ? getTrialDay() : 0

  // Piper choreography — mascot mood/speech follow the trial day (see gtm/workflows/in-app-nudge-map.md).
  // Never mentions price or purchase wording — kid-facing only.
  let piperMood    = 'wave'
  let piperSpeech  = greetingSpeech
  if (trialActive) {
    if (trialDay === 4) {
      piperMood   = 'wave'
      piperSpeech = 'Show a grown-up what you can play! 🎶'
    } else if (trialDay === 8 || trialDay === 9) {
      piperMood   = 'sleepy'
      piperSpeech = 'Our 10-day adventure is nearly done 🌙'
    } else if (trialDay >= 10) {
      piperMood   = 'dance'
      piperSpeech = 'You did it! Show a grown-up 🎉'
    }
  }

  return (
    <div className="flex flex-col" style={{ background: '#FAFAF8', minHeight: '100%' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between" style={{ padding: '14px 16px 6px' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#0B3D3A', lineHeight: 1.2 }}>{greeting}</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#0B3D3A', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
            FLUTE HERO
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Parent-zone entrance — routes to the math-gated /parent page */}
          <button
            onClick={() => navigate('/parent')}
            className="flex items-center justify-center rounded-full bg-white active:bg-gray-100 active:scale-95 transition-all"
            style={{ height: 44, minWidth: 44, padding: '0 12px', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer' }}
            aria-label="For grown-ups"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B3D3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0B3D3A' }}>Grown-ups</span>
          </button>
          <button
            className="relative flex items-center justify-center rounded-full bg-white active:bg-gray-100 active:scale-95 transition-all"
            style={{ width: 44, height: 44, minWidth: 44, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer' }}
            aria-label="Notifications"
          >
            <BellIcon />
          </button>
        </div>
      </div>

      {/* Trial-day indicator — positive journey framing, only while trial is active */}
      {trialActive && (
        <div style={{ margin: '2px 16px 8px' }}>
          {trialDay >= 10 ? (
            <button
              onClick={() => navigate('/parent')}
              className="inline-flex items-center active:scale-95 transition-transform"
              style={{
                background: 'rgba(106,236,225,0.22)',
                color: '#0B3D3A',
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 9999,
                padding: '5px 12px',
                minHeight: 44,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Your 10-day adventure is complete — ask a grown-up! 🎉
            </button>
          ) : (
            <span
              className="inline-flex items-center"
              style={{
                background: 'rgba(106,236,225,0.22)',
                color: '#0B3D3A',
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 9999,
                padding: '5px 12px',
              }}
            >
              Day {trialDay} of your 10-day adventure 🌟
            </span>
          )}
        </div>
      )}

      {/* Streak hero card */}
      <div style={{ margin: '8px 14px 12px', background: '#FFF57E', borderRadius: 18, padding: '14px 16px' }}>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#0B3D3A', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              Current Streak
            </p>
            <div className="flex items-baseline gap-2" style={{ marginTop: 2 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: '#0B3D3A', lineHeight: 1 }}>
                {currentStreak}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0B3D3A' }}>
                {currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#0B3D3A', marginTop: 6 }}>
              {practicedToday
                ? 'Practiced today ✓ Nice work!'
                : currentStreak === 0
                  ? 'Pick up your flute to start! 🎵'
                  : 'Practise today to keep your streak!'}
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <FlameSVG />
          </div>
        </div>
      </div>

      {/* Level + trophy row */}
      <div className="flex gap-2" style={{ margin: '0 14px 10px' }}>
        <div
          className="flex-1 flex flex-col bg-white"
          style={{ borderRadius: 14, padding: '10px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <p style={{ fontSize: 10, fontWeight: 600, color: '#0B3D3A', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
            Level {displayLevel}
          </p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0B3D3A', marginTop: 2 }}>{levelName}</p>
          <div style={{ height: 6, background: '#F1EFE8', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.round(levelPct * 100)}%`,
              background: '#26CCC2',
              borderRadius: 3,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <p style={{ fontSize: 10, fontWeight: 500, color: '#666666', marginTop: 4 }}>
            {masteredCount} of {levelTotal} notes mastered
          </p>
        </div>

        <div
          className="flex flex-col items-center justify-center bg-white"
          style={{ minWidth: 64, borderRadius: 14, padding: '10px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <span style={{ fontSize: 24 }}>🏆</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#0B3D3A', lineHeight: 1 }}>{trophyCount}</span>
          <span style={{ fontSize: 10, fontWeight: 500, color: '#0B3D3A' }}>trophies</span>
        </div>
      </div>

      {/* Primary CTA — Teal gradient with Deep Teal label (golden rule) */}
      <div style={{ margin: '0 14px 12px' }}>
        <button
          onClick={() => navigate('/practice')}
          className="w-full flex items-center gap-3 rounded-2xl active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
            boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
            padding: 14,
            minHeight: 44,
            border: 'none',
            cursor: 'pointer',
            color: '#0B3D3A',
          }}
        >
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(11,61,58,0.12)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0B3D3A">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          <div className="flex-1 text-left" style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Continue practicing</div>
            <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.85 }}>
              {`Next: ${currentNoteLabel} — ${currentSong}`}
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B3D3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>

      {/* Recent trophies */}
      <div style={{ margin: '0 14px 10px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#0B3D3A', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
            Recent Trophies
          </p>
          <Link
            to="/trophies"
            className="inline-flex items-center rounded-lg transition-colors hover:bg-black/5 active:bg-black/10"
            style={{ fontSize: 12, fontWeight: 700, color: '#0B3D3A', padding: '8px 12px', minHeight: 44 }}
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {displayBadges.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id)
            return (
              <div
                key={badge.id}
                className="flex flex-col items-center justify-center rounded-xl"
                style={{
                  aspectRatio: '1',
                  background: isEarned ? '#FFF57E' : 'rgba(255,183,108,0.15)',
                  border: `2px solid ${isEarned ? '#26CCC2' : '#FFB76C'}`,
                  opacity: isEarned ? 1 : 0.7,
                  fontSize: isEarned ? 24 : 20,
                  fontWeight: 800,
                  color: '#0B3D3A',
                }}
                aria-label={isEarned ? badge.name : 'Locked badge'}
              >
                {isEarned ? badge.icon : '?'}
              </div>
            )
          })}
        </div>
      </div>

      {/* Piper — friendly greeting, choreographed by trial day (renders fixed bottom-right by design) */}
      <FluteCharacter mood={piperMood} speech={piperSpeech} />

    </div>
  )
}
