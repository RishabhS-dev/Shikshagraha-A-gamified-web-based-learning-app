'use client'
import { useState } from 'react'

const PAIRS = [
  { r: 'HCl + NaOH', p: 'NaCl + H₂O' },
  { r: 'CaCO₃', p: 'CaO + CO₂' },
  { r: 'Zn + HCl', p: 'ZnCl₂ + H₂' }
]

export default function ChemistryMatch({ onWin }: { onWin: () => void }) {
  const [selectedR, setSelectedR] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const products = [...PAIRS.map(p => p.p)].sort(() => Math.random() - 0.5)

  function selectProduct(p: string) {
    if (!selectedR) return

    const correct = PAIRS.find(x => x.r === selectedR)?.p === p

    if (correct) {
      setMatched([...matched, selectedR])
      setSelectedR(null)

      if (matched.length + 1 === PAIRS.length) {
        setTimeout(onWin, 600)
      }
    } else {
      alert('❌ Wrong match. Try again.')
      setSelectedR(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center font-mono">
      <div className="bg-zinc-900 p-6 rounded-xl w-[600px]">
        <h2 className="text-cyan-400 text-xl mb-4">Chemistry Match</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Reactants */}
          <div>
            <h3 className="text-green-400 mb-2">Reactants</h3>
            {PAIRS.map(({ r }) => (
              <button
                key={r}
                disabled={matched.includes(r)}
                onClick={() => setSelectedR(r)}
                className={`block w-full mb-2 p-2 rounded
                  ${selectedR === r ? 'bg-cyan-600' : 'bg-zinc-700'}
                  ${matched.includes(r) ? 'opacity-40' : ''}
                `}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Products */}
          <div>
            <h3 className="text-green-400 mb-2">Products</h3>
            {products.map(p => (
              <button
                key={p}
                onClick={() => selectProduct(p)}
                className="block w-full mb-2 p-2 bg-zinc-700 rounded hover:bg-cyan-600"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-zinc-400">
          Select a reactant, then its correct product
        </p>
      </div>
    </div>
  )
}
