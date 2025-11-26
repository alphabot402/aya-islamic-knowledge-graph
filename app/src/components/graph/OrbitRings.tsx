/**
 * OrbitRings Component
 * Renders the golden orbital tracks for the "Islamic Astrolabe" visualization
 * Each ring represents one of the Five Pillars
 */

'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbitRingProps {
  radius: number
  label: string
  color: string
  rotationSpeed: number
}

function OrbitRing({ radius, label, color, rotationSpeed }: OrbitRingProps) {
  const rotatingRingRef = useRef<THREE.Group>(null)

  // Animate rotation around Y-axis (only the rotating ring moves)
  useFrame((state, delta) => {
    if (rotatingRingRef.current) {
      rotatingRingRef.current.rotation.y += rotationSpeed * delta
    }
  })

  return (
    <group>
      {/* STATIC ORBITAL TRACK - Semi-transparent with subtle glow */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Outer glow layer for depth */}
        <mesh>
          <torusGeometry args={[radius, 0.15, 16, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Main guideline showing orbital path */}
        <mesh>
          <torusGeometry args={[radius, 0.08, 16, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ROTATING RING - Enhanced 3D effect with multiple glow layers */}
      <group ref={rotatingRingRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Outer glow for atmospheric effect */}
        <mesh>
          <torusGeometry args={[radius, 0.45, 24, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Mid glow layer */}
        <mesh>
          <torusGeometry args={[radius, 0.35, 24, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Main rotating ring with emissive glow */}
        <mesh>
          <torusGeometry args={[radius, 0.25, 24, 100]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.9}
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Main OrbitRings component
 * Rings for Quran nodes only (Hadiths in center)
 * Reduced by 20% to fit all rings on screen
 */
export default function OrbitRings() {
  return (
    <group>
      {/* Ring 1 - SHAHADA */}
      <OrbitRing radius={32} label="Shahada" color="#9333EA" rotationSpeed={0.15} />

      {/* Ring 2 - SALAH */}
      <OrbitRing radius={48} label="Salah" color="#3B82F6" rotationSpeed={0.12} />

      {/* Ring 3 - ZAKAT */}
      <OrbitRing radius={64} label="Zakat" color="#10B981" rotationSpeed={0.1} />

      {/* Ring 4 - SAWM */}
      <OrbitRing radius={80} label="Sawm" color="#F43F5E" rotationSpeed={0.08} />

      {/* Ring 5 - HAJJ (outermost) */}
      <OrbitRing radius={96} label="Hajj" color="#EF4444" rotationSpeed={0.06} />

      {/* Hadiths cluster in center (no ring needed) */}
    </group>
  )
}
