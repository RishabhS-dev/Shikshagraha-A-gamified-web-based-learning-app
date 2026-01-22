'use client'
import { useGameState } from '@/lib/gameState'

export default function MainMenu() {
  const startGame = useGameState(s => s.startGame)

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center font-mono text-cyan-400">
      <div className="text-center animate-pulse">
        <h1 className="text-5xl mb-6 tracking-widest">
          SHIKSHAGRAHA
        </h1>

        <p className="mb-8 text-sm opacity-80">
          Learn • Play • Master
        </p>

        <button
          onClick={startGame}
          className="px-8 py-3 bg-cyan-500 text-black rounded hover:bg-cyan-400 transition"
        >
          START GAME
        </button>

        <p className="mt-8 text-xs opacity-50">
          CBSE Class 10 • Physics & Chemistry
        </p>
      </div>
    </div>
  )
}
