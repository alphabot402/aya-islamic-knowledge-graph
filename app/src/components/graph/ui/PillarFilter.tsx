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
    <div className="absolute top-52 left-4 right-4 max-w-5xl mx-auto bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg p-4 shadow-lg">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mr-2">
          Filter by:
        </span>
        {/* All button */}
        <button
          onClick={() => onChange('all')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 ${
            value === 'all'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:border-purple-500/30 border border-gray-600'
          }`}
        >
          All Surahs
        </button>

        {/* Pillar buttons */}
        {(Object.keys(PILLAR_INFO) as Pillar[]).map(pillar => {
          const info = PILLAR_INFO[pillar]
          const count = pillarCounts[pillar] || 0

          return (
            <button
              key={pillar}
              onClick={() => onChange(pillar)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 border ${
                value === pillar
                  ? 'border-2 shadow-lg'
                  : 'border-gray-600 text-gray-400 hover:text-gray-200 hover:border-opacity-50'
              }`}
              style={
                value === pillar
                  ? {
                      backgroundColor: `${info.color}30`,
                      borderColor: info.color,
                      color: info.color
                    }
                  : {}
              }
            >
              {info.name}{' '}
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
