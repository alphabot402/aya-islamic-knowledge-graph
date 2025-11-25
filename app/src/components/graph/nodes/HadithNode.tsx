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
import { HadithNode as HadithNodeType } from '@/hooks/useGraphData'

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
  const baseSize = 0.8

  return (
    <group position={node.position}>
      {/* Outer constellation glow - far golden aura */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.35, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.2 : isHovered ? 0.15 : 0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Middle constellation glow - golden atmosphere */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.2, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.38 : isHovered ? 0.3 : 0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main sphere - golden stellar core */}
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
          emissiveIntensity={isSelected ? 2.2 : isHovered ? 1.7 : 1.4}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Inner rim glow - golden edge highlight */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.08, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.55 : isHovered ? 0.45 : 0.3}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright golden corona */}
      <mesh>
        <sphereGeometry args={[baseSize * 1.15, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.15}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
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
