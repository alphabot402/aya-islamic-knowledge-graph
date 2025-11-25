/**
 * Quran-Hadith Connection Miner
 *
 * This script automatically discovers connections between Hadiths and Quranic verses
 * by scanning Bukhari for explicit citations, recitations, and revelation contexts.
 *
 * The goal: Generate 90%+ confidence connections without manual typing.
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// PATTERN MATCHING - The Intelligence Layer
// ============================================================================

/**
 * Known Surah name mappings (Arabic/English to surah number)
 * Used to detect when a hadith says "Surah Al-Fatihah" or "سورة الفاتحة"
 */
const SURAH_NAMES = {
  // Top 20 most commonly referenced surahs
  'al-fatihah': 1, 'fatiha': 1, 'الفاتحة': 1,
  'al-baqarah': 2, 'baqara': 2, 'البقرة': 2,
  'ali imran': 3, 'aal imran': 3, 'آل عمران': 3,
  'an-nisa': 4, 'nisa': 4, 'النساء': 4,
  'al-maidah': 5, 'maidah': 5, 'المائدة': 5,
  'al-an\'am': 6, 'anam': 6, 'الأنعام': 6,
  'al-anfal': 8, 'anfal': 8, 'الأنفال': 8,
  'at-tawbah': 9, 'tawbah': 9, 'التوبة': 9,
  'yunus': 10, 'يونس': 10,
  'hud': 11, 'هود': 11,
  'yusuf': 12, 'يوسف': 12,
  'ibrahim': 14, 'إبراهيم': 14,
  'al-hijr': 15, 'hijr': 15, 'الحجر': 15,
  'an-nahl': 16, 'nahl': 16, 'النحل': 16,
  'al-isra': 17, 'isra': 17, 'الإسراء': 17,
  'al-kahf': 18, 'kahf': 18, 'الكهف': 18,
  'maryam': 19, 'مريم': 19,
  'ta ha': 20, 'taha': 20, 'طه': 20,
  'al-anbiya': 21, 'anbiya': 21, 'الأنبياء': 21,
  'al-hajj': 22, 'hajj': 22, 'الحج': 22,
  'an-nur': 24, 'nur': 24, 'النور': 24,
  'al-ahzab': 33, 'ahzab': 33, 'الأحزاب': 33,
  'yasin': 36, 'yaseen': 36, 'يس': 36,
  'sad': 38, 'ص': 38,
  'az-zumar': 39, 'zumar': 39, 'الزمر': 39,
  'fussilat': 41, 'فصلت': 41,
  'muhammad': 47, 'محمد': 47,
  'al-fath': 48, 'fath': 48, 'الفتح': 48,
  'al-hujurat': 49, 'hujurat': 49, 'الحجرات': 49,
  'qaf': 50, 'ق': 50,
  'ar-rahman': 55, 'rahman': 55, 'الرحمن': 55,
  'al-waqi\'ah': 56, 'waqiah': 56, 'الواقعة': 56,
  'al-mulk': 67, 'mulk': 67, 'الملك': 67,
  'al-qalam': 68, 'qalam': 68, 'القلم': 68,
  'al-muddaththir': 74, 'muddaththir': 74, 'المدثر': 74,
  'al-qiyamah': 75, 'qiyamah': 75, 'القيامة': 75,
  'al-insan': 76, 'insan': 76, 'الإنسان': 76,
  'an-naba': 78, 'naba': 78, 'النبأ': 78,
  'al-alaq': 96, 'alaq': 96, 'العلق': 96,
  'al-ikhlas': 112, 'ikhlas': 112, 'الإخلاص': 112,
  'al-falaq': 113, 'falaq': 113, 'الفلق': 113,
  'an-nas': 114, 'nas': 114, 'الناس': 114
};

/**
 * Pattern detectors - ordered by confidence level
 */
const PATTERNS = {
  // HIGH CONFIDENCE - Explicit Quranic text in curly braces
  curlyBraceVerse: /{([^}]+)}/g,

  // HIGH CONFIDENCE - Direct revelation context
  revelation: [
    /then (?:Allah )?revealed?/i,
    /فأنزل الله/,
    /نزلت/,
    /أنزل الله/,
    /was revealed/i,
    /revelation (?:came|was)/i
  ],

  // MEDIUM-HIGH CONFIDENCE - Recitation
  recitation: [
    /recited? (?:the )?(?:verse|surah|ayah)/i,
    /قرأ/,
    /read (?:the )?(?:verse|surah)/i,
    /تلا/
  ],

  // MEDIUM CONFIDENCE - Verse reference patterns
  verseReference: [
    /\((\d+)[:\.](\d+)\)/,  // Matches (2:255) or (2.255)
    /surah (\w+)/i,
    /سورة ([^\s]+)/
  ]
};

// ============================================================================
// CONNECTION DISCOVERY ENGINE
// ============================================================================

class ConnectionMiner {
  constructor() {
    this.connections = [];
    this.edgeIdCounter = 1;
    this.stats = {
      hadithsScanned: 0,
      curlyBraceMatches: 0,
      revelationContextMatches: 0,
      recitationMatches: 0,
      verseReferenceMatches: 0,
      totalConnectionsFound: 0
    };
  }

  /**
   * Main mining function
   */
  mine(hadithsToScan = 500) {
    console.log('🔍 Starting Connection Mining...\n');
    console.log('📖 Reading Bukhari corpus...');

    const bukhariPath = path.join(__dirname, '../data/hadith/bukhari-raw.json');
    const bukhariData = JSON.parse(fs.readFileSync(bukhariPath, 'utf8'));

    const hadiths = bukhariData.hadiths.slice(0, hadithsToScan);
    console.log(`📊 Scanning first ${hadithsToScan} hadiths...\n`);

    for (const hadith of hadiths) {
      this.stats.hadithsScanned++;
      this.scanHadith(hadith);
    }

    this.printResults();
    this.writeOutput();
  }

  /**
   * Scan a single hadith for Quran connections
   */
  scanHadith(hadith) {
    const arabicText = hadith.arabic || '';
    const englishText = hadith.english?.text || '';
    const combinedText = `${arabicText} ${englishText}`;

    // Pattern 1: Curly brace verses (HIGHEST CONFIDENCE)
    this.detectCurlyBraceVerses(hadith, combinedText);

    // Pattern 2: Revelation context
    this.detectRevelationContext(hadith, combinedText);

    // Pattern 3: Recitation mentions
    this.detectRecitations(hadith, combinedText);

    // Pattern 4: Verse references
    this.detectVerseReferences(hadith, combinedText);
  }

  /**
   * Detect verses in curly braces {} - this is the gold standard
   * Example: {اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ}
   */
  detectCurlyBraceVerses(hadith, text) {
    const matches = [...text.matchAll(PATTERNS.curlyBraceVerse)];

    if (matches.length > 0) {
      this.stats.curlyBraceMatches++;

      // For now, mark as "contains explicit verse" - will need Quran lookup for exact reference
      // This is where a future enhancement could query the Quran text to find the exact verse
      for (const match of matches) {
        const verseText = match[1].trim();

        // Skip if it's just a name or too short
        if (verseText.length < 15) continue;

        // Try to identify the surah from the verse text
        const surahGuess = this.guessSurahFromVerseText(verseText, hadith);

        if (surahGuess) {
          this.addConnection({
            hadith,
            surah: surahGuess,
            verse: 1, // Generic verse number - would need fuzzy matching
            type: 'explicit_citation',
            confidence: 'high',
            evidence: `Contains Quranic text: ${verseText.substring(0, 50)}...`
          });
        }
      }
    }
  }

  /**
   * Detect revelation context
   * Example: "Then Allah revealed..." or "فأنزل الله"
   */
  detectRevelationContext(hadith, text) {
    for (const pattern of PATTERNS.revelation) {
      if (pattern.test(text)) {
        this.stats.revelationContextMatches++;

        // Look for surah name in the surrounding text
        const surahMatch = this.findSurahNameInText(text);
        if (surahMatch) {
          this.addConnection({
            hadith,
            surah: surahMatch,
            verse: 1,
            type: 'revelation_context',
            confidence: 'high',
            evidence: 'Hadith describes revelation context'
          });
        }
        break;
      }
    }
  }

  /**
   * Detect recitation mentions
   * Example: "The Prophet recited Surah Al-Fatihah"
   */
  detectRecitations(hadith, text) {
    for (const pattern of PATTERNS.recitation) {
      if (pattern.test(text)) {
        this.stats.recitationMatches++;

        const surahMatch = this.findSurahNameInText(text);
        if (surahMatch) {
          this.addConnection({
            hadith,
            surah: surahMatch,
            verse: 1,
            type: 'recitation',
            confidence: 'medium-high',
            evidence: 'Hadith mentions recitation'
          });
        }
        break;
      }
    }
  }

  /**
   * Detect verse reference patterns
   * Example: "(2:255)" or "Surah Al-Baqarah"
   */
  detectVerseReferences(hadith, text) {
    // Check for (X:Y) pattern
    const verseRefMatch = text.match(/\((\d+):(\d+)\)/);
    if (verseRefMatch) {
      this.stats.verseReferenceMatches++;
      this.addConnection({
        hadith,
        surah: parseInt(verseRefMatch[1]),
        verse: parseInt(verseRefMatch[2]),
        type: 'explicit_reference',
        confidence: 'high',
        evidence: `Direct reference: (${verseRefMatch[1]}:${verseRefMatch[2]})`
      });
      return;
    }

    // Check for surah name
    const surahMatch = this.findSurahNameInText(text);
    if (surahMatch) {
      this.stats.verseReferenceMatches++;
      this.addConnection({
        hadith,
        surah: surahMatch,
        verse: 1,
        type: 'surah_reference',
        confidence: 'medium',
        evidence: 'Hadith references surah by name'
      });
    }
  }

  /**
   * Find surah name in text
   */
  findSurahNameInText(text) {
    const lowerText = text.toLowerCase();

    for (const [name, number] of Object.entries(SURAH_NAMES)) {
      if (lowerText.includes(name)) {
        return number;
      }
    }

    return null;
  }

  /**
   * Guess surah from verse text (known verses from the first few hadiths)
   */
  guessSurahFromVerseText(verseText, hadith) {
    // Known mappings from the sample we saw
    const knownVerses = {
      'اقْرَأْ بِاسْمِ رَبِّكَ': 96, // Surah Al-Alaq
      'يَا أَيُّهَا الْمُدَّثِّرُ': 74, // Surah Al-Muddaththir
      'لاَ تُحَرِّكْ بِهِ لِسَانَكَ': 75, // Surah Al-Qiyamah
      'يَا أَهْلَ الْكِتَابِ': 3, // Surah Ali Imran (3:64)
    };

    for (const [snippet, surahNum] of Object.entries(knownVerses)) {
      if (verseText.includes(snippet)) {
        return surahNum;
      }
    }

    // Also check the chapter context - hadiths in Tafsir chapter often reference verses
    if (hadith.chapterId === 65) { // Chapter 65 is Tafsir
      return this.findSurahNameInText(verseText);
    }

    return null;
  }

  /**
   * Add a connection to the list
   */
  addConnection({ hadith, surah, verse, type, confidence, evidence }) {
    // Deduplicate - don't add same hadith-verse pair twice
    const exists = this.connections.some(c =>
      c.hadith.idInBook === hadith.idInBook &&
      c.verse.surah === surah &&
      c.verse.verse === verse
    );

    if (!exists) {
      this.connections.push({
        id: `edge-${this.edgeIdCounter++}`,
        verse: {
          surah,
          verse,
          reference: `${surah}:${verse}`
        },
        hadith: {
          source: 'bukhari',
          idInBook: hadith.idInBook,
          chapterId: hadith.chapterId,
          grade: 'sahih'
        },
        type,
        confidence,
        evidence,
        generatedBy: 'auto-curator-v1',
        needsReview: confidence === 'medium' || confidence === 'medium-high'
      });

      this.stats.totalConnectionsFound++;
    }
  }

  /**
   * Print mining results
   */
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 MINING RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ Hadiths Scanned:           ${this.stats.hadithsScanned}`);
    console.log(`📝 Curly Brace Matches:       ${this.stats.curlyBraceMatches}`);
    console.log(`🌟 Revelation Contexts:       ${this.stats.revelationContextMatches}`);
    console.log(`📖 Recitation Mentions:       ${this.stats.recitationMatches}`);
    console.log(`🔗 Verse References:          ${this.stats.verseReferenceMatches}`);
    console.log(`\n🎯 TOTAL CONNECTIONS FOUND:   ${this.stats.totalConnectionsFound}`);
    console.log('='.repeat(60) + '\n');

    // Show confidence breakdown
    const confidenceCounts = this.connections.reduce((acc, conn) => {
      acc[conn.confidence] = (acc[conn.confidence] || 0) + 1;
      return acc;
    }, {});

    console.log('📈 Confidence Breakdown:');
    Object.entries(confidenceCounts).forEach(([conf, count]) => {
      console.log(`   ${conf}: ${count}`);
    });

    console.log('\n📋 Sample Connections (first 5):');
    this.connections.slice(0, 5).forEach(conn => {
      console.log(`   • Bukhari ${conn.hadith.idInBook} → Surah ${conn.verse.surah}:${conn.verse.verse}`);
      console.log(`     Type: ${conn.type}, Confidence: ${conn.confidence}`);
      console.log(`     Evidence: ${conn.evidence}`);
    });
  }

  /**
   * Write output to file
   */
  writeOutput() {
    const outputPath = path.join(__dirname, '../data/connections/generated-edges.json');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const output = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        generator: 'auto-curator-v1',
        source: 'bukhari-raw.json',
        hadithsScanned: this.stats.hadithsScanned,
        connectionsFound: this.stats.totalConnectionsFound,
        method: 'pattern-matching + context-analysis',
        reviewStatus: 'needs-human-verification'
      },
      edges: this.connections
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

    console.log(`\n✅ Output written to: ${outputPath}`);
    console.log(`\n📝 Next Steps:`);
    console.log(`   1. Review the generated connections`);
    console.log(`   2. Delete any false positives`);
    console.log(`   3. Merge with existing verse-hadith-edges.json`);
    console.log(`   4. Run: npm run dev to see new connections in graph\n`);
  }
}

// ============================================================================
// RUN THE MINER
// ============================================================================

const miner = new ConnectionMiner();

// Get command line argument for number of hadiths to scan
const hadithsToScan = parseInt(process.argv[2]) || 500;

miner.mine(hadithsToScan);
