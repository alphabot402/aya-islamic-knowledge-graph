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
      {/* STATIC ORBITAL TRACK - Fixed anchor showing the path */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Thin guideline showing orbital path */}
        <mesh>
          <torusGeometry args={[radius, 0.08, 16, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ROTATING RING - Moves along the orbital track like planetary rotation */}
      <group ref={rotatingRingRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Subtle outer glow */}
        <mesh>
          <torusGeometry args={[radius, 0.35, 24, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Main rotating ring - like Saturn's rings rolling on orbit */}
        <mesh>
          <torusGeometry args={[radius, 0.25, 24, 100]} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.3}
            emissive={color}
            emissiveIntensity={0.7}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Main OrbitRings component
 * ONE ring per pillar (Quran and Hadith share the same orbital path)
 * Rings start at radius 150 to create sacred empty void at center
 */
export default function OrbitRings() {
  return (
    <group>
      {/* Ring 1 - SHAHADA (innermost, starting at 150 for divine void) */}
      <OrbitRing radius={150} label="Shahada" color="#9333EA" rotationSpeed={0.15} />

      {/* Ring 2 - SALAH */}
      <OrbitRing radius={220} label="Salah" color="#3B82F6" rotationSpeed={0.12} />

      {/* Ring 3 - ZAKAT */}
      <OrbitRing radius={290} label="Zakat" color="#10B981" rotationSpeed={0.1} />

      {/* Ring 4 - SAWM */}
      <OrbitRing radius={360} label="Sawm" color="#F43F5E" rotationSpeed={0.08} />

      {/* Ring 5 - HAJJ (outermost) */}
      <OrbitRing radius={430} label="Hajj" color="#EF4444" rotationSpeed={0.06} />

      {/* NO central sphere - keep the void empty (Divine Vastness) */}
    </group>
  )
}
