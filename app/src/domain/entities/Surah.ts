/**
 * Surah Entity
 * Represents a chapter of the Quran
 *
 * Domain Rules:
 * - Surah number must be between 1 and 114 (inclusive)
 * - Each surah has a unique number
 * - Arabic name is required and cannot be empty
 * - English name is required and cannot be empty
 * - Verse count must be positive
 * - Each surah is categorized under one of the Five Pillars
 * - Position in 3D space must have exactly 3 coordinates
 */

import { Entity } from '../base/Entity'
import { Result } from '../base/Result'
import { Pillar } from '../values/Pillar'

export interface SurahProps {
  surahNumber: number
  nameArabic: string
  nameEnglish: string
  verseCount: number
  pillar: Pillar
  position: [number, number, number]
  revelationType?: 'Meccan' | 'Medinan'
  revelationOrder?: number
}

export class Surah extends Entity<SurahProps> {
  // Domain constants
  public static readonly MIN_SURAH_NUMBER = 1
  public static readonly MAX_SURAH_NUMBER = 114
  public static readonly MIN_VERSE_COUNT = 1

  get surahNumber(): number {
    return this.props.surahNumber
  }

  get nameArabic(): string {
    return this.props.nameArabic
  }

  get nameEnglish(): string {
    return this.props.nameEnglish
  }

  get verseCount(): number {
    return this.props.verseCount
  }

  get pillar(): Pillar {
    return this.props.pillar
  }

  get position(): [number, number, number] {
    return this.props.position
  }

  get revelationType(): 'Meccan' | 'Medinan' | undefined {
    return this.props.revelationType
  }

  get revelationOrder(): number | undefined {
    return this.props.revelationOrder
  }

  private constructor(id: string, props: SurahProps) {
    super(id, props)
  }

  /**
   * Create a new Surah entity
   */
  public static create(props: SurahProps): Result<Surah> {
    // Validate surah number
    const surahNumberValidation = this.validateSurahNumber(props.surahNumber)
    if (surahNumberValidation.isFailure) {
      return Result.fail<Surah>(surahNumberValidation.error!)
    }

    // Validate Arabic name
    const arabicNameValidation = this.validateName(props.nameArabic, 'Arabic')
    if (arabicNameValidation.isFailure) {
      return Result.fail<Surah>(arabicNameValidation.error!)
    }

    // Validate English name
    const englishNameValidation = this.validateName(props.nameEnglish, 'English')
    if (englishNameValidation.isFailure) {
      return Result.fail<Surah>(englishNameValidation.error!)
    }

    // Validate verse count
    const verseCountValidation = this.validateVerseCount(props.verseCount)
    if (verseCountValidation.isFailure) {
      return Result.fail<Surah>(verseCountValidation.error!)
    }

    // Validate position
    const positionValidation = this.validatePosition(props.position)
    if (positionValidation.isFailure) {
      return Result.fail<Surah>(positionValidation.error!)
    }

    // Generate ID from surah number
    const id = `surah-${props.surahNumber}`

    return Result.ok<Surah>(new Surah(id, props))
  }

  /**
   * Validate surah number (1-114)
   */
  private static validateSurahNumber(surahNumber: number): Result<void> {
    if (!Number.isInteger(surahNumber)) {
      return Result.fail<void>('Surah number must be an integer')
    }

    if (surahNumber < this.MIN_SURAH_NUMBER || surahNumber > this.MAX_SURAH_NUMBER) {
      return Result.fail<void>(
        `Surah number must be between ${this.MIN_SURAH_NUMBER} and ${this.MAX_SURAH_NUMBER}`
      )
    }

    return Result.ok<void>()
  }

  /**
   * Validate name (Arabic or English)
   */
  private static validateName(name: string, language: string): Result<void> {
    if (!name || name.trim().length === 0) {
      return Result.fail<void>(`${language} name cannot be empty`)
    }

    if (name.length > 200) {
      return Result.fail<void>(`${language} name cannot exceed 200 characters`)
    }

    return Result.ok<void>()
  }

  /**
   * Validate verse count
   */
  private static validateVerseCount(count: number): Result<void> {
    if (!Number.isInteger(count)) {
      return Result.fail<void>('Verse count must be an integer')
    }

    if (count < this.MIN_VERSE_COUNT) {
      return Result.fail<void>(`Verse count must be at least ${this.MIN_VERSE_COUNT}`)
    }

    return Result.ok<void>()
  }

  /**
   * Validate 3D position
   */
  private static validatePosition(position: [number, number, number]): Result<void> {
    if (!Array.isArray(position) || position.length !== 3) {
      return Result.fail<void>('Position must be an array of 3 numbers [x, y, z]')
    }

    if (position.some(coord => typeof coord !== 'number' || !isFinite(coord))) {
      return Result.fail<void>('All position coordinates must be finite numbers')
    }

    return Result.ok<void>()
  }

  /**
   * Check if this surah is Meccan
   */
  public isMeccan(): boolean {
    return this.props.revelationType === 'Meccan'
  }

  /**
   * Check if this surah is Medinan
   */
  public isMedianan(): boolean {
    return this.props.revelationType === 'Medinan'
  }

  /**
   * Get display name (prioritizes Arabic)
   */
  public getDisplayName(): string {
    return this.nameArabic
  }

  /**
   * Convert to plain object for serialization
   */
  public toObject(): {
    id: string
    surahNumber: number
    nameArabic: string
    nameEnglish: string
    verseCount: number
    pillar: string
    position: [number, number, number]
    revelationType?: string
    revelationOrder?: number
  } {
    return {
      id: this.id,
      surahNumber: this.surahNumber,
      nameArabic: this.nameArabic,
      nameEnglish: this.nameEnglish,
      verseCount: this.verseCount,
      pillar: this.pillar.type,
      position: this.position,
      revelationType: this.revelationType,
      revelationOrder: this.revelationOrder,
    }
  }
}
