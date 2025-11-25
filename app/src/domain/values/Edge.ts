/**
 * Edge Value Object
 * Represents a verified connection between a Quran verse and a Hadith
 *
 * Domain Rules:
 * - Must connect a valid verse to a valid hadith
 * - Must have a tier (1=Explicit, 2=Implicit, 3=Thematic)
 * - Must have a linkage type describing the relationship
 * - Must be verified with sources before marking as verified
 * - Weight must be between 0 and 1
 */

import { ValueObject } from '../base/ValueObject'
import { Result } from '../base/Result'
import { Pillar } from './Pillar'

export type EdgeTier = 1 | 2 | 3

export type LinkageType =
  | 'Explicit_Citation'
  | 'Implicit_Reference'
  | 'Thematic_Parallel'
  | 'Legal_Specification'
  | 'Contextual_Support'
  | 'Historical_Context'

export type VerificationStatus = 'manually_verified' | 'pending_review' | 'requires_revision'

interface VerseReference {
  surahNumber: number
  verseNumber: number
}

interface HadithReference {
  collection: string
  idInBook: number
}

interface VerificationSource {
  type: 'tafsir' | 'hadith_collection' | 'scholarly_work'
  title: string
  author?: string
  reference?: string
}

interface EdgeProps {
  verseRef: VerseReference
  hadithRef: HadithReference
  pillar: Pillar
  tier: EdgeTier
  linkageType: LinkageType
  weight: number
  verificationStatus: VerificationStatus
  verificationSources: VerificationSource[]
  notes?: string
}

export class Edge extends ValueObject<EdgeProps> {
  public static readonly MIN_WEIGHT = 0
  public static readonly MAX_WEIGHT = 1
  public static readonly MIN_SOURCES_FOR_VERIFICATION = 2

  get verseRef(): VerseReference {
    return this.props.verseRef
  }

  get hadithRef(): HadithReference {
    return this.props.hadithRef
  }

  get pillar(): Pillar {
    return this.props.pillar
  }

  get tier(): EdgeTier {
    return this.props.tier
  }

  get linkageType(): LinkageType {
    return this.props.linkageType
  }

  get weight(): number {
    return this.props.weight
  }

  get verificationStatus(): VerificationStatus {
    return this.props.verificationStatus
  }

  get verificationSources(): VerificationSource[] {
    return this.props.verificationSources
  }

  get notes(): string | undefined {
    return this.props.notes
  }

  private constructor(props: EdgeProps) {
    super(props)
  }

  /**
   * Create a new Edge value object
   */
  public static create(props: EdgeProps): Result<Edge> {
    // Validate verse reference
    const verseValidation = this.validateVerseRef(props.verseRef)
    if (verseValidation.isFailure) {
      return Result.fail<Edge>(verseValidation.error!)
    }

    // Validate hadith reference
    const hadithValidation = this.validateHadithRef(props.hadithRef)
    if (hadithValidation.isFailure) {
      return Result.fail<Edge>(hadithValidation.error!)
    }

    // Validate tier
    const tierValidation = this.validateTier(props.tier)
    if (tierValidation.isFailure) {
      return Result.fail<Edge>(tierValidation.error!)
    }

    // Validate weight
    const weightValidation = this.validateWeight(props.weight)
    if (weightValidation.isFailure) {
      return Result.fail<Edge>(weightValidation.error!)
    }

    // Validate verification
    const verificationValidation = this.validateVerification(
      props.verificationStatus,
      props.verificationSources
    )
    if (verificationValidation.isFailure) {
      return Result.fail<Edge>(verificationValidation.error!)
    }

    return Result.ok<Edge>(new Edge(props))
  }

  /**
   * Validate verse reference
   */
  private static validateVerseRef(ref: VerseReference): Result<void> {
    if (ref.surahNumber < 1 || ref.surahNumber > 114) {
      return Result.fail<void>('Surah number must be between 1 and 114')
    }

    if (!Number.isInteger(ref.verseNumber) || ref.verseNumber < 1) {
      return Result.fail<void>('Verse number must be a positive integer')
    }

    return Result.ok<void>()
  }

  /**
   * Validate hadith reference
   */
  private static validateHadithRef(ref: HadithReference): Result<void> {
    if (!ref.collection || ref.collection.trim().length === 0) {
      return Result.fail<void>('Hadith collection cannot be empty')
    }

    if (!Number.isInteger(ref.idInBook) || ref.idInBook < 1) {
      return Result.fail<void>('Hadith ID must be a positive integer')
    }

    return Result.ok<void>()
  }

  /**
   * Validate tier (1, 2, or 3)
   */
  private static validateTier(tier: EdgeTier): Result<void> {
    if (![1, 2, 3].includes(tier)) {
      return Result.fail<void>('Tier must be 1 (Explicit), 2 (Implicit), or 3 (Thematic)')
    }

    return Result.ok<void>()
  }

  /**
   * Validate weight (0-1)
   */
  private static validateWeight(weight: number): Result<void> {
    if (typeof weight !== 'number' || !isFinite(weight)) {
      return Result.fail<void>('Weight must be a finite number')
    }

    if (weight < this.MIN_WEIGHT || weight > this.MAX_WEIGHT) {
      return Result.fail<void>(
        `Weight must be between ${this.MIN_WEIGHT} and ${this.MAX_WEIGHT}`
      )
    }

    return Result.ok<void>()
  }

  /**
   * Validate verification status and sources
   */
  private static validateVerification(
    status: VerificationStatus,
    sources: VerificationSource[]
  ): Result<void> {
    // If manually verified, must have at least 2 sources
    if (status === 'manually_verified' && sources.length < this.MIN_SOURCES_FOR_VERIFICATION) {
      return Result.fail<void>(
        `Manually verified edges must have at least ${this.MIN_SOURCES_FOR_VERIFICATION} sources`
      )
    }

    // Validate each source
    for (const source of sources) {
      if (!source.title || source.title.trim().length === 0) {
        return Result.fail<void>('Verification source title cannot be empty')
      }
    }

    return Result.ok<void>()
  }

  /**
   * Check if edge is explicitly verified
   */
  public isVerified(): boolean {
    return this.verificationStatus === 'manually_verified'
  }

  /**
   * Check if edge is high confidence (Tier 1)
   */
  public isHighConfidence(): boolean {
    return this.tier === 1
  }

  /**
   * Get connection ID for graph visualization
   */
  public getConnectionId(): string {
    return `${this.verseRef.surahNumber}:${this.verseRef.verseNumber}->${this.hadithRef.collection}:${this.hadithRef.idInBook}`
  }

  /**
   * Get verse reference string
   */
  public getVerseReference(): string {
    return `${this.verseRef.surahNumber}:${this.verseRef.verseNumber}`
  }
}
