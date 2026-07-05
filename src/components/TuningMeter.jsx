import { useMicrophone } from '../hooks/useMicrophone'
import { useStreak } from '../hooks/useStreak'
import BadgeToast from './BadgeToast'

export default function TuningMeter() {
  const {
    note,
    frequency,
    cents,
    isActive,
    startListening,
    earnedBadge: noteBadge,
    clearEarnedBadge: clearNoteBadge,
  } = useMicrophone()

  const {
    recordPractice,
    earnedBadge: streakBadge,
    clearEarnedBadge: clearStreakBadge,
  } = useStreak()

  const toastBadge = noteBadge || streakBadge
  const clearToast = noteBadge ? clearNoteBadge : clearStreakBadge

  const getMeterColor = () => {
    if (!isActive || cents === null) return '#EEEEEE'
    const absCents = Math.abs(cents)
    if (absCents <= 20) return '#E8F5E9'
    if (absCents <= 40) return '#FAFAF8'
    return '#FFF3E0'
  }

  const getMeterLabel = () => {
    if (!isActive || cents === null) return '—'
    const absCents = Math.abs(cents)
    if (absCents <= 20) return 'In tune ✓'
    if (absCents <= 40) return 'Close'
    return 'Off pitch'
  }

  const handleStart = () => {
    startListening()
    recordPractice()
  }

  if (!isActive) {
    return (
      <div>
        <button onClick={handleStart}>
          Start Listening
        </button>
        <BadgeToast badge={toastBadge} onDismiss={clearToast} />
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: getMeterColor(),
        borderRadius: 16,
        padding: '16px 20px',
        transition: 'background-color 0.25s ease',
      }}
    >
      <p className="text-[11px] font-semibold text-[#2D2D2D]" style={{ marginBottom: 4 }}>{getMeterLabel()}</p>
      <p className="text-[11px] font-semibold text-[#2D2D2D]">{note ?? '—'}</p>
      <p className="text-[11px] font-semibold text-[#2D2D2D]">
        {cents !== null ? `${cents > 0 ? '+' : ''}${cents} cents` : '—'}
      </p>
      <BadgeToast badge={toastBadge} onDismiss={clearToast} />
    </div>
  )
}
