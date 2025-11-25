/**
 * NebulaField - The Vastness
 * "He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names"
 *
 * A point cloud system representing the 99 Names of Allah as "Clouds of Mercy"
 * These are not random stars - they are the Divine Attributes surrounding all creation.
 *
 * Features:
 * - Soft, gaseous movement (sine wave animation)
 * - Color shifts based on active pillar
 * - Custom shader for divine glow effect
 * - Performance optimized with BufferGeometry
 */

'use client'

import { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useActivePillar, getPillarColor, useSkyColors } from '@/lib/stores/useCosmicStore'

function NebulaField() {
  const pointsRef = useRef<THREE.Points>(null)
  const activePillar = useActivePillar()
  const skyColors = useSkyColors()

  // Generate particle positions (99 Names + additional for fullness)
  const particleCount = 999 // 99 Names × 10 + 9 for symmetry

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a vast sphere
      const radius = 200 + Math.random() * 150 // 200-350 units away
      const theta = Math.random() * Math.PI * 2 // Azimuthal angle
      const phi = Math.acos(2 * Math.random() - 1) // Polar angle (uniform distribution)

      // Spherical to Cartesian coordinates
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Initial color (will be animated)
      const baseColor = new THREE.Color('#fbbf24') // Gold
      colors[i * 3] = baseColor.r
      colors[i * 3 + 1] = baseColor.g
      colors[i * 3 + 2] = baseColor.b

      // Varying sizes for depth
      sizes[i] = 2 + Math.random() * 4
    }

    return { positions, colors, sizes }
  }, [])

  // Create custom shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color('#fbbf24') },
        glowIntensity: { value: 0.8 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;

        varying vec3 vColor;
        varying float vDistance;

        uniform float time;

        void main() {
          vColor = customColor;

          // Add subtle wave motion
          vec3 pos = position;
          pos.x += sin(time * 0.3 + position.y * 0.01) * 2.0;
          pos.y += cos(time * 0.2 + position.z * 0.01) * 2.0;
          pos.z += sin(time * 0.4 + position.x * 0.01) * 2.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vDistance = length(mvPosition.xyz);

          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 baseColor;
        uniform float glowIntensity;

        varying vec3 vColor;
        varying float vDistance;

        void main() {
          // Create soft circular particle
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);

          if (dist > 0.5) discard;

          // Soft glow falloff
          float alpha = (1.0 - dist * 2.0) * glowIntensity;
          alpha = smoothstep(0.0, 1.0, alpha);

          // Distance-based fading for atmospheric depth
          float depthFade = smoothstep(400.0, 200.0, vDistance);
          alpha *= depthFade;

          // Mix base color with custom color
          vec3 finalColor = mix(baseColor, vColor, 0.5);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }, [])

  // Animate particles and handle color transitions
  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const material = pointsRef.current.material as THREE.ShaderMaterial

    // Update time for wave motion
    material.uniforms.time.value += delta

    // Determine target color based on active pillar or sky color
    let targetColor: THREE.Color
    if (activePillar) {
      targetColor = new THREE.Color(getPillarColor(activePillar))
    } else {
      // Use the sky's middle color as ambient
      targetColor = new THREE.Color(skyColors.middle)
    }

    // Smoothly transition to target color
    material.uniforms.baseColor.value.lerp(targetColor, delta * 0.5)

    // Subtle pulsing glow
    const pulseIntensity = 0.7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    material.uniforms.glowIntensity.value = pulseIntensity
  })

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-customColor"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  )
}

// Memoize to prevent unnecessary re-renders
export default memo(NebulaField)

/**
 * The 99 Names of Allah (Asma ul Husna)
 * These inspire the nebula field's spiritual significance
 *
 * In a future iteration, each particle cluster could represent one name,
 * and hovering could reveal the name and its meaning.
 */
export const ASMA_UL_HUSNA = [
  'Ar-Rahman', 'Ar-Rahim', 'Al-Malik', 'Al-Quddus', 'As-Salam',
  'Al-Mu\'min', 'Al-Muhaymin', 'Al-Aziz', 'Al-Jabbar', 'Al-Mutakabbir',
  'Al-Khaliq', 'Al-Bari', 'Al-Musawwir', 'Al-Ghaffar', 'Al-Qahhar',
  'Al-Wahhab', 'Ar-Razzaq', 'Al-Fattah', 'Al-Alim', 'Al-Qabid',
  'Al-Basit', 'Al-Khafid', 'Ar-Rafi', 'Al-Mu\'izz', 'Al-Mudhill',
  'As-Sami', 'Al-Basir', 'Al-Hakam', 'Al-Adl', 'Al-Latif',
  'Al-Khabir', 'Al-Halim', 'Al-Azim', 'Al-Ghafur', 'Ash-Shakur',
  'Al-Ali', 'Al-Kabir', 'Al-Hafiz', 'Al-Muqit', 'Al-Hasib',
  'Al-Jalil', 'Al-Karim', 'Ar-Raqib', 'Al-Mujib', 'Al-Wasi',
  'Al-Hakim', 'Al-Wadud', 'Al-Majid', 'Al-Ba\'ith', 'Ash-Shahid',
  'Al-Haqq', 'Al-Wakil', 'Al-Qawi', 'Al-Matin', 'Al-Wali',
  'Al-Hamid', 'Al-Muhsi', 'Al-Mubdi', 'Al-Mu\'id', 'Al-Muhyi',
  'Al-Mumit', 'Al-Hayy', 'Al-Qayyum', 'Al-Wajid', 'Al-Majid',
  'Al-Wahid', 'As-Samad', 'Al-Qadir', 'Al-Muqtadir', 'Al-Muqaddim',
  'Al-Mu\'akhkhir', 'Al-Awwal', 'Al-Akhir', 'Az-Zahir', 'Al-Batin',
  'Al-Wali', 'Al-Muta\'ali', 'Al-Barr', 'At-Tawwab', 'Al-Muntaqim',
  'Al-\'Afuw', 'Ar-Ra\'uf', 'Malik-ul-Mulk', 'Dhul-Jalal wal-Ikram', 'Al-Muqsit',
  'Al-Jami', 'Al-Ghani', 'Al-Mughni', 'Al-Mani', 'Ad-Darr',
  'An-Nafi', 'An-Nur', 'Al-Hadi', 'Al-Badi', 'Al-Baqi',
  'Al-Warith', 'Ar-Rashid', 'As-Sabur'
] as const
