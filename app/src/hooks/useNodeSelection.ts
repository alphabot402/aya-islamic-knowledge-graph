/**
 * useNodeSelection Hook
 * Handles node selection and hover state
 * Extracted from QuranGraph.tsx (lines 321-327, 248-257)
 */

import { useState, useCallback } from 'react'
import { GraphNode } from './useGraphData.orbital'

interface UseNodeSelectionResult {
  selectedNode: GraphNode | null
  hoveredNode: GraphNode | null
  handleNodeSelect: (node: GraphNode | null) => void
  handleNodeHover: (node: GraphNode | null) => void
  clearSelection: () => void
}

/**
 * Hook to manage node selection and hover states
 */
export function useNodeSelection(): UseNodeSelectionResult {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)

  // Toggle selection (click same node to deselect)
  const handleNodeSelect = useCallback((node: GraphNode | null) => {
    if (!node) {
      setSelectedNode(null)
      return
    }

    setSelectedNode(current =>
      current?.id === node.id ? null : node
    )
  }, [])

  // Set hover state
  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node)
  }, [])

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedNode(null)
    setHoveredNode(null)
  }, [])

  return {
    selectedNode,
    hoveredNode,
    handleNodeSelect,
    handleNodeHover,
    clearSelection
  }
}
