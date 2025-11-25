/**
 * Orbital Layout Engine
 * Implements circular row pattern for organized node placement
 *
 * Layout Concept - Perfect Circular Rows:
 * - Center (0,0,0): Shahada surahs in vertical column
 * - Row 1 (R=30): Salah surahs
 * - Row 2 (R=42): Zakat surahs
 * - Row 3 (R=54): General surahs (slightly elevated)
 * - Row 4 (R=66): Sawm surahs
 * - Row 5 (R=78): Hajj surahs
 * - Hadiths: Small circular orbits around connected surahs (flat, same Y level)
 */

import { type Pillar } from '@/hooks/useGraphData.orbital'

// ============================================================================
// CIRCULAR ROW CONFIGURATION
// ============================================================================

export const PILLAR_ORBITS: Record<Pillar, { radius: number; yOffset: number }> = {
  shahada: { radius: 20, yOffset: 0 },     // Row 1 - Innermost circle (Foundation)
  salah: { radius: 36, yOffset: 0 },       // Row 2 - Prayer
  zakat: { radius: 52, yOffset: 0 },       // Row 3 - Charity
  sawm: { radius: 68, yOffset: 0 },        // Row 4 - Fasting
  hajj: { radius: 84, yOffset: 0 },        // Row 5 - Pilgrimage (Outer circle)
  general: { radius: 52, yOffset: 0 }      // Mapped to middle ring (will be filtered out)
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

  // All pillars use standard circular positioning - Five Pillars only
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
 * Distinct from the Five Pillars - flat circular row
 */
function calculateGeneralPlanePosition(
  index: number,
  total: number
): [number, number, number] {
  const radius = 54
  const yOffset = 8 // Slightly elevated above other orbits

  // Distribute evenly around the circle in perfect row
  const angle = (index / total) * Math.PI * 2
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  // Flat circular row (no wave pattern)
  return [x, yOffset, z]
}

/**
 * Standard orbital positioning for pillar rings
 * Distributes nodes evenly around the orbital ring in a perfect circle
 */
function calculateOrbitalPosition(
  radius: number,
  index: number,
  total: number,
  yOffset: number
): [number, number, number] {
  // Distribute evenly around the circle
  const angle = (index / total) * Math.PI * 2

  // XZ plane positioning - perfect circular row
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  // Keep y consistent for flat circular rows
  const y = yOffset

  return [x, y, z]
}

/**
 * Calculate position for a Hadith "moon" orbiting a Surah
 * Now uses flat circular positioning for clearer row pattern
 * @param surahPosition - The position of the surah this hadith connects to
 * @param indexAroundSurah - Index of this hadith among all hadiths connected to this surah
 * @param totalAroundSurah - Total hadiths connected to this surah
 * @param orbitRadius - Local orbit radius (default 2.5)
 */
export function calculateHadithMoonPosition(
  surahPosition: [number, number, number],
  indexAroundSurah: number,
  totalAroundSurah: number,
  orbitRadius: number = 2.5
): [number, number, number] {
  const [sx, sy, sz] = surahPosition

  // Distribute hadiths evenly around the surah in a perfect circle
  const angle = (indexAroundSurah / totalAroundSurah) * Math.PI * 2

  // Local orbit around surah - flat circular pattern
  const localX = Math.cos(angle) * orbitRadius
  const localZ = Math.sin(angle) * orbitRadius

  // Keep same Y level as surah for flat circular rows
  return [
    sx + localX,
    sy,
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
