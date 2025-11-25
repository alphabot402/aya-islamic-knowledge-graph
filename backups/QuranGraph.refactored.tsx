/**
 * QuranGraph Component (Refactored)
 * Main 3D graph visualization component - now composing smaller components
 *
 * REFACTORING RESULTS:
 * Before: 625 lines with 9 responsibilities
 * After: ~90 lines that compose focused components
 *
 * Components extracted:
 * - Custom Hooks: useGraphData, useGraphFilters, useNodeSelection
 * - Scene: Main 3D scene with nodes and connections
 * - Node Components: SurahNode, HadithNode, ConnectionLines
 * - UI Components: SearchBar, PillarFilter, StatsDisplay, LoadingIndicator,
 *                  HoverTooltip, NodeDetailsPanel, ErrorDisplay
 */

'use client'

import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGraphData } from '@/hooks/useGraphData'
import { useGraphFilters } from '@/hooks/useGraphFilters'
import { useNodeSelection } from '@/hooks/useNodeSelection'
import Scene from './Scene'
import SearchBar from './ui/SearchBar'
import PillarFilter from './ui/PillarFilter'
import StatsDisplay from './ui/StatsDisplay'
import LoadingIndicator from './ui/LoadingIndicator'
import HoverTooltip from './ui/HoverTooltip'
import NodeDetailsPanel from './ui/NodeDetailsPanel'
import ErrorDisplay from './ui/ErrorDisplay'
import { Pillar, PILLAR_INFO } from './nodes/SurahNode'

export default function QuranGraph() {
  // Load graph data
  const { nodes, isLoading, error, refetch } = useGraphData()

  // Apply filters (search and pillar filter)
  const {
    filteredNodes,
    searchQuery,
    setSearchQuery,
    pillarFilter,
    setPillarFilter
  } = useGraphFilters(nodes)

  // Handle node selection and hover
  const {
    selectedNode,
    hoveredNode,
    handleNodeSelect,
    handleNodeHover,
    clearSelection
  } = useNodeSelection()

  // Calculate pillar counts for filter buttons
  const pillarCounts = useMemo(() => {
    return Object.keys(PILLAR_INFO).reduce((acc, pillar) => {
      acc[pillar as Pillar] = nodes.filter(
        n => n.type === 'surah' && n.pillar === pillar
      ).length
      return acc
    }, {} as Record<Pillar, number>)
  }, [nodes])

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [70, 60, 70], fov: 60 }} className="bg-transparent">
        {!isLoading && !error && (
          <Scene
            nodes={filteredNodes}
            onNodeSelect={handleNodeSelect}
            onNodeHover={handleNodeHover}
          />
        )}
      </Canvas>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search surahs or hadiths..."
      />

      {/* Pillar Filter Buttons */}
      <PillarFilter
        value={pillarFilter}
        onChange={setPillarFilter}
        pillarCounts={pillarCounts}
      />

      {/* Loading State */}
      {isLoading && <LoadingIndicator />}

      {/* Error State */}
      {error && <ErrorDisplay error={error} onRetry={refetch} />}

      {/* Stats Display */}
      {!isLoading && !error && <StatsDisplay nodes={nodes} />}

      {/* Hover Tooltip */}
      {hoveredNode && !selectedNode && <HoverTooltip node={hoveredNode} />}

      {/* Node Details Panel */}
      {selectedNode && (
        <NodeDetailsPanel node={selectedNode} onClose={clearSelection} />
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-lg px-4 py-2">
        <div className="text-purple-400 text-xs text-center uppercase tracking-wide">
          Drag to Rotate • Scroll to Zoom • Click for Details
        </div>
      </div>
    </div>
  )
}
