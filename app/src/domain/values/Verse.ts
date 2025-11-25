/**
 * Verse Value Object
 * Represents a single verse (ayah) from the Quran
 *
 * Domain Rules:
 * - Verse number must be positive
 * - Must belong to a valid surah (1-114)
 * - Arabic text is required
 * - English translation is optional but recommended
 */

import { ValueObject } from '../base/ValueObject'
import { Result } from '../base/Result'

interface VerseProps {
  surahNumber: number
  verseNumber: number
  textArabic: string
  textEnglish?: string
}

export class Verse extends ValueObject<VerseProps> {
  public static readonly MIN_VERSE_NUMBER = 1
  public static readonly MIN_TEXT_LENGTH = 3
  public static readonly MAX_TEXT_LENGTH = 5000

  get surahNumber(): number {
    return this.props.surahNumber
  }

  get verseNumber(): number {
    return this.props.verseNumber
  }

  get textArabic(): string {
    return this.props.textArabic
  }

  get textEnglish(): string | undefined {
    return this.props.textEnglish
  }

  private constructor(props: VerseProps) {
    super(props)
  }

  /**
   * Create a new Verse value object
   */
  public static create(props: VerseProps): Result<Verse> {
    // Validate surah number (1-114)
    if (props.surahNumber < 1 || props.surahNumber > 114) {
      return Result.fail<Verse>('Surah number must be between 1 and 114')
    }

    // Validate verse number
    if (!Number.isInteger(props.verseNumber) || props.verseNumber < this.MIN_VERSE_NUMBER) {
      return Result.fail<Verse>(`Verse number must be at least ${this.MIN_VERSE_NUMBER}`)
    }

    // Validate Arabic text
    if (!props.textArabic || props.textArabic.trim().length === 0) {
      return Result.fail<Verse>('Arabic text cannot be empty')
    }

    if (props.textArabic.length < this.MIN_TEXT_LENGTH) {
      return Result.fail<Verse>(
        `Arabic text must be at least ${this.MIN_TEXT_LENGTH} characters`
      )
    }

    if (props.textArabic.length > this.MAX_TEXT_LENGTH) {
      return Result.fail<Verse>(
        `Arabic text cannot exceed ${this.MAX_TEXT_LENGTH} characters`
      )
    }

    return Result.ok<Verse>(new Verse(props))
  }

  /**
   * Get verse reference (e.g., "2:255" for Ayat al-Kursi)
   */
  public getReference(): string {
    return `${this.surahNumber}:${this.verseNumber}`
  }

  /**
   * Check if verse has English translation
   */
  public hasEnglishTranslation(): boolean {
    return !!this.textEnglish && this.textEnglish.trim().length > 0
  }
}
