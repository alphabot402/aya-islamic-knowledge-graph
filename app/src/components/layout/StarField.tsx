'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'
import * as THREE from 'three'

/**
 * Enhanced StarField with multiple star layers and nebula effects
 * Creates depth and visual richness for the night sky theme
 */

interface StarsProps {
  count?: number
  radius?: number
  color?: string
  size?: number
  speed?: number
}

function Stars({ count = 5000, radius = 1.5, color = "#1ac7b1", size = 0.002, speed = 1 }: StarsProps) {
  const ref = useRef<THREE.Points>(null)

  const sphere = useMemo(() => {
    const positions = random.inSphere(new Float32Array(count * 3), { radius }) as Float32Array
    return positions
  }, [count, radius])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= (delta / 10) * speed
      ref.current.rotation.y -= (delta / 15) * speed
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function NebulaCloud() {
  const ref = useRef<THREE.Points>(null)

  const cloud = useMemo(() => {
    const positions = random.inSphere(new Float32Array(1500 * 3), { radius: 1.2 }) as Float32Array
    return positions
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03
      ref.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.15
    }
  })

  return (
    <Points ref={ref} positions={cloud} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.006}
        sizeAttenuation={true}
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export default function StarField() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Night sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>

      {/* 3D Star layers - Subtle and realistic */}
      <Canvas camera={{ position: [0, 0, 1] }}>
        {/* Background stars - Very dim */}
        <Stars count={6000} radius={2.0} color="#6b7280" size={0.0012} speed={0.2} />

        {/* Mid-layer stars - Soft blue-white */}
        <Stars count={4000} radius={1.5} color="#bfdbfe" size={0.0018} speed={0.4} />

        {/* Foreground stars - Bright but natural */}
        <Stars count={1500} radius={1.0} color="#dbeafe" size={0.003} speed={0.7} />

        {/* Subtle blue nebula */}
        <NebulaCloud />

        {/* Very subtle ambient light */}
        <ambientLight intensity={0.05} color="#1e3a8a" />
      </Canvas>
    </div>
  )
}

