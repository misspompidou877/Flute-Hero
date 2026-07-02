import { createContext, useContext, useMemo, useState } from 'react'
import { STORAGE_KEY, defaultProgress } from './progressDefaults'
import { computeLevel } from '../notes'

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
    }
  } catch {
    return defaultProgress
  }
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(safeLoadProgress)

  const value = useMemo(() => {
    // TODO: remove override before shipping — unlocks all levels for review
    const currentLevel = 99 // computeLevel(progress.masteredNotes)
    const enrichedProgress = { ...progress, currentLevel }

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
    }
  }, [progress])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
