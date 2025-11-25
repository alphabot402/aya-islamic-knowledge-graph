const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('📥 Downloading Tanzil Quran XML...');

const TANZIL_URL = 'https://tanzil.net/trans/?transID=en.sahih&type=xml-quran-uthmani';
const OUTPUT_DIR = path.join(__dirname, '../../data/quran');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'tanzil-quran-uthmani.xml');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Download file
const file = fs.createWriteStream(OUTPUT_FILE);

https.get(TANZIL_URL, (response) => {
  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    console.log('✅ Tanzil Quran downloaded successfully!');
    console.log(`📁 Saved to: ${OUTPUT_FILE}`);
    console.log('\n📊 File size:', (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2), 'MB');
    console.log('\n🔄 Next step: Run the conversion script');
    console.log('   node pipeline/quran/convert-tanzil.js');
  });
}).on('error', (err) => {
  fs.unlink(OUTPUT_FILE, () => {}); // Delete file on error
  console.error('❌ Error downloading:', err.message);
  console.log('\n💡 Alternative: Download manually from https://tanzil.net/download/');
});
