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

import { useMemo, useRef, useCallback, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGraphData, Pillar } from '@/hooks/useGraphData.orbital'
import { useGraphFilters } from '@/hooks/useGraphFilters'
import { useNodeSelection } from '@/hooks/useNodeSelection'
import { CanvasErrorBoundary } from './CanvasErrorBoundary'
import Scene from './Scene'
import Header from './ui/Header'
import PillarFilter from './ui/PillarFilter'
import ZoomControls from './ui/ZoomControls'
import StatsDisplay from './ui/StatsDisplay'
import LoadingIndicator from './ui/LoadingIndicator'
import HoverTooltip from './ui/HoverTooltip'
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

  // Handle node hover (selection removed - now opens URLs directly)
  const {
    hoveredNode,
    handleNodeHover
  } = useNodeSelection()

  // Handle node click - open source URL directly in new tab
  const handleNodeClick = useCallback((node: any) => {
    if (node.apiLink) {
      window.open(node.apiLink, '_blank', 'noopener,noreferrer')
    }
  }, [])

  // Calculate pillar counts for filter buttons
  const pillarCounts = useMemo(() => {
    return Object.keys(PILLAR_INFO).reduce((acc, pillar) => {
      acc[pillar as Pillar] = nodes.filter(
        n => n.pillar === pillar
      ).length
      return acc
    }, {} as Record<Pillar, number>)
  }, [nodes])

  // Responsive camera position - optimized for node alignment visibility
  const [cameraPosition] = useState<[number, number, number]>(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768
      // Mobile: Moderate angle (0, 350, 500)
      // Desktop: More top-down view (0, 600, 400) - reduced Z to minimize perspective distortion
      return isMobile ? [0, 350, 500] : [0, 600, 400]
    }
    return [0, 600, 400] // Default for SSR
  })

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
    <div className="w-full h-[100dvh] relative overflow-hidden" style={{ touchAction: 'none' }}>
      {/* 3D Canvas with Error Boundary - Optimized camera for orbital view */}
      <CanvasErrorBoundary>
        <Canvas
          camera={{
            position: cameraPosition,  // Responsive: flat on mobile, subtle tilt on desktop
            fov: 55
          }}
          className="bg-transparent"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
          }}
        >
          {!isLoading && !error && (
            <Scene
              nodes={filteredNodes}
              onNodeSelect={handleNodeClick}
              onNodeHover={handleNodeHover}
              pillarFilter={pillarFilter}
              cameraControlsRef={cameraControlsRef}
            />
          )}
        </Canvas>
      </CanvasErrorBoundary>

      {/* Header - Main explanation (compact) */}
      {!isLoading && !error && <Header />}

      {/* Pillar Filter Sidebar - serves as color-coded legend */}
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

      {/* Loading State */}
      {isLoading && <LoadingIndicator />}

      {/* Error State */}
      {error && <ErrorDisplay error={error} onRetry={refetch} />}


      {/* Hover Tooltip - Shows on hover, click opens source URL directly */}
      {hoveredNode && <HoverTooltip node={hoveredNode} />}
    </div>
  )
}
