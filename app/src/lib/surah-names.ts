/**
 * Complete Surah Names Database
 * All 114 surahs with Arabic names and English transliterations
 *
 * Source: Authentic Islamic sources, standard transliterations
 * Date: 2025-11-25
 */

export interface SurahInfo {
  number: number
  nameArabic: string
  nameEnglish: string
  meaningEnglish: string
  revelationType: 'Meccan' | 'Medinan'
  verseCount: number
}

export const SURAH_NAMES: Record<number, SurahInfo> = {
  1: { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatihah', meaningEnglish: 'The Opening', revelationType: 'Meccan', verseCount: 7 },
  2: { number: 2, nameArabic: 'البقرة', nameEnglish: 'Al-Baqarah', meaningEnglish: 'The Cow', revelationType: 'Medinan', verseCount: 286 },
  3: { number: 3, nameArabic: 'آل عمران', nameEnglish: 'Ali \'Imran', meaningEnglish: 'Family of Imran', revelationType: 'Medinan', verseCount: 200 },
  4: { number: 4, nameArabic: 'النساء', nameEnglish: 'An-Nisa', meaningEnglish: 'The Women', revelationType: 'Medinan', verseCount: 176 },
  5: { number: 5, nameArabic: 'المائدة', nameEnglish: 'Al-Ma\'idah', meaningEnglish: 'The Table Spread', revelationType: 'Medinan', verseCount: 120 },
  6: { number: 6, nameArabic: 'الأنعام', nameEnglish: 'Al-An\'am', meaningEnglish: 'The Cattle', revelationType: 'Meccan', verseCount: 165 },
  7: { number: 7, nameArabic: 'الأعراف', nameEnglish: 'Al-A\'raf', meaningEnglish: 'The Heights', revelationType: 'Meccan', verseCount: 206 },
  8: { number: 8, nameArabic: 'الأنفال', nameEnglish: 'Al-Anfal', meaningEnglish: 'The Spoils of War', revelationType: 'Medinan', verseCount: 75 },
  9: { number: 9, nameArabic: 'التوبة', nameEnglish: 'At-Tawbah', meaningEnglish: 'The Repentance', revelationType: 'Medinan', verseCount: 129 },
  10: { number: 10, nameArabic: 'يونس', nameEnglish: 'Yunus', meaningEnglish: 'Jonah', revelationType: 'Meccan', verseCount: 109 },
  11: { number: 11, nameArabic: 'هود', nameEnglish: 'Hud', meaningEnglish: 'Hud', revelationType: 'Meccan', verseCount: 123 },
  12: { number: 12, nameArabic: 'يوسف', nameEnglish: 'Yusuf', meaningEnglish: 'Joseph', revelationType: 'Meccan', verseCount: 111 },
  13: { number: 13, nameArabic: 'الرعد', nameEnglish: 'Ar-Ra\'d', meaningEnglish: 'The Thunder', revelationType: 'Medinan', verseCount: 43 },
  14: { number: 14, nameArabic: 'ابراهيم', nameEnglish: 'Ibrahim', meaningEnglish: 'Abraham', revelationType: 'Meccan', verseCount: 52 },
  15: { number: 15, nameArabic: 'الحجر', nameEnglish: 'Al-Hijr', meaningEnglish: 'The Rocky Tract', revelationType: 'Meccan', verseCount: 99 },
  16: { number: 16, nameArabic: 'النحل', nameEnglish: 'An-Nahl', meaningEnglish: 'The Bee', revelationType: 'Meccan', verseCount: 128 },
  17: { number: 17, nameArabic: 'الإسراء', nameEnglish: 'Al-Isra', meaningEnglish: 'The Night Journey', revelationType: 'Meccan', verseCount: 111 },
  18: { number: 18, nameArabic: 'الكهف', nameEnglish: 'Al-Kahf', meaningEnglish: 'The Cave', revelationType: 'Meccan', verseCount: 110 },
  19: { number: 19, nameArabic: 'مريم', nameEnglish: 'Maryam', meaningEnglish: 'Mary', revelationType: 'Meccan', verseCount: 98 },
  20: { number: 20, nameArabic: 'طه', nameEnglish: 'Ta-Ha', meaningEnglish: 'Ta-Ha', revelationType: 'Meccan', verseCount: 135 },
  21: { number: 21, nameArabic: 'الأنبياء', nameEnglish: 'Al-Anbiya', meaningEnglish: 'The Prophets', revelationType: 'Meccan', verseCount: 112 },
  22: { number: 22, nameArabic: 'الحج', nameEnglish: 'Al-Hajj', meaningEnglish: 'The Pilgrimage', revelationType: 'Medinan', verseCount: 78 },
  23: { number: 23, nameArabic: 'المؤمنون', nameEnglish: 'Al-Mu\'minun', meaningEnglish: 'The Believers', revelationType: 'Meccan', verseCount: 118 },
  24: { number: 24, nameArabic: 'النور', nameEnglish: 'An-Nur', meaningEnglish: 'The Light', revelationType: 'Medinan', verseCount: 64 },
  25: { number: 25, nameArabic: 'الفرقان', nameEnglish: 'Al-Furqan', meaningEnglish: 'The Criterion', revelationType: 'Meccan', verseCount: 77 },
  26: { number: 26, nameArabic: 'الشعراء', nameEnglish: 'Ash-Shu\'ara', meaningEnglish: 'The Poets', revelationType: 'Meccan', verseCount: 227 },
  27: { number: 27, nameArabic: 'النمل', nameEnglish: 'An-Naml', meaningEnglish: 'The Ant', revelationType: 'Meccan', verseCount: 93 },
  28: { number: 28, nameArabic: 'القصص', nameEnglish: 'Al-Qasas', meaningEnglish: 'The Stories', revelationType: 'Meccan', verseCount: 88 },
  29: { number: 29, nameArabic: 'العنكبوت', nameEnglish: 'Al-\'Ankabut', meaningEnglish: 'The Spider', revelationType: 'Meccan', verseCount: 69 },
  30: { number: 30, nameArabic: 'الروم', nameEnglish: 'Ar-Rum', meaningEnglish: 'The Romans', revelationType: 'Meccan', verseCount: 60 },
  31: { number: 31, nameArabic: 'لقمان', nameEnglish: 'Luqman', meaningEnglish: 'Luqman', revelationType: 'Meccan', verseCount: 34 },
  32: { number: 32, nameArabic: 'السجدة', nameEnglish: 'As-Sajdah', meaningEnglish: 'The Prostration', revelationType: 'Meccan', verseCount: 30 },
  33: { number: 33, nameArabic: 'الأحزاب', nameEnglish: 'Al-Ahzab', meaningEnglish: 'The Combined Forces', revelationType: 'Medinan', verseCount: 73 },
  34: { number: 34, nameArabic: 'سبإ', nameEnglish: 'Saba', meaningEnglish: 'Sheba', revelationType: 'Meccan', verseCount: 54 },
  35: { number: 35, nameArabic: 'فاطر', nameEnglish: 'Fatir', meaningEnglish: 'Originator', revelationType: 'Meccan', verseCount: 45 },
  36: { number: 36, nameArabic: 'يس', nameEnglish: 'Ya-Sin', meaningEnglish: 'Ya-Sin', revelationType: 'Meccan', verseCount: 83 },
  37: { number: 37, nameArabic: 'الصافات', nameEnglish: 'As-Saffat', meaningEnglish: 'Those Ranged in Ranks', revelationType: 'Meccan', verseCount: 182 },
  38: { number: 38, nameArabic: 'ص', nameEnglish: 'Sad', meaningEnglish: 'Sad', revelationType: 'Meccan', verseCount: 88 },
  39: { number: 39, nameArabic: 'الزمر', nameEnglish: 'Az-Zumar', meaningEnglish: 'The Groups', revelationType: 'Meccan', verseCount: 75 },
  40: { number: 40, nameArabic: 'غافر', nameEnglish: 'Ghafir', meaningEnglish: 'The Forgiver', revelationType: 'Meccan', verseCount: 85 },
  41: { number: 41, nameArabic: 'فصلت', nameEnglish: 'Fussilat', meaningEnglish: 'Explained in Detail', revelationType: 'Meccan', verseCount: 54 },
  42: { number: 42, nameArabic: 'الشورى', nameEnglish: 'Ash-Shura', meaningEnglish: 'The Consultation', revelationType: 'Meccan', verseCount: 53 },
  43: { number: 43, nameArabic: 'الزخرف', nameEnglish: 'Az-Zukhruf', meaningEnglish: 'The Gold Adornments', revelationType: 'Meccan', verseCount: 89 },
  44: { number: 44, nameArabic: 'الدخان', nameEnglish: 'Ad-Dukhan', meaningEnglish: 'The Smoke', revelationType: 'Meccan', verseCount: 59 },
  45: { number: 45, nameArabic: 'الجاثية', nameEnglish: 'Al-Jathiyah', meaningEnglish: 'The Kneeling', revelationType: 'Meccan', verseCount: 37 },
  46: { number: 46, nameArabic: 'الأحقاف', nameEnglish: 'Al-Ahqaf', meaningEnglish: 'The Wind-Curved Sandhills', revelationType: 'Meccan', verseCount: 35 },
  47: { number: 47, nameArabic: 'محمد', nameEnglish: 'Muhammad', meaningEnglish: 'Muhammad', revelationType: 'Medinan', verseCount: 38 },
  48: { number: 48, nameArabic: 'الفتح', nameEnglish: 'Al-Fath', meaningEnglish: 'The Victory', revelationType: 'Medinan', verseCount: 29 },
  49: { number: 49, nameArabic: 'الحجرات', nameEnglish: 'Al-Hujurat', meaningEnglish: 'The Rooms', revelationType: 'Medinan', verseCount: 18 },
  50: { number: 50, nameArabic: 'ق', nameEnglish: 'Qaf', meaningEnglish: 'Qaf', revelationType: 'Meccan', verseCount: 45 },
  51: { number: 51, nameArabic: 'الذاريات', nameEnglish: 'Adh-Dhariyat', meaningEnglish: 'The Winnowing Winds', revelationType: 'Meccan', verseCount: 60 },
  52: { number: 52, nameArabic: 'الطور', nameEnglish: 'At-Tur', meaningEnglish: 'The Mount', revelationType: 'Meccan', verseCount: 49 },
  53: { number: 53, nameArabic: 'النجم', nameEnglish: 'An-Najm', meaningEnglish: 'The Star', revelationType: 'Meccan', verseCount: 62 },
  54: { number: 54, nameArabic: 'القمر', nameEnglish: 'Al-Qamar', meaningEnglish: 'The Moon', revelationType: 'Meccan', verseCount: 55 },
  55: { number: 55, nameArabic: 'الرحمن', nameEnglish: 'Ar-Rahman', meaningEnglish: 'The Most Merciful', revelationType: 'Medinan', verseCount: 78 },
  56: { number: 56, nameArabic: 'الواقعة', nameEnglish: 'Al-Waqi\'ah', meaningEnglish: 'The Inevitable', revelationType: 'Meccan', verseCount: 96 },
  57: { number: 57, nameArabic: 'الحديد', nameEnglish: 'Al-Hadid', meaningEnglish: 'The Iron', revelationType: 'Medinan', verseCount: 29 },
  58: { number: 58, nameArabic: 'المجادلة', nameEnglish: 'Al-Mujadilah', meaningEnglish: 'The Pleading Woman', revelationType: 'Medinan', verseCount: 22 },
  59: { number: 59, nameArabic: 'الحشر', nameEnglish: 'Al-Hashr', meaningEnglish: 'The Exile', revelationType: 'Medinan', verseCount: 24 },
  60: { number: 60, nameArabic: 'الممتحنة', nameEnglish: 'Al-Mumtahanah', meaningEnglish: 'She That Is To Be Examined', revelationType: 'Medinan', verseCount: 13 },
  61: { number: 61, nameArabic: 'الصف', nameEnglish: 'As-Saff', meaningEnglish: 'The Ranks', revelationType: 'Medinan', verseCount: 14 },
  62: { number: 62, nameArabic: 'الجمعة', nameEnglish: 'Al-Jumu\'ah', meaningEnglish: 'Friday', revelationType: 'Medinan', verseCount: 11 },
  63: { number: 63, nameArabic: 'المنافقون', nameEnglish: 'Al-Munafiqun', meaningEnglish: 'The Hypocrites', revelationType: 'Medinan', verseCount: 11 },
  64: { number: 64, nameArabic: 'التغابن', nameEnglish: 'At-Taghabun', meaningEnglish: 'The Mutual Disillusion', revelationType: 'Medinan', verseCount: 18 },
  65: { number: 65, nameArabic: 'الطلاق', nameEnglish: 'At-Talaq', meaningEnglish: 'The Divorce', revelationType: 'Medinan', verseCount: 12 },
  66: { number: 66, nameArabic: 'التحريم', nameEnglish: 'At-Tahrim', meaningEnglish: 'The Prohibition', revelationType: 'Medinan', verseCount: 12 },
  67: { number: 67, nameArabic: 'الملك', nameEnglish: 'Al-Mulk', meaningEnglish: 'The Sovereignty', revelationType: 'Meccan', verseCount: 30 },
  68: { number: 68, nameArabic: 'القلم', nameEnglish: 'Al-Qalam', meaningEnglish: 'The Pen', revelationType: 'Meccan', verseCount: 52 },
  69: { number: 69, nameArabic: 'الحاقة', nameEnglish: 'Al-Haqqah', meaningEnglish: 'The Reality', revelationType: 'Meccan', verseCount: 52 },
  70: { number: 70, nameArabic: 'المعارج', nameEnglish: 'Al-Ma\'arij', meaningEnglish: 'The Ascending Stairways', revelationType: 'Meccan', verseCount: 44 },
  71: { number: 71, nameArabic: 'نوح', nameEnglish: 'Nuh', meaningEnglish: 'Noah', revelationType: 'Meccan', verseCount: 28 },
  72: { number: 72, nameArabic: 'الجن', nameEnglish: 'Al-Jinn', meaningEnglish: 'The Jinn', revelationType: 'Meccan', verseCount: 28 },
  73: { number: 73, nameArabic: 'المزمل', nameEnglish: 'Al-Muzzammil', meaningEnglish: 'The Enshrouded One', revelationType: 'Meccan', verseCount: 20 },
  74: { number: 74, nameArabic: 'المدثر', nameEnglish: 'Al-Muddaththir', meaningEnglish: 'The Cloaked One', revelationType: 'Meccan', verseCount: 56 },
  75: { number: 75, nameArabic: 'القيامة', nameEnglish: 'Al-Qiyamah', meaningEnglish: 'The Resurrection', revelationType: 'Meccan', verseCount: 40 },
  76: { number: 76, nameArabic: 'الانسان', nameEnglish: 'Al-Insan', meaningEnglish: 'The Man', revelationType: 'Medinan', verseCount: 31 },
  77: { number: 77, nameArabic: 'المرسلات', nameEnglish: 'Al-Mursalat', meaningEnglish: 'The Emissaries', revelationType: 'Meccan', verseCount: 50 },
  78: { number: 78, nameArabic: 'النبإ', nameEnglish: 'An-Naba', meaningEnglish: 'The Tidings', revelationType: 'Meccan', verseCount: 40 },
  79: { number: 79, nameArabic: 'النازعات', nameEnglish: 'An-Nazi\'at', meaningEnglish: 'Those Who Drag Forth', revelationType: 'Meccan', verseCount: 46 },
  80: { number: 80, nameArabic: 'عبس', nameEnglish: '\'Abasa', meaningEnglish: 'He Frowned', revelationType: 'Meccan', verseCount: 42 },
  81: { number: 81, nameArabic: 'التكوير', nameEnglish: 'At-Takwir', meaningEnglish: 'The Overthrowing', revelationType: 'Meccan', verseCount: 29 },
  82: { number: 82, nameArabic: 'الإنفطار', nameEnglish: 'Al-Infitar', meaningEnglish: 'The Cleaving', revelationType: 'Meccan', verseCount: 19 },
  83: { number: 83, nameArabic: 'المطففين', nameEnglish: 'Al-Mutaffifin', meaningEnglish: 'The Defrauding', revelationType: 'Meccan', verseCount: 36 },
  84: { number: 84, nameArabic: 'الإنشقاق', nameEnglish: 'Al-Inshiqaq', meaningEnglish: 'The Sundering', revelationType: 'Meccan', verseCount: 25 },
  85: { number: 85, nameArabic: 'البروج', nameEnglish: 'Al-Buruj', meaningEnglish: 'The Mansions of the Stars', revelationType: 'Meccan', verseCount: 22 },
  86: { number: 86, nameArabic: 'الطارق', nameEnglish: 'At-Tariq', meaningEnglish: 'The Night Comer', revelationType: 'Meccan', verseCount: 17 },
  87: { number: 87, nameArabic: 'الأعلى', nameEnglish: 'Al-A\'la', meaningEnglish: 'The Most High', revelationType: 'Meccan', verseCount: 19 },
  88: { number: 88, nameArabic: 'الغاشية', nameEnglish: 'Al-Ghashiyah', meaningEnglish: 'The Overwhelming', revelationType: 'Meccan', verseCount: 26 },
  89: { number: 89, nameArabic: 'الفجر', nameEnglish: 'Al-Fajr', meaningEnglish: 'The Dawn', revelationType: 'Meccan', verseCount: 30 },
  90: { number: 90, nameArabic: 'البلد', nameEnglish: 'Al-Balad', meaningEnglish: 'The City', revelationType: 'Meccan', verseCount: 20 },
  91: { number: 91, nameArabic: 'الشمس', nameEnglish: 'Ash-Shams', meaningEnglish: 'The Sun', revelationType: 'Meccan', verseCount: 15 },
  92: { number: 92, nameArabic: 'الليل', nameEnglish: 'Al-Layl', meaningEnglish: 'The Night', revelationType: 'Meccan', verseCount: 21 },
  93: { number: 93, nameArabic: 'الضحى', nameEnglish: 'Ad-Duha', meaningEnglish: 'The Morning Hours', revelationType: 'Meccan', verseCount: 11 },
  94: { number: 94, nameArabic: 'الشرح', nameEnglish: 'Ash-Sharh', meaningEnglish: 'The Consolation', revelationType: 'Meccan', verseCount: 8 },
  95: { number: 95, nameArabic: 'التين', nameEnglish: 'At-Tin', meaningEnglish: 'The Fig', revelationType: 'Meccan', verseCount: 8 },
  96: { number: 96, nameArabic: 'العلق', nameEnglish: 'Al-\'Alaq', meaningEnglish: 'The Clot', revelationType: 'Meccan', verseCount: 19 },
  97: { number: 97, nameArabic: 'القدر', nameEnglish: 'Al-Qadr', meaningEnglish: 'The Power', revelationType: 'Meccan', verseCount: 5 },
  98: { number: 98, nameArabic: 'البينة', nameEnglish: 'Al-Bayyinah', meaningEnglish: 'The Clear Proof', revelationType: 'Medinan', verseCount: 8 },
  99: { number: 99, nameArabic: 'الزلزلة', nameEnglish: 'Az-Zalzalah', meaningEnglish: 'The Earthquake', revelationType: 'Medinan', verseCount: 8 },
  100: { number: 100, nameArabic: 'العاديات', nameEnglish: 'Al-\'Adiyat', meaningEnglish: 'The Courser', revelationType: 'Meccan', verseCount: 11 },
  101: { number: 101, nameArabic: 'القارعة', nameEnglish: 'Al-Qari\'ah', meaningEnglish: 'The Calamity', revelationType: 'Meccan', verseCount: 11 },
  102: { number: 102, nameArabic: 'التكاثر', nameEnglish: 'At-Takathur', meaningEnglish: 'The Rivalry in World Increase', revelationType: 'Meccan', verseCount: 8 },
  103: { number: 103, nameArabic: 'العصر', nameEnglish: 'Al-\'Asr', meaningEnglish: 'The Declining Day', revelationType: 'Meccan', verseCount: 3 },
  104: { number: 104, nameArabic: 'الهمزة', nameEnglish: 'Al-Humazah', meaningEnglish: 'The Traducer', revelationType: 'Meccan', verseCount: 9 },
  105: { number: 105, nameArabic: 'الفيل', nameEnglish: 'Al-Fil', meaningEnglish: 'The Elephant', revelationType: 'Meccan', verseCount: 5 },
  106: { number: 106, nameArabic: 'قريش', nameEnglish: 'Quraysh', meaningEnglish: 'Quraysh', revelationType: 'Meccan', verseCount: 4 },
  107: { number: 107, nameArabic: 'الماعون', nameEnglish: 'Al-Ma\'un', meaningEnglish: 'The Small Kindnesses', revelationType: 'Meccan', verseCount: 7 },
  108: { number: 108, nameArabic: 'الكوثر', nameEnglish: 'Al-Kawthar', meaningEnglish: 'The Abundance', revelationType: 'Meccan', verseCount: 3 },
  109: { number: 109, nameArabic: 'الكافرون', nameEnglish: 'Al-Kafirun', meaningEnglish: 'The Disbelievers', revelationType: 'Meccan', verseCount: 6 },
  110: { number: 110, nameArabic: 'النصر', nameEnglish: 'An-Nasr', meaningEnglish: 'The Divine Support', revelationType: 'Medinan', verseCount: 3 },
  111: { number: 111, nameArabic: 'المسد', nameEnglish: 'Al-Masad', meaningEnglish: 'The Palm Fiber', revelationType: 'Meccan', verseCount: 5 },
  112: { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'Al-Ikhlas', meaningEnglish: 'The Sincerity', revelationType: 'Meccan', verseCount: 4 },
  113: { number: 113, nameArabic: 'الفلق', nameEnglish: 'Al-Falaq', meaningEnglish: 'The Daybreak', revelationType: 'Meccan', verseCount: 5 },
  114: { number: 114, nameArabic: 'الناس', nameEnglish: 'An-Nas', meaningEnglish: 'Mankind', revelationType: 'Meccan', verseCount: 6 }
}

/**
 * Get surah name by number
 */
export function getSurahName(surahNumber: number): SurahInfo | undefined {
  return SURAH_NAMES[surahNumber]
}

/**
 * Get formatted surah display name
 * Returns: "Surah Al-Fatihah (1) - The Opening"
 */
export function getFormattedSurahName(surahNumber: number): string {
  const info = SURAH_NAMES[surahNumber]
  if (!info) return `Surah ${surahNumber}`
  return `Surah ${info.nameEnglish} (${surahNumber}) - ${info.meaningEnglish}`
}

/**
 * Get short surah display name
 * Returns: "Al-Fatihah"
 */
export function getShortSurahName(surahNumber: number): string {
  const info = SURAH_NAMES[surahNumber]
  return info ? info.nameEnglish : `Surah ${surahNumber}`
}
