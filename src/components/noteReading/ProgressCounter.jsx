export default function ProgressCounter({ learned, total }) {
  const allDone = learned >= total

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 18px',
        borderRadius: '999px',
        background: allDone ? '#D0FFA3' : '#FFFFFF',
        border: `2px solid ${allDone ? '#A8D47F' : '#E0E0E0'}`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <span
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: '16px',
          color: allDone ? '#000180' : '#006EE9',
          transition: 'color 0.3s ease',
        }}
      >
        {learned} of {total} learned
      </span>
      {allDone && (
        <span style={{ fontSize: '18px' }}>✓</span>
      )}
    </div>
  )
}
