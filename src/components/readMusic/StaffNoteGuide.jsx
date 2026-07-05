// Interactive treble-clef staff using VexFlow — used in the Read Music module.
// Notes are rendered professionally; tapped/revealed notes light up in colour.
import { useEffect, useRef } from 'react'
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow'

// ── Staff geometry ────────────────────────────────────────────────────────────
const STAVE_X      = 10
const STAVE_Y      = 0
const SPACING      = 15   // spacingBetweenLinesPx — wider than default 10 for readability
const TOTAL_HEIGHT = 175  // total SVG canvas height
const TARGET       = 56   // touch-target size (Foundations minimum 56 px)

// ── VexFlow note keys ─────────────────────────────────────────────────────────
const NOTE_KEYS = {
  E4: 'e/4', F4: 'f/4', G4: 'g/4', A4: 'a/4', B4: 'b/4',
  C5: 'c/5', D5: 'd/5', E5: 'e/5', F5: 'f/5',
}

// ── SVG namespace helper ──────────────────────────────────────────────────────
const SVG_NS = 'http://www.w3.org/2000/svg'
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag)
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  return el
}

// ── Core render ───────────────────────────────────────────────────────────────
function renderGuide({
  el,
  noteIds,
  tappedNotes,
  activeColors,
  onNoteClickRef,
  showAllLabels,
  revealNote,
}) {
  el.innerHTML = ''
  const width = Math.max(el.clientWidth || 340, 280)

  const renderer = new Renderer(el, Renderer.Backends.SVG)
  renderer.resize(width, TOTAL_HEIGHT)
  const ctx = renderer.getContext()

  const staveWidth = width - STAVE_X * 2
  const stave = new Stave(STAVE_X, STAVE_Y, staveWidth, {
    spacingBetweenLinesPx: SPACING,
  })
  stave.addClef('treble')
  stave.setContext(ctx).draw()

  const svgRoot = el.querySelector('svg')
  if (!svgRoot || noteIds.length === 0) return

  // ── Build coloured StaveNotes ──────────────────────────────────────────────
  const staveNotes = noteIds.map(id => {
    const isRevealed = revealNote === id
    const isTapped   = tappedNotes.has(id)
    const color = isRevealed
      ? '#26CCC2'
      : isTapped
        ? (activeColors[id] ?? '#26CCC2')
        : '#555555'

    const sn = new StaveNote({ keys: [NOTE_KEYS[id] || 'b/4'], duration: 'w' })
    sn.setStyle({ fillStyle: color, strokeStyle: color })
    return sn
  })

  const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false)
  voice.addTickables(staveNotes)

  // No time signature — leave 60 px for the clef only
  new Formatter().joinVoices([voice]).format([voice], staveWidth - 60)

  staveNotes.forEach(sn => sn.setStave(stave))
  voice.draw(ctx, stave)

  // ── Overlay: touch targets + letter labels ────────────────────────────────
  const labelY = stave.getYForLine(4) + SPACING + 18  // just below bottom staff line

  staveNotes.forEach((sn, i) => {
    const noteId   = noteIds[i]
    const isRevealed = revealNote === noteId
    const isTapped   = tappedNotes.has(noteId)
    const color = isRevealed
      ? '#26CCC2'
      : isTapped
        ? (activeColors[noteId] ?? '#26CCC2')
        : '#555555'

    const noteX    = sn.getAbsoluteX()
    const noteY    = sn.getYs()[0]
    const noteName = noteId.replace(/\d/, '')

    // Invisible click target centred on the note head
    if (onNoteClickRef.current) {
      const hit = svgEl('rect', {
        x: noteX - TARGET / 2,
        y: noteY - TARGET / 2,
        width: TARGET,
        height: TARGET,
        fill: 'transparent',
        cursor: 'pointer',
        'pointer-events': 'all',
        role: 'button',
        'aria-label': `Note ${noteId}`,
      })
      hit.addEventListener('click', () => onNoteClickRef.current?.(noteId))
      hit.addEventListener('touchend', (e) => {
        e.preventDefault()
        onNoteClickRef.current?.(noteId)
      })
      svgRoot.appendChild(hit)
    }

    // Letter label below the staff
    const showLabel = showAllLabels || isTapped || isRevealed
    if (showLabel) {
      const label = svgEl('text', {
        x: noteX,
        y: labelY,
        'text-anchor': 'middle',
        'font-size': '15',
        'font-weight': '700',
        fill: color,
        'font-family': 'Nunito, sans-serif',
        'pointer-events': 'none',
      })
      label.textContent = noteName
      svgRoot.appendChild(label)
    }
  })
}

// ── Component ─────────────────────────────────────────────────────────────────
// Props:
//   noteIds        string[]    — which notes to render, left → right
//   noteXs         number[]    — kept for API compatibility; ignored (VexFlow handles layout)
//   tappedNotes    Set<string> — note IDs that have been tapped (lit up)
//   activeColors   object      — { noteId: colorString } — colour when tapped
//   onNoteClick    fn          — called with noteId when a note is tapped
//   showAllLabels  bool        — show letter labels even for untapped notes
//   revealNote     string|null — show this note in green (quiz correct-answer reveal)
export default function StaffNoteGuide({
  noteIds      = [],
  noteXs       = [],   // eslint-disable-line no-unused-vars
  tappedNotes  = new Set(),
  activeColors = {},
  onNoteClick,
  showAllLabels = false,
  revealNote    = null,
}) {
  const containerRef   = useRef(null)
  const observerRef    = useRef(null)
  const onNoteClickRef = useRef(onNoteClick)

  // Keep callback ref fresh so DOM event listeners never go stale
  useEffect(() => { onNoteClickRef.current = onNoteClick }, [onNoteClick])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const draw = () => renderGuide({
      el, noteIds, tappedNotes, activeColors,
      onNoteClickRef, showAllLabels, revealNote,
    })

    draw()

    // Re-render on container width change (responsive)
    observerRef.current = new ResizeObserver(() => draw())
    observerRef.current.observe(el)

    return () => {
      observerRef.current?.disconnect()
      if (el) el.innerHTML = ''
    }
    // tappedNotes is a new Set reference on each tap in ReadMusicPage,
    // so this effect re-runs correctly to update note colours.
  }, [noteIds, tappedNotes, activeColors, showAllLabels, revealNote])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
