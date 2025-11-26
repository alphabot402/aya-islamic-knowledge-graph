/**
 * Analyze Authenticated Surah-Pillar Mapping
 * Shows the distribution of surahs across pillars based on authenticated references
 */

// Import the authenticated references (mimicking the TypeScript logic)
const fs = require('fs')
const path = require('path')

// Read the five-pillars-references.ts file and parse the data
const referencesFile = path.join(__dirname, '..', 'app', 'src', 'data', 'five-pillars-references.ts')

console.log('📖 AUTHENTICATED SURAH-PILLAR MAPPING ANALYSIS')
console.log('=' .repeat(70))
console.log()

// Extract citations from the references file
const content = fs.readFileSync(referencesFile, 'utf-8')

// Parse the pillars and their Quranic references
const pillars = ['shahada', 'salah', 'zakat', 'sawm', 'hajj']
const mapping = {}

pillars.forEach(pillar => {
  const surahSet = new Set()

  // Find all Quran references for this pillar
  const regex = new RegExp(`pillar: '${pillar}',[\\s\\S]*?source: 'quran',[\\s\\S]*?citation: '([\\d:]+)'`, 'g')
  let match

  while ((match = regex.exec(content)) !== null) {
    const citation = match[1]
    const [surah] = citation.split(':')
    surahSet.add(parseInt(surah))
  }

  mapping[pillar] = Array.from(surahSet).sort((a, b) => a - b)
})

// Calculate statistics
const totalMapped = new Set()
pillars.forEach(pillar => {
  mapping[pillar].forEach(surah => totalMapped.add(surah))
})

const unmappedCount = 114 - totalMapped.size

// Display results
console.log('📊 DISTRIBUTION BY PILLAR:')
console.log()

pillars.forEach(pillar => {
  const surahs = mapping[pillar]
  console.log(`${pillar.toUpperCase()}:`)
  console.log(`  Count: ${surahs.length} surahs`)
  console.log(`  Surahs: ${surahs.join(', ')}`)
  console.log()
})

console.log('=' .repeat(70))
console.log()
console.log(`✅ TOTAL MAPPED: ${totalMapped.size} surahs across Five Pillars`)
console.log(`⚪ UNMAPPED (will show as "general"): ${unmappedCount} surahs`)
console.log()

// Show which surahs are unmapped
const unmapped = []
for (let i = 1; i <= 114; i++) {
  if (!totalMapped.has(i)) {
    unmapped.push(i)
  }
}

console.log('📋 Unmapped Surahs (excluded from visualization):')
console.log(`   ${unmapped.join(', ')}`)
console.log()

console.log('=' .repeat(70))
console.log()
console.log('💡 KEY DIFFERENCES FROM OLD MAPPING:')
console.log('   • OLD: 114 surahs mapped (subjective thematic categorization)')
console.log('   • NEW: ' + totalMapped.size + ' surahs mapped (authenticated Quranic references only)')
console.log('   • Unmapped surahs default to "general" and are filtered from display')
console.log('   • This ensures only scripturally-backed categorizations are shown')
console.log()
