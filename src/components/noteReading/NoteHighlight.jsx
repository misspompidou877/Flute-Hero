import { useEffect, useRef } from 'react'
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow'

// ── Staff geometry (matches StaffDisplay constants) ──────────────────────────
const STAVE_X = 10
const STAVE_Y = 0
const SPACING = 15
const TOTAL_HEIGHT = 170

const NOTE_COLORS = {
  G4: '#26CCC2',
  A4: '#6AECE1',
  B4: '#FFB76C',
  C5: '#FFF57E',
  D5: '#A855F7',
}

const NOTE_KEYS = {
  G4: 'g/4',
  A4: 'a/4',
  B4: 'b/4',
  C5: 'c/5',
  D5: 'd/5',
}

// ── NoteHighlight — renders a single whole note on a treble clef staff ──────
// Props:
//   noteId   — string, e.g. 'B4'
//   duration — VexFlow duration string, default 'w' (whole note)
export default function NoteHighlight({ noteId, duration = 'w' }) {
  const containerRef = useRef(null)
  const observerRef  = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !noteId) return

    const draw = () => {
      el.innerHTML = ''
      const width = Math.max(el.clientWidth || 300, 280)

      const renderer = new Renderer(el, Renderer.Backends.SVG)
      renderer.resize(width, TOTAL_HEIGHT)
      const ctx = renderer.getContext()

      const staveWidth = width - STAVE_X * 2
      const stave = new Stave(STAVE_X, STAVE_Y, staveWidth, {
        spacingBetweenLinesPx: SPACING,
      })
      stave.addClef('treble')
      stave.setContext(ctx).draw()

      const color = NOTE_COLORS[noteId] || '#0B3D3A'
      const key   = NOTE_KEYS[noteId]
      if (!key) return

      const sn = new StaveNote({ keys: [key], duration })
      sn.setStyle({ fillStyle: color, strokeStyle: color })
      sn.setStave(stave)

      const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false)
      voice.addTickables([sn])
      new Formatter().joinVoices([voice]).format([voice], staveWidth - 80)
      voice.draw(ctx, stave)
    }

    draw()

    observerRef.current = new ResizeObserver(() => draw())
    observerRef.current.observe(el)

    return () => {
      observerRef.current?.disconnect()
      if (el) el.innerHTML = ''
    }
  }, [noteId, duration])

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div ref={containerRef} style={{ width: '100%' }} />
    </div>
  )
}
