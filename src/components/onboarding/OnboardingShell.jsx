/*
 * OnboardingShell — shared frame + primitives for the first-use onboarding flow.
 * Palette law: STYLE_GUIDE v2.0 TEAL only. Text on any bright fill = Deep Teal.
 * Kid touch targets: primary actions are 56px tall. CSS animations only.
 */

const DEEP_TEAL = '#0B3D3A';

// One-time keyframes for the onboarding-only entrance / sparkle motions.
const KEYFRAMES = `
@keyframes fh-rise {
  0%   { opacity: 0; transform: translateY(18px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes fh-pop {
  0%   { opacity: 0; transform: scale(0.8); }
  60%  { opacity: 1; transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes fh-sparkle {
  0%   { opacity: 0; transform: scale(0.4) rotate(0deg); }
  40%  { opacity: 1; transform: scale(1.1) rotate(20deg); }
  100% { opacity: 0; transform: scale(0.5) rotate(40deg); }
}
`;

/** Progress dots for steps after the splash (never shown on step 0). */
export function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center justify-center" style={{ gap: 6, padding: '6px 0' }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i === current ? 20 : 8,
            height: 8,
            borderRadius: 9999,
            background: i <= current ? '#26CCC2' : '#D3D1C7',
            transition: 'all 0.25s ease',
          }}
        />
      ))}
    </div>
  );
}

/** Full-width primary action — teal gradient, Deep Teal label, 56px tall. */
export function PrimaryButton({ children, onClick, disabled = false, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full active:scale-95 transition-transform"
      style={{
        minHeight: 56,
        borderRadius: 16,
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        background: disabled ? '#D3D1C7' : 'linear-gradient(to right, #26CCC2, #1AA89F)',
        boxShadow: disabled ? 'none' : '0 4px 16px rgba(38,204,194,0.35)',
        color: DEEP_TEAL,
        fontFamily: "'Nunito', sans-serif",
        fontSize: 18,
        fontWeight: 800,
        padding: '0 20px',
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {children}
    </button>
  );
}

/** Secondary / low-emphasis action — white fill, Deep Teal label. */
export function SecondaryButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full active:scale-95 transition-transform"
      style={{
        minHeight: 56,
        borderRadius: 16,
        border: '2px solid #6AECE1',
        cursor: 'pointer',
        background: '#FFFFFF',
        color: DEEP_TEAL,
        fontFamily: "'Nunito', sans-serif",
        fontSize: 16,
        fontWeight: 700,
        padding: '0 20px',
      }}
    >
      {children}
    </button>
  );
}

/**
 * The screen frame: full-height, page background, safe-area insets, a centred
 * content column, and an optional progress row along the top.
 */
export default function OnboardingShell({ children, stepIndex, totalSteps, showProgress = true }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAFAF8',
        color: DEEP_TEAL,
        fontFamily: "'Nunito', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))',
      }}
    >
      <style>{KEYFRAMES}</style>

      {showProgress && (
        <div style={{ paddingTop: 14 }}>
          <ProgressDots current={stepIndex} total={totalSteps} />
        </div>
      )}

      <div
        className="flex flex-col items-center justify-center"
        style={{ flex: 1, width: '100%', maxWidth: 460, margin: '0 auto', textAlign: 'center' }}
      >
        {children}
      </div>
    </div>
  );
}
