/**
 * Migrate Quran Data to Supabase
 * Reads from data/quran/*.json and inserts into surahs/verses tables
 */

import fs from 'fs'
import path from 'path'
import { supabase, batchInsert, clearTable } from './supabase-client'

// Surah metadata (from Islamic tradition)
const SURAH_METADATA: Record<number, {
  nameArabic: string
  nameTransliteration: string
  nameTranslation: string
  revelationType: 'Meccan' | 'Medinan'
  revelationOrder: number
}> = {
  1: { nameArabic: 'الفاتحة', nameTransliteration: 'Al-Fatihah', nameTranslation: 'The Opening', revelationType: 'Meccan', revelationOrder: 5 },
  2: { nameArabic: 'البقرة', nameTransliteration: 'Al-Baqarah', nameTranslation: 'The Cow', revelationType: 'Medinan', revelationOrder: 87 },
  3: { nameArabic: 'آل عمران', nameTransliteration: 'Ali Imran', nameTranslation: 'Family of Imran', revelationType: 'Medinan', revelationOrder: 89 },
  4: { nameArabic: 'النساء', nameTransliteration: 'An-Nisa', nameTranslation: 'The Women', revelationType: 'Medinan', revelationOrder: 92 },
  5: { nameArabic: 'المائدة', nameTransliteration: 'Al-Maidah', nameTranslation: 'The Table Spread', revelationType: 'Medinan', revelationOrder: 112 },
  // Add all 114 surahs - shortened for brevity, you'll need complete list
  // For now, generate metadata dynamically
}

// Medinan surahs (from api/quran/route.ts)
const MEDINAN_SURAHS = [2, 3, 4, 5, 8, 9, 22, 24, 33, 47, 48, 49, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 110]

// Pillar classification (from QuranGraph.tsx)
const SURAH_PILLARS: Record<number, string> = {
  1: 'shahada', 2: 'salah', 3: 'shahada', 4: 'zakat', 5: 'zakat', 6: 'shahada',
  7: 'shahada', 8: 'general', 9: 'hajj', 10: 'shahada', 11: 'shahada', 12: 'shahada',
  13: 'shahada', 14: 'shahada', 15: 'general', 16: 'shahada', 17: 'salah', 18: 'shahada',
  19: 'shahada', 20: 'shahada', 21: 'shahada', 22: 'hajj', 23: 'shahada', 24: 'general',
  25: 'shahada', 26: 'shahada', 27: 'shahada', 28: 'shahada', 29: 'shahada', 30: 'shahada',
  31: 'shahada', 32: 'shahada', 33: 'salah', 34: 'shahada', 35: 'shahada', 36: 'shahada',
  37: 'shahada', 38: 'shahada', 39: 'shahada', 40: 'shahada', 41: 'shahada', 42: 'shahada',
  43: 'shahada', 44: 'shahada', 45: 'shahada', 46: 'shahada', 47: 'general', 48: 'general',
  49: 'general', 50: 'shahada', 51: 'shahada', 52: 'shahada', 53: 'shahada', 54: 'shahada',
  55: 'shahada', 56: 'shahada', 57: 'zakat', 58: 'general', 59: 'general', 60: 'general',
  61: 'general', 62: 'salah', 63: 'general', 64: 'shahada', 65: 'general', 66: 'general',
  67: 'shahada', 68: 'shahada', 69: 'shahada', 70: 'shahada', 71: 'shahada', 72: 'shahada',
  73: 'salah', 74: 'shahada', 75: 'shahada', 76: 'general', 77: 'shahada', 78: 'shahada',
  79: 'shahada', 80: 'general', 81: 'shahada', 82: 'shahada', 83: 'general', 84: 'shahada',
  85: 'shahada', 86: 'shahada', 87: 'shahada', 88: 'shahada', 89: 'shahada', 90: 'general',
  91: 'shahada', 92: 'zakat', 93: 'shahada', 94: 'shahada', 95: 'shahada', 96: 'salah',
  97: 'sawm', 98: 'shahada', 99: 'shahada', 100: 'general', 101: 'shahada', 102: 'general',
  103: 'shahada', 104: 'general', 105: 'shahada', 106: 'general', 107: 'salah', 108: 'salah',
  109: 'shahada', 110: 'shahada', 111: 'general', 112: 'shahada', 113: 'shahada', 114: 'shahada'
}

interface QuranSurahFile {
  surah_number: number
  revelation_order?: number
  juz_list?: number[]
  verses: Array<{
    index: number
    text_uthmani: string
    text_simple: string
    structural_tags?: {
      pillar_tags?: string[]
      topic_tags?: string[]
    }
    cross_refs?: string[]
  }>
}

async function migrateQuranData(clearExisting: boolean = false): Promise<void> {
  console.log('\n🕌 Starting Quran data migration...\n')

  const dataDir = path.join(__dirname, '../../data/quran')

  // Check if data directory exists
  if (!fs.existsSync(dataDir)) {
    throw new Error(`Quran data directory not found: ${dataDir}`)
  }

  // Clear existing data if requested
  if (clearExisting) {
    await clearTable('verses')
    await clearTable('surahs')
  }

  // Step 1: Migrate Surahs
  console.log('📖 Step 1: Migrating surahs...')

  const surahFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('surah_') && f.endsWith('.json'))
  console.log(`   Found ${surahFiles.length} surah files`)

  const surahsData: any[] = []
  const allVersesData: any[] = []
  const surahIdMap = new Map<number, number>()  // surah_number -> database id

  for (const file of surahFiles) {
    const filePath = path.join(dataDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const surahData: QuranSurahFile = JSON.parse(fileContent)

    const surahNumber = surahData.surah_number
    const metadata = SURAH_METADATA[surahNumber] || {
      nameArabic: `سورة ${surahNumber}`,
      nameTransliteration: `Surah ${surahNumber}`,
      nameTranslation: `Surah ${surahNumber}`,
      revelationType: MEDINAN_SURAHS.includes(surahNumber) ? 'Medinan' : 'Meccan',
      revelationOrder: surahNumber
    }

    surahsData.push({
      number: surahNumber,
      name_arabic: metadata.nameArabic,
      name_transliteration: metadata.nameTransliteration,
      name_translation: metadata.nameTranslation,
      revelation_type: metadata.revelationType,
      revelation_order: surahData.revelation_order || metadata.revelationOrder,
      verse_count: surahData.verses.length,
      primary_pillar: SURAH_PILLARS[surahNumber] || 'general',
      bismillah_pre: surahNumber !== 1 && surahNumber !== 9  // All surahs except 1 and 9
    })
  }

  // Insert surahs
  await batchInsert('surahs', surahsData, 50)

  // Fetch inserted surahs to get their IDs
  const { data: insertedSurahs, error: fetchError } = await supabase
    .from('surahs')
    .select('id, number')
    .order('number')

  if (fetchError || !insertedSurahs) {
    throw new Error(`Failed to fetch inserted surahs: ${fetchError?.message}`)
  }

  // Build surah number -> id map
  for (const surah of insertedSurahs) {
    surahIdMap.set(surah.number, surah.id)
  }

  console.log(`✅ Migrated ${surahsData.length} surahs\n`)

  // Step 2: Migrate Verses
  console.log('📝 Step 2: Migrating verses...')

  for (const file of surahFiles) {
    const filePath = path.join(dataDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const surahData: QuranSurahFile = JSON.parse(fileContent)

    const surahId = surahIdMap.get(surahData.surah_number)
    if (!surahId) {
      console.error(`❌ Surah ID not found for surah ${surahData.surah_number}`)
      continue
    }

    for (const verse of surahData.verses) {
      allVersesData.push({
        surah_id: surahId,
        verse_number: verse.index,
        text_arabic: verse.text_uthmani,
        text_simple: verse.text_simple,
        text_english: null,  // Not in current data
        juz: null,  // Not in current data
        hizb: null,
        page: null,
        pillar_tags: verse.structural_tags?.pillar_tags || [],
        topic_tags: verse.structural_tags?.topic_tags || []
      })
    }
  }

  await batchInsert('verses', allVersesData, 500)

  console.log('\n✅ Quran migration complete!')
  console.log(`   📖 Surahs: ${surahsData.length}`)
  console.log(`   📝 Verses: ${allVersesData.length}`)
}

// Run migration if called directly
if (require.main === module) {
  const clearExisting = process.argv.includes('--clear')

  migrateQuranData(clearExisting)
    .then(() => {
      console.log('\n🎉 Migration successful!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ Migration failed:', error)
      process.exit(1)
    })
}

export { migrateQuranData }
