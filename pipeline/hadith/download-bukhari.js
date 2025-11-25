const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('📥 Downloading Sahih al-Bukhari JSON...');

// Using the CDN link for the hadith collection
const BUKHARI_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/bukhari.json';
const OUTPUT_DIR = path.join(__dirname, '../../data/hadith');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'bukhari-raw.json');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔗 Source: fawazahmed0/hadith-api');
console.log('📦 Collection: Sahih al-Bukhari');
console.log('⏳ Please wait...\n');

// Download file
const file = fs.createWriteStream(OUTPUT_FILE);

https.get(BUKHARI_URL, (response) => {
  if (response.statusCode !== 200) {
    console.error(`❌ HTTP Error: ${response.statusCode}`);
    console.log('\n💡 Alternative sources:');
    console.log('   1. https://github.com/AhmedBaset/hadith-json');
    console.log('   2. https://sunnah.com/developers');
    return;
  }

  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    const stats = fs.statSync(OUTPUT_FILE);
    console.log('✅ Sahih al-Bukhari downloaded successfully!');
    console.log(`📁 Saved to: ${OUTPUT_FILE}`);
    console.log(`📊 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📚 Contains: ~7,563 hadiths`);
    console.log('\n🔄 Next step: Process the hadith data');
    console.log('   node pipeline/hadith/process-bukhari.js');
  });
}).on('error', (err) => {
  fs.unlink(OUTPUT_FILE, () => {});
  console.error('❌ Error downloading:', err.message);
  console.log('\n💡 Manual download options:');
  console.log('   1. Visit: https://github.com/AhmedBaset/hadith-json');
  console.log('   2. Download bukhari.json from db/by_book/the_9_books/');
  console.log('   3. Save to: data/hadith/bukhari-raw.json');
});
