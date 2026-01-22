'use client'
import { useGameState } from '@/lib/gameState'
import Link from 'next/link'

export default function CompletionScreen() {
  const stats = useGameState(s => s.stats)

  return (
    <div className="fixed inset-0 bg-black text-cyan-400 font-mono flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl mb-6">MISSION COMPLETE</h1>

        <p>Waves Cleared: {stats.wavesCleared}</p>
        <p>Accuracy: {stats.mcqCorrect}/{stats.mcqTotal}</p>
        <p>Time Spent: {stats.timeSpent}s</p>

        <Link
          href="/dashboard"
          className="inline-block mt-6 px-6 py-2 bg-cyan-500 text-black rounded"
        >
          VIEW DASHBOARD
        </Link>
      </div>
    </div>
  )
}
