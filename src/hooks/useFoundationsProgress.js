import { useState, useCallback } from 'react'

const safeGet = (key) => {
  try { return localStorage.getItem(key) } catch { return null }
}
const safeSet = (key, value) => {
  try { localStorage.setItem(key, value) } catch (e) { console.warn('[foundations]', e) }
}

function load() {
  return {
    isComplete: safeGet('foundationsComplete') === 'true',
    completedModules: {
      noteReading: safeGet('foundations.noteReading') === 'true',
      embouchure:  safeGet('foundations.embouchure')  === 'true',
      tonguing:    safeGet('foundations.tonguing')     === 'true',
      firstNotes:  safeGet('foundations.firstNotes')  === 'true',
    },
    lastStep: (() => {
      try { return JSON.parse(safeGet('foundations.lastStep')) } catch { return null }
    })(),
  }
}

export function useFoundationsProgress() {
  const [state, setState] = useState(load)

  const refresh = useCallback(() => setState(load), [])

  const markModuleComplete = useCallback((module) => {
    safeSet(`foundations.${module}`, 'true')
    refresh()
  }, [refresh])

  const markFoundationsComplete = useCallback(() => {
    safeSet('foundationsComplete', 'true')
    safeSet('foundationsCompletedAt', String(Date.now()))
    refresh()
  }, [refresh])

  const saveLastStep = useCallback((module, step) => {
    safeSet('foundations.lastStep', JSON.stringify({ module, step }))
    safeSet('foundationsStarted', 'true')
  }, [])

  const awardBadge = useCallback((badgeKey) => {
    safeSet(`badges.${badgeKey}`, JSON.stringify({ earned: true, earnedAt: Date.now() }))
  }, [])

  return { ...state, markModuleComplete, markFoundationsComplete, saveLastStep, awardBadge }
}
