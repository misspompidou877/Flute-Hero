import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import PracticePage from './pages/PracticePage'
import LessonPage from './pages/LessonPage'
import SongsPage from './pages/SongsPage'
import EchoGamePage from './pages/EchoGamePage'
import TrophiesPage from './pages/TrophiesPage'
import FingeringLibraryPage from './pages/FingeringLibraryPage'
import FoundationsPage from './pages/FoundationsPage'
import ReadMusicPage from './pages/ReadMusicPage'
import BasicsPage from './pages/BasicsPage'
import UnlockPage from './pages/UnlockPage'
import ParentZonePage from './pages/ParentZonePage'
import OnboardingPage from './pages/OnboardingPage'

// First-run gate: true unless the user still needs onboarding. Defaults to
// "done" if localStorage is unavailable so we never trap the user in a loop.
function isOnboardingComplete() {
  try {
    return localStorage.getItem('onboarding.complete') === 'true'
  } catch {
    return true
  }
}

function App() {
  const location = useLocation()
  const isPractice = location.pathname === '/practice'

  // First-run onboarding gate: send new users to /onboarding before anything else.
  if (!isOnboardingComplete() && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // Onboarding renders full-screen (no bottom nav / app chrome).
  if (location.pathname === '/onboarding') {
    return <OnboardingPage />
  }

  if (isPractice) {
    return (
      <div style={{ background: '#FAFAF8' }}>
        <Routes>
          <Route path="/practice" element={<PracticePage />} />
          <Route path="*" element={<Navigate to="/practice" replace />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', color: '#0B3D3A' }}>
      <main
        className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 pt-6"
        style={{ paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))' }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson" element={<LessonPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/echo-game" element={<EchoGamePage />} />
          <Route path="/trophies" element={<TrophiesPage />} />
          <Route path="/fingering-library" element={<FingeringLibraryPage />} />
          <Route path="/foundations" element={<FoundationsPage />} />
          <Route path="/foundations/:module" element={<FoundationsPage />} />
          <Route path="/read-music" element={<ReadMusicPage />} />
          <Route path="/basics" element={<BasicsPage />} />
          <Route path="/unlock" element={<UnlockPage />} />
          <Route path="/parent" element={<ParentZonePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  )
}

export default App
