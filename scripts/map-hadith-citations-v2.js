/**
 * Map Authenticated Hadith Citations to Database idInBook - Version 2
 * Uses exact coreText from five-pillars-references.ts for better matching
 */

const fs = require('fs')
const path = require('path')

// Load the hadith database
const hadithPath = path.join(__dirname, '..', 'data', 'hadith', 'bukhari-raw.json')
const hadithData = JSON.parse(fs.readFileSync(hadithPath, 'utf8'))
const hadiths = hadithData.hadiths

// Load authenticated references from TypeScript file
const referencesPath = path.join(__dirname, '..', 'app', 'src', 'data', 'five-pillars-references.ts')
const referencesContent = fs.readFileSync(referencesPath, 'utf8')

console.log('📚 HADITH CITATION MAPPING V2')
console.log('=' .repeat(70))
console.log()

// Parse hadith references from TypeScript file
// Extract all Bukhari hadiths from FIVE_PILLARS_REFERENCES array
const hadithRegex = /{\s*refId:\s*'([^']+)',[\s\S]*?source:\s*'bukhari',[\s\S]*?citation:\s*'([^']+)',[\s\S]*?coreText:\s*'([^']+)'/g

const authenticatedHadiths = []
let match

while ((match = hadithRegex.exec(referencesContent)) !== null) {
  const [, refId, citation, coreText] = match
  authenticatedHadiths.push({ refId, citation, coreText })
}

console.log(`Found ${authenticatedHadiths.length} Bukhari hadiths in authenticated references`)
console.log()

// Helper function to search hadith with multiple strategies
function findHadith(ref) {
  // Clean the core text (remove extra spaces, normalize)
  const searchText = ref.coreText
    .replace(/\.\.\./g, '')
    .trim()
    .toLowerCase()

  // Strategy 1: Search for first 30 characters of core text
  const searchPhrase1 = searchText.substring(0, 30)
  let found = hadiths.find(h =>
    h.english.text.toLowerCase().includes(searchPhrase1)
  )

  if (found) return { hadith: found, strategy: 'first-30-chars' }

  // Strategy 2: Split into words and search for key phrases
  const words = searchText.split(/\s+/)
  const keyPhrases = []

  // Extract significant phrases (3+ consecutive words)
  for (let i = 0; i < words.length - 2; i++) {
    keyPhrases.push(words.slice(i, i + 3).join(' '))
  }

  // Try each key phrase
  for (const phrase of keyPhrases) {
    found = hadiths.find(h =>
      h.english.text.toLowerCase().includes(phrase)
    )
    if (found) return { hadith: found, strategy: `key-phrase: "${phrase}"` }
  }

  // Strategy 3: Search for individual significant words
  const significantWords = words.filter(w =>
    w.length > 4 &&
    !['allah', 'prophet', 'messenger', 'said', 'narrated', 'peace', 'upon'].includes(w)
  )

  if (significantWords.length >= 2) {
    const word1 = significantWords[0]
    const word2 = significantWords[1]
    found = hadiths.find(h => {
      const text = h.english.text.toLowerCase()
      return text.includes(word1) && text.includes(word2)
    })
    if (found) return { hadith: found, strategy: `words: "${word1}" + "${word2}"` }
  }

  return null
}

// Create mapping
const mapping = {}
let foundCount = 0
let notFoundCount = 0
const notFound = []

console.log('🔍 Searching for hadiths in database...')
console.log()

authenticatedHadiths.forEach(ref => {
  const result = findHadith(ref)

  if (result) {
    mapping[ref.refId] = {
      sunnah_citation: ref.citation,
      database_idInBook: result.hadith.idInBook,
      coreText: ref.coreText.substring(0, 60) + '...',
      match_strategy: result.strategy,
      database_text_preview: result.hadith.english.text.substring(0, 60) + '...'
    }
    foundCount++
    console.log(`✅ ${ref.refId}: Sunnah #${ref.citation} → idInBook ${result.hadith.idInBook} (${result.strategy})`)
  } else {
    console.log(`❌ ${ref.refId}: Sunnah #${ref.citation} → NOT FOUND`)
    console.log(`   Core text: "${ref.coreText.substring(0, 80)}..."`)
    notFoundCount++
    notFound.push(ref)
  }
})

console.log()
console.log('=' .repeat(70))
console.log()
console.log(`✅ Found: ${foundCount}`)
console.log(`❌ Not Found: ${notFoundCount}`)
console.log()

if (notFound.length > 0) {
  console.log('⚠️  NOT FOUND HADITHS:')
  console.log()
  notFound.forEach(ref => {
    console.log(`  ${ref.refId} (Sunnah #${ref.citation}):`)
    console.log(`    "${ref.coreText.substring(0, 100)}..."`)
    console.log()
  })
}

// Save mapping to file
const outputPath = path.join(__dirname, '..', 'app', 'src', 'data', 'hadith-citation-mapping.json')
fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2))

console.log(`💾 Mapping saved to: ${outputPath}`)
console.log()

// Generate statistics by pillar
console.log('📊 SUMMARY:')
console.log()
console.log(`  Total authenticated hadiths: ${authenticatedHadiths.length}`)
console.log(`  Successfully mapped: ${foundCount} (${Math.round(foundCount/authenticatedHadiths.length*100)}%)`)
console.log(`  Not found in database: ${notFoundCount}`)
console.log()

if (foundCount > 0) {
  console.log('✅ Mapping file created! Now update useGraphData.orbital.ts to use this mapping.')
}
