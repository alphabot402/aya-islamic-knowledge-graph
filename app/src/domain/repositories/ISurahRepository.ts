/**
 * Surah Repository Interface
 * Defines contract for Surah data access
 *
 * Repository Pattern:
 * - Abstracts data access logic
 * - Returns domain entities, not DTOs
 * - Allows easy switching between data sources (API, DB, cache)
 */

import { Surah } from '../entities/Surah'
import { Result } from '../base/Result'
import { PillarType } from '../values/Pillar'

export interface ISurahRepository {
  /**
   * Get a single surah by number (1-114)
   */
  findByNumber(surahNumber: number): Promise<Result<Surah>>

  /**
   * Get all surahs
   */
  findAll(): Promise<Result<Surah[]>>

  /**
   * Get surahs by pillar category
   */
  findByPillar(pillar: PillarType): Promise<Result<Surah[]>>

  /**
   * Get surahs by revelation type
   */
  findByRevelationType(type: 'Meccan' | 'Medinan'): Promise<Result<Surah[]>>

  /**
   * Search surahs by name (Arabic or English)
   */
  searchByName(query: string): Promise<Result<Surah[]>>

  /**
   * Get count of surahs
   */
  count(): Promise<Result<number>>

  /**
   * Check if surah exists
   */
  exists(surahNumber: number): Promise<Result<boolean>>
}
