import { NavLink } from 'react-router-dom'

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9,21 9,12 15,12 15,21" />
    </svg>
  )
}

function BasicsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function SongsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function PracticeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5h-4" />
      <path d="M6 2h12v7a6 6 0 1 1-12 0z" />
      <path d="M12 15v7" />
      <path d="M8 22h8" />
    </svg>
  )
}

function GamesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="20" height="12" rx="6" />
      <path d="M9 12h2m0 0h2m-2 0v-2m0 2v2" />
      <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const navItems = [
  { to: '/',          label: 'Home',     Icon: HomeIcon,     end: true },
  { to: '/basics',    label: 'Basics',   Icon: BasicsIcon,   end: false },
  { to: '/songs',     label: 'Songs',    Icon: SongsIcon,    end: false },
  { to: '/practice',  label: 'Practice', Icon: PracticeIcon, end: false },
  { to: '/trophies',  label: 'Trophies', Icon: TrophyIcon,   end: false },
  { to: '/echo-game', label: 'Games',    Icon: GamesIcon,    end: false },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 bg-white"
      style={{
        borderTop: '0.5px solid #F1EFE8',
        boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.06)',
        padding: '8px 4px calc(8px + env(safe-area-inset-bottom))',
      }}
      aria-label="Main navigation"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-6 gap-0.5">
        {navItems.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className="flex flex-col items-center justify-center rounded-xl active:scale-95 transition-transform"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              {({ isActive }) => (
                <div
                  className="flex flex-col items-center justify-center gap-0.5"
                  style={{ color: isActive ? '#006EE9' : '#000180' }}
                >
                  <Icon />
                  <span style={{ fontSize: 9, fontWeight: isActive ? 600 : 500, lineHeight: 1.2 }}>
                    {label}
                  </span>
                  {isActive && (
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#D0FFA3',
                        marginTop: 1,
                      }}
                    />
                  )}
                </div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
