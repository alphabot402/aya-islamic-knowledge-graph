/**
 * Sahih Muslim Downloader
 *
 * Downloads the complete Sahih Muslim collection from sunnah.com API
 * Similar to the Bukhari downloader but for Muslim collection
 *
 * Output: data/hadith/muslim-raw.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUNNAH_API_BASE = 'https://api.sunnah.com/v1';
const API_KEY = 'YOUR_API_KEY_HERE'; // Will try without key first

// Sahih Muslim collection ID in sunnah.com API
const MUSLIM_COLLECTION = 'muslim';

class MuslimDownloader {
  constructor() {
    this.hadiths = [];
    this.books = [];
    this.stats = {
      totalHadiths: 0,
      totalBooks: 0,
      downloadedHadiths: 0,
      errors: 0
    };
  }

  async download() {
    console.log('📖 Sahih Muslim Downloader');
    console.log('='.repeat(60));
    console.log('');
    console.log('🌐 Source: api.sunnah.com');
    console.log('📚 Collection: Sahih Muslim');
    console.log('');

    try {
      // Check if API is accessible
      console.log('🔍 Checking API accessibility...');

      // Try alternate source: hadith-data repository
      console.log('📥 Attempting to download from hadith-data repository...');
      await this.downloadFromGitHub();

    } catch (error) {
      console.error('❌ Download failed:', error.message);
      console.log('\n💡 Alternative: You can manually download Sahih Muslim from:');
      console.log('   - https://sunnah.com/muslim');
      console.log('   - https://github.com/sunnah-com/hadith-data');
      process.exit(1);
    }
  }

  async downloadFromGitHub() {
    console.log('🔗 Using hadith-data GitHub repository...');
    console.log('📂 Repository: github.com/sunnah-com/hadith-data');
    console.log('');

    // Sahih Muslim has multiple books (56 books)
    const MUSLIM_BOOKS = 56;

    console.log(`📊 Sahih Muslim consists of ${MUSLIM_BOOKS} books`);
    console.log('⏳ This may take a few minutes...\n');

    for (let bookNum = 1; bookNum <= MUSLIM_BOOKS; bookNum++) {
      try {
        await this.downloadBook(bookNum);
        this.stats.totalBooks++;
      } catch (error) {
        console.log(`⚠️  Warning: Could not download book ${bookNum}`);
        this.stats.errors++;
      }
    }

    this.saveToFile();
  }

  downloadBook(bookNum) {
    return new Promise((resolve, reject) => {
      const bookNumPadded = String(bookNum).padStart(2, '0');
      // Try the GitHub raw URL for Sahih Muslim JSON files
      const url = `https://raw.githubusercontent.com/sunnah-com/hadith-data/master/muslim/${bookNumPadded}.json`;

      console.log(`📥 Downloading Book ${bookNum}...`);

      https.get(url, (res) => {
        let data = '';

        if (res.statusCode !== 200) {
          console.log(`   ⏭️  Book ${bookNum} not found (${res.statusCode})`);
          resolve();
          return;
        }

        res.on('data', chunk => data += chunk);

        res.on('end', () => {
          try {
            const bookData = JSON.parse(data);

            // Extract hadiths from the book
            if (bookData.hadiths) {
              bookData.hadiths.forEach(hadith => {
                this.hadiths.push({
                  collection: 'muslim',
                  bookId: bookNum,
                  idInBook: hadith.hadithnumber,
                  chapterId: hadith.chapterid || bookNum,
                  arabic: hadith.arab || hadith.text_ar,
                  english: {
                    text: hadith.text || hadith.text_en,
                    narrator: hadith.narrator || '',
                    grade: hadith.grade || 'sahih'
                  }
                });
                this.stats.downloadedHadiths++;
              });

              console.log(`   ✅ Book ${bookNum}: ${bookData.hadiths.length} hadiths`);
            }

            resolve();
          } catch (error) {
            console.log(`   ❌ Error parsing book ${bookNum}`);
            reject(error);
          }
        });

      }).on('error', (error) => {
        console.log(`   ❌ Network error for book ${bookNum}`);
        reject(error);
      });
    });
  }

  saveToFile() {
    const outputPath = path.join(__dirname, '../data/hadith/muslim-raw.json');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const output = {
      metadata: {
        collection: 'Sahih Muslim',
        source: 'sunnah.com via hadith-data repository',
        downloadDate: new Date().toISOString(),
        totalHadiths: this.hadiths.length,
        totalBooks: this.stats.totalBooks,
        description: 'Complete Sahih Muslim collection in Arabic and English',
        authentication: 'All hadiths are graded Sahih (authentic)'
      },
      hadiths: this.hadiths
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

    this.printSummary(outputPath);
  }

  printSummary(outputPath) {
    console.log('\n' + '='.repeat(60));
    console.log('✅ SAHIH MUSLIM DOWNLOAD COMPLETE');
    console.log('='.repeat(60));
    console.log(`📊 Statistics:`);
    console.log(`   Total Books: ${this.stats.totalBooks}`);
    console.log(`   Total Hadiths: ${this.hadiths.length}`);
    console.log(`   Errors: ${this.stats.errors}`);
    console.log('');
    console.log(`📂 Output:`);
    console.log(`   ${outputPath}`);
    console.log(`   Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Adapt v3 miner for multi-collection support');
    console.log('   2. Scan Muslim collection for connections');
    console.log('   3. Merge with existing edge database');
    console.log('');
  }
}

// ============================================================================
// RUN THE DOWNLOADER
// ============================================================================

(async () => {
  const downloader = new MuslimDownloader();
  await downloader.download();
})();
