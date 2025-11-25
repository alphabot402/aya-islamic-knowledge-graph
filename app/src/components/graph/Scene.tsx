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
}

export default function Scene({ nodes, onNodeSelect, onNodeHover }: SceneProps) {
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
      {/* Lighting - Enhanced for metallic orbital rings */}
      <ambientLight intensity={0.6} />
      <pointLight position={[20, 20, 20]} intensity={2.5} />
      <pointLight position={[-20, -20, -20]} intensity={1.2} color="#9333ea" />
      <pointLight position={[0, 25, 0]} intensity={1.5} color="#2563eb" />
      <pointLight position={[70, 0, 0]} intensity={2.0} color="#d97706" />

      {/* Additional lighting for golden orbital tracks */}
      <pointLight position={[0, 50, 0]} intensity={1.0} color="#fbbf24" />
      <pointLight position={[0, -30, 0]} intensity={0.8} color="#14b8a6" />

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

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={20}
        maxDistance={180}
        maxPolarAngle={Math.PI * 0.9} // ✅ Prevent gimbal lock
      />
    </>
  )
}
