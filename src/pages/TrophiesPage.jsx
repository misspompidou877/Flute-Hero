import PageScreen from '../components/PageScreen'
import { useBadges } from '../hooks/useBadges'
import { useStreak } from '../hooks/useStreak'

// --- Heatmap ---

function buildHeatmapDays(practiceDays) {
  const practiceSet = new Set(practiceDays)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (27 - i))
    const key = d.toISOString().slice(0, 10)
    return { key, practiced: practiceSet.has(key) }
  })
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function Heatmap({ practiceDays }) {
  const days = buildHeatmapDays(practiceDays)

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-[#999999]">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ key, practiced }) => (
          <div
            key={key}
            title={key}
            className="aspect-square rounded-sm"
            style={{ background: practiced ? '#26CCC2' : '#E8E8E8' }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 justify-end">
        <span className="text-[10px] text-[#999999]">Less</span>
        <div className="h-3 w-3 rounded-sm" style={{ background: '#E8E8E8' }} />
        <div className="h-3 w-3 rounded-sm" style={{ background: '#26CCC2' }} />
        <span className="text-[10px] text-[#999999]">More</span>
      </div>
    </div>
  )
}

// --- Badge Card ---

function BadgeCard({ badge }) {
  const earned = badge.earned

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border-2 p-4 text-center transition ${
        earned
          ? 'border-[#26CCC2] bg-white'
          : 'border-[#FFB76C] bg-[#FAFAF8] opacity-70'
      }`}
      style={earned ? { boxShadow: '0 0 16px rgba(255,245,126,0.5)' } : {}}
    >
      <span className={`text-4xl leading-none ${earned ? '' : 'grayscale'}`}>
        {badge.icon}
      </span>
      <p className={`mt-2 text-sm font-bold ${earned ? 'text-[#0B3D3A]' : 'text-[#999999]'}`}>
        {badge.name}
      </p>
      <p className="mt-1 text-xs text-[#666666] leading-snug">{badge.description}</p>
      {earned && badge.earnedDate && (
        <p className="mt-2 text-[11px] font-semibold text-[#26CCC2]">
          Earned {badge.earnedDate}
        </p>
      )}
    </div>
  )
}

// --- Page ---

function TrophiesPage() {
  const { badges } = useBadges()
  const { currentStreak, longestStreak, practiceDays } = useStreak()

  const earnedCount = badges.filter(b => b.earned).length
  const nextBadge   = badges.find(b => !b.earned) ?? null

  return (
    <PageScreen
      title="Trophies"
      description="Track your badges, celebrate milestones, and see the progress you've earned through regular practice."
    >
      {/* Streak section */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,245,126,0.18) 0%, rgba(106,236,225,0.18) 100%)',
          border: '2px solid #FFF57E',
          boxShadow: '0 4px 16px rgba(255, 245, 126, 0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#26CCC2]">
              Current Streak
            </p>
            <p className="mt-1 text-4xl font-extrabold text-[#0B3D3A]">
              🔥 {currentStreak} day{currentStreak !== 1 ? 's' : ''}!
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#999999]">
              Longest
            </p>
            <p className="mt-1 text-2xl font-bold text-[#0B3D3A]">{longestStreak} days</p>
          </div>
        </div>

        {/* Heatmap */}
        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#999999]">
            Last 4 weeks
          </p>
          <Heatmap practiceDays={practiceDays} />
        </div>
      </div>

      {/* Next badge card */}
      {nextBadge && (
        <div
          style={{
            marginTop: 16,
            borderRadius: 16,
            background: 'white',
            borderLeft: '4px solid #26CCC2',
            padding: '16px 20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#999999',
              margin: '0 0 10px',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            🎯 Next to unlock
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{nextBadge.icon}</span>
            <div>
              <p
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#0B3D3A',
                  margin: '0 0 4px',
                }}
              >
                {nextBadge.name}
              </p>
              <p
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#26CCC2',
                  margin: 0,
                }}
              >
                How to earn: {nextBadge.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Badge cabinet */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0B3D3A]">Badge Cabinet</h2>
          <span className="text-sm font-semibold text-[#26CCC2]">
            {earnedCount} / {badges.length} earned
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {badges.map(badge => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>
    </PageScreen>
  )
}

export default TrophiesPage
