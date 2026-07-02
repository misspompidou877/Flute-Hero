import { useState } from 'react'
import { useBadges } from './useBadges'

const STORAGE_KEY = 'flutehero_streak'

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

function loadStreak() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { practiceDays: [], longestStreak: 0 }
    return JSON.parse(raw)
  } catch {
    return { practiceDays: [], longestStreak: 0 }
  }
}

function calcCurrentStreak(days) {
  if (!days.length) return 0
  const sorted = [...days].sort().reverse()
  const today = toDateKey(new Date())
  const yesterday = toDateKey(new Date(Date.now() - 86400000))

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = Math.round((prev - curr) / 86400000)
    if (diff === 1) streak++
    else break
  }
  return streak
}

function calcLongestStreak(days) {
  if (!days.length) return 0
  const sorted = [...days].sort()
  let longest = 1
  let current = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = Math.round((curr - prev) / 86400000)
    if (diff === 1) {
      current++
      if (current > longest) longest = current
    } else if (diff > 1) {
      current = 1
    }
  }
  return longest
}

export function useStreak() {
  const [data, setData] = useState(loadStreak)
  const { earnBadge, earnedBadge, clearEarnedBadge } = useBadges()

  const currentStreak = calcCurrentStreak(data.practiceDays)

  function recordPractice() {
    const today = toDateKey(new Date())
    if (data.practiceDays.includes(today)) return

    const newDays = [...data.practiceDays, today]
    const newCurrent = calcCurrentStreak(newDays)
    const newLongest = Math.max(data.longestStreak, calcLongestStreak(newDays))

    const updated = { practiceDays: newDays, longestStreak: newLongest }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setData(updated)

    if (newCurrent >= 7) earnBadge('streak_7')
    else if (newCurrent >= 3) earnBadge('streak_3')
  }

  return {
    currentStreak,
    longestStreak: data.longestStreak,
    practiceDays: data.practiceDays,
    recordPractice,
    earnedBadge,
    clearEarnedBadge,
  }
}
