/**
 * Scene Component - ORBITAL LAYOUT VERSION
 * Main 3D scene with "Celestial Orrery" visualization
 * Includes animated orbital rings for the Five Pillars
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import { GraphNode, Pillar } from '@/hooks/useGraphData.orbital'
import SurahNode from './nodes/SurahNode'
import HadithNode from './nodes/HadithNode'
import ConnectionLines from './nodes/ConnectionLines'
import OrbitRings from './OrbitRings'

interface SceneProps {
  nodes: GraphNode[]
  onNodeSelect: (node: GraphNode | null) => void
  onNodeHover: (node: GraphNode | null) => void
  pillarFilter: Pillar | 'all'
  cameraControlsRef?: React.MutableRefObject<any>
}

export default function Scene({ nodes, onNodeSelect, onNodeHover, pillarFilter, cameraControlsRef }: SceneProps) {
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
      {/* Night Sky Lighting - Clean and Clear */}

      {/* Base ambient - soft white */}
      <ambientLight intensity={0.6} color="#e0e7ff" />

      {/* Key lights - Bright and clear */}
      <pointLight position={[40, 50, 40]} intensity={4.0} color="#ffffff" castShadow />
      <pointLight position={[-40, -30, -40]} intensity={2.0} color="#dbeafe" />

      {/* Accent lights - Subtle blues instead of purple */}
      <pointLight position={[0, 60, 0]} intensity={2.5} color="#93c5fd" />
      <pointLight position={[80, 15, 0]} intensity={3.0} color="#fbbf24" />
      <pointLight position={[-80, 15, 0]} intensity={2.5} color="#5eead4" />

      {/* Rim lighting - Adds clarity */}
      <pointLight position={[0, -50, 0]} intensity={1.8} color="#67e8f9" />
      <pointLight position={[0, 0, 80]} intensity={2.2} color="#bfdbfe" />
      <pointLight position={[0, 0, -80]} intensity={2.0} color="#dbeafe" />

      {/* Spot light for center focus */}
      <spotLight
        position={[60, 60, 60]}
        intensity={3.0}
        angle={0.5}
        penumbra={0.4}
        color="#f0f9ff"
        castShadow
      />

      {/* Hemisphere light - Night sky effect */}
      <hemisphereLight
        color="#60a5fa"
        groundColor="#0f172a"
        intensity={1.0}
      />

      {/* Orbital Rings - Filtered by pillar */}
      <OrbitRings pillarFilter={pillarFilter} />

      {/* Nodes with stable callbacks - Clean planetary view */}
      {nodes.map(node => {
        const callbacks = nodeCallbacks.get(node.id)!

        return node.type === 'primary' ? (
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
