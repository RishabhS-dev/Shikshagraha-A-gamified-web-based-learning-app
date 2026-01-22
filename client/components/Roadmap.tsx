'use client'
import { useGameState } from '@/lib/gameState'
import LevelNode from './LevelNode'

export default function Roadmap() {
  const { levels, selectLevel } = useGameState()

  return (
    <div className="fixed inset-0 bg-black z-40 flex items-center justify-center">
      <div className="w-[420px]">
        <h2 className="text-cyan-400 font-mono text-xl mb-4">
          Learning Roadmap
        </h2>

        {levels.map((lvl) => (
          <LevelNode
            key={lvl.id}
            level={lvl}
            onClick={() => selectLevel(lvl)}
          />
        ))}
      </div>
    </div>
  )
}
