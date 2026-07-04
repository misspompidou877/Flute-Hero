import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useStreak } from '../hooks/useStreak'
import { BADGES } from '../data/badges'
import { SONGS } from '../data/songs'
import { NOTES } from '../notes'

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

// ── Streak accessories: unlocked by day count ─────────────────────────────────
const STREAK_ACCESSORIES = [
  { minStreak: 30, id: 'hero_mask',    bubble: 'Flute Hero! 🦸'   },
  { minStreak: 14, id: 'wizard_hat',   bubble: 'Magical! 🧙'       },
  { minStreak: 7,  id: 'crown',        bubble: 'Week warrior! 👑'  },
  { minStreak: 4,  id: 'sunglasses',   bubble: 'Looking cool! 😎'  },
  { minStreak: 3,  id: 'baseball_cap', bubble: 'Hat trick! ⚾'     },
  { minStreak: 2,  id: 'giraffe',      bubble: 'Two days! 🦒'      },
  { minStreak: 1,  id: 'panda',        bubble: 'Day one! 🐼'       },
  { minStreak: 0,  id: 'none',         bubble: "Let's play! 🎵"    },
]

// ── Streak character SVG with layered accessories ─────────────────────────────
function StreakCharacterSVG({ accessory }) {
  return (
    <svg viewBox="0 -35 80 215" width="80" height="130" aria-hidden="true">
      {/* Drop shadow */}
      <ellipse cx="40" cy="174" rx="22" ry="5" fill="rgba(0,0,0,0.10)" />

      {/* Flute body */}
      <rect x="28" y="50" width="24" height="122" rx="12" fill="#83E7FF" />
      <rect x="31" y="54" width="7"  height="114" rx="3.5" fill="rgba(255,255,255,0.28)" />
      <circle cx="40" cy="95"  r="5" fill="#006EE9" />
      <circle cx="40" cy="112" r="5" fill="#006EE9" />
      <circle cx="40" cy="129" r="5" fill="#006EE9" />
      <circle cx="40" cy="146" r="5" fill="#006EE9" />

      {/* Panda ears — behind face */}
      {accessory === 'panda' && <>
        <circle cx="20" cy="19" r="13" fill="#1A1A2E" />
        <circle cx="60" cy="19" r="13" fill="#1A1A2E" />
        <circle cx="20" cy="19" r="8"  fill="white" />
        <circle cx="60" cy="19" r="8"  fill="white" />
      </>}

      {/* Face */}
      <circle cx="40" cy="34" r="26" fill="#83E7FF" />
      <circle cx="32" cy="26" r="7"  fill="rgba(255,255,255,0.20)" />

      {/* Eyes */}
      <circle cx="31"   cy="30"   r="6.5" fill="white" />
      <circle cx="31.5" cy="30.5" r="3"   fill="#1A1A2E" />
      <circle cx="29.5" cy="28.5" r="1.5" fill="white" />
      <circle cx="49"   cy="30"   r="6.5" fill="white" />
      <circle cx="49.5" cy="30.5" r="3"   fill="#1A1A2E" />
      <circle cx="47.5" cy="28.5" r="1.5" fill="white" />

      {/* Smile */}
      <path d="M 31 40 Q 40 49 49 40" fill="none" stroke="#1A1A2E" strokeWidth="2.2" strokeLinecap="round" />

      {/* Floating ♪ */}
      <text x="64" y="30" fontSize="16" fill="#006EE9" fontWeight="bold">♪</text>

      {/* ── Front accessories ── */}

      {/* Giraffe ossicones */}
      {accessory === 'giraffe' && <>
        <rect x="25" y="-8" width="6" height="22" rx="3" fill="#F5A623" />
        <circle cx="28" cy="-10" r="6" fill="#D4851A" />
        <rect x="49" y="-8" width="6" height="22" rx="3" fill="#F5A623" />
        <circle cx="52" cy="-10" r="6" fill="#D4851A" />
      </>}

      {/* Baseball cap */}
      {accessory === 'baseball_cap' && <>
        <path d="M17 22 Q17 2 40 2 Q63 2 63 22 Z" fill="#E7A0FE" />
        <ellipse cx="40" cy="21" rx="28" ry="5" fill="#C060E8" />
        <circle cx="40" cy="4" r="3.5" fill="#C060E8" />
      </>}

      {/* Sunglasses */}
      {accessory === 'sunglasses' && <>
        <rect x="19" y="23" width="18" height="13" rx="5.5" fill="#1A1A2E" opacity="0.88" />
        <rect x="43" y="23" width="18" height="13" rx="5.5" fill="#1A1A2E" opacity="0.88" />
        <rect x="37" y="27" width="6"  height="3.5" rx="1.5" fill="#1A1A2E" opacity="0.88" />
        <line x1="19" y1="29" x2="9"  y2="31" stroke="#555" strokeWidth="2" strokeLinecap="round" />
        <line x1="61" y1="29" x2="71" y2="31" stroke="#555" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="25" cy="26" rx="3.5" ry="2" fill="white" opacity="0.35" />
        <ellipse cx="49" cy="26" rx="3.5" ry="2" fill="white" opacity="0.35" />
      </>}

      {/* Crown */}
      {accessory === 'crown' && <>
        <rect x="17" y="2" width="46" height="14" rx="3" fill="#F5A623" />
        <polygon points="17,2 23,-14 30,2"  fill="#F5A623" />
        <polygon points="31,2 40,-18 49,2"  fill="#F5A623" />
        <polygon points="50,2 57,-14 63,2"  fill="#F5A623" />
        <circle cx="23" cy="9" r="4" fill="#E7A0FE" />
        <circle cx="40" cy="9" r="4" fill="#83E7FF" />
        <circle cx="57" cy="9" r="4" fill="#D0FFA3" />
        <rect x="17" y="13" width="46" height="3" rx="1.5" fill="rgba(0,0,0,0.12)" />
      </>}

      {/* Wizard hat */}
      {accessory === 'wizard_hat' && <>
        <polygon points="40,-33 18,8 62,8" fill="#A855F7" />
        <ellipse cx="40" cy="8" rx="27" ry="7" fill="#7C3AED" />
        <circle cx="40" cy="-20" r="4"   fill="#F5A623" />
        <circle cx="40" cy="-20" r="2"   fill="white" opacity="0.5" />
        <circle cx="30" cy="-8"  r="2.5" fill="#D0FFA3" />
        <circle cx="51" cy="-11" r="2"   fill="#83E7FF" />
        <rect x="23" y="4" width="34" height="6" rx="2" fill="rgba(255,255,255,0.15)" />
      </>}

      {/* Hero mask */}
      {accessory === 'hero_mask' && <>
        <path d="M11 23 Q21 14 31 23 L49 23 Q59 14 69 23 L69 36 Q59 41 49 34 L31 34 Q21 41 11 36 Z" fill="#006EE9" />
        <ellipse cx="28.5" cy="29" rx="8.5" ry="6.5" fill="#83E7FF" />
        <ellipse cx="51.5" cy="29" rx="8.5" ry="6.5" fill="#83E7FF" />
        <line x1="11" y1="29" x2="3"  y2="29" stroke="#006EE9" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="69" y1="29" x2="77" y2="29" stroke="#006EE9" strokeWidth="2.5" strokeLinecap="round" />
      </>}
    </svg>
  )
}

// ── Home-page inline character with speech bubble ─────────────────────────────
function HomeStreakCharacter({ streak }) {
  const styleInjected = useRef(false)

  useEffect(() => {
    if (styleInjected.current) return
    if (document.getElementById('home-char-keyframes')) { styleInjected.current = true; return }
    const el = document.createElement('style')
    el.id = 'home-char-keyframes'
    el.textContent = `
      @keyframes home-char-float {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-7px); }
      }
    `
    document.head.appendChild(el)
    styleInjected.current = true
  }, [])

  const acc = STREAK_ACCESSORIES.find(a => streak >= a.minStreak)
              ?? STREAK_ACCESSORIES[STREAK_ACCESSORIES.length - 1]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, gap: 4 }}>
      {/* Speech bubble */}
      <div style={{
        background: 'white',
        borderRadius: 10,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 700,
        color: '#000180',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
        position: 'relative',
      }}>
        {acc.bubble}
        <div style={{
          position: 'absolute',
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 10,
          height: 6,
          background: 'white',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
        }} />
      </div>

      {/* Animated character */}
      <div style={{ animation: 'home-char-float 2.2s ease-in-out infinite' }}>
        <StreakCharacterSVG accessory={acc.id} />
      </div>
    </div>
  )
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const { currentStreak, practiceDays } = useStreak()

  const displayLevel = Math.min(Math.max(progress.currentLevel === 99 ? 1 : progress.currentLevel, 1), 8)
  const levelName    = LEVEL_NAMES[displayLevel] ?? 'First Breath'
  const masteredCount = progress.masteredNotes.length
  const levelTotal   = LEVEL_TOTAL_NOTES[displayLevel] ?? 3
  const levelPct     = Math.min(masteredCount / levelTotal, 1)

  const earnedBadgeIds = new Set(progress.badgesEarned)
  const earnedBadges   = BADGES.filter(b => earnedBadgeIds.has(b.id))
  const lockedBadges   = BADGES.filter(b => !earnedBadgeIds.has(b.id))
  const recentBadges   = earnedBadges.slice(-4).reverse()
  const displayBadges  = [...recentBadges, ...lockedBadges.slice(0, 4 - recentBadges.length)].slice(0, 4)

  const todayKey      = new Date().toISOString().slice(0, 10)
  const practicedToday = Array.isArray(practiceDays) && practiceDays.includes(todayKey)
  const trophyCount   = earnedBadges.length

  const currentNote      = NOTE_ORDER.find(n => !progress.masteredNotes.includes(n)) ?? 'B4'
  const currentNoteLabel = NOTES[currentNote]?.label ?? currentNote
  const currentSong      = SONGS.find(s => s.level <= displayLevel)?.title ?? 'Hot Cross Buns'

  return (
    <div className="flex flex-col" style={{ background: '#FAFAF8', minHeight: '100%' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between" style={{ padding: '14px 16px 6px' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#000180', lineHeight: 1.2 }}>Hi, Jenny!</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#000180', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
            FLUTE HERO
          </p>
        </div>
        <button
          className="relative flex items-center justify-center rounded-full bg-white active:bg-gray-100 transition-colors"
          style={{ width: 44, height: 44, minWidth: 44, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer' }}
          aria-label="Notifications"
        >
          <BellIcon />
        </button>
      </div>

      {/* Streak hero card */}
      <div style={{ margin: '8px 14px 12px', background: '#D0FFA3', borderRadius: 18, padding: '14px 16px 8px' }}>
        <div className="flex items-end justify-between">
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#000180', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              Practice Streak
            </p>
            <div className="flex items-baseline gap-2" style={{ marginTop: 2 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: '#000180', lineHeight: 1 }}>
                {currentStreak}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#000180' }}>
                {currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#000180', marginTop: 6 }}>
              {practicedToday
                ? '✓ You practiced today — nice work!'
                : currentStreak === 0
                  ? 'Pick up your flute to start! 🎵'
                  : 'Practice today to keep your streak!'}
            </p>
          </div>
          <HomeStreakCharacter streak={currentStreak} />
        </div>
      </div>

      {/* Level + trophy row */}
      <div className="flex gap-2" style={{ margin: '0 14px 10px' }}>
        <div
          className="flex-1 flex flex-col bg-white"
          style={{ borderRadius: 14, padding: '10px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <p style={{ fontSize: 10, fontWeight: 600, color: '#000180', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
            Level {displayLevel}
          </p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#000180', marginTop: 2 }}>{levelName}</p>
          <div style={{ height: 6, background: '#F1EFE8', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.round(levelPct * 100)}%`,
              background: '#006EE9',
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
          <span style={{ fontSize: 16, fontWeight: 800, color: '#000180', lineHeight: 1 }}>{trophyCount}</span>
          <span style={{ fontSize: 10, fontWeight: 500, color: '#666666' }}>trophies</span>
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{ margin: '0 14px 12px' }}>
        <button
          onClick={() => navigate('/practice')}
          className="w-full flex items-center gap-3 rounded-2xl active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(to right, #006EE9, #0056C7)',
            boxShadow: '0 4px 16px rgba(0,110,233,0.35)',
            padding: 14,
            minHeight: 44,
            border: 'none',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.18)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div style={{ fontSize: 13, fontWeight: 700 }}>Continue practicing</div>
            <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.9 }}>
              {`Next: ${currentNoteLabel} — ${currentSong}`}
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>

      {/* Premium upsell — free users only */}
      {!progress.isPremium && (
        <div style={{ margin: '0 14px 12px' }}>
          <button
            onClick={() => navigate('/unlock')}
            className="w-full flex items-center gap-3 active:scale-95 transition-transform"
            style={{
              borderRadius: 14,
              padding: 12,
              minHeight: 44,
              border: '1.5px solid #F5A623',
              background: '#FDF7EF',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 24, lineHeight: 1 }}>🔓</span>
            <div className="flex-1" style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#000180' }}>
                Unlock the full course
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#8A6D3B' }}>
                Level 1 is free — open Levels 2–8 with Premium
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>
      )}

      {/* Quick-launch row */}
      <div className="flex gap-2" style={{ margin: '0 14px 12px' }}>
        <button
          onClick={() => navigate('/songs')}
          className="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
          style={{
            borderRadius: 14, padding: '12px 8px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #83E7FF, #00C5E5)',
            boxShadow: '0 2px 8px rgba(131,231,255,0.4)',
          }}
        >
          <span style={{ fontSize: 22 }}>🎵</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#000180' }}>Songs</span>
        </button>

        <button
          onClick={() => navigate('/echo-game')}
          className="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
          style={{
            borderRadius: 14, padding: '12px 8px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #E7A0FE, #A855F7)',
            boxShadow: '0 2px 8px rgba(168,85,247,0.35)',
          }}
        >
          <span style={{ fontSize: 22 }}>🎮</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>Games</span>
        </button>

        <button
          onClick={() => navigate('/lesson')}
          className="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
          style={{
            borderRadius: 14, padding: '12px 8px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #D0FFA3, #8BE062)',
            boxShadow: '0 2px 8px rgba(139,224,98,0.4)',
          }}
        >
          <span style={{ fontSize: 22 }}>📖</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#000180' }}>Learn</span>
        </button>
      </div>

      {/* Trophies section */}
      <div style={{ margin: '0 14px 10px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#000180', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
            My Trophies
          </p>
          <Link
            to="/trophies"
            className="inline-flex items-center rounded-lg transition-colors hover:bg-blue-50 active:bg-blue-100"
            style={{ fontSize: 12, fontWeight: 600, color: '#006EE9', padding: '8px 12px', minHeight: 44 }}
          >
            See all
          </Link>
        </div>

        {earnedBadges.length === 0 ? (
          /* Empty state — show the first earnable badge as a goal */
          <div style={{
            borderRadius: 14,
            padding: '14px 16px',
            background: 'rgba(0,110,233,0.05)',
            border: '1.5px dashed rgba(0,110,233,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12, flexShrink: 0,
              background: 'rgba(208,255,163,0.6)',
              border: '2px dashed #006EE9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
            }}>
              {BADGES[0].icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#000180', lineHeight: 1.2 }}>
                Earn your first trophy!
              </p>
              <p style={{ fontSize: 11, fontWeight: 500, color: '#666666', marginTop: 3, lineHeight: 1.4 }}>
                {BADGES[0].description}
              </p>
            </div>
            <button
              onClick={() => navigate('/practice')}
              className="active:scale-95 transition-transform"
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 10,
                background: 'linear-gradient(to right, #006EE9, #0056C7)',
                boxShadow: '0 4px 12px rgba(0,110,233,0.3)',
                color: 'white',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Go! →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {displayBadges.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id)
              return (
                <div
                  key={badge.id}
                  className="flex flex-col items-center justify-center rounded-xl"
                  style={{
                    aspectRatio: '1',
                    background: isEarned ? '#D0FFA3' : 'rgba(231,160,254,0.15)',
                    border: `2px solid ${isEarned ? '#006EE9' : '#E7A0FE'}`,
                    opacity: isEarned ? 1 : 0.6,
                    fontSize: isEarned ? 24 : 16,
                    color: '#000180',
                  }}
                  aria-label={isEarned ? badge.name : 'Locked badge'}
                >
                  {isEarned ? badge.icon : '🔒'}
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
