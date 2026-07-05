import ProgressDots from './ProgressDots'

export default function LessonCard({
  emoji,
  title,
  children,
  onNext,
  onPrev,
  showPrev,
  nextLabel,
  nextDisabled,
  total,
  current,
  onDotClick,
}) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#FAFAF8',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '680px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <ProgressDots total={total} current={current} onDotClick={onDotClick} />

      <div
        key={current}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px 24px',
          animation: 'f-slide-in 280ms ease-out',
        }}
      >
        {children}
      </div>

      <div
        style={{
          padding: '16px',
          paddingBottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
          background: '#FAFAF8',
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        {showPrev && (
          <button
            onClick={onPrev}
            style={{
              height: '56px',
              minWidth: '120px',
              borderRadius: '28px',
              border: '2px solid #EEEEEE',
              background: '#FFFFFF',
              color: '#666666',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            ← Back
          </button>
        )}

        {nextLabel && (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            style={{
              flex: 1,
              height: '56px',
              minWidth: '160px',
              borderRadius: '28px',
              border: 'none',
              background: nextDisabled
                ? '#26CCC2'
                : 'linear-gradient(to right, #26CCC2, #1AA89F)',
              color: '#0B3D3A',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              cursor: nextDisabled ? 'not-allowed' : 'pointer',
              opacity: nextDisabled ? 0.4 : 1,
            }}
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  )
}
