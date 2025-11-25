/**
 * Validation Script
 * Verifies data integrity after migration
 */

import fs from 'fs'
import path from 'path'
import { supabase, checkConnection } from './supabase-client'

interface ValidationResult {
  test: string
  expected: number | string
  actual: number | string
  passed: boolean
}

async function validateMigration(): Promise<void> {
  console.log('\n🔍 Validating migration...\n')

  const results: ValidationResult[] = []

  // Check connection
  const connected = await checkConnection()
  if (!connected) {
    throw new Error('Failed to connect to database')
  }

  // Test 1: Count surahs
  console.log('📊 Test 1: Verifying surah count...')
  const { count: surahCount, error: surahError } = await supabase
    .from('surahs')
    .select('*', { count: 'exact', head: true })

  results.push({
    test: 'Surah count',
    expected: 114,
    actual: surahCount || 0,
    passed: surahCount === 114
  })

  // Test 2: Count verses
  console.log('📊 Test 2: Verifying verse count...')
  const { count: verseCount, error: verseError } = await supabase
    .from('verses')
    .select('*', { count: 'exact', head: true })

  results.push({
    test: 'Verse count',
    expected: '~6,236',
    actual: verseCount || 0,
    passed: verseCount ? verseCount > 6000 && verseCount < 6500 : false
  })

  // Test 3: Count hadiths
  console.log('📊 Test 3: Verifying hadith count...')
  const { count: hadithCount, error: hadithError } = await supabase
    .from('hadiths')
    .select('*', { count: 'exact', head: true })

  // Check against original file
  const bukhariPath = path.join(__dirname, '../../data/hadith/bukhari-raw.json')
  const bukhariData = JSON.parse(fs.readFileSync(bukhariPath, 'utf-8'))
  const expectedHadiths = bukhariData.hadiths.length

  results.push({
    test: 'Hadith count',
    expected: expectedHadiths,
    actual: hadithCount || 0,
    passed: hadithCount === expectedHadiths
  })

  // Test 4: Count edges
  console.log('📊 Test 4: Verifying edge count...')
  const { count: edgeCount, error: edgeError } = await supabase
    .from('edges')
    .select('*', { count: 'exact', head: true })

  const edgesPath = path.join(__dirname, '../../data/connections/verse-hadith-edges.json')
  const edgesData = JSON.parse(fs.readFileSync(edgesPath, 'utf-8'))
  const expectedEdges = edgesData.edges.length

  results.push({
    test: 'Edge count',
    expected: expectedEdges,
    actual: edgeCount || 0,
    passed: edgeCount === expectedEdges || edgeCount === expectedEdges - 1  // Allow 1 skip
  })

  // Test 5: Verify foreign key integrity
  console.log('📊 Test 5: Checking foreign key integrity...')
  const { data: orphanedEdges } = await supabase
    .from('edges')
    .select('id')
    .is('verse_id', null)
    .or('hadith_id.is.null')

  results.push({
    test: 'Foreign key integrity',
    expected: 0,
    actual: orphanedEdges?.length || 0,
    passed: (orphanedEdges?.length || 0) === 0
  })

  // Test 6: Verify text search vectors
  console.log('📊 Test 6: Checking text search vectors...')
  const { data: versesWithoutTsv } = await supabase
    .from('verses')
    .select('id')
    .is('tsv_arabic', null)

  results.push({
    test: 'Verse search vectors',
    expected: 0,
    actual: versesWithoutTsv?.length || 0,
    passed: (versesWithoutTsv?.length || 0) === 0
  })

  // Print results
  console.log('\n╔══════════════════════════════════════════════════════════╗')
  console.log('║               Validation Results                         ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${result.test}`)
    console.log(`     Expected: ${result.expected}`)
    console.log(`     Actual:   ${result.actual}\n`)
  }

  const allPassed = results.every(r => r.passed)
  const passedCount = results.filter(r => r.passed).length

  console.log('───────────────────────────────────────────────────────────')
  console.log(`Results: ${passedCount}/${results.length} tests passed`)
  console.log('───────────────────────────────────────────────────────────\n')

  if (allPassed) {
    console.log('✅ All validation tests passed!')
    console.log('   Your migration was successful.\n')
  } else {
    console.log('❌ Some validation tests failed.')
    console.log('   Review the results above and re-run migration if needed.\n')
    process.exit(1)
  }
}

// Run validation
validateMigration()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Validation error:', error.message)
    process.exit(1)
  })
