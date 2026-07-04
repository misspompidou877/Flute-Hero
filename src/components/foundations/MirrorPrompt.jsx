import { useState } from 'react'

const CHECKLIST = [
  'Lips are relaxed — no tension',
  'Cheeks are flat, not puffed out',
  'Just a small opening in the middle',
]

export default function MirrorPrompt({ onConfirm }) {
  const [showChecklist, setShowChecklist] = useState(false)

  return (
    <div
      style={{
        background: '#EBF6FF',
        borderRadius: '16px',
        border: '2px solid #90CAF9',
        padding: '20px 20px 20px',
        marginTop: '20px',
        animation: 'f-slide-in 280ms ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '28px' }}>📱</span>
        <p
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 600,
            fontSize: '18px',
            color: '#2D2D2D',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Hold your phone like a mirror. Does your lip shape look like the picture?
        </p>
      </div>

      {showChecklist && (
        <ul
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '17px',
            color: '#2D2D2D',
            margin: '0 0 16px',
            paddingLeft: '24px',
            lineHeight: 1.8,
          }}
        >
          {CHECKLIST.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {!showChecklist ? (
          <>
            <button
              onClick={onConfirm}
              style={{
                height: '56px',
                padding: '0 20px',
                borderRadius: '24px',
                border: 'none',
                background: '#4CAF50',
                color: '#FFFFFF',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: '17px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Yes, looks right! ✓
            </button>
            <button
              onClick={() => setShowChecklist(true)}
              style={{
                height: '56px',
                padding: '0 20px',
                borderRadius: '24px',
                border: '2px solid #EEEEEE',
                background: '#FFFFFF',
                color: '#666666',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 600,
                fontSize: '17px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Not sure 🤔
            </button>
          </>
        ) : (
          <button
            onClick={onConfirm}
            style={{
              height: '48px',
              padding: '0 24px',
              borderRadius: '24px',
              border: 'none',
              background: '#4CAF50',
              color: '#FFFFFF',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '17px',
              cursor: 'pointer',
            }}
          >
            Got it ✓
          </button>
        )}
      </div>
    </div>
  )
}
