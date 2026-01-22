'use client'

import { useEffect, useState } from 'react'
import Roadmap from '@/components/Roadmap'
import MCQModal from '@/components/MCQModal'
import ChemistryMatch from '@/components/ChemistryMatch'
import MainMenu from '@/components/MainMenu'
import PauseMenu from '@/components/PauseMenu'
import { useGameState } from '@/lib/gameState'
import { getQuestions, saveGameSession } from '@/lib/api'

export default function Home() {
  const [game, setGame] = useState<any>(null)
  const [mcq, setMcq] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [showChem, setShowChem] = useState(false)

  const {
    started,
    currentLevel,
    paused,
    pause,
    resume,
    token,
    stats,
    recordMCQ,
    resetStats
  } = useGameState()

  /* ---------------- INIT GAME ---------------- */

  useEffect(() => {
    if (started && currentLevel && !game) {
      import('@/game/main').then((mod) => {
        setGame(mod.startGame())
      })
    }
  }, [started, currentLevel, game])

  /* ---------------- FETCH QUESTIONS ---------------- */

  useEffect(() => {
    if (!token) return

    getQuestions(token)
      .then(setQuestions)
      .catch(() => {
        // fallback safety (demo safe)
        setQuestions([])
      })
  }, [token])

  /* ---------------- EVENTS ---------------- */

  useEffect(() => {
    const handlePauseEvent = () => pause()

    const handleShowMCQ = () => {
      if (questions.length === 0) return
      const q = questions[Math.floor(Math.random() * questions.length)]
      setMcq(q)
    }

    const handleChapterComplete = async () => {
      // Save game session
      if (token) {
        await saveGameSession(token, {
          score: stats.mcqCorrect * 10,
          physicsCorrect: stats.physicsCorrect,
          chemistryCorrect: stats.chemistryCorrect,
          totalQuestions: stats.mcqTotal,
          timeSpent: stats.timeSpent
        })
      }

      resetStats()
      setGame(null)
      globalThis.location.href = '/dashboard'
    }

    globalThis.addEventListener('PAUSE_GAME', handlePauseEvent)
    globalThis.addEventListener('SHOW_MCQ', handleShowMCQ)
    globalThis.addEventListener('CHAPTER_COMPLETE', handleChapterComplete)

    return () => {
      globalThis.removeEventListener('PAUSE_GAME', handlePauseEvent)
      globalThis.removeEventListener('SHOW_MCQ', handleShowMCQ)
      globalThis.removeEventListener('CHAPTER_COMPLETE', handleChapterComplete)

      if (game) {
        game.destroy(true)
        setGame(null)
      }
    }
  }, [pause, questions, token, stats, game, resetStats])

  /* ---------------- MCQ HANDLING ---------------- */

  function handleAnswer(correct: boolean) {
    if (mcq?.subject) {
      recordMCQ(correct, mcq.subject)
    }

    setMcq(null)

    // 50% chance chemistry bonus
    if (Math.random() > 0.5) {
      setShowChem(true)
    } else {
      globalThis.dispatchEvent(
        new CustomEvent('MCQ_RESULT', { detail: correct })
      )
      resume()
    }
  }

  function handleChemWin() {
    setShowChem(false)
    recordMCQ(true, 'CHEMISTRY')

    globalThis.dispatchEvent(
      new CustomEvent('MCQ_RESULT', { detail: true })
    )
    resume()
  }

  /* ---------------- UI ---------------- */

  return (
    <>
      {!started && <MainMenu />}

      {started && !currentLevel && <Roadmap />}

      {started && currentLevel && (
        <main className="w-screen h-screen bg-black overflow-hidden relative">
          <div id="game-container" className="w-full h-full" />

          {paused && <PauseMenu onResume={resume} />}

          {mcq && (
            <MCQModal
              question={mcq}
              onAnswer={handleAnswer}
            />
          )}

          {showChem && <ChemistryMatch onWin={handleChemWin} />}
        </main>
      )}
    </>
  )
}
