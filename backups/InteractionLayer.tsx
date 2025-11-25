/**
 * InteractionLayer Component
 * Invisible interaction layer for instanced meshes
 *
 * Problem: InstancedMesh doesn't support individual onClick/onHover per instance
 * Solution: Create invisible spheres for interaction, map raycasts to instances
 *
 * This layer is only rendered for interaction, not for visuals
 */

'use client'

import { useMemo } from 'react'
import { GraphNode, SurahNode as SurahNodeType, HadithNode as HadithNodeType } from '@/hooks/useGraphData'

interface InteractionLayerProps {
  nodes: GraphNode[]
  onSelect: (node: GraphNode) => void
  onHover: (node: GraphNode | null, hover: boolean) => void
}

export default function InteractionLayer({
  nodes,
  onSelect,
  onHover
}: InteractionLayerProps) {
  // Separate nodes by type for different handling
  const { surahNodes, hadithNodes } = useMemo(() => {
    return {
      surahNodes: nodes.filter(n => n.type === 'surah') as SurahNodeType[],
      hadithNodes: nodes.filter(n => n.type === 'hadith') as HadithNodeType[]
    }
  }, [nodes])

  return (
    <>
      {/* Invisible interaction spheres for surahs */}
      {surahNodes.map(node => {
        const baseSize = 0.6 + Math.min(node.verseCount / 120, 1.5)

        return (
          <mesh
            key={node.id}
            position={node.position}
            onClick={() => onSelect(node)}
            onPointerOver={() => onHover(node, true)}
            onPointerOut={() => onHover(node, false)}
          >
            <sphereGeometry args={[baseSize, 8, 8]} /> {/* Low poly for performance */}
            <meshBasicMaterial visible={false} /> {/* Invisible but interactive */}
          </mesh>
        )
      })}

      {/* Invisible interaction spheres for hadiths */}
      {hadithNodes.map(node => {
        const baseSize = 0.8

        return (
          <mesh
            key={node.id}
            position={node.position}
            onClick={() => onSelect(node)}
            onPointerOver={() => onHover(node, true)}
            onPointerOut={() => onHover(node, false)}
          >
            <sphereGeometry args={[baseSize, 8, 8]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        )
      })}
    </>
  )
}
