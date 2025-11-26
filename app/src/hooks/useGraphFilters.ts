/**
 * useGraphFilters Hook
 * Handles search and filtering logic for graph nodes
 * Extracted from QuranGraph.tsx (lines 414-442)
 */

import { useState, useEffect, useMemo } from 'react'
import { GraphNode, Pillar } from './useGraphData.orbital'

interface UseGraphFiltersResult {
  filteredNodes: GraphNode[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  pillarFilter: Pillar | 'all'
  setPillarFilter: (pillar: Pillar | 'all') => void
}

/**
 * Hook to manage graph filtering and search
 * Uses memoization to prevent unnecessary recalculations
 */
export function useGraphFilters(allNodes: GraphNode[]): UseGraphFiltersResult {
  const [searchQuery, setSearchQuery] = useState('')
  const [pillarFilter, setPillarFilter] = useState<Pillar | 'all'>('all')

  // Memoize filtered results to avoid recalculation on every render
  const filteredNodes = useMemo(() => {
    let filtered = allNodes

    // Apply pillar filter
    if (pillarFilter !== 'all') {
      filtered = filtered.filter(node => {
        if (node.type === 'primary') {
          return node.pillar === pillarFilter
        }
        // Always show hadiths (they connect across pillars)
        return node.type === 'secondary'
      })
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()

      filtered = filtered.filter(node => {
        if (node.type === 'primary') {
          return (
            node.surahNumber.toString().includes(query) ||
            node.name.toLowerCase().includes(query) ||
            node.englishName.toLowerCase().includes(query)
          )
        }

        if (node.type === 'secondary') {
          return (
            node.hadith.english.text.toLowerCase().includes(query) ||
            node.id.includes(query)
          )
        }

        return false
      })
    }

    return filtered
  }, [allNodes, searchQuery, pillarFilter])

  return {
    filteredNodes,
    searchQuery,
    setSearchQuery,
    pillarFilter,
    setPillarFilter
  }
}
