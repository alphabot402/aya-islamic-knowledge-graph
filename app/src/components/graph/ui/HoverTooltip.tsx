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
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="bg-black/95 backdrop-blur-md border border-purple-500/50 rounded-lg p-4 max-w-sm shadow-xl">
        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
          {PILLAR_INFO[node.pillar].name}
        </div>
        <div className="text-gray-200 font-semibold text-base mb-1">
          {node.source} {node.citation}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {node.function}
        </div>
      </div>
    </div>
  )
}
