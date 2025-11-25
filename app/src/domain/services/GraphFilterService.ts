/**
 * Graph Filter Service
 * Domain service for filtering and searching graph nodes
 *
 * Domain Logic:
 * - Case-insensitive search across names and text
 * - Pillar-based filtering
 * - Support for Arabic and English text
 */

import { Surah } from '../entities/Surah'
import { Hadith } from '../entities/Hadith'
import { PillarType } from '../values/Pillar'
import { Result } from '../base/Result'

export class GraphFilterService {
  /**
   * Filter surahs by search query
   * Searches: surah number, Arabic name, English name
   */
  public static filterSurahs(surahs: Surah[], query: string): Result<Surah[]> {
    if (!query || query.trim().length === 0) {
      return Result.ok<Surah[]>(surahs)
    }

    const normalizedQuery = query.toLowerCase().trim()

    const filtered = surahs.filter(surah => {
      // Check surah number
      if (surah.surahNumber.toString().includes(normalizedQuery)) {
        return true
      }

      // Check Arabic name (case-insensitive)
      if (surah.nameArabic.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      // Check English name (case-insensitive)
      if (surah.nameEnglish.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      return false
    })

    return Result.ok<Surah[]>(filtered)
  }

  /**
   * Filter hadiths by search query
   * Searches: hadith ID, English text, Arabic text, narrator
   */
  public static filterHadiths(hadiths: Hadith[], query: string): Result<Hadith[]> {
    if (!query || query.trim().length === 0) {
      return Result.ok<Hadith[]>(hadiths)
    }

    const normalizedQuery = query.toLowerCase().trim()

    const filtered = hadiths.filter(hadith => {
      // Check hadith ID
      if (hadith.id.includes(normalizedQuery)) {
        return true
      }

      if (hadith.idInBook.toString().includes(normalizedQuery)) {
        return true
      }

      // Check English text (case-insensitive)
      if (hadith.textEnglish.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      // Check Arabic text (case-insensitive)
      if (hadith.textArabic.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      // Check narrator (case-insensitive)
      if (hadith.narrator.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      return false
    })

    return Result.ok<Hadith[]>(filtered)
  }

  /**
   * Filter surahs by pillar
   */
  public static filterSurahsByPillar(
    surahs: Surah[],
    pillar: PillarType | 'all'
  ): Result<Surah[]> {
    if (pillar === 'all') {
      return Result.ok<Surah[]>(surahs)
    }

    const filtered = surahs.filter(surah => surah.pillar.type === pillar)

    return Result.ok<Surah[]>(filtered)
  }

  /**
   * Filter hadiths by pillar
   */
  public static filterHadithsByPillar(
    hadiths: Hadith[],
    pillar: PillarType | 'all'
  ): Result<Hadith[]> {
    if (pillar === 'all') {
      return Result.ok<Hadith[]>(hadiths)
    }

    const filtered = hadiths.filter(hadith => hadith.pillar.type === pillar)

    return Result.ok<Hadith[]>(filtered)
  }

  /**
   * Combined filter: search query + pillar filter
   */
  public static filterSurahsCombined(
    surahs: Surah[],
    query: string,
    pillar: PillarType | 'all'
  ): Result<Surah[]> {
    // First apply pillar filter
    const pillarFilterResult = this.filterSurahsByPillar(surahs, pillar)
    if (pillarFilterResult.isFailure) {
      return pillarFilterResult
    }

    // Then apply search filter
    return this.filterSurahs(pillarFilterResult.value, query)
  }

  /**
   * Get count by pillar
   */
  public static countByPillar(surahs: Surah[]): Record<PillarType, number> {
    const counts: Record<PillarType, number> = {
      shahada: 0,
      salah: 0,
      zakat: 0,
      sawm: 0,
      hajj: 0,
      general: 0,
    }

    surahs.forEach(surah => {
      const pillarType = surah.pillar.type
      counts[pillarType]++
    })

    return counts
  }

  /**
   * Get hadiths connected to a specific surah
   */
  public static getConnectedHadiths(
    hadiths: Hadith[],
    surahId: string
  ): Result<Hadith[]> {
    const connected = hadiths.filter(hadith => hadith.isConnectedToSurah(surahId))

    return Result.ok<Hadith[]>(connected)
  }

  /**
   * Get connection count for all hadiths
   */
  public static getTotalConnectionCount(hadiths: Hadith[]): number {
    return hadiths.reduce((sum, hadith) => sum + hadith.getConnectionCount(), 0)
  }
}
