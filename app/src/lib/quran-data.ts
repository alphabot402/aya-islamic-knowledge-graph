import { QuranSurah } from '@/types/quran'
import fs from 'fs'
import path from 'path'

export interface SurahMetadata {
  number: number
  name: string
  arabicName: string
  englishNameTranslation: string
  revelationType: 'Meccan' | 'Medinan'
  verses: number
}

export interface QuranMetadata {
  surahs: SurahMetadata[]
}

/**
 * Load a specific surah by number
 */
export async function loadSurah(surahNumber: number): Promise<QuranSurah | null> {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'quran')
    const fileName = `surah_${String(surahNumber).padStart(3, '0')}.json`
    const filePath = path.join(dataDir, fileName)
    
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent) as QuranSurah
  } catch (error) {
    console.error(`Error loading surah ${surahNumber}:`, error)
    return null
  }
}

/**
 * Load metadata for all surahs
 */
export async function loadSurahsMetadata(): Promise<QuranMetadata | null> {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'quran')
    const filePath = path.join(dataDir, 'surahs-metadata.json')
    
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent) as QuranMetadata
  } catch (error) {
    console.error('Error loading surahs metadata:', error)
    return null
  }
}

/**
 * Load multiple surahs at once
 */
export async function loadSurahs(surahNumbers: number[]): Promise<QuranSurah[]> {
  const surahs = await Promise.all(
    surahNumbers.map(num => loadSurah(num))
  )
  return surahs.filter((s): s is QuranSurah => s !== null)
}

/**
 * Load a specific verse from a surah
 */
export async function loadVerse(surahNumber: number, verseNumber: number) {
  const surah = await loadSurah(surahNumber)
  if (!surah) return null
  
  const verse = surah.verses.find(v => v.index === verseNumber)
  return verse || null
}

/**
 * Get a verse reference string (e.g., "2:255" for Ayat al-Kursi)
 */
export function getVerseReference(surahNumber: number, verseNumber: number): string {
  return `${surahNumber}:${verseNumber}`
}

/**
 * Parse a verse reference string into components
 */
export function parseVerseReference(reference: string): { surah: number; verse: number } | null {
  const match = reference.match(/^(\d+):(\d+)$/)
  if (!match) return null
  
  return {
    surah: parseInt(match[1], 10),
    verse: parseInt(match[2], 10)
  }
}
