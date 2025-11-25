/**
 * Pillar Value Object
 * Represents the Five Pillars of Islam
 *
 * Domain Rules:
 * - Must be one of the five valid pillars or general
 * - Each pillar has Arabic and English names
 * - Each pillar has a specific color for visualization
 */

import { ValueObject } from '../base/ValueObject'
import { Result } from '../base/Result'

export type PillarType = 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj' | 'general'

interface PillarProps {
  type: PillarType
  name: string
  nameArabic: string
  color: string
}

export class Pillar extends ValueObject<PillarProps> {
  // Pillar definitions following Islamic tradition
  private static readonly PILLAR_DEFINITIONS: Record<PillarType, Omit<PillarProps, 'type'>> = {
    shahada: {
      name: 'Shahada',
      nameArabic: 'الشهادة',
      color: '#9333ea', // Deep Purple - Declaration of Faith
    },
    salah: {
      name: 'Salah',
      nameArabic: 'الصلاة',
      color: '#2563eb', // Royal Blue - Prayer
    },
    zakat: {
      name: 'Zakat',
      nameArabic: 'الزكاة',
      color: '#059669', // Emerald Green - Charity
    },
    sawm: {
      name: 'Sawm',
      nameArabic: 'الصوم',
      color: '#dc2626', // Deep Red - Fasting
    },
    hajj: {
      name: 'Hajj',
      nameArabic: 'الحج',
      color: '#b91c1c', // Crimson - Pilgrimage
    },
    general: {
      name: 'General',
      nameArabic: 'عام',
      color: '#475569', // Slate Gray - General Topics
    },
  }

  get type(): PillarType {
    return this.props.type
  }

  get name(): string {
    return this.props.name
  }

  get nameArabic(): string {
    return this.props.nameArabic
  }

  get color(): string {
    return this.props.color
  }

  private constructor(props: PillarProps) {
    super(props)
  }

  /**
   * Create a Pillar from a type string
   */
  public static create(type: string): Result<Pillar> {
    // Validate pillar type
    if (!this.isValidPillarType(type)) {
      return Result.fail<Pillar>(
        `Invalid pillar type: "${type}". Must be one of: shahada, salah, zakat, sawm, hajj, general`
      )
    }

    const pillarType = type as PillarType
    const definition = this.PILLAR_DEFINITIONS[pillarType]

    return Result.ok<Pillar>(
      new Pillar({
        type: pillarType,
        ...definition,
      })
    )
  }

  /**
   * Check if a string is a valid pillar type
   */
  public static isValidPillarType(type: string): type is PillarType {
    return ['shahada', 'salah', 'zakat', 'sawm', 'hajj', 'general'].includes(type)
  }

  /**
   * Get all valid pillar types
   */
  public static getAllTypes(): PillarType[] {
    return ['shahada', 'salah', 'zakat', 'sawm', 'hajj', 'general']
  }

  /**
   * Get all pillars
   */
  public static getAll(): Pillar[] {
    return this.getAllTypes().map(type => {
      const result = this.create(type)
      if (result.isFailure) {
        throw new Error(result.error)
      }
      return result.value
    })
  }

  /**
   * Get pillar info for UI display
   */
  public toDisplayObject(): { name: string; nameAr: string; color: string } {
    return {
      name: this.name,
      nameAr: this.nameArabic,
      color: this.color,
    }
  }
}
