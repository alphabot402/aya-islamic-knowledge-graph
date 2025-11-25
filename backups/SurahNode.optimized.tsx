/**
 * SurahNode Component (OPTIMIZED)
 * Performance improvements:
 * 1. Reused Vector3 to avoid allocations
 * 2. Memoized color calculations
 * 3. Early exit when scale is stable
 * 4. Component memoization
 */

'use client'

import { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { SurahNode as SurahNodeType } from '@/hooks/useGraphData'

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

function SurahNode({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover
}: SurahNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // ✅ OPTIMIZATION 1: Reuse Vector3 object instead of creating new one each frame
  const targetScaleVector = useRef(new THREE.Vector3())

  // ✅ OPTIMIZATION 2: Memoize all color calculations (only runs when pillar changes)
  const nodeMetrics = useMemo(() => {
    const pillarInfo = PILLAR_INFO[node.pillar]
    const baseColor = pillarInfo.color

    // Pre-calculate all colors once
    const baseColorObj = new THREE.Color(baseColor)
    const hoverColorHex = baseColorObj.clone().multiplyScalar(1.3).getHexString()
    const selectColorHex = baseColorObj.clone().multiplyScalar(1.6).getHexString()

    // Pre-calculate size
    const baseSize = 0.6 + Math.min(node.verseCount / 120, 1.5)

    return {
      baseColor,
      hoverColor: `#${hoverColorHex}`,
      selectColor: `#${selectColorHex}`,
      baseSize
    }
  }, [node.pillar, node.verseCount])

  // ✅ OPTIMIZATION 3: Only animate when scale is different (early exit)
  useFrame(() => {
    if (!meshRef.current) return

    const targetScale = isSelected ? 2.0 : isHovered ? 1.6 : 1.0
    const currentScale = meshRef.current.scale.x

    // Early exit if scale is already at target (no need to lerp)
    if (Math.abs(currentScale - targetScale) < 0.001) {
      return
    }

    // Use reused Vector3 object
    targetScaleVector.current.set(targetScale, targetScale, targetScale)
    meshRef.current.scale.lerp(targetScaleVector.current, 0.1)
  })

  // Select color based on state
  const color = isSelected
    ? nodeMetrics.selectColor
    : isHovered
    ? nodeMetrics.hoverColor
    : nodeMetrics.baseColor

  return (
    <group position={node.position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[nodeMetrics.baseSize, 32, 32]} />
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
        position={[0, nodeMetrics.baseSize + 0.7, 0]}
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
          <ringGeometry args={[nodeMetrics.baseSize + 0.3, nodeMetrics.baseSize + 0.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  )
}

// ✅ OPTIMIZATION 4: Memoize component to prevent unnecessary re-renders
export default memo(SurahNode, (prevProps, nextProps) => {
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered
    // onSelect and onHover should be stable callbacks
  )
})

export { PILLAR_INFO }
