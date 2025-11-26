/**
 * HadithNode Component
 * Renders a single Hadith node in 3D space
 * Extracted from QuranGraph.tsx (lines 150-218)
 */

'use client'

import { useRef, memo, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { GraphNode } from '@/hooks/useGraphData.orbital'
import { PILLAR_INFO } from './SurahNode'

interface HadithNodeProps {
  node: GraphNode
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (hover: boolean) => void
}

function HadithNode({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover
}: HadithNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // ✅ OPTIMIZATION: Reuse Vector3 object instead of creating new one each frame
  const targetScaleVector = useRef(new THREE.Vector3())

  // Memoize color calculations based on pillar
  const nodeMetrics = useMemo(() => {
    const pillarInfo = PILLAR_INFO[node.pillar]
    const baseColor = pillarInfo.hadithColor  // Use light Hadith color for this pillar

    // Pre-calculate all colors once
    const baseColorObj = new THREE.Color(baseColor)
    const hoverColorHex = baseColorObj.clone().multiplyScalar(1.2).getHexString()
    const selectColorHex = baseColorObj.clone().multiplyScalar(1.4).getHexString()

    // Smaller size for Hadith nodes (80% of Quran nodes)
    const baseSize = 2.3 * 0.8  // 80% of Quran node size

    return {
      baseColor,
      hoverColor: `#${hoverColorHex}`,
      selectColor: `#${selectColorHex}`,
      baseSize
    }
  }, [node.pillar])

  // Smooth scale animation + rotation
  useFrame(() => {
    if (!meshRef.current) return

    const targetScale = isSelected ? 2.0 : isHovered ? 1.6 : 1.0
    const currentScale = meshRef.current.scale.x

    // ✅ OPTIMIZATION: Early exit if scale is already at target
    if (Math.abs(currentScale - targetScale) < 0.001) {
      // Only apply rotation (less expensive than lerp)
      meshRef.current.rotation.y += 0.004
      return
    }

    // Use reused Vector3 object
    targetScaleVector.current.set(targetScale, targetScale, targetScale)
    meshRef.current.scale.lerp(targetScaleVector.current, 0.1)

    // Subtle rotation for visual interest
    meshRef.current.rotation.y += 0.004
  })

  // Select color based on state
  const color = isSelected
    ? nodeMetrics.selectColor
    : isHovered
    ? nodeMetrics.hoverColor
    : nodeMetrics.baseColor

  return (
    <group position={node.position}>
      {/* Outer neon glow - soft diffuse halo */}
      <mesh>
        <sphereGeometry args={[nodeMetrics.baseSize * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.2 : isHovered ? 0.15 : 0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Mid glow - crisp neon ring */}
      <mesh>
        <sphereGeometry args={[nodeMetrics.baseSize * 1.25, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.35 : isHovered ? 0.28 : 0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner bright core */}
      <mesh>
        <sphereGeometry args={[nodeMetrics.baseSize * 1.08, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.5 : isHovered ? 0.4 : 0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main sphere - glassy, shiny planet with rich color */}
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[nodeMetrics.baseSize, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.8 : isHovered ? 1.5 : 1.1}
          metalness={0.7}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Hadith ID label - pillar-colored, smaller and subtle */}
      <Text
        position={[0, nodeMetrics.baseSize + 0.5, 0]}
        fontSize={0.35}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {node.citation}
      </Text>

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[nodeMetrics.baseSize + 0.3, nodeMetrics.baseSize + 0.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

// ✅ OPTIMIZATION: Memoize component to prevent unnecessary re-renders
export default memo(HadithNode, (prevProps, nextProps) => {
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered
  )
})
