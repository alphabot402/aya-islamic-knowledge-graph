/**
 * HadithNode Component
 * Renders a single Hadith node in 3D space
 * Extracted from QuranGraph.tsx (lines 150-218)
 */

'use client'

import { useRef } from 'react'
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

export default function HadithNode({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover
}: HadithNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Smooth scale animation + rotation
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isSelected ? 2.0 : isHovered ? 1.6 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
      // Subtle rotation for visual interest
      meshRef.current.rotation.y += 0.004
    }
  })

  // Golden color scheme for hadiths
  const baseColor = '#d97706'
  const hoverColor = '#f59e0b'
  const selectColor = '#fbbf24'

  const color = isSelected ? selectColor : isHovered ? hoverColor : baseColor
  const baseSize = 0.8

  return (
    <group position={node.position}>
      {/* Main sphere */}
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
          emissiveIntensity={isSelected ? 1.2 : isHovered ? 1.0 : 0.8}
          metalness={0.95}
          roughness={0.05}
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
