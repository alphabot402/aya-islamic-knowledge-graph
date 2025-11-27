/**
 * PillarFilter Component
 * Filter buttons for Five Pillars of Islam
 * MOBILE OPTIMIZED: Ultra-compact, always visible legend
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
    <div className="fixed bottom-2 md:bottom-4 left-2 md:left-4 z-30">
      {/* Vertical sidebar - Slightly wider to fit "Shahada" without wrapping */}
      <div className="bg-black/90 md:bg-black/70 backdrop-blur-xl border border-white/20 md:border-blue-300/30 rounded-md md:rounded-xl p-2 md:p-3 shadow-2xl w-[100px] md:w-auto">
        <div className="flex flex-col gap-1 md:gap-2">
          <span className="text-[9px] md:text-[10px] text-blue-200 font-semibold uppercase tracking-wide text-center mb-1 md:mb-1">
            Legend
          </span>

          {/* All button - ultra compact on mobile */}
          <button
            onClick={() => onChange('all')}
            className={`px-2 md:px-3 py-1 md:py-2 rounded md:rounded-lg text-[10px] md:text-xs font-medium transition-all duration-200 w-full flex items-center gap-1 md:gap-2 ${
              value === 'all'
                ? 'bg-gray-500/30 text-white border border-gray-400/60 shadow-[0_0_12px_rgba(156,163,175,0.4)]'
                : 'text-gray-300/80 hover:text-white hover:border-gray-400/40 border border-gray-400/20 hover:bg-gray-500/20'
            }`}
          >
            <span className="flex items-center gap-0.5 md:gap-1">
              <span className="w-[7px] md:w-2 h-[7px] md:h-2 rounded-full bg-gray-400"></span>
              <span className="w-[7px] md:w-2 h-[7px] md:h-2 rounded-full bg-gray-400"></span>
            </span>
            <span className="text-[10px] md:text-xs">All</span>
          </button>

          {/* Pillar buttons with two-tone color circles - ultra compact on mobile */}
          {(Object.keys(PILLAR_INFO) as Pillar[])
            .filter(pillar => pillar !== 'general')
            .map(pillar => {
              const info = PILLAR_INFO[pillar]
              const isSelected = value === pillar

              return (
                <button
                  key={pillar}
                  onClick={() => onChange(pillar)}
                  className={`px-2 md:px-3 py-1 md:py-2 rounded md:rounded-lg text-[10px] md:text-xs font-medium transition-all duration-200 border w-full flex items-center gap-1 md:gap-2 ${
                    isSelected
                      ? 'bg-white/10 shadow-lg'
                      : 'text-white/70 hover:text-white border-white/20 hover:border-white/40 hover:bg-white/5'
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: info.quranColor,
                          boxShadow: `0 0 16px ${info.quranColor}50`
                        }
                      : {}
                  }
                >
                  {/* Two-tone color circles - 7px on mobile, larger on desktop */}
                  <span className="flex items-center gap-0.5 md:gap-1 shrink-0">
                    {/* Left circle: Bold Quran color */}
                    <span
                      className="w-[7px] md:w-3 h-[7px] md:h-3 rounded-full"
                      style={{ backgroundColor: info.quranColor }}
                    ></span>
                    {/* Right circle: Light Hadith color */}
                    <span
                      className="w-[7px] md:w-3 h-[7px] md:h-3 rounded-full"
                      style={{ backgroundColor: info.hadithColor }}
                    ></span>
                  </span>
                  {/* Pillar name - ultra compact on mobile, prevent wrapping */}
                  <span className={`text-[10px] md:text-xs whitespace-nowrap ${isSelected ? 'text-white' : ''}`}>
                    {info.name}
                  </span>
                </button>
              )
            })}
        </div>
      </div>
    </div>
  )
}
