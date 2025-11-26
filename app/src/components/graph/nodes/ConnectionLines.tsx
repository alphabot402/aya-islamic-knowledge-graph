/**
 * ConnectionLines Component
 * Temporarily disabled - no connections in current dataset
 */

'use client'

import { GraphNode } from '@/hooks/useGraphData.orbital'

interface ConnectionLinesProps {
  nodes: GraphNode[]
  hoveredNodeId: string | null
  selectedNodeId: string | null
}

export default function ConnectionLines({ nodes, hoveredNodeId, selectedNodeId }: ConnectionLinesProps) {
  // No connections in current dataset - return empty component
  return null
}
