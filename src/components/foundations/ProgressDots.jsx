export default function ProgressDots({ total, current, onDotClick }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        paddingTop: '24px',
        paddingBottom: '8px',
      }}
    >
      {Array.from({ length: total }, (_, i) => {
        const isComplete = i < current
        const isCurrent = i === current

        let bg = '#EEEEEE'
        if (isComplete) bg = '#26CCC2'
        if (isCurrent) bg = '#26CCC2'

        const handleClick = isComplete && onDotClick ? () => onDotClick(i) : undefined

        return (
          <button
            key={i}
            onClick={handleClick}
            disabled={!isComplete || !onDotClick}
            aria-label={isComplete ? `Review step ${i + 1}` : `Step ${i + 1}`}
            style={{
              padding: '22px',
              background: 'transparent',
              border: 'none',
              cursor: isComplete && onDotClick ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span
              style={{
                display: 'block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: bg,
                animation: isCurrent ? 'dot-pulse 1.4s ease-out infinite' : 'none',
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
