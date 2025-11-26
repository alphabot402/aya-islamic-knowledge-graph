/**
 * StatsDisplay Component
 * Shows graph statistics (surah count, hadith count, connections)
 * Extracted from QuranGraph.tsx (lines 515-520)
 */

'use client'

import { GraphNode } from '@/hooks/useGraphData.orbital'

interface StatsDisplayProps {
  nodes: GraphNode[]
}

export default function StatsDisplay({ nodes }: StatsDisplayProps) {
  const primaryCount = nodes.filter(n => n.type === 'primary').length
  const secondaryCount = nodes.filter(n => n.type === 'secondary').length

  return (
    <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg px-4 py-2 shadow-lg">
      <div className="text-purple-300 text-sm font-semibold">
        {primaryCount + secondaryCount} References
      </div>
      <div className="text-xs text-gray-400">
        {primaryCount} Quran • {secondaryCount} Hadith
      </div>
    </div>
  )
}
