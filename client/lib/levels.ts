export type Level = {
  id: number
  subject: 'Physics' | 'Chemistry' | 'Boss'
  title: string
  unlocked: boolean
}

export const LEVELS: Level[] = [
  { id: 1, subject: 'Physics', title: 'Motion', unlocked: true },
  { id: 2, subject: 'Physics', title: 'Force & Laws', unlocked: false },
  { id: 3, subject: 'Chemistry', title: 'Chemical Reactions', unlocked: false },
  { id: 4, subject: 'Chemistry', title: 'Acids & Bases', unlocked: false },
  { id: 5, subject: 'Boss', title: 'Final Assessment', unlocked: false }
]
