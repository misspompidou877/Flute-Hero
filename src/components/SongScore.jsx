import { useEffect, useRef } from 'react'
import { Renderer, Stave, StaveNote, Voice, Formatter, Beam, Barline, Accidental, Dot } from 'vexflow'

const DEFAULT_MEASURES_PER_ROW = 2
const STAVE_X = 10
const STAVE_Y = 20
const ROW_HEIGHT = 110
const MIN_WIDTH = 300

const DURATION_BEATS = {
  w: 4, wd: 6,
  h: 2, hd: 3,
  q: 1, qd: 1.5,
  '8': 0.5, '8d': 0.75,
  '16': 0.25,
}

// v2.0 TEAL palette. Played notes read Deep Teal at full strength, the active
// note is Teal, and upcoming notes fade to Deep Teal @ 50% so the eye focuses
// on the active region (per redesign spec).
const STYLE_DONE     = { fillStyle: '#0B3D3A', strokeStyle: '#0B3D3A' }
const STYLE_CURRENT  = { fillStyle: '#26CCC2', strokeStyle: '#26CCC2' }
const STYLE_UPCOMING = { fillStyle: 'rgba(11,61,58,0.5)', strokeStyle: 'rgba(11,61,58,0.5)' }

function getAccidental(key) {
  const notePart = key.split('/')[0]
  if (notePart.includes('#')) return '#'
  if (notePart.length > 1 && notePart[1] === 'b') return 'b'
  return null
}

export function groupIntoMeasures(notes, beatsPerMeasure = 4) {
  const measures = []
  let current = []
  let beats = 0
  for (const note of notes) {
    current.push(note)
    beats += DURATION_BEATS[note.duration] ?? 1
    if (beats >= beatsPerMeasure - 0.01) {
      measures.push(current)
      current = []
      beats = 0
    }
  }
  if (current.length) measures.push(current)
  return measures
}

function renderScore(el, notes, currentNoteIndex, beatsPerMeasure, timeSignature, startMeasure, endMeasure, measuresPerRow) {
  el.innerHTML = ''
  if (!notes?.length) return

  const allMeasures = groupIntoMeasures(notes, beatsPerMeasure)
  const measures = allMeasures.slice(startMeasure, endMeasure)
  if (!measures.length) return

  // Only draw a double barline on the very last bar of the entire song,
  // not at the end of every page.
  const isFinalPage = endMeasure >= allMeasures.length

  // Compute global note index offset for colouring
  let noteOffset = 0
  for (let i = 0; i < startMeasure; i++) noteOffset += allMeasures[i].length

  const perRow = measuresPerRow || DEFAULT_MEASURES_PER_ROW
  const totalWidth = Math.max(el.clientWidth || MIN_WIDTH, MIN_WIDTH)
  const staveWidth = Math.floor((totalWidth - STAVE_X * 2) / perRow)

  const rows = []
  for (let i = 0; i < measures.length; i += perRow) {
    rows.push(measures.slice(i, i + perRow))
  }

  const totalHeight = rows.length * ROW_HEIGHT + 40
  const renderer = new Renderer(el, Renderer.Backends.SVG)
  renderer.resize(totalWidth, totalHeight)
  const context = renderer.getContext()

  const lastRowIndex = rows.length - 1
  let globalNoteIndex = noteOffset

  rows.forEach((rowMeasures, rowIndex) => {
    const y = STAVE_Y + rowIndex * ROW_HEIGHT
    const isFirstRow = rowIndex === 0
    const isLastRow = rowIndex === lastRowIndex

    let xCursor = STAVE_X

    rowMeasures.forEach((measureNotes, measureIndex) => {
      const isFirstStave = measureIndex === 0
      const isLastStave = isLastRow && measureIndex === rowMeasures.length - 1

      const stave = new Stave(xCursor, y, staveWidth)
      if (isFirstStave) stave.addClef('treble')
      if (isFirstStave && isFirstRow && startMeasure === 0) stave.addTimeSignature(timeSignature)
      if (isLastStave && isFinalPage) stave.setEndBarType(Barline.type.END)
      stave.setContext(context).draw()

      const staveNotes = measureNotes.map(({ key, duration }) => {
        const sn = new StaveNote({ keys: [key], duration })
        const dotCount = (duration.match(/d/g) || []).length
        if (dotCount > 0) Dot.buildAndAttach([sn], { all: true })
        const acc = getAccidental(key)
        if (acc) sn.addModifier(new Accidental(acc), 0)
        if (currentNoteIndex >= 0) {
          if (globalNoteIndex < currentNoteIndex)        sn.setStyle(STYLE_DONE)
          else if (globalNoteIndex === currentNoteIndex) sn.setStyle(STYLE_CURRENT)
          else                                           sn.setStyle(STYLE_UPCOMING)
        }
        globalNoteIndex++
        return sn
      })

      const beams = Beam.generateBeams(staveNotes)
      const voice = new Voice({ numBeats: beatsPerMeasure, beatValue: 4 }).setStrict(false)
      voice.addTickables(staveNotes)

      const overhead = isFirstStave ? (isFirstRow ? 90 : 50) : 20
      new Formatter().joinVoices([voice]).format([voice], staveWidth - overhead)

      voice.draw(context, stave)
      beams.forEach(b => b.setContext(context).draw())

      xCursor += staveWidth
    })
  })

  // Make the rendered SVG scale to fit its container (both width AND height) so
  // the music is always fully visible — critical on short landscape phones where
  // the fixed-height staff would otherwise be clipped.
  const svg = el.querySelector('svg')
  if (svg) {
    svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.style.display = 'block'
    svg.style.width = '100%'
    svg.style.height = '100%'
  }
}

export default function SongScore({ notes, title, currentNoteIndex = -1, beatsPerMeasure = 4, startMeasure = 0, measuresPerPage, measuresPerRow = DEFAULT_MEASURES_PER_ROW }) {
  const containerRef = useRef(null)
  const observerRef = useRef(null)
  const timeSignature = `${beatsPerMeasure}/4`

  const allMeasures = groupIntoMeasures(notes ?? [], beatsPerMeasure)
  const endMeasure = measuresPerPage != null
    ? Math.min(startMeasure + measuresPerPage, allMeasures.length)
    : allMeasures.length

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    renderScore(el, notes, currentNoteIndex, beatsPerMeasure, timeSignature, startMeasure, endMeasure, measuresPerRow)

    observerRef.current = new ResizeObserver(() => {
      renderScore(el, notes, currentNoteIndex, beatsPerMeasure, timeSignature, startMeasure, endMeasure, measuresPerRow)
    })
    observerRef.current.observe(el)

    return () => observerRef.current?.disconnect()
  }, [notes, currentNoteIndex, beatsPerMeasure, startMeasure, endMeasure, measuresPerRow])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && <h3 className="mb-2 font-semibold text-[#0B3D3A]">{title}</h3>}
      <div ref={containerRef} style={{ width: '100%', flex: 1, minHeight: 0 }} />
    </div>
  )
}
