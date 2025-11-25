/**
 * Scene Component (OPTIMIZED)
 * Performance improvements:
 * 1. Memoized callback functions
 * 2. Stable event handlers
 * 3. Optimized node filtering
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import { GraphNode } from '@/hooks/useGraphData'
import SurahNode from './nodes/SurahNode.optimized'
import HadithNode from './nodes/HadithNode'
import ConnectionLines from './nodes/ConnectionLines.optimized'

interface SceneProps {
  nodes: GraphNode[]
  onNodeSelect: (node: GraphNode | null) => void
  onNodeHover: (node: GraphNode | null) => void
}

export default function Scene({ nodes, onNodeSelect, onNodeHover }: SceneProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  // ✅ OPTIMIZATION 1: Memoize callback functions
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

  // ✅ OPTIMIZATION 2: Memoize node-specific callbacks
  // Create stable callbacks per node to prevent unnecessary re-renders
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
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <pointLight position={[20, 20, 20]} intensity={2.5} />
      <pointLight position={[-20, -20, -20]} intensity={1.2} color="#9333ea" />
      <pointLight position={[0, 25, 0]} intensity={1.5} color="#2563eb" />
      <pointLight position={[70, 0, 0]} intensity={2.0} color="#d97706" />

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
        // ✅ OPTIMIZATION 3: Limit max polar angle to prevent gimbal lock
        maxPolarAngle={Math.PI * 0.9}
      />
    </>
  )
}
