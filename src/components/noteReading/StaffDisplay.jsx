import { useEffect, useRef } from 'react'
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow'

// ── Staff geometry ──────────────────────────────────────────────────────────
const STAVE_X = 10
const STAVE_Y = 0
const SPACING = 15          // spacingBetweenLinesPx — bigger than default 10 for readability
// With STAVE_Y=0, spacing=15: getYForLine(0)=60, getYForLine(4)=120
const LABEL_Y = 155         // y position of letter labels below the staff
const TOTAL_HEIGHT = 170    // total SVG height

// ── Canonical note colours (from STYLE_GUIDE.md — Note Badge Circles) ──────
const NOTE_COLORS = {
  G4: '#26A69A',  // teal
  A4: '#AB47BC',  // purple
  B4: '#EF5350',  // red
  C5: '#42A5F5',  // blue
  D5: '#A855F7',
}

// ── VexFlow note keys ───────────────────────────────────────────────────────
const NOTE_KEYS = {
  G4: 'g/4',
  A4: 'a/4',
  B4: 'b/4',
  C5: 'c/5',
  D5: 'd/5',
}

// ── Music line → VexFlow line mapping (music: 1=bottom, 5=top; vf: 0=top, 4=bottom)
const MUSIC_LINES = [
  { musicNum: 5, vfLine: 0 },
  { musicNum: 4, vfLine: 1 },
  { musicNum: 3, vfLine: 2 },
  { musicNum: 2, vfLine: 3 },
  { musicNum: 1, vfLine: 4 },
]

// ── Music space → VexFlow fractional line mapping ───────────────────────────
const MUSIC_SPACES = [
  { musicNum: 4, vfLine: 0.5 },
  { musicNum: 3, vfLine: 1.5 },
  { musicNum: 2, vfLine: 2.5 },
  { musicNum: 1, vfLine: 3.5 },
]

// ── SVG namespace helper ────────────────────────────────────────────────────
const SVG_NS = 'http://www.w3.org/2000/svg'

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag)
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  return el
}

// ── Core render function ────────────────────────────────────────────────────
function renderStaff({
  el,
  mode,
  notes,
  singleNote,
  highlightedLines,
  highlightedSpaces,
  onNoteClickRef,
  onLineClickRef,
  onSpaceClickRef,
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
  if (mode !== 'single') stave.addTimeSignature('4/4')
  stave.setContext(ctx).draw()

  const svgRoot = el.querySelector('svg')
  if (!svgRoot) return

  // ── basic mode: staff only, no notes ────────────────────────────────────
  if (mode === 'basic') return

  // ── interactive mode: highlight bands + single proximity overlay ─────────
  // Individual per-element hit rects can't be used here because lines and
  // spaces are only SPACING/2 = 7.5 px apart — any useful hit-target height
  // causes rects to overlap, and SVG paint order means the topmost rect
  // silently swallows clicks meant for elements beneath it.
  //
  // Fix: draw highlight bands as before, then place ONE transparent overlay
  // over the full staff area and use proximity (nearest y-position) to
  // decide which line or space was clicked.
  if (mode === 'interactive') {
    const noteStartX = stave.getNoteStartX()
    const endX = stave.getX() + stave.getWidth()
    const bandW = endX - noteStartX
    const halfGap = SPACING / 2   // used only for highlight band height

    // Pre-compute all y positions for hit-testing
    const allPositions = [
      ...MUSIC_LINES.map(({ musicNum, vfLine }) => ({
        type: 'line', musicNum, y: stave.getYForLine(vfLine),
      })),
      ...MUSIC_SPACES.map(({ musicNum, vfLine }) => ({
        type: 'space', musicNum, y: stave.getYForLine(vfLine),
      })),
    ]

    // Draw highlight bands for already-tapped elements (visual feedback only)
    allPositions.forEach(({ type, musicNum, y }) => {
      const tapped = type === 'line'
        ? (highlightedLines instanceof Set && highlightedLines.has(musicNum))
        : (highlightedSpaces instanceof Set && highlightedSpaces.has(musicNum))
      if (!tapped) return
      svgRoot.appendChild(svgEl('rect', {
        x: noteStartX, y: y - halfGap,
        width: bandW, height: halfGap * 2,
        fill: type === 'line' ? 'rgba(79,195,247,0.25)' : 'rgba(131,231,255,0.25)',
        'pointer-events': 'none',
      }))
    })

    // Single overlay over the full staff — handles all clicks
    const topY = stave.getYForLine(0) - halfGap
    const botY = stave.getYForLine(4) + halfGap
    const overlay = svgEl('rect', {
      x: noteStartX, y: topY,
      width: bandW, height: botY - topY,
      fill: 'transparent',
      cursor: 'pointer',
      'pointer-events': 'all',
      role: 'group',
      'aria-label': 'Interactive staff — tap a line or space',
    })

    const dispatchClick = (clientY) => {
      // Map clientY → SVG-coordinate y, accounting for any CSS scaling
      const svgRect = svgRoot.getBoundingClientRect()
      const svgH = parseFloat(svgRoot.getAttribute('height')) || svgRect.height
      const scale = svgRect.height > 0 ? svgH / svgRect.height : 1
      const clickY = (clientY - svgRect.top) * scale

      // Find the nearest line or space
      let nearest = allPositions[0]
      let minDist = Infinity
      allPositions.forEach((pos) => {
        const d = Math.abs(pos.y - clickY)
        if (d < minDist) { minDist = d; nearest = pos }
      })

      if (nearest.type === 'line') onLineClickRef.current?.(nearest.musicNum)
      else onSpaceClickRef.current?.(nearest.musicNum)
    }

    overlay.addEventListener('click', (e) => dispatchClick(e.clientY))
    // touchend so the 300 ms click delay doesn't affect iPad feel
    overlay.addEventListener('touchend', (e) => {
      e.preventDefault()
      dispatchClick(e.changedTouches[0].clientY)
    })

    svgRoot.appendChild(overlay)
    return
  }

  // ── notes mode: 5 coloured whole notes + click targets + labels ──────────
  if (mode === 'notes' && Array.isArray(notes) && notes.length > 0) {
    const staveNotes = notes.map(({ id }) => {
      const color = NOTE_COLORS[id] || '#2D2D2D'
      const sn = new StaveNote({ keys: [NOTE_KEYS[id] || 'b/4'], duration: 'w' })
      sn.setStyle({ fillStyle: color, strokeStyle: color })
      return sn
    })

    const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false)
    voice.addTickables(staveNotes)

    const overhead = 80  // clef + timesig space
    new Formatter().joinVoices([voice]).format([voice], staveWidth - overhead)

    staveNotes.forEach(sn => sn.setStave(stave))
    voice.draw(ctx, stave)

    // Overlay: click targets and letter labels
    staveNotes.forEach((sn, i) => {
      const noteId = notes[i].id
      const color = NOTE_COLORS[noteId] || '#2D2D2D'
      const noteX = sn.getAbsoluteX()
      const noteY = sn.getYs()[0]
      const noteName = noteId.replace(/\d/, '')  // 'G4' → 'G'
      const TARGET = 56  // 56px touch target (Foundations minimum)

      // Invisible click target centred on note head
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
      hit.addEventListener('click', () => {
        // Convert SVG coordinates to screen coordinates for popup placement
        const svgRect = svgRoot.getBoundingClientRect()
        const svgW = parseFloat(svgRoot.getAttribute('width')) || svgRect.width
        const svgH = parseFloat(svgRoot.getAttribute('height')) || svgRect.height
        const scaleX = svgRect.width / svgW
        const scaleY = svgRect.height / svgH
        const screenX = svgRect.left + noteX * scaleX
        const screenY = svgRect.top  + noteY * scaleY
        onNoteClickRef.current?.(noteId, screenX, screenY)
      })
      svgRoot.appendChild(hit)

      // Letter label below staff
      const label = svgEl('text', {
        x: noteX,
        y: LABEL_Y,
        'text-anchor': 'middle',
        'font-size': '16',
        'font-weight': '700',
        fill: color,
        'font-family': 'Nunito, sans-serif',
        'pointer-events': 'none',
      })
      label.textContent = noteName
      svgRoot.appendChild(label)
    })

    return
  }

  // ── single mode: one note (for Name That Note game) ──────────────────────
  if (mode === 'single' && singleNote) {
    const noteId = singleNote.id
    const color = NOTE_COLORS[noteId] || singleNote.color || '#2D2D2D'
    const key = NOTE_KEYS[noteId]
    if (!key) return

    const sn = new StaveNote({ keys: [key], duration: 'w' })
    sn.setStyle({ fillStyle: color, strokeStyle: color })
    sn.setStave(stave)

    const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false)
    voice.addTickables([sn])
    new Formatter().joinVoices([voice]).format([voice], staveWidth - 80)
    voice.draw(ctx, stave)
  }
}

// ── Component ───────────────────────────────────────────────────────────────
export default function StaffDisplay({
  mode = 'basic',
  notes = [],
  singleNote = null,
  onNoteClick,
  onLineClick,
  onSpaceClick,
  highlightedLines = new Set(),
  highlightedSpaces = new Set(),
  animateClef = false,
}) {
  const containerRef = useRef(null)
  const observerRef  = useRef(null)

  // Keep callback refs fresh so DOM event listeners never go stale
  const onNoteClickRef  = useRef(onNoteClick)
  const onLineClickRef  = useRef(onLineClick)
  const onSpaceClickRef = useRef(onSpaceClick)
  useEffect(() => { onNoteClickRef.current  = onNoteClick  }, [onNoteClick])
  useEffect(() => { onLineClickRef.current  = onLineClick  }, [onLineClick])
  useEffect(() => { onSpaceClickRef.current = onSpaceClick }, [onSpaceClick])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const draw = () => renderStaff({
      el, mode, notes, singleNote,
      highlightedLines, highlightedSpaces,
      onNoteClickRef, onLineClickRef, onSpaceClickRef,
    })

    draw()

    // Re-render on container width change (responsive)
    observerRef.current = new ResizeObserver(() => draw())
    observerRef.current.observe(el)

    return () => {
      observerRef.current?.disconnect()
      if (el) el.innerHTML = ''
    }
    // highlightedLines / highlightedSpaces are Sets — NoteReadingModule creates
    // a new Set on each tap so the reference changes, triggering re-render correctly
  }, [mode, notes, singleNote, highlightedLines, highlightedSpaces])

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        // 'both' fill-mode: applies from-keyframe before start (prevents opacity flash)
        animation: animateClef ? 'clef-appear 1.5s ease-out both' : undefined,
      }}
    >
      <div ref={containerRef} style={{ width: '100%' }} />
    </div>
  )
}
