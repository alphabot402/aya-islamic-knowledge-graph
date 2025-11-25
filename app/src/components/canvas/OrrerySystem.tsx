/**
 * OrrerySystem - The Order
 * "He has subjected the sun and the moon, each running [its course] for a specified term"
 *
 * The Celestial Orrery system that organizes all knowledge nodes:
 * - 5 Pillar Orbits (Salah, Zakat, Sawm, Hajj, General)
 * - Shahada Column at center
 * - Animated orbital rings
 * - Surahs as "Suns"
 * - Hadiths as "Moons" orbiting their surahs
 *
 * This component coordinates the rendering of all nodes and rings.
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { useGraphData, type GraphNode } from '@/hooks/useGraphData.orbital'
import { useCosmicStore } from '@/lib/stores/useCosmicStore'
import SurahNode from '@/components/graph/nodes/SurahNode'
import HadithNode from '@/components/graph/nodes/HadithNode'
import ConnectionLines from '@/components/graph/nodes/ConnectionLines'
import OrbitRings from '@/components/graph/OrbitRings'

export default function OrrerySystem() {
  // Load graph data (uses orbital layout)
  const { nodes, isLoading, error } = useGraphData()

  // Get filter state from Cosmic Store
  const activePillar = useCosmicStore((state) => state.activePillar)
  const setSelectedNode = useCosmicStore((state) => state.setSelectedNode)
  const setHoveredNode = useCosmicStore((state) => state.setHoveredNode)
  const emitBlessing = useCosmicStore((state) => state.emitBlessing)

  // Local selection state (for visual feedback)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  // Apply pillar filter (inline)
  const filteredNodes = useMemo(() => {
    if (!activePillar) return nodes

    return nodes.filter((node) => {
      // If surah, match pillar
      if (node.type === 'surah') {
        return node.pillar === activePillar
      }
      // Always show hadiths (they connect across pillars)
      return true
    })
  }, [nodes, activePillar])

  // Handle node selection
  const handleSelect = useCallback(
    (node: GraphNode) => {
      const newSelection = node.id === selectedNodeId ? null : node.id
      setSelectedNodeId(newSelection)

      // Update cosmic store
      if (newSelection) {
        setSelectedNode({
          id: node.id,
          type: node.type,
          position: node.position
        })
        // Trigger blessing particle effect
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

  // Memoize node callbacks for stable references
  const nodeCallbacks = useMemo(() => {
    const callbacks = new Map<
      string,
      {
        onSelect: () => void
        onHover: (hover: boolean) => void
      }
    >()

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
      {/* The Orbital Rings - The Astrolabe tracks */}
      <OrbitRings />

      {/* Connection lines between nodes - Only show on hover/selection */}
      <ConnectionLines
        nodes={filteredNodes}
        hoveredNodeId={hoveredNodeId}
        selectedNodeId={selectedNodeId}
      />

      {/* The Nodes - Surahs and Hadiths */}
      {filteredNodes.map((node) => {
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
    </group>
  )
}
