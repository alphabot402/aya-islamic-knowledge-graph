/**
 * QuranGraph Component - ORBITAL LAYOUT VERSION
 * "Celestial Orrery" / "Islamic Astrolabe" Visualization
 *
 * NEW LAYOUT CONCEPT:
 * - Five Pillars form concentric orbital rings
 * - Shahada surahs in vertical column at center
 * - Hadiths orbit as "moons" around their connected surahs
 * - Animated golden orbital tracks (Astrolabe aesthetic)
 * - General knowledge on separate elevated plane
 *
 * ARCHITECTURE:
 * - useGraphData.orbital: Orbital position calculations
 * - OrbitRings: Animated astrolabe tracks
 * - Scene: Enhanced with orbital rings
 */

'use client'

import { useMemo, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGraphData, Pillar } from '@/hooks/useGraphData.orbital'
import { useGraphFilters } from '@/hooks/useGraphFilters'
import { useNodeSelection } from '@/hooks/useNodeSelection'
import { CanvasErrorBoundary } from './CanvasErrorBoundary'
import Scene from './Scene'
import Header from './ui/Header'
import Legend from './ui/Legend'
import PillarFilter from './ui/PillarFilter'
import ZoomControls from './ui/ZoomControls'
import BottomInstructions from './ui/BottomInstructions'
import StatsDisplay from './ui/StatsDisplay'
import LoadingIndicator from './ui/LoadingIndicator'
import HoverTooltip from './ui/HoverTooltip'
import NodeDetailsPanel from './ui/NodeDetailsPanel'
import ErrorDisplay from './ui/ErrorDisplay'
import { PILLAR_INFO } from './nodes/SurahNode'

export default function QuranGraph() {
  // Load graph data
  const { nodes, isLoading, error, refetch } = useGraphData()

  // Apply filters (pillar filter only)
  const {
    filteredNodes,
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

  // Camera control state
  const cameraControlsRef = useRef<any>(null)

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    if (cameraControlsRef.current) {
      const controls = cameraControlsRef.current
      const zoomSpeed = 0.8
      controls.dollyIn(zoomSpeed)
      controls.update()
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (cameraControlsRef.current) {
      const controls = cameraControlsRef.current
      const zoomSpeed = 0.8
      controls.dollyOut(zoomSpeed)
      controls.update()
    }
  }, [])

  const handleResetView = useCallback(() => {
    if (cameraControlsRef.current) {
      const controls = cameraControlsRef.current
      controls.reset()
    }
  }, [])

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* 3D Canvas with Error Boundary - Optimized camera for orbital view */}
      <CanvasErrorBoundary>
        <Canvas
          camera={{
            position: [120, 90, 120],  // Optimal view - not too close, not too far
            fov: 55
          }}
          className="bg-transparent"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          {!isLoading && !error && (
            <Scene
              nodes={filteredNodes}
              onNodeSelect={handleNodeSelect}
              onNodeHover={handleNodeHover}
              cameraControlsRef={cameraControlsRef}
            />
          )}
        </Canvas>
      </CanvasErrorBoundary>

      {/* Header - Main explanation (top 25%) */}
      {!isLoading && !error && <Header />}

      {/* Legend - Color guide for Surah vs Hadith */}
      {!isLoading && !error && <Legend />}

      {/* Pillar Filter Buttons */}
      <PillarFilter
        value={pillarFilter}
        onChange={setPillarFilter}
        pillarCounts={pillarCounts}
      />

      {/* Zoom Controls - Beautiful and accessible */}
      {!isLoading && !error && (
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetView}
        />
      )}

      {/* Bottom Instructions */}
      {!isLoading && !error && <BottomInstructions />}

      {/* Loading State */}
      {isLoading && <LoadingIndicator />}

      {/* Error State */}
      {error && <ErrorDisplay error={error} onRetry={refetch} />}


      {/* Hover Tooltip */}
      {hoveredNode && !selectedNode && <HoverTooltip node={hoveredNode} />}

      {/* Node Details Panel */}
      {selectedNode && (
        <NodeDetailsPanel node={selectedNode} onClose={clearSelection} />
      )}
    </div>
  )
}
