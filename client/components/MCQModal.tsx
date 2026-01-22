'use client'

type Question = {
  id: number
  subject: 'PHYSICS' | 'CHEMISTRY'
  question: string
  optionA: string
  optionB: string
  optionC: string
  correct: 'A' | 'B' | 'C'
}

type Props = {
  question: Question
  onAnswer: (isCorrect: boolean) => void
}

export default function MCQModal({ question, onAnswer }: Props) {
  if (!question) return null

  function handleAnswer(option: 'A' | 'B' | 'C') {
    onAnswer(option === question.correct)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white p-6 rounded-xl w-[420px] border border-cyan-500/40">
        <h2 className="text-cyan-400 font-bold mb-4">
          {question.question}
        </h2>

        <button
          onClick={() => handleAnswer('A')}
          className="w-full text-left bg-zinc-700 hover:bg-cyan-600 p-3 mb-2 rounded"
        >
          {question.optionA}
        </button>

        <button
          onClick={() => handleAnswer('B')}
          className="w-full text-left bg-zinc-700 hover:bg-cyan-600 p-3 mb-2 rounded"
        >
          {question.optionB}
        </button>

        <button
          onClick={() => handleAnswer('C')}
          className="w-full text-left bg-zinc-700 hover:bg-cyan-600 p-3 rounded"
        >
          {question.optionC}
        </button>
      </div>
    </div>
  )
}
