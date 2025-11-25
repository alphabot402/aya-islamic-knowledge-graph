const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔄 Converting Tanzil XML to JSON...\n');

const INPUT_FILE = path.join(__dirname, '../../data/quran/tanzil-quran-uthmani.xml');
const OUTPUT_DIR = path.join(__dirname, '../../data/quran');
const CHECKSUM_FILE = path.join(__dirname, '../../tests/checksums/quran.json');

// Check if input file exists
if (!fs.existsSync(INPUT_FILE)) {
  console.error('❌ Error: Tanzil XML file not found!');
  console.log('📥 Please run the download script first:');
  console.log('   node pipeline/quran/download-tanzil.js');
  process.exit(1);
}

// Read and parse XML (simple parsing for now)
console.log('📖 Reading XML file...');
const xmlContent = fs.readFileSync(INPUT_FILE, 'utf8');

// Extract verses using regex (basic parsing)
const surahRegex = /<sura index="(\d+)"[^>]*>([\s\S]*?)<\/sura>/g;
const ayahRegex = /<aya index="(\d+)" text="([^"]+)"[^>]*>/g;

const surahs = {};
let surahMatch;

console.log('🔍 Parsing surahs and verses...\n');

while ((surahMatch = surahRegex.exec(xmlContent)) !== null) {
  const surahNumber = parseInt(surahMatch[1]);
  const surahContent = surahMatch[2];
  
  const verses = [];
  let ayahMatch;
  
  while ((ayahMatch = ayahRegex.exec(surahContent)) !== null) {
    const ayahNumber = parseInt(ayahMatch[1]);
    const textUthmani = ayahMatch[2]
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    
    verses.push({
      index: ayahNumber,
      text_uthmani: textUthmani,
      text_simple: textUthmani, // For now, same as uthmani
      structural_tags: {
        pillar_tags: [],
        topic_tags: []
      },
      cross_refs: []
    });
  }
  
  if (verses.length > 0) {
    const surahData = {
      surah_number: surahNumber,
      revelation_order: 0, // To be added later
      juz_list: [], // To be added later
      verses: verses
    };
    
    // Save individual surah file
    const surahFileName = `surah_${String(surahNumber).padStart(3, '0')}.json`;
    const surahFilePath = path.join(OUTPUT_DIR, surahFileName);
    fs.writeFileSync(surahFilePath, JSON.stringify(surahData, null, 2));
    
    // Calculate checksum
    const checksum = crypto.createHash('sha256')
      .update(JSON.stringify(surahData))
      .digest('hex');
    
    surahs[surahFileName.replace('.json', '')] = checksum;
    
    console.log(`✅ Surah ${surahNumber}: ${verses.length} verses (${surahFileName})`);
  }
}

// Save checksums
const checksumDir = path.dirname(CHECKSUM_FILE);
if (!fs.existsSync(checksumDir)) {
  fs.mkdirSync(checksumDir, { recursive: true });
}

const checksumData = {
  version: '1.0.0',
  source: 'tanzil',
  last_updated: new Date().toISOString(),
  surahs: surahs
};

fs.writeFileSync(CHECKSUM_FILE, JSON.stringify(checksumData, null, 2));

console.log('\n✅ Conversion complete!');
console.log(`📁 Output: ${OUTPUT_DIR}`);
console.log(`🔐 Checksums: ${CHECKSUM_FILE}`);
console.log(`📊 Total surahs: ${Object.keys(surahs).length}`);
console.log('\n🎯 Next: Start building your Quran reader pages!');
