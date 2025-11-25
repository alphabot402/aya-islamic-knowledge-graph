/**
 * Hadith Repository Interface
 * Defines contract for Hadith data access
 */

import { Hadith, HadithCollection } from '../entities/Hadith'
import { Result } from '../base/Result'
import { PillarType } from '../values/Pillar'

export interface IHadithRepository {
  /**
   * Get a single hadith by ID
   */
  findById(id: string): Promise<Result<Hadith>>

  /**
   * Get hadith by ID within collection
   */
  findByIdInBook(collection: HadithCollection, idInBook: number): Promise<Result<Hadith>>

  /**
   * Get all hadiths
   */
  findAll(): Promise<Result<Hadith[]>>

  /**
   * Get hadiths by collection
   */
  findByCollection(collection: HadithCollection): Promise<Result<Hadith[]>>

  /**
   * Get hadiths connected to a specific surah
   */
  findConnectedToSurah(surahId: string): Promise<Result<Hadith[]>>

  /**
   * Get hadiths by multiple IDs (for smart loading)
   */
  findByIds(ids: number[]): Promise<Result<Hadith[]>>

  /**
   * Search hadiths by text (English or Arabic)
   */
  searchByText(query: string): Promise<Result<Hadith[]>>

  /**
   * Get hadiths by pillar category
   */
  findByPillar(pillar: PillarType): Promise<Result<Hadith[]>>

  /**
   * Get count of hadiths
   */
  count(): Promise<Result<number>>

  /**
   * Check if hadith exists
   */
  exists(id: string): Promise<Result<boolean>>
}
