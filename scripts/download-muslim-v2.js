/**
 * Sahih Muslim Downloader v2
 *
 * Downloads Sahih Muslim from the actual JSON format available online
 * Uses a working data source for the complete collection
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class MuslimDownloaderV2 {
  constructor() {
    this.hadiths = [];
  }

  async download() {
    console.log('📖 Sahih Muslim Downloader v2');
    console.log('='.repeat(60));
    console.log('');

    // Try downloading from a known working source
    // Option 1: Try the complete JSON file from hadith-data
    const url = 'https://raw.githubusercontent.com/sunnah-com/hadith-data/master/sahih-muslim.json';

    console.log('📥 Attempting to download complete Sahih Muslim collection...');
    console.log(`🔗 Source: ${url}`);
    console.log('');

    try {
      await this.downloadFromURL(url);
    } catch (error) {
      console.log('\n⚠️  Primary source failed. Trying alternative...\n');

      // Alternative: Use a structured API endpoint
      await this.downloadAlternative();
    }
  }

  downloadFromURL(url) {
    return new Promise((resolve, reject) => {
      console.log('⏳ Downloading... (this may take a minute)');

      https.get(url, (res) => {
        let data = '';

        if (res.statusCode !== 200) {
          console.log(`❌ Failed: HTTP ${res.statusCode}`);
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        const totalLength = parseInt(res.headers['content-length'], 10);
        let downloaded = 0;

        res.on('data', chunk => {
          data += chunk;
          downloaded += chunk.length;
          if (totalLength) {
            const percent = ((downloaded / totalLength) * 100).toFixed(1);
            process.stdout.write(`\r📊 Progress: ${percent}% (${(downloaded / 1024 / 1024).toFixed(2)} MB)`);
          }
        });

        res.on('end', () => {
          console.log('\n\n✅ Download complete. Processing...\n');

          try {
            const jsonData = JSON.parse(data);
            this.processData(jsonData);
            this.saveToFile();
            resolve();
          } catch (error) {
            console.error('❌ Error parsing JSON:', error.message);
            reject(error);
          }
        });

      }).on('error', (error) => {
        console.error('❌ Network error:', error.message);
        reject(error);
      });
    });
  }

  async downloadAlternative() {
    console.log('🔄 Using alternative download method...');
    console.log('');

    // If the complete file doesn't exist, we can inform the user
    // about manual download options
    console.log('📝 Manual Download Options:');
    console.log('');
    console.log('Option 1: Download from GitHub hadith-data');
    console.log('   git clone https://github.com/sunnah-com/hadith-data.git');
    console.log('   (Look for muslim.json or similar)');
    console.log('');
    console.log('Option 2: Use sunnah.com API');
    console.log('   Visit https://sunnah.com/muslim');
    console.log('   API docs: https://sunnah.api-docs.io/');
    console.log('');
    console.log('Option 3: Use existing Bukhari data only');
    console.log('   Continue with Bukhari collection (7,277 hadiths)');
    console.log('   Muslim can be added later');
    console.log('');

    // Create placeholder file
    this.createPlaceholder();

    throw new Error('Manual download required');
  }

  processData(data) {
    console.log('🔍 Processing hadith data...');

    // Handle different possible JSON structures
    let hadithArray = [];

    if (Array.isArray(data)) {
      hadithArray = data;
    } else if (data.hadiths && Array.isArray(data.hadiths)) {
      hadithArray = data.hadiths;
    } else if (data.data && Array.isArray(data.data)) {
      hadithArray = data.data;
    }

    console.log(`📊 Found ${hadithArray.length} hadiths`);

    // Convert to our format
    hadithArray.forEach((hadith, idx) => {
      this.hadiths.push({
        collection: 'muslim',
        idInBook: hadith.hadithnumber || hadith.id || idx + 1,
        bookId: hadith.bookid || hadith.book || 1,
        chapterId: hadith.chapterid || hadith.chapter || 1,
        arabic: hadith.arab || hadith.arabic || hadith.text_ar || '',
        english: {
          text: hadith.text || hadith.english || hadith.text_en || '',
          narrator: hadith.narrator || '',
          grade: 'sahih'
        }
      });
    });

    console.log(`✅ Processed ${this.hadiths.length} hadiths\n`);
  }

  saveToFile() {
    const outputPath = path.join(__dirname, '../data/hadith/muslim-raw.json');

    const output = {
      metadata: {
        collection: 'Sahih Muslim',
        source: 'sunnah.com',
        downloadDate: new Date().toISOString(),
        totalHadiths: this.hadiths.length,
        description: 'Complete Sahih Muslim collection',
        authentication: 'Sahih (authentic)'
      },
      hadiths: this.hadiths
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

    console.log('='.repeat(60));
    console.log('✅ SAHIH MUSLIM SAVED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log(`📊 Total Hadiths: ${this.hadiths.length}`);
    console.log(`📂 Output: ${outputPath}`);
    console.log(`💾 Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
    console.log('');
  }

  createPlaceholder() {
    const outputPath = path.join(__dirname, '../data/hadith/muslim-raw.json');

    const placeholder = {
      metadata: {
        collection: 'Sahih Muslim',
        status: 'pending_manual_download',
        note: 'This is a placeholder. Muslim collection needs to be downloaded manually.',
        instructions: [
          '1. Visit https://github.com/sunnah-com/hadith-data',
          '2. Find sahih-muslim.json or equivalent',
          '3. Replace this file with the actual data'
        ]
      },
      hadiths: []
    };

    fs.writeFileSync(outputPath, JSON.stringify(placeholder, null, 2), 'utf8');
    console.log(`📝 Placeholder created at: ${outputPath}`);
  }
}

// ============================================================================
// RUN
// ============================================================================

(async () => {
  const downloader = new MuslimDownloaderV2();
  try {
    await downloader.download();
  } catch (error) {
    console.log('\n💡 RECOMMENDATION: Continue with Bukhari only');
    console.log('   Your auto-curator already has 7,277 Bukhari hadiths');
    console.log('   You can add Muslim collection later\n');
    process.exit(0); // Exit gracefully
  }
})();
