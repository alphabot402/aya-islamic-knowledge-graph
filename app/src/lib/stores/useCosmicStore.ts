/**
 * Cosmic Store - Global State for the Divine Vastness
 * "The heavens and the earth are held by His decree"
 *
 * This Zustand store manages:
 * 1. The Atmosphere (Prayer Time & Lighting)
 * 2. The Filter State (Active Pillar)
 * 3. The Camera Mode (Orbit vs Travel)
 * 4. The Selection State (Active Node)
 *
 * Theology drives the Physics.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  type PrayerTime,
  type PrayerTimeInfo,
  getCurrentPrayerTime,
  getPrayerTimeColors,
  getSunElevation,
  getAmbientIntensity
} from '@/lib/prayer-times'
import type { Pillar } from '@/hooks/useGraphData.orbital'

export type CameraMode = 'orbit' | 'travel' | 'focused'

export interface SelectedNode {
  id: string
  type: 'primary' | 'secondary'
  position: [number, number, number]
}

export interface CosmicState {
  // ============================================================================
  // THE ATMOSPHERE - Prayer Time & Lighting
  // ============================================================================
  prayerTimeInfo: PrayerTimeInfo
  colors: ReturnType<typeof getPrayerTimeColors>
  sunElevation: number
  ambientIntensity: number

  // ============================================================================
  // THE FILTER - Active Pillar
  // ============================================================================
  activePillar: Pillar | null
  setActivePillar: (pillar: Pillar | null) => void

  // ============================================================================
  // THE CAMERA - Mode & Position
  // ============================================================================
  cameraMode: CameraMode
  setCameraMode: (mode: CameraMode) => void

  // ============================================================================
  // THE SELECTION - Active Node
  // ============================================================================
  selectedNode: SelectedNode | null
  setSelectedNode: (node: SelectedNode | null) => void
  hoveredNode: SelectedNode | null
  setHoveredNode: (node: SelectedNode | null) => void

  // ============================================================================
  // THE TIME - Update Prayer Time
  // ============================================================================
  updatePrayerTime: () => void

  // ============================================================================
  // THE BLESSING - Particle Trigger
  // ============================================================================
  triggerBlessing: boolean
  emitBlessing: () => void
}

export const useCosmicStore = create<CosmicState>()(
  devtools(
    (set, get) => {
      // Initialize with current prayer time
      const initialPrayerTime = getCurrentPrayerTime()
      const initialColors = getPrayerTimeColors(initialPrayerTime.current)
      const initialSunElevation = getSunElevation(initialPrayerTime)
      const initialAmbientIntensity = getAmbientIntensity(initialPrayerTime)

      return {
        // Initial atmosphere state
        prayerTimeInfo: initialPrayerTime,
        colors: initialColors,
        sunElevation: initialSunElevation,
        ambientIntensity: initialAmbientIntensity,

        // Initial filter state
        activePillar: null,
        setActivePillar: (pillar) => set({ activePillar: pillar }),

        // Initial camera state
        cameraMode: 'orbit',
        setCameraMode: (mode) => set({ cameraMode: mode }),

        // Initial selection state
        selectedNode: null,
        setSelectedNode: (node) => {
          set({ selectedNode: node })
          // If selecting a node, switch to focused camera mode
          if (node) {
            set({ cameraMode: 'focused' })
          }
        },
        hoveredNode: null,
        setHoveredNode: (node) => set({ hoveredNode: node }),

        // Prayer time updater
        updatePrayerTime: () => {
          const prayerTimeInfo = getCurrentPrayerTime()
          const colors = getPrayerTimeColors(prayerTimeInfo.current)
          const sunElevation = getSunElevation(prayerTimeInfo)
          const ambientIntensity = getAmbientIntensity(prayerTimeInfo)

          set({
            prayerTimeInfo,
            colors,
            sunElevation,
            ambientIntensity
          })
        },

        // Blessing particle trigger
        triggerBlessing: false,
        emitBlessing: () => {
          set({ triggerBlessing: true })
          // Reset after short delay
          setTimeout(() => set({ triggerBlessing: false }), 100)
        }
      }
    },
    {
      name: 'cosmic-store'
    }
  )
)

/**
 * Hook to start the prayer time clock
 * Call this once in your main component
 */
export function useStartPrayerClock() {
  const updatePrayerTime = useCosmicStore((state) => state.updatePrayerTime)

  React.useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      updatePrayerTime()
    }, 60000) // 60 seconds

    // Also update on mount
    updatePrayerTime()

    return () => clearInterval(interval)
  }, [updatePrayerTime])
}

// Export React for the hook above
import React from 'react'

/**
 * Selector hooks for performance
 * Use these instead of accessing the whole store
 */
export const usePrayerTime = () =>
  useCosmicStore((state) => state.prayerTimeInfo)

export const useSkyColors = () =>
  useCosmicStore((state) => state.colors)

export const useActivePillar = () =>
  useCosmicStore((state) => state.activePillar)

export const useSelectedNode = () =>
  useCosmicStore((state) => state.selectedNode)

export const useCameraMode = () =>
  useCosmicStore((state) => state.cameraMode)

/**
 * Get pillar-specific color based on active pillar
 * Used by Nebula field to tint based on current pillar
 */
export function getPillarColor(pillar: Pillar): string {
  switch (pillar) {
    case 'shahada':
      return '#fbbf24' // Gold
    case 'salah':
      return '#14b8a6' // Teal
    case 'zakat':
      return '#22c55e' // Green
    case 'sawm':
      return '#8b5cf6' // Violet
    case 'hajj':
      return '#ec4899' // Pink
    case 'general':
      return '#6b7280' // Gray
    default:
      return '#fbbf24' // Default gold
  }
}

/**
 * Smooth interpolation function for color transitions
 * Returns a value between 0 and 1 that smoothly transitions
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}
