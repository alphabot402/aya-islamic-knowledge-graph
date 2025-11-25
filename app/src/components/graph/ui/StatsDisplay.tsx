/**
 * StatsDisplay Component
 * Shows graph statistics (surah count, hadith count, connections)
 * Extracted from QuranGraph.tsx (lines 515-520)
 */

'use client'

import { GraphNode } from '@/hooks/useGraphData'

interface StatsDisplayProps {
  nodes: GraphNode[]
}

export default function StatsDisplay({ nodes }: StatsDisplayProps) {
  const surahCount = nodes.filter(n => n.type === 'surah').length
  const hadithCount = nodes.filter(n => n.type === 'hadith').length
  const connectionCount = nodes
    .filter(n => n.type === 'hadith')
    .reduce((sum, n) => sum + (n.type === 'hadith' ? n.connections.length : 0), 0)

  return (
    <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg px-4 py-2 shadow-lg">
      <div className="text-purple-300 text-sm font-semibold">
        {surahCount} Surahs • {hadithCount} Hadiths • {connectionCount} Verified
        Connections
      </div>
    </div>
  )
}
