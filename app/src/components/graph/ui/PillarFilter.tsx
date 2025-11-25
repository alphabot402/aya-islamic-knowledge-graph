/**
 * PillarFilter Component
 * Filter buttons for Five Pillars of Islam
 * Extracted from QuranGraph.tsx (lines 475-508)
 */

'use client'

import { Pillar } from '@/hooks/useGraphData.orbital'
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
    <div className="fixed bottom-2 left-2 z-30">
      {/* Vertical stack - bottom left - compact */}
      <div className="bg-black/60 backdrop-blur-lg border border-blue-300/20 rounded-lg p-1.5 shadow-lg">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] text-blue-300/60 font-semibold uppercase tracking-wide text-center mb-0.5">
            Filter
          </span>

          {/* All button */}
          <button
            onClick={() => onChange('all')}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all duration-200 w-full ${
              value === 'all'
                ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50 shadow-[0_0_8px_rgba(96,165,250,0.3)]'
                : 'text-blue-300/70 hover:text-blue-200 hover:border-blue-400/30 border border-blue-400/20 hover:bg-blue-500/10'
            }`}
          >
            All
          </button>

          {/* Pillar buttons - Vertical stack - compact */}
          {(Object.keys(PILLAR_INFO) as Pillar[]).map(pillar => {
            const info = PILLAR_INFO[pillar]
            const isSelected = value === pillar

            return (
              <button
                key={pillar}
                onClick={() => onChange(pillar)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-all duration-200 border w-full text-left ${
                  isSelected
                    ? 'shadow-md'
                    : 'text-blue-300/70 hover:text-blue-200 border-blue-400/20 hover:border-blue-400/40'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${info.color}20`,
                        borderColor: info.color,
                        color: info.color,
                        boxShadow: `0 0 12px ${info.color}40`
                      }
                    : {}
                }
              >
                {info.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
