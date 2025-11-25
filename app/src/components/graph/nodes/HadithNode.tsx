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

  // Scale node size by connection count - Balanced for neon aesthetic
  const connectionCount = node.connectionCount || 1
  const sizeScale = Math.min(0.9 + (connectionCount * 0.2), 1.8)
  const baseSize = 1.0 * sizeScale

  return (
    <group position={node.position}>
      {/* Outer golden neon glow - soft diffuse halo */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.2 : isHovered ? 0.15 : 0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Mid golden glow - crisp neon ring */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.25, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.35 : isHovered ? 0.28 : 0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner bright golden core */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.08, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.5 : isHovered ? 0.4 : 0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main sphere - glassy, shiny golden planet with rich color */}
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[baseSize, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.8 : isHovered ? 1.5 : 1.1}
          metalness={0.7}
          roughness={0.15}
          envMapIntensity={1.5}
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
