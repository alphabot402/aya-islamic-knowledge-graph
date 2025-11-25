/**
 * Scene Component - ORBITAL LAYOUT VERSION
 * Main 3D scene with "Celestial Orrery" visualization
 * Includes animated orbital rings for the Five Pillars
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import { GraphNode } from '@/hooks/useGraphData'
import SurahNode from './nodes/SurahNode'
import HadithNode from './nodes/HadithNode'
import ConnectionLines from './nodes/ConnectionLines'
import OrbitRings from './OrbitRings'

interface SceneProps {
  nodes: GraphNode[]
  onNodeSelect: (node: GraphNode | null) => void
  onNodeHover: (node: GraphNode | null) => void
  cameraControlsRef?: React.MutableRefObject<any>
}

export default function Scene({ nodes, onNodeSelect, onNodeHover, cameraControlsRef }: SceneProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  // ✅ OPTIMIZATION: Memoize callback functions for stable references
  const handleSelect = useCallback(
    (node: GraphNode) => {
      const newSelection = node.id === selectedNodeId ? null : node.id
      setSelectedNodeId(newSelection)
      onNodeSelect(newSelection ? node : null)
    },
    [selectedNodeId, onNodeSelect]
  )

  const handleHover = useCallback(
    (node: GraphNode | null, hover: boolean) => {
      setHoveredNodeId(hover && node ? node.id : null)
      onNodeHover(hover ? node : null)
    },
    [onNodeHover]
  )

  // ✅ OPTIMIZATION: Memoize node-specific callbacks to prevent re-creating on every render
  const nodeCallbacks = useMemo(() => {
    const callbacks = new Map<string, {
      onSelect: () => void
      onHover: (hover: boolean) => void
    }>()

    nodes.forEach(node => {
      callbacks.set(node.id, {
        onSelect: () => handleSelect(node),
        onHover: (hover: boolean) => handleHover(node, hover)
      })
    })

    return callbacks
  }, [nodes, handleSelect, handleHover])

  return (
    <>
      {/* Enhanced Lighting System - Dramatic and Beautiful */}

      {/* Base ambient - subtle purple tint */}
      <ambientLight intensity={0.4} color="#d8b4fe" />

      {/* Key lights - Multiple sources for depth */}
      <pointLight position={[30, 30, 30]} intensity={3.0} color="#ffffff" castShadow />
      <pointLight position={[-30, -30, -30]} intensity={1.5} color="#9333ea" />

      {/* Accent lights for pillars - Creates drama */}
      <pointLight position={[0, 40, 0]} intensity={2.0} color="#a855f7" />
      <pointLight position={[70, 10, 0]} intensity={2.5} color="#f59e0b" />
      <pointLight position={[-70, 10, 0]} intensity={2.0} color="#14b8a6" />

      {/* Rim lighting - Adds dimensionality */}
      <pointLight position={[0, -40, 0]} intensity={1.2} color="#1ac7b1" />
      <pointLight position={[0, 0, 60]} intensity={1.8} color="#d8b4fe" />
      <pointLight position={[0, 0, -60]} intensity={1.5} color="#9333ea" />

      {/* Spot lights for focused drama */}
      <spotLight
        position={[50, 50, 50]}
        intensity={2.0}
        angle={0.6}
        penumbra={0.5}
        color="#fbbf24"
        castShadow
      />

      {/* Hemisphere light for realistic sky/ground lighting */}
      <hemisphereLight
        color="#a855f7"
        groundColor="#0a0e1a"
        intensity={0.8}
      />

      {/* Orbital Rings - The Astrolabe tracks */}
      <OrbitRings />

      {/* Connection lines */}
      <ConnectionLines nodes={nodes} />

      {/* Nodes with stable callbacks */}
      {nodes.map(node => {
        const callbacks = nodeCallbacks.get(node.id)!

        return node.type === 'surah' ? (
          <SurahNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            isHovered={hoveredNodeId === node.id}
            onSelect={callbacks.onSelect}
            onHover={callbacks.onHover}
          />
        ) : (
          <HadithNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            isHovered={hoveredNodeId === node.id}
            onSelect={callbacks.onSelect}
            onHover={callbacks.onHover}
          />
        )
      })}

      {/* Camera controls - Smooth and responsive */}
      <OrbitControls
        ref={cameraControlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={20}
        maxDistance={200}
        maxPolarAngle={Math.PI * 0.9} // Prevent gimbal lock
        zoomSpeed={1.2}
        rotateSpeed={0.8}
        panSpeed={0.8}
        enablePan={true}
        makeDefault
      />
    </>
  )
}
