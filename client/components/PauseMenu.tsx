'use client'
import { useGameState } from '@/lib/gameState'

export default function PauseMenu() {
  const { resume, exitLevel } = useGameState()

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="text-center font-mono text-cyan-400">
        <h2 className="text-3xl mb-6">PAUSED</h2>

        <button
          onClick={resume}
          className="block w-48 mx-auto mb-3 bg-cyan-500 text-black py-2 rounded"
        >
          RESUME
        </button>

        <button
          onClick={exitLevel}
          className="block w-48 mx-auto bg-red-500 text-black py-2 rounded"
        >
          EXIT TO MAP
        </button>
      </div>
    </div>
  )
}
