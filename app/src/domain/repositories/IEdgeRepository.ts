/**
 * Edge Repository Interface
 * Defines contract for Edge (connection) data access
 */

import { Edge, EdgeTier, VerificationStatus } from '../values/Edge'
import { Result } from '../base/Result'
import { PillarType } from '../values/Pillar'

export interface IEdgeRepository {
  /**
   * Get all edges
   */
  findAll(): Promise<Result<Edge[]>>

  /**
   * Get edges for a specific verse
   */
  findByVerse(surahNumber: number, verseNumber: number): Promise<Result<Edge[]>>

  /**
   * Get edges for a specific hadith
   */
  findByHadith(collection: string, idInBook: number): Promise<Result<Edge[]>>

  /**
   * Get edges by pillar category
   */
  findByPillar(pillar: PillarType): Promise<Result<Edge[]>>

  /**
   * Get edges by tier (1=Explicit, 2=Implicit, 3=Thematic)
   */
  findByTier(tier: EdgeTier): Promise<Result<Edge[]>>

  /**
   * Get edges by verification status
   */
  findByVerificationStatus(status: VerificationStatus): Promise<Result<Edge[]>>

  /**
   * Get only verified edges
   */
  findVerified(): Promise<Result<Edge[]>>

  /**
   * Get count of edges
   */
  count(): Promise<Result<number>>

  /**
   * Get count of verified edges
   */
  countVerified(): Promise<Result<number>>

  /**
   * Check if edge exists between verse and hadith
   */
  exists(
    surahNumber: number,
    verseNumber: number,
    collection: string,
    hadithId: number
  ): Promise<Result<boolean>>
}
