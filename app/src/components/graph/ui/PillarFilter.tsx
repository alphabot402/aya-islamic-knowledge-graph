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
    <div className="absolute top-20 md:top-28 left-2 right-2 md:left-4 md:right-4 max-w-5xl mx-auto z-20">
      {/* Glass morphism container with enhanced glow */}
      <div className="bg-gradient-to-br from-black/90 via-black/85 to-black/90 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-3 md:p-4 shadow-2xl shadow-purple-500/20">
        <div className="flex flex-wrap gap-1.5 md:gap-2 items-center justify-center md:justify-start">
          <span className="text-[10px] md:text-xs text-gray-400 font-semibold uppercase tracking-wide mr-1 md:mr-2 hidden sm:inline">
            Filter by:
          </span>

          {/* All button */}
          <button
            onClick={() => onChange('all')}
            className={`px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              value === 'all'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/30 scale-105'
                : 'text-gray-400 hover:text-gray-200 hover:border-purple-500/30 border border-gray-600/50 hover:bg-purple-500/10'
            }`}
          >
            <span className="hidden sm:inline">All Surahs</span>
            <span className="sm:hidden">All</span>
          </button>

          {/* Pillar buttons - Enhanced with glow effects */}
          {(Object.keys(PILLAR_INFO) as Pillar[]).map(pillar => {
            const info = PILLAR_INFO[pillar]
            const count = pillarCounts[pillar] || 0
            const isSelected = value === pillar

            return (
              <button
                key={pillar}
                onClick={() => onChange(pillar)}
                className={`group px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 border ${
                  isSelected
                    ? 'border-2 shadow-lg scale-105'
                    : 'border-gray-600/50 text-gray-400 hover:text-gray-200 hover:border-opacity-70 hover:scale-105'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${info.color}30`,
                        borderColor: info.color,
                        color: info.color,
                        boxShadow: `0 0 20px ${info.color}50`
                      }
                    : {}
                }
              >
                <span className="flex items-center gap-1">
                  {/* Icon or emoji for mobile */}
                  <span className="text-xs">{info.name}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
