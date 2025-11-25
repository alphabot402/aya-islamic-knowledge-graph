/**
 * Graph Layout Service
 * Domain service for calculating 3D positions of nodes in the graph
 *
 * Domain Logic:
 * - Surahs arranged in spiral pattern (114 surahs)
 * - Hadiths arranged in outer ring
 * - Positions calculated based on index and total count
 * - Height variation creates visual depth
 */

import { Surah } from '../entities/Surah'
import { Hadith } from '../entities/Hadith'
import { Result } from '../base/Result'

export interface Position3D {
  x: number
  y: number
  z: number
}

export class GraphLayoutService {
  // Layout constants
  private static readonly SURAH_SPIRAL_TURNS = 3.5
  private static readonly SURAH_INNER_RADIUS = 22
  private static readonly SURAH_OUTER_RADIUS = 57
  private static readonly SURAH_HEIGHT_VARIATION = 10
  private static readonly HADITH_RADIUS = 70
  private static readonly HADITH_HEIGHT_VARIATION = 3

  /**
   * Calculate position for a surah node in spiral pattern
   */
  public static calculateSurahPosition(
    surahNumber: number,
    totalSurahs: number = 114
  ): Result<Position3D> {
    if (surahNumber < 1 || surahNumber > totalSurahs) {
      return Result.fail<Position3D>(`Surah number must be between 1 and ${totalSurahs}`)
    }

    const index = surahNumber - 1 // 0-based index

    // Spiral angle (multiple rotations)
    const angle = (index * Math.PI * 2 * this.SURAH_SPIRAL_TURNS) / totalSurahs

    // Radius increases from inner to outer
    const radius =
      this.SURAH_INNER_RADIUS +
      (index / totalSurahs) * (this.SURAH_OUTER_RADIUS - this.SURAH_INNER_RADIUS)

    // Height varies sinusoidally for visual interest
    const height = Math.sin(index * 0.18) * this.SURAH_HEIGHT_VARIATION

    const position: Position3D = {
      x: Math.cos(angle) * radius,
      y: height,
      z: Math.sin(angle) * radius,
    }

    return Result.ok<Position3D>(position)
  }

  /**
   * Calculate position for a hadith node in outer ring
   */
  public static calculateHadithPosition(
    hadithIndex: number,
    totalHadiths: number
  ): Result<Position3D> {
    if (hadithIndex < 0 || hadithIndex >= totalHadiths) {
      return Result.fail<Position3D>(
        `Hadith index must be between 0 and ${totalHadiths - 1}`
      )
    }

    if (totalHadiths === 0) {
      return Result.fail<Position3D>('Total hadiths must be greater than 0')
    }

    // Evenly distribute hadiths in a circle
    const angle = (hadithIndex / totalHadiths) * Math.PI * 2

    // Height varies slightly for visual interest
    const height = Math.sin(hadithIndex * 0.5) * this.HADITH_HEIGHT_VARIATION

    const position: Position3D = {
      x: Math.cos(angle) * this.HADITH_RADIUS,
      y: height,
      z: Math.sin(angle) * this.HADITH_RADIUS,
    }

    return Result.ok<Position3D>(position)
  }

  /**
   * Calculate positions for all surahs
   */
  public static calculateAllSurahPositions(): Result<Map<number, Position3D>> {
    const positions = new Map<number, Position3D>()

    for (let surahNumber = 1; surahNumber <= 114; surahNumber++) {
      const positionResult = this.calculateSurahPosition(surahNumber)
      if (positionResult.isFailure) {
        return Result.fail<Map<number, Position3D>>(positionResult.error!)
      }
      positions.set(surahNumber, positionResult.value)
    }

    return Result.ok<Map<number, Position3D>>(positions)
  }

  /**
   * Calculate distance between two positions
   */
  public static calculateDistance(pos1: Position3D, pos2: Position3D): number {
    const dx = pos2.x - pos1.x
    const dy = pos2.y - pos1.y
    const dz = pos2.z - pos1.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Apply position to a surah entity (returns new surah with position)
   */
  public static applySurahPosition(surah: Surah, position: Position3D): Result<Surah> {
    return Surah.create({
      surahNumber: surah.surahNumber,
      nameArabic: surah.nameArabic,
      nameEnglish: surah.nameEnglish,
      verseCount: surah.verseCount,
      pillar: surah.pillar,
      position: [position.x, position.y, position.z],
      revelationType: surah.revelationType,
      revelationOrder: surah.revelationOrder,
    })
  }

  /**
   * Apply position to a hadith entity (returns new hadith with position)
   */
  public static applyHadithPosition(hadith: Hadith, position: Position3D): Result<Hadith> {
    return Hadith.create({
      idInBook: hadith.idInBook,
      bookId: hadith.bookId,
      chapterId: hadith.chapterId,
      collection: hadith.collection,
      textArabic: hadith.textArabic,
      textEnglish: hadith.textEnglish,
      narrator: hadith.narrator,
      position: [position.x, position.y, position.z],
      connections: hadith.connections,
      pillar: hadith.pillar,
      grade: hadith.grade,
    })
  }
}
