/**
 * Hadith Entity
 * Represents an authenticated saying or action of Prophet Muhammad (PBUH)
 *
 * Domain Rules:
 * - Must have a unique ID within its collection/book
 * - Must have both Arabic text and English translation
 * - Must specify the narrator (chain of transmission)
 * - Must specify the collection/book (e.g., Sahih al-Bukhari)
 * - Position in 3D space must have exactly 3 coordinates
 * - Can be connected to multiple Quran verses
 */

import { Entity } from '../base/Entity'
import { Result } from '../base/Result'
import { Pillar } from '../values/Pillar'

export interface HadithProps {
  idInBook: number
  bookId: number
  chapterId: number
  collection: HadithCollection
  textArabic: string
  textEnglish: string
  narrator: string
  position: [number, number, number]
  connections: string[] // IDs of connected surahs
  pillar: Pillar
  grade?: HadithGrade
}

export type HadithCollection = 'sahih-bukhari' | 'sahih-muslim' | 'sunan-abu-dawud' | 'jami-at-tirmidhi' | 'sunan-an-nasai' | 'sunan-ibn-majah'

export type HadithGrade = 'sahih' | 'hasan' | 'daif' | 'mawdu'

export class Hadith extends Entity<HadithProps> {
  // Domain constants
  public static readonly MIN_TEXT_LENGTH = 10
  public static readonly MAX_TEXT_LENGTH = 10000
  public static readonly MIN_NARRATOR_LENGTH = 3
  public static readonly MAX_NARRATOR_LENGTH = 500

  get idInBook(): number {
    return this.props.idInBook
  }

  get bookId(): number {
    return this.props.bookId
  }

  get chapterId(): number {
    return this.props.chapterId
  }

  get collection(): HadithCollection {
    return this.props.collection
  }

  get textArabic(): string {
    return this.props.textArabic
  }

  get textEnglish(): string {
    return this.props.textEnglish
  }

  get narrator(): string {
    return this.props.narrator
  }

  get position(): [number, number, number] {
    return this.props.position
  }

  get connections(): string[] {
    return this.props.connections
  }

  get pillar(): Pillar {
    return this.props.pillar
  }

  get grade(): HadithGrade | undefined {
    return this.props.grade
  }

  private constructor(id: string, props: HadithProps) {
    super(id, props)
  }

  /**
   * Create a new Hadith entity
   */
  public static create(props: HadithProps): Result<Hadith> {
    // Validate ID in book
    const idValidation = this.validateIdInBook(props.idInBook)
    if (idValidation.isFailure) {
      return Result.fail<Hadith>(idValidation.error!)
    }

    // Validate Arabic text
    const arabicValidation = this.validateText(props.textArabic, 'Arabic')
    if (arabicValidation.isFailure) {
      return Result.fail<Hadith>(arabicValidation.error!)
    }

    // Validate English text
    const englishValidation = this.validateText(props.textEnglish, 'English')
    if (englishValidation.isFailure) {
      return Result.fail<Hadith>(englishValidation.error!)
    }

    // Validate narrator
    const narratorValidation = this.validateNarrator(props.narrator)
    if (narratorValidation.isFailure) {
      return Result.fail<Hadith>(narratorValidation.error!)
    }

    // Validate position
    const positionValidation = this.validatePosition(props.position)
    if (positionValidation.isFailure) {
      return Result.fail<Hadith>(positionValidation.error!)
    }

    // Validate connections
    const connectionsValidation = this.validateConnections(props.connections)
    if (connectionsValidation.isFailure) {
      return Result.fail<Hadith>(connectionsValidation.error!)
    }

    // Generate ID from collection and book ID
    const id = `hadith-${props.idInBook}`

    return Result.ok<Hadith>(new Hadith(id, props))
  }

  /**
   * Validate ID in book
   */
  private static validateIdInBook(id: number): Result<void> {
    if (!Number.isInteger(id) || id < 1) {
      return Result.fail<void>('Hadith ID in book must be a positive integer')
    }
    return Result.ok<void>()
  }

  /**
   * Validate text (Arabic or English)
   */
  private static validateText(text: string, language: string): Result<void> {
    if (!text || text.trim().length === 0) {
      return Result.fail<void>(`${language} text cannot be empty`)
    }

    if (text.length < this.MIN_TEXT_LENGTH) {
      return Result.fail<void>(
        `${language} text must be at least ${this.MIN_TEXT_LENGTH} characters`
      )
    }

    if (text.length > this.MAX_TEXT_LENGTH) {
      return Result.fail<void>(
        `${language} text cannot exceed ${this.MAX_TEXT_LENGTH} characters`
      )
    }

    return Result.ok<void>()
  }

  /**
   * Validate narrator
   */
  private static validateNarrator(narrator: string): Result<void> {
    if (!narrator || narrator.trim().length === 0) {
      return Result.fail<void>('Narrator cannot be empty')
    }

    if (narrator.length < this.MIN_NARRATOR_LENGTH) {
      return Result.fail<void>(
        `Narrator must be at least ${this.MIN_NARRATOR_LENGTH} characters`
      )
    }

    if (narrator.length > this.MAX_NARRATOR_LENGTH) {
      return Result.fail<void>(
        `Narrator cannot exceed ${this.MAX_NARRATOR_LENGTH} characters`
      )
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
   * Validate connections array
   */
  private static validateConnections(connections: string[]): Result<void> {
    if (!Array.isArray(connections)) {
      return Result.fail<void>('Connections must be an array')
    }

    // Check for duplicate connections
    const uniqueConnections = new Set(connections)
    if (uniqueConnections.size !== connections.length) {
      return Result.fail<void>('Connections cannot contain duplicates')
    }

    return Result.ok<void>()
  }

  /**
   * Check if hadith is Sahih (authentic)
   */
  public isSahih(): boolean {
    return this.grade === 'sahih'
  }

  /**
   * Check if hadith is Hasan (good)
   */
  public isHasan(): boolean {
    return this.grade === 'hasan'
  }

  /**
   * Check if hadith is weak or fabricated
   */
  public isWeak(): boolean {
    return this.grade === 'daif' || this.grade === 'mawdu'
  }

  /**
   * Get number of connections to Quran verses
   */
  public getConnectionCount(): number {
    return this.connections.length
  }

  /**
   * Check if connected to a specific surah
   */
  public isConnectedToSurah(surahId: string): boolean {
    return this.connections.includes(surahId)
  }

  /**
   * Add connection to a surah
   */
  public addConnection(surahId: string): Result<Hadith> {
    if (this.connections.includes(surahId)) {
      return Result.fail<Hadith>('Connection already exists')
    }

    const newConnections = [...this.connections, surahId]
    return Hadith.create({
      ...this.props,
      connections: newConnections,
    })
  }

  /**
   * Convert to plain object for serialization
   */
  public toObject(): {
    id: string
    idInBook: number
    bookId: number
    chapterId: number
    collection: string
    textArabic: string
    textEnglish: string
    narrator: string
    position: [number, number, number]
    connections: string[]
    pillar: string
    grade?: string
  } {
    return {
      id: this.id,
      idInBook: this.idInBook,
      bookId: this.bookId,
      chapterId: this.chapterId,
      collection: this.collection,
      textArabic: this.textArabic,
      textEnglish: this.textEnglish,
      narrator: this.narrator,
      position: this.position,
      connections: this.connections,
      pillar: this.pillar.type,
      grade: this.grade,
    }
  }
}
