/**
 * HadithNode Component
 * Renders a single Hadith node in 3D space
 * Extracted from QuranGraph.tsx (lines 150-218)
 */

'use client'

import { useRef, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { HadithNode as HadithNodeType } from '@/hooks/useGraphData.orbital'

interface HadithNodeProps {
  node: HadithNodeType
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

  // Golden color scheme for hadiths
  const baseColor = '#d97706'
  const hoverColor = '#f59e0b'
  const selectColor = '#fbbf24'

  const color = isSelected ? selectColor : isHovered ? hoverColor : baseColor

  // Scale node size by connection count - LARGER for planet-like appearance
  const connectionCount = node.connectionCount || 1
  const sizeScale = Math.min(1.2 + (connectionCount * 0.25), 2.2)
  const baseSize = 1.5 * sizeScale

  return (
    <group position={node.position}>
      {/* Outer atmospheric glow - golden planetary atmosphere */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.35, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.15 : isHovered ? 0.12 : 0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner atmospheric glow */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.18, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.28 : isHovered ? 0.22 : 0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main sphere - golden planet surface */}
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.4 : isHovered ? 1.1 : 0.8}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Hadith ID label */}
      <Text
        position={[0, baseSize + 0.6, 0]}
        fontSize={0.45}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {node.hadith.idInBook}
      </Text>

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[baseSize + 0.3, baseSize + 0.5, 32]} />
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
