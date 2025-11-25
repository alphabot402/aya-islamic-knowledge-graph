/**
 * Tests for Pillar Value Object
 */

import { Pillar } from '../Pillar'

describe('Pillar Value Object', () => {
  describe('create', () => {
    it('should create a valid Shahada pillar', () => {
      const result = Pillar.create('shahada')

      expect(result.isSuccess).toBe(true)
      expect(result.value.type).toBe('shahada')
      expect(result.value.name).toBe('Shahada')
      expect(result.value.nameArabic).toBe('الشهادة')
      expect(result.value.color).toBe('#9333ea')
    })

    it('should create all five pillars', () => {
      const pillars: Array<'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj'> = [
        'shahada',
        'salah',
        'zakat',
        'sawm',
        'hajj',
      ]

      pillars.forEach(type => {
        const result = Pillar.create(type)
        expect(result.isSuccess).toBe(true)
        expect(result.value.type).toBe(type)
      })
    })

    it('should create general pillar', () => {
      const result = Pillar.create('general')

      expect(result.isSuccess).toBe(true)
      expect(result.value.type).toBe('general')
      expect(result.value.name).toBe('General')
    })

    it('should fail for invalid pillar type', () => {
      const result = Pillar.create('invalid')

      expect(result.isFailure).toBe(true)
      expect(result.error).toContain('Invalid pillar type')
    })

    it('should fail for empty string', () => {
      const result = Pillar.create('')

      expect(result.isFailure).toBe(true)
    })
  })

  describe('isValidPillarType', () => {
    it('should return true for valid pillar types', () => {
      expect(Pillar.isValidPillarType('shahada')).toBe(true)
      expect(Pillar.isValidPillarType('salah')).toBe(true)
      expect(Pillar.isValidPillarType('zakat')).toBe(true)
      expect(Pillar.isValidPillarType('sawm')).toBe(true)
      expect(Pillar.isValidPillarType('hajj')).toBe(true)
      expect(Pillar.isValidPillarType('general')).toBe(true)
    })

    it('should return false for invalid pillar types', () => {
      expect(Pillar.isValidPillarType('invalid')).toBe(false)
      expect(Pillar.isValidPillarType('')).toBe(false)
      expect(Pillar.isValidPillarType('Shahada')).toBe(false) // Case-sensitive
    })
  })

  describe('getAllTypes', () => {
    it('should return all six pillar types', () => {
      const types = Pillar.getAllTypes()

      expect(types).toHaveLength(6)
      expect(types).toContain('shahada')
      expect(types).toContain('salah')
      expect(types).toContain('zakat')
      expect(types).toContain('sawm')
      expect(types).toContain('hajj')
      expect(types).toContain('general')
    })
  })

  describe('getAll', () => {
    it('should return all pillar instances', () => {
      const pillars = Pillar.getAll()

      expect(pillars).toHaveLength(6)
      pillars.forEach(pillar => {
        expect(pillar).toBeInstanceOf(Pillar)
        expect(pillar.name).toBeTruthy()
        expect(pillar.nameArabic).toBeTruthy()
        expect(pillar.color).toBeTruthy()
      })
    })
  })

  describe('toDisplayObject', () => {
    it('should return display object with correct structure', () => {
      const pillar = Pillar.create('salah').value
      const display = pillar.toDisplayObject()

      expect(display).toHaveProperty('name')
      expect(display).toHaveProperty('nameAr')
      expect(display).toHaveProperty('color')
      expect(display.name).toBe('Salah')
      expect(display.nameAr).toBe('الصلاة')
      expect(display.color).toBe('#2563eb')
    })
  })

  describe('equals', () => {
    it('should return true for equal pillars', () => {
      const pillar1 = Pillar.create('shahada').value
      const pillar2 = Pillar.create('shahada').value

      expect(pillar1.equals(pillar2)).toBe(true)
    })

    it('should return false for different pillars', () => {
      const pillar1 = Pillar.create('shahada').value
      const pillar2 = Pillar.create('salah').value

      expect(pillar1.equals(pillar2)).toBe(false)
    })

    it('should return false for null/undefined', () => {
      const pillar = Pillar.create('shahada').value

      expect(pillar.equals(null as any)).toBe(false)
      expect(pillar.equals(undefined)).toBe(false)
    })
  })

  describe('immutability', () => {
    it('should be immutable', () => {
      const pillar = Pillar.create('shahada').value

      // Try to modify properties (TypeScript will prevent this at compile time,
      // but JavaScript allows it, so we verify runtime immutability)
      const props = (pillar as any).props
      expect(() => {
        props.type = 'salah'
      }).toThrow()
    })
  })
})
