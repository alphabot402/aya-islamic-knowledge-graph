/**
 * OrrerySystem - CLEAN SLATE VERSION
 *
 * Orbital ring system ready for new 100-item dataset
 * Visual structure preserved, data references removed
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { useGraphData, type GraphNode } from '@/hooks/useGraphData.orbital'
import { useCosmicStore } from '@/lib/stores/useCosmicStore'
import OrbitRings from '@/components/graph/OrbitRings'
import { Sphere } from '@react-three/drei'

// Generic Node Component for rendering any node type
function GenericNode({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover
}: {
  node: GraphNode
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (hover: boolean) => void
}) {
  const scale = isHovered ? 1.3 : isSelected ? 1.2 : 1.0

  return (
    <group position={node.position}>
      <Sphere
        args={[0.5, 16, 16]}
        scale={scale}
        onClick={onSelect}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <meshStandardMaterial
          color={isSelected ? '#ffd700' : '#00ffff'}
          emissive={isSelected ? '#ffaa00' : '#0088aa'}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
        />
      </Sphere>
    </group>
  )
}

export default function OrrerySystem() {
  // Load graph data
  const { nodes, isLoading, error } = useGraphData()

  // Get filter state from Cosmic Store
  const activePillar = useCosmicStore((state) => state.activePillar)
  const setSelectedNode = useCosmicStore((state) => state.setSelectedNode)
  const setHoveredNode = useCosmicStore((state) => state.setHoveredNode)
  const emitBlessing = useCosmicStore((state) => state.emitBlessing)

  // Local selection state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  // Apply pillar filter
  const filteredNodes = useMemo(() => {
    if (!activePillar) {
      return nodes.filter((node) => node.pillar !== 'general')
    }
    return nodes.filter((node) => node.pillar === activePillar)
  }, [nodes, activePillar])

  // Handle node selection
  const handleSelect = useCallback(
    (node: GraphNode) => {
      const newSelection = node.id === selectedNodeId ? null : node.id
      setSelectedNodeId(newSelection)

      if (newSelection) {
        setSelectedNode({
          id: node.id,
          type: node.type,
          position: node.position
        })
        emitBlessing()
      } else {
        setSelectedNode(null)
      }
    },
    [selectedNodeId, setSelectedNode, emitBlessing]
  )

  // Handle node hover
  const handleHover = useCallback(
    (node: GraphNode | null, hover: boolean) => {
      setHoveredNodeId(hover && node ? node.id : null)

      if (hover && node) {
        setHoveredNode({
          id: node.id,
          type: node.type,
          position: node.position
        })
      } else {
        setHoveredNode(null)
      }
    },
    [setHoveredNode]
  )

  // Memoize callbacks
  const nodeCallbacks = useMemo(() => {
    const callbacks = new Map<string, {
      onSelect: () => void
      onHover: (hover: boolean) => void
    }>()

    filteredNodes.forEach((node) => {
      callbacks.set(node.id, {
        onSelect: () => handleSelect(node),
        onHover: (hover: boolean) => handleHover(node, hover)
      })
    })

    return callbacks
  }, [filteredNodes, handleSelect, handleHover])

  // Don't render if loading or error
  if (isLoading || error) {
    return null
  }

  return (
    <group name="orrery-system">
      {/* The Orbital Rings */}
      <OrbitRings />

      {/* The Nodes - Generic rendering for any node type */}
      {filteredNodes.map((node) => {
        const callbacks = nodeCallbacks.get(node.id)!

        return (
          <GenericNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            isHovered={hoveredNodeId === node.id}
            onSelect={callbacks.onSelect}
            onHover={callbacks.onHover}
          />
        )
      })}
    </group>
  )
}
