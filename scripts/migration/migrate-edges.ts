/**
 * Migrate Edge Data to Supabase
 * Reads from data/connections/verse-hadith-edges.json and inserts into edges table
 */

import fs from 'fs'
import path from 'path'
import { supabase, batchInsert, clearTable } from './supabase-client'

interface EdgeFile {
  metadata: {
    version: string
    lastUpdated: string
    totalConnections: number
    verificationStandard: string
    description: string
  }
  edges: Array<{
    id: string
    verse: {
      surah: number
      verse: number
      reference: string
    }
    hadith: {
      collection: string
      bookId: number
      chapterId: number
      hadithId: number
      idInBook: number
    }
    connectionType: string
    relationship: string
    scholarlyVerification: {
      verified: boolean
      verifiedBy: string
      verificationDate: string
      sources: string[]
    }
    strength: string
    tags: string[]
  }>
}

async function migrateEdgesData(clearExisting: boolean = false): Promise<void> {
  console.log('\n🔗 Starting Edges data migration...\n')

  const filePath = path.join(__dirname, '../../data/connections/verse-hadith-edges.json')

  // Check if data file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Edges data file not found: ${filePath}`)
  }

  // Clear existing data if requested
  if (clearExisting) {
    await clearTable('edges')
  }

  // Read edges data
  console.log('📖 Reading edges data...')
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const edgesFile: EdgeFile = JSON.parse(fileContent)

  console.log(`   Found ${edgesFile.edges.length} edges\n`)

  // Step 1: Build lookup maps for verse and hadith UUIDs
  console.log('🔍 Step 1: Resolving verse and hadith UUIDs...')

  // Fetch all verses
  const { data: verses, error: versesError } = await supabase
    .from('verses')
    .select('id, surah_id, verse_number, surahs!inner(number)')

  if (versesError || !verses) {
    throw new Error(`Failed to fetch verses: ${versesError?.message}`)
  }

  // Build verse lookup map: "surahNumber:verseNumber" -> UUID
  const verseMap = new Map<string, string>()
  for (const verse of verses) {
    const key = `${(verse.surahs as any).number}:${verse.verse_number}`
    verseMap.set(key, verse.id)
  }

  console.log(`   Loaded ${verses.length} verses`)

  // Fetch all hadiths
  const { data: hadiths, error: hadithsError } = await supabase
    .from('hadiths')
    .select('id, id_in_book, collection_id, hadith_collections!inner(name_english)')

  if (hadithsError || !hadiths) {
    throw new Error(`Failed to fetch hadiths: ${hadithsError?.message}`)
  }

  // Build hadith lookup map: "collection:idInBook" -> UUID
  const hadithMap = new Map<string, string>()
  for (const hadith of hadiths) {
    const key = `${(hadith.hadith_collections as any).name_english}:${hadith.id_in_book}`
    hadithMap.set(key, hadith.id)
  }

  console.log(`   Loaded ${hadiths.length} hadiths\n`)

  // Step 2: Map and insert edges
  console.log('🔗 Step 2: Mapping and inserting edges...')

  const edgesData: any[] = []
  let skippedCount = 0

  for (const edge of edgesFile.edges) {
    // Look up verse UUID
    const verseKey = `${edge.verse.surah}:${edge.verse.verse}`
    const verseId = verseMap.get(verseKey)

    if (!verseId) {
      console.warn(`⚠️  Verse not found: ${verseKey}`)
      skippedCount++
      continue
    }

    // Look up hadith UUID
    const hadithKey = `${edge.hadith.collection}:${edge.hadith.idInBook}`
    const hadithId = hadithMap.get(hadithKey)

    if (!hadithId) {
      console.warn(`⚠️  Hadith not found: ${hadithKey}`)
      skippedCount++
      continue
    }

    // Map strength
    const strengthMap: Record<string, 'weak' | 'moderate' | 'strong'> = {
      'weak': 'weak',
      'moderate': 'moderate',
      'strong': 'strong'
    }

    // Map connection type
    const connectionTypeMap: Record<string, string> = {
      'direct': 'direct',
      'contextual': 'contextual',
      'thematic': 'thematic',
      'excellence': 'excellence'
    }

    edgesData.push({
      verse_id: verseId,
      hadith_id: hadithId,
      connection_type: connectionTypeMap[edge.connectionType] || 'contextual',
      relationship_description: edge.relationship,
      strength: strengthMap[edge.strength] || 'moderate',
      weight: edge.strength === 'strong' ? 0.9 : edge.strength === 'moderate' ? 0.6 : 0.3,
      pillar: 'general',  // Infer from verse/hadith tags later
      verified: edge.scholarlyVerification?.verified || false,
      verified_by: edge.scholarlyVerification?.verifiedBy || null,
      verified_at: edge.scholarlyVerification?.verificationDate ? new Date(edge.scholarlyVerification.verificationDate).toISOString() : null,
      verification_sources: edge.scholarlyVerification?.sources || [],
      scholarly_notes: null,
      tags: edge.tags || []
    })
  }

  if (skippedCount > 0) {
    console.log(`⚠️  Skipped ${skippedCount} edges due to missing references\n`)
  }

  await batchInsert('edges', edgesData, 100)

  console.log('\n✅ Edges migration complete!')
  console.log(`   🔗 Total edges: ${edgesFile.edges.length}`)
  console.log(`   ✅ Migrated: ${edgesData.length}`)
  console.log(`   ⚠️  Skipped: ${skippedCount}`)
}

// Run migration if called directly
if (require.main === module) {
  const clearExisting = process.argv.includes('--clear')

  migrateEdgesData(clearExisting)
    .then(() => {
      console.log('\n🎉 Migration successful!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ Migration failed:', error)
      process.exit(1)
    })
}

export { migrateEdgesData }
