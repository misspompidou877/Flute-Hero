const STORAGE_KEY = 'flute-hero-progress-v1'

const defaultProgress = {
  currentLevel: 1,
  masteredNotes: [],
  badgesEarned: [],
  dailyPracticeStreak: 0,
  lastPracticeDate: null,
  isPremium: false, // free tier by default — premium unlocks Levels 2–8
}

export { STORAGE_KEY, defaultProgress }
