import { useEffect, useRef } from 'react'
import { Renderer, Stave } from 'vexflow'

export default function VexTest() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''
    
    try {
      const renderer = new Renderer(
        ref.current, 
        Renderer.Backends.SVG
      )
      renderer.resize(400, 120)
      const context = renderer.getContext()
      const stave = new Stave(10, 10, 370)
      stave.addClef('treble')
      stave.setContext(context).draw()
      console.log('VexFlow rendered successfully')
    } catch (err) {
      console.error('VexFlow error:', err)
    }
  }, [])

  return (
    <div>
      <p>VexFlow test:</p>
      <div 
        ref={ref} 
        style={{ 
          background: 'white', 
          width: 400, 
          height: 120 
        }} 
      />
    </div>
  )
}