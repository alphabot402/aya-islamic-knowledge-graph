/**
 * PillarFilter Component
 * Filter buttons for Five Pillars of Islam
 * Extracted from QuranGraph.tsx (lines 475-508)
 */

'use client'

import { Pillar } from '@/hooks/useGraphData'
import { PILLAR_INFO } from '../nodes/SurahNode'

interface PillarFilterProps {
  value: Pillar | 'all'
  onChange: (pillar: Pillar | 'all') => void
  pillarCounts: Record<Pillar, number>
}

export default function PillarFilter({
  value,
  onChange,
  pillarCounts
}: PillarFilterProps) {
  return (
    <div className="fixed bottom-4 left-4 z-30 max-w-md">
      {/* Compact glass container - bottom left */}
      <div className="bg-black/70 backdrop-blur-xl border border-blue-300/20 rounded-xl p-2 shadow-2xl shadow-blue-500/10">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-blue-300/70 font-semibold uppercase tracking-wide mr-1 hidden lg:inline">
            Filter:
          </span>

          {/* All button */}
          <button
            onClick={() => onChange('all')}
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              value === 'all'
                ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50 shadow-[0_0_10px_rgba(96,165,250,0.3)]'
                : 'text-blue-300/70 hover:text-blue-200 hover:border-blue-400/30 border border-blue-400/20 hover:bg-blue-500/10'
            }`}
          >
            <span className="hidden md:inline">All</span>
            <span className="md:hidden">All</span>
          </button>

          {/* Pillar buttons - Compact */}
          {(Object.keys(PILLAR_INFO) as Pillar[]).map(pillar => {
            const info = PILLAR_INFO[pillar]
            const count = pillarCounts[pillar] || 0
            const isSelected = value === pillar

            return (
              <button
                key={pillar}
                onClick={() => onChange(pillar)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  isSelected
                    ? 'shadow-lg'
                    : 'text-blue-300/70 hover:text-blue-200 border-blue-400/20 hover:border-blue-400/40'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${info.color}20`,
                        borderColor: info.color,
                        color: info.color,
                        boxShadow: `0 0 15px ${info.color}40`
                      }
                    : {}
                }
              >
                <span className="hidden md:inline">{info.name}</span>
                <span className="md:hidden">{info.name.slice(0, 3)}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
