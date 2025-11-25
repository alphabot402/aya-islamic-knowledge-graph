/**
 * Orbital Layout Engine
 * Implements the "Celestial Orrery" / "Islamic Astrolabe" positioning system
 *
 * Layout Concept:
 * - Center (0,0,0): Shahada surahs in vertical column
 * - Orbit 1 (R=30): Salah surahs
 * - Orbit 2 (R=50): Zakat surahs
 * - Orbit 3 (R=70): Sawm surahs
 * - Orbit 4 (R=90): Hajj surahs
 * - Separate plane: General surahs
 * - Hadiths: "Moons" orbiting their connected surahs
 */

import { type Pillar } from '@/hooks/useGraphData.orbital'

// ============================================================================
// ORBITAL CONFIGURATION
// ============================================================================

export const PILLAR_ORBITS: Record<Pillar, { radius: number; yOffset: number }> = {
  shahada: { radius: 0, yOffset: 0 },      // Center vertical column
  salah: { radius: 30, yOffset: 0 },       // Inner ring
  zakat: { radius: 50, yOffset: 0 },       // Second ring
  sawm: { radius: 70, yOffset: 0 },        // Third ring
  hajj: { radius: 90, yOffset: 0 },        // Outer ring
  general: { radius: 60, yOffset: 15 }     // Separate elevated plane
}

// ============================================================================
// POSITION CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate position for a Surah node in orbital system
 * @param pillar - The pillar this surah belongs to
 * @param indexInPillar - Index of this surah within its pillar group (0-based)
 * @param totalInPillar - Total number of surahs in this pillar
 */
export function calculateSurahPosition(
  pillar: Pillar,
  indexInPillar: number,
  totalInPillar: number
): [number, number, number] {
  const orbit = PILLAR_ORBITS[pillar]

  // Special case: Shahada surahs in vertical column at center
  if (pillar === 'shahada') {
    return calculateShahadaColumnPosition(indexInPillar, totalInPillar)
  }

  // Special case: General surahs on elevated plane
  if (pillar === 'general') {
    return calculateGeneralPlanePosition(indexInPillar, totalInPillar)
  }

  // Standard orbital positioning
  return calculateOrbitalPosition(orbit.radius, indexInPillar, totalInPillar, orbit.yOffset)
}

/**
 * Shahada surahs: Vertical column at center (0,0,0)
 * Forms a tight helix around the central axis
 */
function calculateShahadaColumnPosition(
  index: number,
  total: number
): [number, number, number] {
  // Vertical spacing
  const height = (index / total) * 35 - 17.5 // Spread from -17.5 to +17.5

  // Small circular offset for visual interest (tight helix)
  const angle = (index / total) * Math.PI * 4 // 2 full rotations
  const helixRadius = 3
  const x = Math.cos(angle) * helixRadius
  const z = Math.sin(angle) * helixRadius

  return [x, height, z]
}

/**
 * General surahs: Elevated plane with own orbital pattern
 * Distinct from the Five Pillars
 */
function calculateGeneralPlanePosition(
  index: number,
  total: number
): [number, number, number] {
  const radius = 60
  const yOffset = 15 // Elevated above other orbits

  // Distribute evenly around the circle
  const angle = (index / total) * Math.PI * 2
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  // Add slight wave pattern
  const waveHeight = Math.sin(index * 0.5) * 3

  return [x, yOffset + waveHeight, z]
}

/**
 * Standard orbital positioning for pillar rings
 * Distributes nodes evenly around the orbital ring
 */
function calculateOrbitalPosition(
  radius: number,
  index: number,
  total: number,
  yOffset: number
): [number, number, number] {
  // Distribute evenly around the circle
  const angle = (index / total) * Math.PI * 2

  // XZ plane positioning
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  // Slight vertical variation for visual interest
  const verticalVariation = Math.sin(index * 0.3) * 2
  const y = yOffset + verticalVariation

  return [x, y, z]
}

/**
 * Calculate position for a Hadith "moon" orbiting a Surah
 * @param surahPosition - The position of the surah this hadith connects to
 * @param indexAroundSurah - Index of this hadith among all hadiths connected to this surah
 * @param totalAroundSurah - Total hadiths connected to this surah
 * @param orbitRadius - Local orbit radius (default 4)
 */
export function calculateHadithMoonPosition(
  surahPosition: [number, number, number],
  indexAroundSurah: number,
  totalAroundSurah: number,
  orbitRadius: number = 4
): [number, number, number] {
  const [sx, sy, sz] = surahPosition

  // Distribute hadiths evenly around the surah
  const angle = (indexAroundSurah / totalAroundSurah) * Math.PI * 2

  // Local orbit around surah
  const localX = Math.cos(angle) * orbitRadius
  const localZ = Math.sin(angle) * orbitRadius

  // Slight vertical offset for each hadith
  const verticalOffset = Math.sin(indexAroundSurah * 0.8) * 1.5

  return [
    sx + localX,
    sy + verticalOffset,
    sz + localZ
  ]
}

/**
 * Group surahs by pillar for orbital distribution
 * @param surahs - Array of surah numbers
 * @param pillarMap - Mapping of surah number to pillar
 */
export function groupSurahsByPillar(
  surahs: number[],
  pillarMap: Record<number, Pillar>
): Record<Pillar, number[]> {
  const groups: Record<Pillar, number[]> = {
    shahada: [],
    salah: [],
    zakat: [],
    sawm: [],
    hajj: [],
    general: []
  }

  surahs.forEach(surahNum => {
    const pillar = pillarMap[surahNum] || 'general'
    groups[pillar].push(surahNum)
  })

  return groups
}

/**
 * Calculate hadith position when it connects to multiple surahs
 * Places hadith at the midpoint between connected surahs
 */
export function calculateMultiConnectionHadithPosition(
  surahPositions: Array<[number, number, number]>
): [number, number, number] {
  if (surahPositions.length === 0) {
    return [0, 0, 0]
  }

  if (surahPositions.length === 1) {
    // Single connection: orbit around that surah
    return calculateHadithMoonPosition(surahPositions[0], 0, 1)
  }

  // Multiple connections: calculate centroid
  const sum = surahPositions.reduce(
    (acc, pos) => [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]],
    [0, 0, 0] as [number, number, number]
  )

  return [
    sum[0] / surahPositions.length,
    sum[1] / surahPositions.length,
    sum[2] / surahPositions.length
  ]
}
