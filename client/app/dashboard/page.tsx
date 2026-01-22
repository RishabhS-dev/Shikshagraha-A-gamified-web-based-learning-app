'use client'

import { useEffect, useState } from 'react'
import { useGameState } from '@/lib/gameState'
import { getGameStats } from '@/lib/api'
import { Line, Pie } from 'react-chartjs-2'
import '@/lib/chart'

type BackendStats = {
  totalGames: number
  accuracy: number
  physicsAccuracy: number
  chemistryAccuracy: number
  weeklyScores: number[]
  weakSubject: string
}

export default function Dashboard() {
  const { token } = useGameState()
  const [stats, setStats] = useState<BackendStats | null>(null)

  useEffect(() => {
    if (!token) return
    getGameStats(token).then(setStats)
  }, [token])

  if (!stats) {
    return (
      <main className="min-h-screen bg-black text-white font-mono p-10">
        Loading analytics...
      </main>
    )
  }

  /* ---------- CHART DATA ---------- */

  const lineData = {
    labels: stats.weeklyScores.map((_, i) => `Game ${i + 1}`),
    datasets: [
      {
        label: 'Score',
        data: stats.weeklyScores,
        borderWidth: 2,
        tension: 0.4
      }
    ]
  }

  const pieData = {
    labels: ['Physics', 'Chemistry'],
    datasets: [
      {
        data: [
          stats.physicsAccuracy,
          stats.chemistryAccuracy
        ],
        borderWidth: 1
      }
    ]
  }

  /* ---------- UI ---------- */

  return (
    <main className="min-h-screen bg-black text-white font-mono p-10">
      <h1 className="text-cyan-400 text-3xl mb-10">
        Student Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-10 max-w-4xl">

        {/* LINE CHART */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-cyan-400 mb-4">
            Performance Over Time
          </h2>
          <Line data={lineData} />
        </div>

        {/* PIE CHART */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-cyan-400 mb-4">
            Subject Accuracy
          </h2>
          <Pie data={pieData} />
        </div>

        {/* STATS */}
        <div className="bg-zinc-900 p-6 rounded-xl col-span-2">
          <p>Total Games Played: {stats.totalGames}</p>
          <p>Overall Accuracy: {stats.accuracy}%</p>
          <p className="text-green-400">
            Weak Area: {stats.weakSubject}
          </p>
        </div>

      </div>
    </main>
  )
}
