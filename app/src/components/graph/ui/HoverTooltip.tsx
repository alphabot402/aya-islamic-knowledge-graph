/**
 * HoverTooltip Component
 * Displays quick preview when hovering over nodes
 * Extracted from QuranGraph.tsx (lines 522-542)
 */

'use client'

import { GraphNode } from '@/hooks/useGraphData.orbital'
import { PILLAR_INFO } from '../nodes/SurahNode'
import { getSurahName } from '@/lib/surah-names'

interface HoverTooltipProps {
  node: GraphNode
}

export default function HoverTooltip({ node }: HoverTooltipProps) {
  // Determine if this is a Quran or Hadith node
  const isQuran = node.source === 'Quran'
  const nodeTypeLabel = isQuran ? 'Quran Verse' : 'Hadith'

  // Format the display text
  const displayText = isQuran
    ? `${node.source} ${node.citation}`  // "Quran 2:255"
    : `${node.source} ${node.citation}`  // "Sahih Bukhari 123"

  // Get pillar-specific color
  const pillarInfo = PILLAR_INFO[node.pillar]
  const borderColor = isQuran ? pillarInfo.quranColor : pillarInfo.hadithColor

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div
        className="bg-black/95 backdrop-blur-md border-2 rounded-lg p-4 max-w-sm shadow-xl"
        style={{ borderColor }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            {PILLAR_INFO[node.pillar].name}
          </div>
          <div
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{
              backgroundColor: `${borderColor}20`,
              color: borderColor
            }}
          >
            {nodeTypeLabel}
          </div>
        </div>
        <div className="text-white font-bold text-base mb-2">
          {displayText}
        </div>
        <div className="text-xs text-gray-400 leading-relaxed">
          {node.function}
        </div>
      </div>
    </div>
  )
}
