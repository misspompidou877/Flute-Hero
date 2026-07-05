import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SONGS } from '../data/songs'
import { NOTES, NOTES_BY_LEVEL } from '../notes'
import { useProgress } from '../context/ProgressContext'
import PaywallCard from '../components/paywall/PaywallCard'
import { FREE_MAX_LEVEL, PAYWALL } from '../data/freemium'
import Landmark, { Gem, LANDMARK_NAMES } from '../components/SkyMap/Landmark'

/*
 * Songs — "Songkeeper's Sky" (redesign brief §2).
 * A vertical, scrollable sky map: each curriculum level is a landmark section.
 * Song data, gating (isPremium / PaywallCard), and Practice navigation are all
 * unchanged — this is a teal (STYLE_GUIDE v2.0) re-skin plus a mastery-driven
 * note-gem read of existing state.
 */

// v2.0 TEAL palette
const DEEP_TEAL = '#0B3D3A'
const TEAL_GRAD = 'linear-gradient(to right, #26CCC2, #1AA89F)'
const HINT = '#666666'
const MUTED = '#999999'

const LEVEL_INFO = {
  1: { curriculum: 'First Breath',     notes: 'B · A · G' },
  2: { curriculum: 'Finding My Voice', notes: '…+ C · D' },
  3: { curriculum: 'Middle Path',      notes: '…+ B♭ · E · F · F♯' },
  4: { curriculum: 'Reaching Higher',  notes: '…+ G5 · A5 · B♭5 · B5 · C6' },
  5: { curriculum: 'Taking Flight',    notes: '…+ low E · F · F♯' },
  6: { curriculum: 'Sharps & Flats',   notes: '…+ C♯ · E♭' },
  7: { curriculum: 'Filling the Gaps', notes: '…+ G♯ / A♭' },
  8: { curriculum: 'Sky High',         notes: '…+ high C♯ · D' },
}

// Map a VexFlow key ('f#/5', 'bb/4', 'c/5') to a note id ('Fs5', 'Bb4', 'C5')
// so a song's mastery can be read from progress.masteredNotes.
function keyToNoteId(key) {
  const [pitch, oct] = key.split('/')
  let p = pitch.toUpperCase()
  if (p.endsWith('#')) p = p[0] + 's'                 // F# -> Fs, C# -> Cs
  else if (p.length === 2 && p.endsWith('B')) p = p[0] + 'b' // BB -> Bb, EB -> Eb
  return `${p}${oct}`
}

// Unique note ids used by a song (memo-friendly, pure).
function songNoteIds(song) {
  const set = new Set()
  for (const n of song.notes) set.add(keyToNoteId(n.key))
  return [...set]
}

function LockIcon({ color = MUTED }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={DEEP_TEAL}>
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DEEP_TEAL}
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
      <polyline points="9,18 15,12 9,6" />
    </svg>
  )
}

// A row of note-gems for a level, lit from existing masteredNotes state.
function LevelGems({ noteIds, masteredSet }) {
  if (!noteIds || noteIds.length === 0) return null
  return (
    <div className="flex items-center" style={{ gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
      {noteIds.map(id => {
        const earned = masteredSet.has(id)
        return <Gem key={id} earned={earned} title={`${NOTES[id]?.label ?? id} ${earned ? 'mastered' : 'not yet'}`} />
      })}
    </div>
  )
}

export default function SongsPage() {
  const navigate = useNavigate()
  const { progress: { currentLevel, isPremium, masteredNotes } } = useProgress()

  // Cap display level at 8; treat 99 (premium override) as all unlocked.
  const unlockedUpTo = Math.min(currentLevel, 8)

  // Accordion: one landmark open at a time. Defaults to the first unlocked level.
  const [openLevel, setOpenLevel] = useState(() => Math.min(unlockedUpTo, 1) || 1)

  const songsByLevel = useMemo(() => {
    const map = {}
    for (let i = 1; i <= 8; i++) map[i] = SONGS.filter(s => s.level === i)
    return map
  }, [])

  const masteredSet = useMemo(() => new Set(masteredNotes), [masteredNotes])

  return (
    <div className="flex flex-col" style={{ minHeight: '100%' }}>

      {/* Page header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#26CCC2', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          Songkeeper&rsquo;s Sky
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: DEEP_TEAL, marginTop: 2 }}>
          Follow the Sky Map
        </h1>
        <p style={{ fontSize: 13, fontWeight: 500, color: HINT, marginTop: 2, lineHeight: 1.4 }}>
          Each landmark holds Piper&rsquo;s lost songs. Tap one, then hit Practice to bring a melody home.
        </p>
      </div>

      {/* Vertical sky map — one landmark section per level */}
      <div className="flex flex-col" style={{ gap: 12 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(lvl => {
          const info = LEVEL_INFO[lvl]
          const landmark = LANDMARK_NAMES[lvl]
          const songs = songsByLevel[lvl] ?? []
          const levelNotes = NOTES_BY_LEVEL[lvl] ?? []
          const locked = lvl > unlockedUpTo
          const open = openLevel === lvl

          return (
            <section
              key={lvl}
              className="bg-white"
              style={{
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: open ? '1.5px solid #26CCC2' : '1.5px solid transparent',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
              }}
            >
              {/* Landmark header — tappable accordion toggle */}
              <button
                onClick={() => setOpenLevel(prev => (prev === lvl ? null : lvl))}
                className="flex items-center gap-3 active:scale-[0.99] transition-transform"
                style={{
                  width: '100%',
                  minHeight: 64,
                  padding: '12px 14px',
                  background: open ? 'rgba(106,236,225,0.12)' : '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                }}
                aria-expanded={open}
                aria-label={`Level ${lvl}, ${landmark}${locked ? ', locked' : ''}`}
              >
                <Landmark level={lvl} size={44} muted={locked} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center" style={{ gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: DEEP_TEAL,
                      background: 'rgba(106,236,225,0.20)',
                      borderRadius: 6, padding: '1px 6px', lineHeight: 1.4,
                    }}>
                      L{lvl}
                    </span>
                    {locked && <LockIcon color={MUTED} />}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: DEEP_TEAL, marginTop: 3, lineHeight: 1.15 }}>
                    {landmark}
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: HINT, marginTop: 1, lineHeight: 1.2 }}>
                    {info.curriculum} · {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                  </p>
                  <LevelGems noteIds={levelNotes} masteredSet={masteredSet} />
                </div>

                <div className="flex flex-col items-end flex-shrink-0" style={{ gap: 6 }}>
                  {!isPremium && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.3px', textTransform: 'uppercase',
                      padding: '2px 7px', borderRadius: 999, lineHeight: 1.4, color: DEEP_TEAL,
                      background: lvl <= FREE_MAX_LEVEL ? 'rgba(106,236,225,0.25)' : 'rgba(255,183,108,0.28)',
                    }}>
                      {lvl <= FREE_MAX_LEVEL ? PAYWALL.freeTag : PAYWALL.proTag}
                    </span>
                  )}
                  <ChevronIcon open={open} />
                </div>
              </button>

              {/* Expanded body */}
              {open && (
                <div style={{ padding: '4px 14px 16px' }}>
                  {/* Notes sub-line */}
                  <p style={{ fontSize: 11, fontWeight: 600, color: HINT, marginBottom: 12 }}>
                    New notes: {info.notes}
                  </p>

                  {locked && !isPremium ? (
                    <PaywallCard
                      levelName={`Level ${lvl} — ${info.curriculum}`}
                      onUnlock={() => navigate('/unlock')}
                    />
                  ) : locked ? (
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{ borderRadius: 16, padding: 28, background: 'rgba(241,239,232,0.6)', textAlign: 'center' }}
                    >
                      <Landmark level={lvl} size={52} muted />
                      <p style={{ fontSize: 15, fontWeight: 800, color: DEEP_TEAL, marginTop: 12 }}>
                        {landmark} is still in the clouds
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: HINT, marginTop: 6, lineHeight: 1.5 }}>
                        Keep mastering your current notes to reach this landmark.
                      </p>
                      <button
                        onClick={() => navigate('/practice')}
                        className="active:scale-95 transition-transform"
                        style={{
                          marginTop: 16, minHeight: 44, padding: '10px 24px', borderRadius: 999, border: 'none',
                          background: TEAL_GRAD, boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
                          color: DEEP_TEAL, fontSize: 13, fontWeight: 800, cursor: 'pointer',
                        }}
                      >
                        Go to Practice →
                      </button>
                    </div>
                  ) : songs.length === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center"
                      style={{ borderRadius: 16, padding: 28, background: 'rgba(255,245,126,0.10)', textAlign: 'center' }}
                    >
                      <Landmark level={lvl} size={52} />
                      <p style={{ fontSize: 15, fontWeight: 800, color: DEEP_TEAL, marginTop: 12 }}>
                        New notes, songs on the way
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: HINT, marginTop: 6, lineHeight: 1.5 }}>
                        Practise these notes in the Fingering Library while we add songs for this landmark.
                      </p>
                      <button
                        onClick={() => navigate('/fingering')}
                        className="active:scale-95 transition-transform"
                        style={{
                          marginTop: 16, minHeight: 44, padding: '10px 24px', borderRadius: 999, border: 'none',
                          background: TEAL_GRAD, boxShadow: '0 4px 16px rgba(38,204,194,0.35)',
                          color: DEEP_TEAL, fontSize: 13, fontWeight: 800, cursor: 'pointer',
                        }}
                      >
                        Open Fingering Library →
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col" style={{ gap: 10 }}>
                      {songs.map((song, i) => {
                        const ids = songNoteIds(song)
                        const recovered = ids.length > 0 && ids.every(id => masteredSet.has(id))
                        return (
                          <div
                            key={song.id}
                            className="flex items-center gap-3"
                            style={{
                              borderRadius: 14,
                              padding: '12px 14px',
                              background: recovered ? 'rgba(255,245,126,0.14)' : '#FAFAF8',
                              border: recovered ? '1.5px solid rgba(255,245,126,0.9)' : '1.5px solid #F1EFE8',
                            }}
                          >
                            {/* Song gem — Sunshine when every note is mastered */}
                            <div className="flex items-center justify-center flex-shrink-0" style={{ width: 34 }}>
                              <Gem
                                earned={recovered}
                                size={26}
                                title={recovered ? `${song.title} recovered` : `${song.title} not yet recovered`}
                              />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <p style={{
                                fontSize: 14, fontWeight: 700, color: DEEP_TEAL, lineHeight: 1.2,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              }}>
                                {song.title}
                              </p>
                              {song.description && (
                                <p style={{
                                  fontSize: 11, fontWeight: 500, color: HINT, marginTop: 2, lineHeight: 1.3,
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                  {song.description}
                                </p>
                              )}
                              {song.beatsPerMeasure === 3 && (
                                <span style={{
                                  display: 'inline-block', marginTop: 4, fontSize: 9, fontWeight: 800,
                                  color: DEEP_TEAL, background: 'rgba(106,236,225,0.20)',
                                  borderRadius: 4, padding: '2px 6px', letterSpacing: '0.3px', textTransform: 'uppercase',
                                }}>
                                  3/4 waltz
                                </span>
                              )}
                            </div>

                            {/* Practice button */}
                            <button
                              onClick={() => navigate(`/practice?song=${song.id}`)}
                              className="flex items-center justify-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform"
                              style={{
                                minWidth: 44, minHeight: 44, padding: '0 14px', borderRadius: 12, border: 'none',
                                background: TEAL_GRAD, color: DEEP_TEAL, fontSize: 12, fontWeight: 800, cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(38,204,194,0.30)',
                              }}
                              aria-label={`Practice ${song.title}`}
                            >
                              <PlayIcon />
                              Practice
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>
          )
        })}
      </div>

    </div>
  )
}
