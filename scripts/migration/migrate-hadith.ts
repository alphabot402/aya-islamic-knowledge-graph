/**
 * Migrate Hadith Data to Supabase
 * Reads from data/hadith/bukhari-raw.json and inserts into hadith_collections/hadiths tables
 */

import fs from 'fs'
import path from 'path'
import { supabase, batchInsert, clearTable } from './supabase-client'

interface BukhariRawData {
  id: number
  metadata: {
    id: number
    length: number
    arabic: {
      title: string
      author: string
      introduction: string
    }
    english: {
      title: string
      author: string
      introduction: string
    }
  }
  chapters: Array<{
    id: number
    bookId: number
    arabic: string
    english: string
  }>
  hadiths: Array<{
    id: number
    idInBook: number
    chapterId: number
    bookId: number
    arabic: string
    english: {
      narrator: string
      text: string
    }
  }>
}

async function migrateHadithData(clearExisting: boolean = false): Promise<void> {
  console.log('\n📚 Starting Hadith data migration...\n')

  const filePath = path.join(__dirname, '../../data/hadith/bukhari-raw.json')

  // Check if data file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Hadith data file not found: ${filePath}`)
  }

  // Clear existing data if requested
  if (clearExisting) {
    await clearTable('hadiths')
    await clearTable('hadith_collections')
  }

  // Read Bukhari data
  console.log('📖 Reading Sahih al-Bukhari data...')
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const bukhariData: BukhariRawData = JSON.parse(fileContent)

  console.log(`   Found ${bukhariData.hadiths.length} hadiths`)
  console.log(`   Found ${bukhariData.chapters.length} chapters\n`)

  // Step 1: Create Collection
  console.log('📚 Step 1: Creating hadith collection...')

  const { data: collection, error: collectionError } = await supabase
    .from('hadith_collections')
    .insert({
      name_arabic: bukhariData.metadata.arabic.title,
      name_english: bukhariData.metadata.english.title,
      author_arabic: bukhariData.metadata.arabic.author,
      author_english: bukhariData.metadata.english.author,
      total_hadiths: bukhariData.metadata.length,
      description: bukhariData.metadata.english.introduction
    })
    .select()
    .single()

  if (collectionError) {
    throw new Error(`Failed to create collection: ${collectionError.message}`)
  }

  console.log(`✅ Created collection: ${collection.name_english}\n`)

  // Step 2: Create chapter lookup map
  const chapterMap = new Map<number, { arabic: string; english: string; bookId: number }>()
  for (const chapter of bukhariData.chapters) {
    chapterMap.set(chapter.id, {
      arabic: chapter.arabic,
      english: chapter.english,
      bookId: chapter.bookId
    })
  }

  // Step 3: Migrate Hadiths
  console.log('📝 Step 2: Migrating hadiths...')

  const hadithsData: any[] = []

  for (const hadith of bukhariData.hadiths) {
    const chapterInfo = chapterMap.get(hadith.chapterId)

    // Extract narrator from English text (usually first sentence)
    const narratorMatch = hadith.english.narrator || hadith.english.text.split(':')[0]

    hadithsData.push({
      collection_id: collection.id,
      id_in_book: hadith.idInBook,
      book_id: hadith.bookId,
      chapter_id: hadith.chapterId,
      book_name_arabic: chapterInfo?.arabic || null,
      book_name_english: chapterInfo?.english || null,
      chapter_name_arabic: chapterInfo?.arabic || null,
      chapter_name_english: chapterInfo?.english || null,
      narrator_primary: narratorMatch,
      isnad_chain: null,  // Not in current data
      text_arabic: hadith.arabic,
      text_english: hadith.english.text,
      grade: 'Sahih' as const,  // All Bukhari hadiths are Sahih
      grade_source: 'Imam al-Bukhari',
      authentication_notes: 'Authenticated in Sahih al-Bukhari collection',
      pillar_tags: [],  // Will be tagged later based on book/chapter
      topic_tags: []
    })
  }

  await batchInsert('hadiths', hadithsData, 500)

  console.log('\n✅ Hadith migration complete!')
  console.log(`   📚 Collections: 1 (Sahih al-Bukhari)`)
  console.log(`   📝 Hadiths: ${hadithsData.length}`)
}

// Run migration if called directly
if (require.main === module) {
  const clearExisting = process.argv.includes('--clear')

  migrateHadithData(clearExisting)
    .then(() => {
      console.log('\n🎉 Migration successful!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ Migration failed:', error)
      process.exit(1)
    })
}

export { migrateHadithData }
