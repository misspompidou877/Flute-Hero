import { useState } from 'react'
import { BADGES } from '../data/badges'
import { NOTES_BY_LEVEL } from '../notes'

const STORAGE_KEY = 'flutehero_badges'

const LEVEL1_2_NOTES = [...NOTES_BY_LEVEL[1], ...NOTES_BY_LEVEL[2]]

function loadBadges() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return BADGES.map(b => ({ ...b }))
    const saved = JSON.parse(raw)
    return BADGES.map(badge => {
      const s = saved.find(b => b.id === badge.id)
      return s ? { ...badge, earned: s.earned, earnedDate: s.earnedDate } : { ...badge }
    })
  } catch {
    return BADGES.map(b => ({ ...b }))
  }
}

export function useBadges() {
  const [badges, setBadges] = useState(loadBadges)
  const [earnedBadge, setEarnedBadge] = useState(null)

  function earnBadge(id) {
    const current = loadBadges()
    const badge = current.find(b => b.id === id)
    if (!badge || badge.earned) return null

    const earnedDate = new Date().toISOString().slice(0, 10)
    const updated = current.map(b =>
      b.id === id ? { ...b, earned: true, earnedDate } : b
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setBadges(updated)
    const newBadge = updated.find(b => b.id === id)
    setEarnedBadge(newBadge)
    return newBadge
  }

  function clearEarnedBadge() {
    setEarnedBadge(null)
  }

  // Called with the current progress state to auto-check condition-based badges
  function checkBadges(progressState) {
    const { currentLevel, masteredNotes = [] } = progressState

    if (currentLevel >= 5) earnBadge('flute_hero')

    const hasAllFirstNotes = LEVEL1_2_NOTES.every(n => masteredNotes.includes(n))
    if (hasAllFirstNotes) earnBadge('five_note_star')
  }

  return { badges, earnBadge, earnedBadge, clearEarnedBadge, checkBadges }
}
