'use client'
import { Level } from '@/lib/levels'

export default function LevelNode({
  level,
  onClick
}: {
  level: Level
  onClick: () => void
}) {
  return (
    <button
      disabled={!level.unlocked}
      onClick={onClick}
      className={`w-full p-4 rounded mb-3 text-left font-mono
        ${level.unlocked
          ? 'bg-zinc-800 hover:bg-cyan-600'
          : 'bg-zinc-900 opacity-40 cursor-not-allowed'
        }`}
    >
      <div className="text-cyan-400">{level.subject}</div>
      <div className="text-white">{level.title}</div>
    </button>
  )
}
