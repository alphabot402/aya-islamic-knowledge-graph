/**
 * OrrerySystem - The Order
 * "He has subjected the sun and the moon, each running [its course] for a specified term"
 *
 * The Celestial Orrery system that organizes all knowledge nodes:
 * - Five Pillar Orbits (Shahada, Salah, Zakat, Sawm, Hajj)
 * - Animated orbital rings with dual-ring system (static + rotating)
 * - Surahs as planetary bodies (color-coded by pillar)
 * - Hadiths as golden moons in their own orbital rings
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

  // Apply pillar filter (inline) - exclude "general" category, focus on Five Pillars
  const filteredNodes = useMemo(() => {
    if (!activePillar) {
      // "All" view: Show all Five Pillars (exclude general)
      return nodes.filter((node) => {
        if (node.type === 'surah') {
          return node.pillar !== 'general'
        }
        // Show all hadiths
        return true
      })
    }

    // Specific pillar selected
    return nodes.filter((node) => {
      // If surah, match pillar (general already excluded above)
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

      {/* The Nodes - Surahs and Hadiths - Clean planetary view */}
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
