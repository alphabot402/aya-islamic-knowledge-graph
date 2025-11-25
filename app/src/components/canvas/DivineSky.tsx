/**
 * DivineSky - The Atmospheric Layer
 * "He created the heavens and the earth in truth"
 *
 * A dynamic skybox that transitions through prayer times:
 * - Fajr: Deep Sapphire → Pink (Dawn)
 * - Dhuhr: Blinding White/Gold (Noon - "Nur")
 * - Maghrib: Amber → Purple (Sunset)
 * - Isha: Deep Void/Black (Night)
 *
 * The sky is not static - it breathes with the rhythm of prayer.
 */

'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSkyColors, smoothstep } from '@/lib/stores/useCosmicStore'

export default function DivineSky() {
  const meshRef = useRef<THREE.Mesh>(null)
  const colors = useSkyColors()

  // Create shader material for the sky gradient
  const skyMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(colors.top) },
        middleColor: { value: new THREE.Color(colors.middle) },
        bottomColor: { value: new THREE.Color(colors.bottom) },
        offset: { value: 50 },
        exponent: { value: 0.6 },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vNormal = normalize(normalMatrix * normal);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 middleColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        uniform float time;

        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        // Smooth interpolation function
        float smootherstep(float edge0, float edge1, float x) {
          float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
          return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        }

        void main() {
          // Normalize the world position to get direction
          float h = normalize(vWorldPosition + offset).y;

          // Create gradient zones
          // 0.0 to 0.5: bottom to middle
          // 0.5 to 1.0: middle to top

          vec3 color;

          if (h < 0.0) {
            // Below horizon - fade from middle to bottom
            float t = smootherstep(-0.5, 0.0, h);
            color = mix(bottomColor, middleColor, t);
          } else {
            // Above horizon - fade from middle to top
            float t = smootherstep(0.0, 1.0, h);
            color = mix(middleColor, topColor, t);
          }

          // Add subtle shimmer effect for divine quality
          float shimmer = sin(time * 0.5 + vWorldPosition.x * 0.1) * 0.02 +
                          cos(time * 0.3 + vWorldPosition.z * 0.1) * 0.02;
          color += vec3(shimmer);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    })

    return material
  }, [])

  // Smoothly interpolate colors when prayer time changes
  useFrame((state, delta) => {
    if (!meshRef.current) return

    const material = meshRef.current.material as THREE.ShaderMaterial

    // Update time for shimmer effect
    material.uniforms.time.value += delta

    // Target colors from the store
    const targetTop = new THREE.Color(colors.top)
    const targetMiddle = new THREE.Color(colors.middle)
    const targetBottom = new THREE.Color(colors.bottom)

    // Smooth interpolation (lerp over 5 seconds)
    const lerpFactor = Math.min(delta * 0.2, 1) // 0.2 = 1/5 seconds

    material.uniforms.topColor.value.lerp(targetTop, lerpFactor)
    material.uniforms.middleColor.value.lerp(targetMiddle, lerpFactor)
    material.uniforms.bottomColor.value.lerp(targetBottom, lerpFactor)
  })

  return (
    <mesh ref={meshRef} material={skyMaterial}>
      {/* Large sphere that encompasses the entire scene */}
      <sphereGeometry args={[500, 64, 64]} />
    </mesh>
  )
}

/**
 * Atmospheric Lighting Component
 * Provides dynamic lighting based on prayer time
 */
export function AtmosphericLight() {
  const colors = useSkyColors()
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame((state, delta) => {
    if (!lightRef.current) return

    // Smoothly transition light color
    const targetColor = new THREE.Color(colors.sunLight)
    lightRef.current.color.lerp(targetColor, delta * 0.2)
  })

  return (
    <>
      {/* Ambient light - base illumination */}
      <ambientLight intensity={0.4} color={colors.ambient} />

      {/* Directional light - the "sun" */}
      <directionalLight
        ref={lightRef}
        position={[100, 100, 50]}
        intensity={1.5}
        color={colors.sunLight}
        castShadow
      />

      {/* Subtle fill lights for depth */}
      <pointLight
        position={[-50, -50, -50]}
        intensity={0.3}
        color={colors.bottom}
      />
      <pointLight
        position={[50, -50, 50]}
        intensity={0.3}
        color={colors.middle}
      />
    </>
  )
}
