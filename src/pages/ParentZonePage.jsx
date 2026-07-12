import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useStreak } from '../hooks/useStreak'
import { NOTES } from '../notes'
import {
  PARENT_PRICE,
  PARENT_PRICE_LABEL,
  PREMIUM_BENEFITS,
} from '../data/freemium'
import MathGate from '../components/parent/MathGate'

/*
 * ParentZonePage — the math-gated parent surface at /parent.
 *
 * This is a PARENT-facing screen: prices are allowed here and NOWHERE on the
 * kid surfaces. The whole page sits behind MathGate (an adult gate) so a young
 * child cannot reach the pricing/terms on their own.
 *
 * Voice: calm, plain-language teacher — no hype, no fabricated numbers, no
 * invented endorsers. Every stat is derived from real localStorage state.
 * The curriculum-credibility block is a clearly flagged NEEDS_REAL_PERSON
 * placeholder until a real educator is attached.
 */

// Palette (v2.0 TEAL) — text on bright fills is always Deep Teal.
const DEEP_TEAL = '#0B3D3A'
const HINT = '#666666'
const MUTED = '#999999'
const TRACK = '#F1EFE8'
const MINT_TINT = 'rgba(106, 236, 225, 0.12)'
const SUNSHINE_TINT = 'rgba(255, 245, 126, 0.10)'

// Full 8-level curriculum (mirrors CLAUDE.md). Note ids match src/notes.js.
const CURRICULUM = [
  { level: 1, name: 'First Breath',     notes: ['B4', 'A4', 'G4'],        songs: ['Hot Cross Buns', 'Mary Had a Little Lamb'] },
  { level: 2, name: 'Finding My Voice', notes: ['C5', 'D5'],              songs: ['Ode to Joy', 'Lightly Row'] },
  { level: 3, name: 'Middle Path',      notes: ['Bb4', 'E5', 'F5', 'Fs5'], songs: ['Twinkle Twinkle', 'Greensleeves', 'Minuet in G'] },
  { level: 4, name: 'Reaching Higher',  notes: ['A5', 'B5', 'C6'],        songs: ['Scarborough Fair', 'Simple Gifts'] },
  { level: 5, name: 'Taking Flight',    notes: ['E4', 'F4', 'Fs4'],       songs: ['Low Note Ladder', 'Camptown Races'] },
  { level: 6, name: 'Sharps & Flats',   notes: ['Cs5', 'Eb5'],            songs: [] },
  { level: 7, name: 'Filling the Gaps', notes: ['Gs4', 'Gs5'],            songs: [] },
  { level: 8, name: 'Sky High',         notes: ['Cs6', 'D6'],             songs: [] },
]

function safeGet(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeGetJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) ?? fallback
  } catch {
    return fallback
  }
}

function readFirstName() {
  const v = safeGet('profile.firstName')
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

// Turn note ids into a natural label list, e.g. ["B4","A4","G4"] → "B, A and G".
function noteLabelList(ids) {
  const labels = ids.map(id => NOTES[id]?.label ?? id)
  if (labels.length === 0) return ''
  if (labels.length === 1) return labels[0]
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}

// First level with an unmastered note = what the child is working on now.
function findNextGoals(masteredNotes) {
  const mastered = new Set(masteredNotes)
  for (const lvl of CURRICULUM) {
    const remaining = lvl.notes.filter(n => !mastered.has(n))
    if (remaining.length) return { level: lvl, remaining }
  }
  return null // every note in the curriculum is mastered
}

function SectionCard({ children, tint }) {
  return (
    <div
      className="bg-white"
      style={{
        width: '100%', maxWidth: 480, marginTop: 16,
        borderRadius: 16, padding: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        background: tint || '#FFFFFF',
      }}
    >
      {children}
    </div>
  )
}

function CardTitle({ children }) {
  return (
    <h2 style={{ fontSize: 16, fontWeight: 800, color: DEEP_TEAL, margin: 0 }}>
      {children}
    </h2>
  )
}

export default function ParentZonePage() {
  const navigate = useNavigate()
  const { progress, unlockPremium } = useProgress()
  const { isPremium, masteredNotes } = progress
  const { practiceDays } = useStreak()

  const [passed, setPassed] = useState(false)
  const [weeklyEmail, setWeeklyEmail] = useState(() => safeGet('parent.weeklyEmail') === 'true')

  // ── Adult gate: nothing (including the price) renders until this passes ──
  if (!passed) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{
          minHeight: 'calc(100dvh - 7rem)', padding: '24px 16px',
          fontFamily: "'Nunito', sans-serif",
          paddingTop: 'max(24px, env(safe-area-inset-top))',
        }}
      >
        <MathGate
          onPass={() => setPassed(true)}
          title="Parent Zone"
          subtitle="This area is for grown-ups. Answer to continue."
        />
      </div>
    )
  }

  // ── Real, non-fabricated stats ──
  const firstName = readFirstName()
  const childRef = firstName || 'your child'
  const daysPractised = practiceDays.length
  const daysLabel = 'Days practised'
  const completedSongs = safeGetJSON('progress.completedSongs', [])
  const songsLearned = Array.isArray(completedSongs) ? completedSongs.length : 0
  const skillsSentence = masteredNotes.length
    ? `Can now play ${noteLabelList(masteredNotes)} in tune.`
    : null

  const nextGoals = findNextGoals(masteredNotes)

  // Latest kid recording (data URL) — the top conversion asset.
  const recordingUrl = safeGet('recording.latest')

  function toggleWeeklyEmail() {
    const next = !weeklyEmail
    setWeeklyEmail(next)
    try {
      localStorage.setItem('parent.weeklyEmail', String(next))
    } catch {
      /* private mode — pref simply won't persist */
    }
  }

  return (
    <div
      className="flex flex-col items-center"
      style={{
        minHeight: 'calc(100dvh - 7rem)',
        fontFamily: "'Nunito', sans-serif",
        padding: '12px 16px 32px',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Header */}
      <div style={{ width: '100%', maxWidth: 480, textAlign: 'center', marginTop: 8 }}>
        <p style={{
          fontSize: 12, fontWeight: 700, color: '#1AA89F',
          textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0,
        }}>
          Parent Zone
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: DEEP_TEAL, marginTop: 4 }}>
          How {childRef} is getting on
        </h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: HINT, marginTop: 6, lineHeight: 1.5 }}>
          A quiet snapshot from me — your child's flute tutor. No jargon, just where
          things stand and what's coming up.
        </p>
      </div>

      {/* 1 ── Progress hero */}
      <SectionCard tint={SUNSHINE_TINT}>
        <CardTitle>This week's progress</CardTitle>
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: DEEP_TEAL }}>{daysPractised}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: HINT, marginTop: 2 }}>{daysLabel}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: DEEP_TEAL }}>{songsLearned}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: HINT, marginTop: 2 }}>Songs learned</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: DEEP_TEAL }}>{masteredNotes.length}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: HINT, marginTop: 2 }}>Notes mastered</div>
          </div>
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: DEEP_TEAL, marginTop: 16, lineHeight: 1.5 }}>
          {skillsSentence
            ? skillsSentence
            : `${childRef} is just getting started — the first notes are on the way. Every child begins here, so there's nothing to worry about.`}
        </p>
      </SectionCard>

      {/* 2 ── Latest recording (top conversion asset) */}
      <SectionCard tint={MINT_TINT}>
        <CardTitle>Hear {childRef} play</CardTitle>
        {recordingUrl ? (
          <>
            <p style={{ fontSize: 13, fontWeight: 600, color: HINT, marginTop: 6 }}>
              Your child's latest performance
            </p>
            <audio
              controls
              src={recordingUrl}
              style={{ width: '100%', marginTop: 12 }}
            >
              Your browser can't play this recording.
            </audio>
          </>
        ) : (
          <p style={{ fontSize: 14, fontWeight: 500, color: HINT, marginTop: 8, lineHeight: 1.5 }}>
            No recording yet — after a song, your child can tap
            <strong style={{ color: DEEP_TEAL }}> "Play for a grown-up"</strong> and their
            performance will appear right here for you to hear.
          </p>
        )}
      </SectionCard>

      {/* 3 ── What's next */}
      <SectionCard>
        <CardTitle>What's next</CardTitle>
        {nextGoals ? (
          <>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1AA89F', marginTop: 8 }}>
              Level {nextGoals.level.level} · {nextGoals.level.name}
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: DEEP_TEAL, marginTop: 8, lineHeight: 1.5 }}>
              This week we're working on {noteLabelList(nextGoals.remaining)}.
            </p>
            {nextGoals.level.songs.length > 0 && (
              <p style={{ fontSize: 14, fontWeight: 500, color: HINT, marginTop: 6, lineHeight: 1.5 }}>
                A great song to aim for: <strong style={{ color: DEEP_TEAL }}>{nextGoals.level.songs[0]}</strong>.
              </p>
            )}
          </>
        ) : (
          <p style={{ fontSize: 14, fontWeight: 500, color: HINT, marginTop: 8, lineHeight: 1.5 }}>
            {childRef} has worked all the way through every note in the course — a real
            achievement. Now it's all about polishing tone and playing for joy.
          </p>
        )}
      </SectionCard>

      {/* 4 ── Curriculum credibility (placeholder — no invented educator) */}
      <SectionCard>
        <CardTitle>About the course</CardTitle>
        <p style={{ fontSize: 14, fontWeight: 500, color: HINT, marginTop: 8, lineHeight: 1.5 }}>
          Trill follows a steady, beginner-friendly path from a first note to eight
          levels of real repertoire.
        </p>
        <p style={{
          fontSize: 13, fontWeight: 700, color: MUTED, marginTop: 10,
          padding: '10px 12px', borderRadius: 12, background: TRACK, lineHeight: 1.5,
        }}>
          NEEDS_REAL_PERSON — curriculum author / reviewing flute educator credit
          goes here (name, qualification, one honest line). Do not publish invented
          credentials.
        </p>
      </SectionCard>

      {/* 5 ── Pricing (parent-only) OR full-access state */}
      {isPremium ? (
        <SectionCard>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 40, lineHeight: 1 }} aria-hidden="true">🎉</span>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: DEEP_TEAL, marginTop: 8 }}>
              Full access unlocked ✓
            </h2>
            <p style={{ fontSize: 14, fontWeight: 500, color: HINT, marginTop: 6, lineHeight: 1.5 }}>
              All 8 levels are open for {childRef}. There's nothing more to buy — no
              subscription, no auto-renew. Enjoy the whole course.
            </p>
          </div>
        </SectionCard>
      ) : (
        <SectionCard>
          <CardTitle>Unlock the whole course</CardTitle>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: DEEP_TEAL }}>{PARENT_PRICE}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: HINT }}>{PARENT_PRICE_LABEL}</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
            {PREMIUM_BENEFITS.map(({ icon, text }) => (
              <li key={text} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                fontSize: 14, fontWeight: 600, color: DEEP_TEAL, padding: '6px 0',
              }}>
                <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden="true">{icon}</span>
                {text}
              </li>
            ))}
          </ul>

          <p style={{
            fontSize: 13, fontWeight: 500, color: HINT, marginTop: 14,
            padding: '12px', borderRadius: 12, background: TRACK, lineHeight: 1.6,
          }}>
            Two free songs at every level — just add your email. One payment
            unlocks every song for good. No subscription, no auto-renew.
          </p>

          <button
            onClick={() => navigate('/unlock')}
            className="active:scale-95 transition-transform"
            style={{
              width: '100%', marginTop: 16, padding: '14px 24px', borderRadius: 999,
              border: 'none', background: 'linear-gradient(to right, #26CCC2, #1AA89F)',
              boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
              color: DEEP_TEAL, fontSize: 16, fontWeight: 800, cursor: 'pointer',
              minHeight: 44, fontFamily: "'Nunito', sans-serif",
            }}
          >
            Continue to unlock
          </button>

          {/* Plain-language FAQ */}
          <div style={{ marginTop: 18 }}>
            {[
              {
                q: 'Does my child need a real flute?',
                a: 'Yes. Trill listens through the microphone as your child plays a real flute — it is a tutor, not a toy instrument.',
              },
              {
                q: 'Can I get a refund?',
                a: 'Refunds are handled by the payment provider used at checkout. NEEDS_REAL_PERSON — confirm the exact refund window and steps before launch.',
              },
              {
                q: 'Which devices work?',
                a: 'Any iPad, iPhone, or computer with a web browser and a microphone.',
              },
              {
                q: 'Are there ads or chat?',
                a: 'No ads, ever. No chat, no messaging, and nothing for your child to post or share.',
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ padding: '10px 0', borderTop: `1px solid ${TRACK}` }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: DEEP_TEAL, margin: 0 }}>{q}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: HINT, marginTop: 4, lineHeight: 1.5 }}>{a}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* 6 ── Weekly email opt-in (client-side pref only, no backend) */}
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <CardTitle>Weekly progress email</CardTitle>
            <p style={{ fontSize: 13, fontWeight: 500, color: HINT, marginTop: 4, lineHeight: 1.5 }}>
              A short weekly note on how {childRef} is doing.
            </p>
          </div>
          <button
            onClick={toggleWeeklyEmail}
            role="switch"
            aria-checked={weeklyEmail}
            aria-label="Weekly progress email"
            className="active:scale-95 transition-transform"
            style={{
              flexShrink: 0, width: 60, height: 34, borderRadius: 999, border: 'none',
              cursor: 'pointer', position: 'relative',
              background: weeklyEmail ? 'linear-gradient(to right, #26CCC2, #1AA89F)' : '#D3D1C7',
              transition: 'background 0.2s',
            }}
          >
            <span
              style={{
                position: 'absolute', top: 3, left: weeklyEmail ? 29 : 3,
                width: 28, height: 28, borderRadius: 999, background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s',
              }}
            />
          </button>
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: MUTED, marginTop: 12, lineHeight: 1.5 }}>
          This is just a saved preference on this device. Trill has no accounts or
          server, so no email is sent yet — this switch simply remembers your choice
          for when device-side summaries are added later.
        </p>
      </SectionCard>
    </div>
  )
}
