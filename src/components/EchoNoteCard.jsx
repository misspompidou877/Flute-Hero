import { useState, useEffect } from 'react'
import { NOTES } from '../notes'
import { FingeringDiagramForNote } from './FingeringDiagrams'

function getCardStyle(status) {
  switch (status) {
    case 'active':
      return {
        borderColor: '#26CCC2',
        background: 'rgba(245,166,35,0.07)',
        boxShadow: '0 0 14px rgba(106,236,225,0.25)',
      }
    case 'correct':
      return {
        borderColor: '#F0D64E',
        background: 'rgba(255,245,126,0.10)',
        boxShadow: '0 0 16px rgba(255,245,126,0.6)',
      }
    case 'wrong':
      return {
        borderColor: '#FFB76C',
        background: '#FAFAF8',
        boxShadow: 'none',
      }
    case 'hidden':
      return { borderColor: '#CCCCCC', background: '#F5F5F5' }
    default:
      return { borderColor: '#E0E0E0', background: 'white' }
  }
}

export default function EchoNoteCard({ noteId, status, showFingering = false, size = 'large' }) {
  const noteData = noteId ? NOTES[noteId] : null
  const label  = noteData ? noteData.label  : '?'
  const octave = noteData ? noteData.octave : ''
  const cardStyle = getCardStyle(status)
  const isHidden = status === 'hidden' || !noteData

  // Brief pop + glow when a note transitions to 'correct'
  const [popAnim, setPopAnim] = useState(false)
  useEffect(() => {
    if (status === 'correct') {
      setPopAnim(true)
      const t = setTimeout(() => setPopAnim(false), 400)
      return () => clearTimeout(t)
    }
  }, [status])

  const animStyle = popAnim
    ? { animation: 'scale-pop 200ms ease-out', boxShadow: '0 0 16px rgba(255,245,126,0.6)' }
    : {}

  if (size === 'small') {
    return (
      <div
        className="flex h-16 w-14 flex-col items-center justify-center rounded-xl border-2 transition-all"
        style={{ ...cardStyle, ...animStyle }}
      >
        <span className="text-base font-black leading-tight text-[#0B3D3A]">
          {isHidden ? '?' : label}
        </span>
        {!isHidden && (
          <span className="text-xs" style={{ color: '#666666' }}>{octave}</span>
        )}
        {status === 'correct' && <span className="text-xs font-bold" style={{ color: '#0B3D3A' }}>✓</span>}
        {status === 'wrong'   && <span className="text-xs font-bold" style={{ color: '#0B3D3A' }}>✗</span>}
      </div>
    )
  }

  // Large card
  return (
    <div
      className={`w-full rounded-2xl border-4 p-6 transition-all duration-300 ${status === 'active' ? 'animate-pulse' : ''}`}
      style={{ ...cardStyle, ...animStyle }}
    >
      <div className="mb-2 text-center">
        <span className="text-6xl font-black leading-none text-[#0B3D3A]">
          {isHidden ? '?' : label}
        </span>
        {!isHidden && (
          <span className="ml-1 text-2xl font-bold" style={{ color: '#666666' }}>{octave}</span>
        )}
      </div>
      {status === 'correct' && (
        <p className="mt-2 text-center text-2xl font-bold" style={{ color: '#0B3D3A' }}>✓</p>
      )}
      {status === 'wrong' && (
        <p className="mt-2 text-center text-2xl font-bold" style={{ color: '#0B3D3A' }}>✗</p>
      )}
      {showFingering && !isHidden && (
        <div className="mt-4">
          <FingeringDiagramForNote noteId={noteId} />
        </div>
      )}
    </div>
  )
}
