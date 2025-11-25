/**
 * Scene Component
 * Main 3D scene that renders all nodes and connections
 * Extracted from QuranGraph.tsx (lines 236-318)
 */

'use client'

import { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { GraphNode } from '@/hooks/useGraphData'
import SurahNode from './nodes/SurahNode'
import HadithNode from './nodes/HadithNode'
import ConnectionLines from './nodes/ConnectionLines'

interface SceneProps {
  nodes: GraphNode[]
  onNodeSelect: (node: GraphNode | null) => void
  onNodeHover: (node: GraphNode | null) => void
}

export default function Scene({ nodes, onNodeSelect, onNodeHover }: SceneProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const handleSelect = (node: GraphNode) => {
    const newSelection = node.id === selectedNodeId ? null : node.id
    setSelectedNodeId(newSelection)
    onNodeSelect(newSelection ? node : null)
  }

  const handleHover = (node: GraphNode | null, hover: boolean) => {
    setHoveredNodeId(hover && node ? node.id : null)
    onNodeHover(hover ? node : null)
  }

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

      {/* Nodes */}
      {nodes.map(node =>
        node.type === 'surah' ? (
          <SurahNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            isHovered={hoveredNodeId === node.id}
            onSelect={() => handleSelect(node)}
            onHover={hover => handleHover(node, hover)}
          />
        ) : (
          <HadithNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            isHovered={hoveredNodeId === node.id}
            onSelect={() => handleSelect(node)}
            onHover={hover => handleHover(node, hover)}
          />
        )
      )}

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={20}
        maxDistance={180}
      />
    </>
  )
}
