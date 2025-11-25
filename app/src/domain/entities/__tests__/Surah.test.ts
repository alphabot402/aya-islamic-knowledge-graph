/**
 * Tests for Surah Entity
 */

import { Surah } from '../Surah'
import { Pillar } from '../../values/Pillar'

describe('Surah Entity', () => {
  const validPillar = Pillar.create('shahada').value

  const validProps = {
    surahNumber: 1,
    nameArabic: 'الفاتحة',
    nameEnglish: 'Al-Fatihah',
    verseCount: 7,
    pillar: validPillar,
    position: [0, 0, 0] as [number, number, number],
    revelationType: 'Meccan' as const,
    revelationOrder: 5,
  }

  describe('create', () => {
    it('should create a valid surah', () => {
      const result = Surah.create(validProps)

      expect(result.isSuccess).toBe(true)
      expect(result.value.surahNumber).toBe(1)
      expect(result.value.nameArabic).toBe('الفاتحة')
      expect(result.value.nameEnglish).toBe('Al-Fatihah')
      expect(result.value.verseCount).toBe(7)
      expect(result.value.id).toBe('surah-1')
    })

    it('should create surah with minimal required fields', () => {
      const minimalProps = {
        surahNumber: 2,
        nameArabic: 'البقرة',
        nameEnglish: 'Al-Baqarah',
        verseCount: 286,
        pillar: validPillar,
        position: [1, 0, 0] as [number, number, number],
      }

      const result = Surah.create(minimalProps)

      expect(result.isSuccess).toBe(true)
      expect(result.value.revelationType).toBeUndefined()
      expect(result.value.revelationOrder).toBeUndefined()
    })

    it('should fail for invalid surah number (too low)', () => {
      const result = Surah.create({
        ...validProps,
        surahNumber: 0,
      })

      expect(result.isFailure).toBe(true)
      expect(result.error).toContain('must be between 1 and 114')
    })

    it('should fail for invalid surah number (too high)', () => {
      const result = Surah.create({
        ...validProps,
        surahNumber: 115,
      })

      expect(result.isFailure).toBe(true)
      expect(result.error).toContain('must be between 1 and 114')
    })

    it('should fail for non-integer surah number', () => {
      const result = Surah.create({
        ...validProps,
        surahNumber: 1.5,
      })

      expect(result.isFailure).toBe(true)
      expect(result.error).toContain('must be an integer')
    })

    it('should fail for empty Arabic name', () => {
      const result = Surah.create({
        ...validProps,
        nameArabic: '',
      })

      expect(result.isFailure).toBe(true)
      expect(result.error).toContain('Arabic name cannot be empty')
    })

    it('should fail for empty English name', () => {
      const result = Surah.create({
        ...validProps,
        nameEnglish: '   ',
      })

      expect(result.isFailure).toBe(true)
      expect(result.error).toContain('English name cannot be empty')
    })

    it('should fail for invalid verse count', () => {
      const result = Surah.create({
        ...validProps,
        verseCount: 0,
      })

      expect(result.isFailure).toBe(true)
      expect(result.error).toContain('Verse count must be at least 1')
    })

    it('should fail for invalid position (not 3 coordinates)', () => {
      const result = Surah.create({
        ...validProps,
        position: [0, 0] as any,
      })

      expect(result.isFailure).toBe(true)
      expect(result.error).toContain('array of 3 numbers')
    })

    it('should fail for non-finite position coordinates', () => {
      const result = Surah.create({
        ...validProps,
        position: [0, Infinity, 0],
      })

      expect(result.isFailure).toBe(true)
      expect(result.error).toContain('finite numbers')
    })
  })

  describe('getters', () => {
    it('should provide access to all properties', () => {
      const surah = Surah.create(validProps).value

      expect(surah.surahNumber).toBe(validProps.surahNumber)
      expect(surah.nameArabic).toBe(validProps.nameArabic)
      expect(surah.nameEnglish).toBe(validProps.nameEnglish)
      expect(surah.verseCount).toBe(validProps.verseCount)
      expect(surah.pillar).toBe(validProps.pillar)
      expect(surah.position).toEqual(validProps.position)
      expect(surah.revelationType).toBe(validProps.revelationType)
      expect(surah.revelationOrder).toBe(validProps.revelationOrder)
    })
  })

  describe('isMeccan', () => {
    it('should return true for Meccan surah', () => {
      const surah = Surah.create({
        ...validProps,
        revelationType: 'Meccan',
      }).value

      expect(surah.isMeccan()).toBe(true)
      expect(surah.isMedianan()).toBe(false)
    })

    it('should return false for Medinan surah', () => {
      const surah = Surah.create({
        ...validProps,
        revelationType: 'Medinan',
      }).value

      expect(surah.isMeccan()).toBe(false)
      expect(surah.isMedianan()).toBe(true)
    })
  })

  describe('getDisplayName', () => {
    it('should return Arabic name', () => {
      const surah = Surah.create(validProps).value

      expect(surah.getDisplayName()).toBe('الفاتحة')
    })
  })

  describe('toObject', () => {
    it('should convert to plain object', () => {
      const surah = Surah.create(validProps).value
      const obj = surah.toObject()

      expect(obj.id).toBe('surah-1')
      expect(obj.surahNumber).toBe(1)
      expect(obj.nameArabic).toBe('الفاتحة')
      expect(obj.pillar).toBe('shahada')
      expect(obj.position).toEqual([0, 0, 0])
    })
  })

  describe('equals', () => {
    it('should return true for surahs with same ID', () => {
      const surah1 = Surah.create(validProps).value
      const surah2 = Surah.create(validProps).value

      expect(surah1.equals(surah2)).toBe(true)
    })

    it('should return false for surahs with different IDs', () => {
      const surah1 = Surah.create(validProps).value
      const surah2 = Surah.create({
        ...validProps,
        surahNumber: 2,
      }).value

      expect(surah1.equals(surah2)).toBe(false)
    })
  })
})
