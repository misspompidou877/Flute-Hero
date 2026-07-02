import { useState } from 'react'
import { FingeringDiagramForNote } from '../components/FingeringDiagrams'
import { NOTES, NOTES_BY_LEVEL, ALTERNATE_FINGERINGS } from '../notes'
import { useProgress } from '../context/ProgressContext'
import { playTone, NOTE_FREQUENCIES } from '../utils/playTone'

// ── Display labels only — no logic ───────────────────────────────────────────
const LEVEL_NAMES = {
  1: 'First Breath',
  2: 'New Steps',
  3: 'Finding Flow',
  4: 'Upper Octave',
  5: 'Full Range',
  6: 'Sharps & Flats',
  7: 'Filling the Gaps',
  8: 'Sky High',
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function FingeringLibraryPage() {
  // ── All logic unchanged ───────────────────────────────────────────────────
  const { progress: { currentLevel, masteredNotes } } = useProgress()
  const [activeNoteId, setActiveNoteId] = useState('B4')
  const [showChart,    setShowChart]    = useState(false)

  function handleHearNote() {
    const freq = NOTE_FREQUENCIES?.[activeNoteId]
    if (freq) playTone(freq, 0.8)
  }

  const masteredCount  = masteredNotes.length
  const activeNote     = NOTES[activeNoteId]
  const canShowDiagram = activeNoteId && activeNote && currentLevel >= activeNote.level

  return (
    /*
     * Scrollable page layout — avoids clipping expanded sections.
     * Sticky header stays visible; columns flow to their natural height.
     * paddingBottom leaves room for the fixed bottom nav.
     */
    <div style={{ background: '#FAF4EE', minHeight: 'calc(100dvh - 5rem)', paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}>

      {/* ── Sticky header ────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid #EEEEEE',
          background: '#FAF4EE',
        }}
      >
        <h1
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            color: '#2D2D2D',
            margin: 0,
          }}
        >
          Fingering Library
        </h1>
        {masteredCount > 0 && (
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: '#4CAF50' }}>
            ⭐ {masteredCount} mastered
          </span>
        )}
      </div>

      {/* ── Two-column body ──────────────────────────────────────────────── */}
      <div
        className="flex-col sm:flex-row"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: 12,
        }}
      >

        {/* ═══════════════════════════════════════════════════════════════════
            LEFT COLUMN — note selector + chart reference (40% on tablet)
        ════════════════════════════════════════════════════════════════════ */}
        <div
          className="w-full sm:w-[40%] sm:flex-shrink-0"
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >

          {/* Level groups with note pills */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map(level => {
            const noteIds       = NOTES_BY_LEVEL[level]
            const levelUnlocked = level <= currentLevel

            return (
              <div key={level}>
                {/* Level label + underline */}
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {!levelUnlocked && <LockIcon />}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.09em',
                        textTransform: 'uppercase',
                        color: levelUnlocked ? '#999999' : '#CCCCCC',
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      Lv {level} — {LEVEL_NAMES[level]}
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      height: 2,
                      width: levelUnlocked ? 48 : 28,
                      background: levelUnlocked ? '#F5A623' : '#E0E0E0',
                      borderRadius: 1,
                    }}
                  />
                </div>

                {/* Note pills — wrapping on tablet, horizontal scroll on mobile */}
                <div
                  className="flex-wrap sm:flex-wrap overflow-x-auto sm:overflow-x-visible pb-1 sm:pb-0"
                  style={{ display: 'flex', gap: 6 }}
                >
                  {noteIds.map(noteId => {
                    const note     = NOTES[noteId]
                    const mastered = masteredNotes.includes(noteId)
                    const isActive = activeNoteId === noteId
                    const locked   = !levelUnlocked

                    let bg     = 'white'
                    let border = '1.5px solid #E0E0E0'
                    let color  = '#2D2D2D'
                    let cursor = 'pointer'
                    let shadow = 'none'

                    if (locked) {
                      bg = '#F7F7F7'; border = '1.5px solid #E8E8E8'
                      color = '#CCCCCC'; cursor = 'not-allowed'
                    } else if (isActive) {
                      bg = '#F5A623'; border = '1.5px solid #F5A623'; color = 'white'
                    } else if (mastered) {
                      bg = '#E8F5E9'; border = '1.5px solid #4CAF50'; color = '#2E7D32'
                      shadow = '0 0 8px rgba(76,175,80,0.2)'
                    }

                    return (
                      <button
                        key={noteId}
                        type="button"
                        disabled={locked}
                        onClick={() => setActiveNoteId(noteId)}
                        className="transition-all active:scale-95"
                        style={{
                          borderRadius: 999,
                          padding: '6px 16px',
                          minHeight: 44,
                          fontSize: 14,
                          fontWeight: 600,
                          fontFamily: "'Nunito', sans-serif",
                          border,
                          background: bg,
                          color,
                          cursor,
                          boxShadow: shadow,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          flexShrink: 0,
                        }}
                      >
                        {locked && <LockIcon />}
                        {mastered && !locked && !isActive && (
                          <span style={{ fontSize: 11 }}>⭐</span>
                        )}
                        {note?.label ?? noteId}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* ── "How to read" — collapsible chart reference ─────────────── */}
          <div
            style={{
              borderRadius: 12,
              background: 'white',
              border: '1px solid #EEEEEE',
              overflow: 'hidden',
              marginTop: 4,
            }}
          >
            {/* Toggle — 44px touch target */}
            <button
              type="button"
              onClick={() => setShowChart(s => !s)}
              aria-expanded={showChart}
              style={{
                width: '100%',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: '#555555',
                textAlign: 'left',
              }}
            >
              <span>📖 How to read diagrams</span>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#AAAAAA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{
                  flexShrink: 0,
                  transition: 'transform 250ms ease',
                  transform: showChart ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>

            {/* Chart image + colour key — collapses to zero height when closed */}
            <div
              style={{
                overflow: 'hidden',
                maxHeight: showChart ? 600 : 0,
                transition: 'max-height 300ms ease',
              }}
            >
              <div style={{ padding: '0 14px 14px' }}>
                <img
                  src="/images/correct-fingering-chart.png"
                  alt="Flute fingering chart: filled circle means press the key, open circle means leave it open. Diagram reads left-to-right from the embouchure hole to the foot joint."
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', borderRadius: 8, display: 'block' }}
                />

                {/* Colour key */}
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    { bg: '#EFF6FF', dot: '#2563eb', textColor: '#1d4ed8', label: 'Left hand' },
                    { bg: '#F0FBF0', dot: '#16a34a', textColor: '#15803d', label: 'Right hand' },
                    { bg: '#dbeeff', dot: '#37A0FE', textColor: '#37A0FE', label: 'Thumb (T / ♭)' },
                  ].map(({ bg, dot, textColor, label }) => (
                    <span
                      key={label}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: bg, borderRadius: 999, padding: '3px 10px',
                        fontSize: 11, fontWeight: 700, color: textColor,
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0 }} />
                      {label}
                    </span>
                  ))}
                </div>

                <p style={{
                  marginTop: 8, marginBottom: 0,
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 12, color: '#888888', lineHeight: 1.5,
                }}>
                  Filled = press down · Open = leave open
                </p>
              </div>
            </div>
          </div>
          {/* ── end left column ─────────────────────────────────────────── */}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            RIGHT COLUMN — fingering diagram (60% on tablet, full on mobile)
        ════════════════════════════════════════════════════════════════════ */}
        <div
          className="flex-1"
          style={{ minWidth: 0 }}
        >
          {canShowDiagram ? (
            <>
              <FingeringDiagramForNote noteId={activeNoteId} />

              {ALTERNATE_FINGERINGS[activeNoteId] && (
                <div style={{ marginTop: 12 }}>
                  <FingeringDiagramForNote noteId={ALTERNATE_FINGERINGS[activeNoteId]} />
                </div>
              )}

              {masteredNotes.includes(activeNoteId) && (
                <div
                  style={{
                    marginTop: 12,
                    borderRadius: 12,
                    padding: '10px 16px',
                    background: '#F0FBF0',
                    border: '1.5px solid #4CAF50',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#2E7D32',
                  }}
                >
                  ✓ You've mastered this note!
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                height: '100%',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#AAAAAA',
                fontFamily: "'Nunito', sans-serif",
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 36 }}>👈</span>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                Select a note to see its fingering
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default FingeringLibraryPage
