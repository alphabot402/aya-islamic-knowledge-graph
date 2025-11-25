/**
 * SurahNode Component
 * Renders a single Surah node in 3D space
 * Extracted from QuranGraph.tsx (lines 80-148)
 */

'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { SurahNode as SurahNodeType } from '@/hooks/useGraphData'

// Pillar color configuration
const PILLAR_INFO = {
  shahada: { name: 'Shahada', nameAr: 'الشهادة', color: '#9333ea' },
  salah: { name: 'Salah', nameAr: 'الصلاة', color: '#2563eb' },
  zakat: { name: 'Zakat', nameAr: 'الزكاة', color: '#059669' },
  sawm: { name: 'Sawm', nameAr: 'الصوم', color: '#dc2626' },
  hajj: { name: 'Hajj', nameAr: 'الحج', color: '#b91c1c' },
  general: { name: 'General', nameAr: 'عام', color: '#475569' }
}

interface SurahNodeProps {
  node: SurahNodeType
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (hover: boolean) => void
}

export default function SurahNode({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover
}: SurahNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Smooth scale animation
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isSelected ? 2.0 : isHovered ? 1.6 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
  })

  // Color calculations
  const pillarInfo = PILLAR_INFO[node.pillar]
  const baseColor = pillarInfo.color
  const hoverColor = new THREE.Color(baseColor).multiplyScalar(1.3).getHexString()
  const selectColor = new THREE.Color(baseColor).multiplyScalar(1.6).getHexString()

  const color = isSelected ? `#${selectColor}` : isHovered ? `#${hoverColor}` : baseColor

  // Size based on verse count (larger surahs = bigger nodes)
  const baseSize = 0.6 + Math.min(node.verseCount / 120, 1.5)

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
          emissiveIntensity={isSelected ? 1.0 : isHovered ? 0.8 : 0.6}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Surah number label */}
      <Text
        position={[0, baseSize + 0.7, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {node.surahNumber}
      </Text>

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[baseSize + 0.3, baseSize + 0.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  )
}

// Export pillar info for use by other components
export { PILLAR_INFO }
