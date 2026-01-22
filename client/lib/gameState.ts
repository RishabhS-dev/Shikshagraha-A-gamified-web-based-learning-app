import { create } from 'zustand'
import { LEVELS, Level } from './levels'

type GameStats = {
  wavesCleared: number
  mcqCorrect: number
  mcqTotal: number
  timeSpent: number
  physicsCorrect: number
  chemistryCorrect: number
}

type GameState = {
  // ---------- CORE ----------
  started: boolean
  paused: boolean
  currentLevel: Level | null
  levels: Level[]

  // ---------- AUTH ----------
  token: string | null
  setToken: (token: string) => void
  logout: () => void

  // ---------- STATS ----------
  stats: GameStats

  // ---------- ACTIONS ----------
  startGame: () => void
  selectLevel: (level: Level) => void
  completeLevel: () => void
  pause: () => void
  resume: () => void
  exitLevel: () => void

  recordMCQ: (correct: boolean, subject?: 'PHYSICS' | 'CHEMISTRY') => void
  addTime: (seconds: number) => void
  resetStats: () => void
}

export const useGameState = create<GameState>((set, get) => ({
  // ---------- CORE ----------
  started: false,
  paused: false,
  currentLevel: null,
  levels: LEVELS,

  // ---------- AUTH ----------
  token: null,
  setToken: (token) => set({ token }),
  logout: () =>
    set({
      token: null,
      started: false,
      currentLevel: null,
      paused: false
    }),

  // ---------- STATS ----------
  stats: {
    wavesCleared: 0,
    mcqCorrect: 0,
    mcqTotal: 0,
    timeSpent: 0,
    physicsCorrect: 0,
    chemistryCorrect: 0
  },

  // ---------- GAME FLOW ----------
  startGame: () => set({ started: true }),

  selectLevel: (level) =>
    set({ currentLevel: level, paused: false }),

  completeLevel: () => {
    const { currentLevel, levels } = get()
    if (!currentLevel) return

    set({
      levels: levels.map(l =>
        l.id === currentLevel.id + 1 ? { ...l, unlocked: true } : l
      ),
      currentLevel: null
    })
  },

  pause: () => set({ paused: true }),
  resume: () => set({ paused: false }),
  exitLevel: () => set({ currentLevel: null, paused: false }),

  // ---------- STATS ----------
  recordMCQ: (correct, subject) =>
    set((s) => ({
      stats: {
        ...s.stats,
        mcqTotal: s.stats.mcqTotal + 1,
        mcqCorrect: s.stats.mcqCorrect + (correct ? 1 : 0),
        physicsCorrect:
          subject === 'PHYSICS'
            ? s.stats.physicsCorrect + (correct ? 1 : 0)
            : s.stats.physicsCorrect,
        chemistryCorrect:
          subject === 'CHEMISTRY'
            ? s.stats.chemistryCorrect + (correct ? 1 : 0)
            : s.stats.chemistryCorrect
      }
    })),

  addTime: (seconds) =>
    set((s) => ({
      stats: {
        ...s.stats,
        timeSpent: s.stats.timeSpent + seconds
      }
    })),

  resetStats: () =>
    set({
      stats: {
        wavesCleared: 0,
        mcqCorrect: 0,
        mcqTotal: 0,
        timeSpent: 0,
        physicsCorrect: 0,
        chemistryCorrect: 0
      }
    })
}))
