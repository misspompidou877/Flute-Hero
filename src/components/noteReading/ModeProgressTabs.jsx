const TABS = [
  { label: 'Lines', icon: '♩', mode: 0 },
  { label: 'Spaces', icon: '♩', mode: 1 },
  { label: 'All Notes', icon: '♩', mode: 2 },
]

export default function ModeProgressTabs({ currentMode, completedModes, onModeSelect, isLocked }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        padding: '4px',
        background: '#EEEEEE',
        borderRadius: '999px',
      }}
    >
      {TABS.map(({ label, icon, mode }) => {
        const locked = isLocked(mode)
        const active = currentMode === mode
        const done = completedModes.has(mode)

        let bg = 'transparent'
        let color = '#666666'
        let opacity = 1

        if (locked) {
          opacity = 0.45
        } else if (active) {
          bg = '#26CCC2'
          color = '#0B3D3A'
        } else if (done) {
          bg = '#FFFFFF'
          color = '#0B3D3A'
        } else {
          bg = '#FFFFFF'
          color = '#0B3D3A'
        }

        return (
          <button
            key={mode}
            onClick={() => !locked && onModeSelect(mode)}
            disabled={locked}
            style={{
              flex: 1,
              minHeight: '56px',
              borderRadius: '999px',
              border: 'none',
              background: bg,
              color,
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              cursor: locked ? 'not-allowed' : 'pointer',
              opacity,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'background 0.2s ease, color 0.2s ease, opacity 0.2s ease',
              boxShadow: active ? '0 2px 8px rgba(38,204,194,0.25)' : 'none',
              padding: '0 8px',
            }}
          >
            <span>{label}</span>
            {done && (
              <span
                style={{
                  color: active ? '#0B3D3A' : '#26CCC2',
                  fontSize: '14px',
                  transition: 'color 0.2s ease',
                }}
              >
                ✓
              </span>
            )}
            {locked && (
              <span style={{ fontSize: '13px' }}>🔒</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
