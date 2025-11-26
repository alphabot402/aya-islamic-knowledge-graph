/**
 * Map Authenticated Hadith Citations to Database idInBook
 *
 * This script creates a mapping between:
 * - Sunnah.com Bukhari hadith numbers (used in authenticated references)
 * - Local database idInBook values (sequential numbering)
 *
 * It searches for hadith by key text phrases to create the mapping.
 */

const fs = require('fs')
const path = require('path')

// Load the hadith database
const hadithPath = path.join(__dirname, '..', 'data', 'hadith', 'bukhari-raw.json')
const hadithData = JSON.parse(fs.readFileSync(hadithPath, 'utf8'))
const hadiths = hadithData.hadiths

console.log('📚 HADITH CITATION MAPPING')
console.log('=' .repeat(70))
console.log()

// Authenticated hadith references with key search phrases
// Format: { pillar, refId, citation (sunnah.com number), searchPhrase }
const authenticatedHadiths = [
  // SHAHADA (10 hadiths)
  { pillar: 'shahada', refId: 'SH-11', citation: '8', searchPhrase: 'Islam is based on' },
  { pillar: 'shahada', refId: 'SH-12', citation: '123', searchPhrase: 'La ilaha illal-lah' },
  { pillar: 'shahada', refId: 'SH-13', citation: '23', searchPhrase: 'I have been ordered to fight' },
  { pillar: 'shahada', refId: 'SH-14', citation: '16', searchPhrase: 'sweetness of faith' },
  { pillar: 'shahada', refId: 'SH-15', citation: '30', searchPhrase: 'without associating anything' },
  { pillar: 'shahada', refId: 'SH-16', citation: '50', searchPhrase: 'Faith has' },
  { pillar: 'shahada', refId: 'SH-17', citation: '34', searchPhrase: 'Signs of a Munafiq' },
  { pillar: 'shahada', refId: 'SH-18', citation: '24', searchPhrase: 'Haya' },
  { pillar: 'shahada', refId: 'SH-19', citation: '13', searchPhrase: 'loves for his brother' },
  { pillar: 'shahada', refId: 'SH-20', citation: '26', searchPhrase: 'died knowing' },

  // SALAH (12 hadiths)
  { pillar: 'salah', refId: 'SL-11', citation: '528', searchPhrase: 'coolness of my eyes' },
  { pillar: 'salah', refId: 'SL-12', citation: '574', searchPhrase: 'key to Paradise is prayer' },
  { pillar: 'salah', refId: 'SL-13', citation: '528', searchPhrase: 'Between a man and shirk' },
  { pillar: 'salah', refId: 'SL-14', citation: '498', searchPhrase: 'first to be judged' },
  { pillar: 'salah', refId: 'SL-15', citation: '8', searchPhrase: 'five daily prayers' },
  { pillar: 'salah', refId: 'SL-16', citation: '631', searchPhrase: 'nearest to his Lord when prostrating' },
  { pillar: 'salah', refId: 'SL-17', citation: '506', searchPhrase: 'line up in rows' },
  { pillar: 'salah', refId: 'SL-18', citation: '648', searchPhrase: 'Satan ties three knots' },
  { pillar: 'salah', refId: 'SL-19', citation: '555', searchPhrase: 'delay in offering Isha' },
  { pillar: 'salah', refId: 'SL-20', citation: '505', searchPhrase: 'Do the bowing properly' },
  { pillar: 'salah', refId: 'SL-21', citation: '692', searchPhrase: 'When anyone prays, he is speaking to his Lord' },
  { pillar: 'salah', refId: 'SL-22', citation: '481', searchPhrase: 'people who miss the Fajr' },

  // ZAKAT (10 hadiths)
  { pillar: 'zakat', refId: 'Z-11', citation: '8', searchPhrase: 'Zakat of your properties' },
  { pillar: 'zakat', refId: 'Z-12', citation: '1395', searchPhrase: 'taken from the wealthy' },
  { pillar: 'zakat', refId: 'Z-13', citation: '1389', searchPhrase: 'right of the poor' },
  { pillar: 'zakat', refId: 'Z-14', citation: '1428', searchPhrase: 'protection from Hellfire' },
  { pillar: 'zakat', refId: 'Z-15', citation: '1404', searchPhrase: 'hoarded gold and silver' },
  { pillar: 'zakat', refId: 'Z-16', citation: '1388', searchPhrase: 'charity extinguishes sin' },
  { pillar: 'zakat', refId: 'Z-17', citation: '1443', searchPhrase: 'Best charity is that given in Ramadan' },
  { pillar: 'zakat', refId: 'Z-18', citation: '1371', searchPhrase: 'do not refuse to give Zakat' },
  { pillar: 'zakat', refId: 'Z-19', citation: '1427', searchPhrase: 'whatever you give in charity' },
  { pillar: 'zakat', refId: 'Z-20', citation: '1338', searchPhrase: 'Every act of kindness is charity' },

  // SAWM (8 hadiths)
  { pillar: 'sawm', refId: 'SW-11', citation: '1795', searchPhrase: 'shield from the fire' },
  { pillar: 'sawm', refId: 'SW-12', citation: '1898', searchPhrase: 'forgiven his past sins' },
  { pillar: 'sawm', refId: 'SW-13', citation: '1904', searchPhrase: 'Search for Laylat al-Qadr' },
  { pillar: 'sawm', refId: 'SW-14', citation: '8', searchPhrase: 'fast during Ramadan' },
  { pillar: 'sawm', refId: 'SW-15', citation: '1771', searchPhrase: 'gates of Paradise are opened' },
  { pillar: 'sawm', refId: 'SW-16', citation: '1894', searchPhrase: 'smell of the fasting person' },
  { pillar: 'sawm', refId: 'SW-17', citation: '1897', searchPhrase: 'special gate called Ar-Rayyan' },
  { pillar: 'sawm', refId: 'SW-18', citation: '1901', searchPhrase: 'fasting is a shield' },

  // HAJJ (10 hadiths)
  { pillar: 'hajj', refId: 'H-11', citation: '8', searchPhrase: 'pilgrimage to the House' },
  { pillar: 'hajj', refId: 'H-12', citation: '1773', searchPhrase: 'no reward except Paradise' },
  { pillar: 'hajj', refId: 'H-13', citation: '1521', searchPhrase: 'like the day his mother bore him' },
  { pillar: 'hajj', refId: 'H-14', citation: '1819', searchPhrase: 'best deed is Hajj Mabrur' },
  { pillar: 'hajj', refId: 'H-15', citation: '1723', searchPhrase: 'Talbiyah' },
  { pillar: 'hajj', refId: 'H-16', citation: '1654', searchPhrase: 'standing at Arafah' },
  { pillar: 'hajj', refId: 'H-17', citation: '1738', searchPhrase: 'Zamzam water' },
  { pillar: 'hajj', refId: 'H-18', citation: '1520', searchPhrase: 'hastens for Hajj' },
  { pillar: 'hajj', refId: 'H-19', citation: '1741', searchPhrase: 'Safa and Marwah' },
  { pillar: 'hajj', refId: 'H-20', citation: '1650', searchPhrase: 'three days at Mina' }
]

// Create mapping
const mapping = {}
let foundCount = 0
let notFoundCount = 0

console.log('🔍 Searching for hadiths in database...')
console.log()

authenticatedHadiths.forEach(ref => {
  const found = hadiths.find(h =>
    h.english.text.toLowerCase().includes(ref.searchPhrase.toLowerCase())
  )

  if (found) {
    mapping[ref.refId] = {
      pillar: ref.pillar,
      sunnah_citation: ref.citation,
      database_idInBook: found.idInBook,
      text_preview: found.english.text.substring(0, 80) + '...'
    }
    foundCount++
    console.log(`✅ ${ref.refId}: Sunnah #${ref.citation} → idInBook ${found.idInBook}`)
  } else {
    console.log(`❌ ${ref.refId}: Sunnah #${ref.citation} → NOT FOUND (search: "${ref.searchPhrase}")`)
    notFoundCount++
  }
})

console.log()
console.log('=' .repeat(70))
console.log()
console.log(`✅ Found: ${foundCount}`)
console.log(`❌ Not Found: ${notFoundCount}`)
console.log()

// Save mapping to file
const outputPath = path.join(__dirname, '..', 'app', 'src', 'data', 'hadith-citation-mapping.json')
fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2))

console.log(`💾 Mapping saved to: ${outputPath}`)
console.log()

// Generate statistics by pillar
console.log('📊 BY PILLAR:')
console.log()
const byPillar = {}
Object.values(mapping).forEach(m => {
  if (!byPillar[m.pillar]) byPillar[m.pillar] = 0
  byPillar[m.pillar]++
})

Object.entries(byPillar).forEach(([pillar, count]) => {
  console.log(`  ${pillar.toUpperCase()}: ${count} hadiths mapped`)
})
console.log()
