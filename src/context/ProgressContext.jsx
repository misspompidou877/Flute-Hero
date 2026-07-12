import { createContext, useContext, useMemo, useState } from 'react'
import { STORAGE_KEY, defaultProgress } from './progressDefaults'
import { FREE_MAX_LEVEL } from '../data/freemium'
import { isEmailUnlocked, markEmailUnlocked } from '../utils/entitlements'

const ProgressContext = createContext(null)

function safeLoadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    const parsed = JSON.parse(raw)
    return {
      ...defaultProgress,
      ...parsed,
      masteredNotes: Array.isArray(parsed.masteredNotes) ? parsed.masteredNotes : [],
      badgesEarned: Array.isArray(parsed.badgesEarned) ? parsed.badgesEarned : [],
      isPremium: parsed.isPremium === true,
    }
  } catch {
    return defaultProgress
  }
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(safeLoadProgress)
  // Free-song entitlement lives in its own localStorage key (entitlements.js).
  // Held in React state so unlocking re-renders every gated surface live.
  const [emailUnlocked, setEmailUnlockedState] = useState(isEmailUnlocked)

  const value = useMemo(() => {
    // Premium unlocks every level; everyone else sits at the free baseline
    // (Level 1) for notes/games/fingering. SONG access is separate and
    // per-song (see src/utils/entitlements.js) — the 2 `free` songs at each
    // level open once a grown-up adds an email (emailUnlocked).
    const currentLevel = progress.isPremium ? 99 : FREE_MAX_LEVEL
    const enrichedProgress = { ...progress, currentLevel, emailUnlocked }

    const save = (next) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    }

    return {
      progress: enrichedProgress,

      markNoteMastered(noteId) {
        setProgress(prev => {
          if (prev.masteredNotes.includes(noteId)) return prev
          return save({ ...prev, masteredNotes: [...prev.masteredNotes, noteId] })
        })
      },

      toggleMasteredNote(note) {
        const id = note.trim().toUpperCase()
        if (!id) return
        setProgress(prev => {
          const has = prev.masteredNotes.includes(id)
          return save({
            ...prev,
            masteredNotes: has
              ? prev.masteredNotes.filter(n => n !== id)
              : [...prev.masteredNotes, id],
          })
        })
      },

      addBadge(badge) {
        const id = badge.trim()
        if (!id) return
        setProgress(prev => {
          if (prev.badgesEarned.includes(id)) return prev
          return save({ ...prev, badgesEarned: [...prev.badgesEarned, id] })
        })
      },

      resetProgress() {
        setProgress(save(defaultProgress))
      },

      // Premium entitlement — client-side flag, no backend (placeholder purchase).
      unlockPremium() {
        setProgress(prev => (prev.isPremium ? prev : save({ ...prev, isPremium: true })))
      },

      lockPremium() {
        setProgress(prev => (!prev.isPremium ? prev : save({ ...prev, isPremium: false })))
      },

      // Free-song tier — a grown-up's email opens the 2 free songs at every
      // level. Optionally stores the email on-device (no backend, no send).
      unlockFreeSongs(email) {
        if (email) {
          try { localStorage.setItem('profile.saveEmail', String(email)) } catch { /* private mode */ }
        }
        markEmailUnlocked()
        setEmailUnlockedState(true)
      },
    }
  }, [progress, emailUnlocked])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
