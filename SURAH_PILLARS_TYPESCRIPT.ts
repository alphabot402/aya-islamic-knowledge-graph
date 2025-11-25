/**
 * REFINED SURAH_PILLARS Categorization
 * Date: 2025-11-24
 *
 * Balanced distribution for optimal orbital visualization:
 * - Shahada: 19 surahs (pure Tawhid - center column)
 * - Salah: 19 surahs (prayer/worship - inner ring R=30)
 * - Zakat: 19 surahs (charity/wealth - ring R=50)
 * - Sawm: 19 surahs (fasting/patience - ring R=70)
 * - Hajj: 19 surahs (pilgrimage/journey - outer ring R=90)
 * - General: 19 surahs (mixed themes - elevated plane R=60)
 */

type Pillar = 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj' | 'general'

const SURAH_PILLARS: Record<number, Pillar> = {
  // SHAHADA (19) - Pure Tawhid/Monotheism/Faith
  1: 'shahada',   // Al-Fatiha - Foundation
  6: 'shahada',   // Al-An'am - Tawhid arguments
  7: 'shahada',   // Al-A'raf - Prophets
  10: 'shahada',  // Yunus - Divine signs
  14: 'shahada',  // Ibrahim - Pure monotheism
  16: 'shahada',  // An-Nahl - Signs of Allah
  50: 'shahada',  // Qaf - Divine power
  67: 'shahada',  // Al-Mulk - Allah's dominion
  71: 'shahada',  // Nuh - Call to Tawhid
  77: 'shahada',  // Al-Mursalat - Divine warning
  81: 'shahada',  // At-Takwir - Day of Judgment
  84: 'shahada',  // Al-Inshiqaq - Accountability
  86: 'shahada',  // At-Tariq - Divine watchfulness
  89: 'shahada',  // Al-Fajr - Lessons from history
  91: 'shahada',  // Ash-Shams - Soul purification
  109: 'shahada', // Al-Kafirun - Rejection of shirk
  112: 'shahada', // Al-Ikhlas - Pure monotheism essence
  113: 'shahada', // Al-Falaq - Seeking refuge
  114: 'shahada', // An-Nas - Seeking refuge

  // SALAH (19) - Prayer/Worship/Dhikr
  2: 'salah',     // Al-Baqarah - Qibla, prayer times (2:238-239)
  4: 'salah',     // An-Nisa - Fear prayer, shortening
  11: 'salah',    // Hud - Prayer at both ends of day (11:114)
  17: 'salah',    // Al-Isra - Five daily prayers
  19: 'salah',    // Maryam - Prayer of Zakariya
  20: 'salah',    // Ta-Ha - Prayer for My remembrance (20:14)
  24: 'salah',    // An-Nur - Not distracted from prayer (24:37)
  30: 'salah',    // Ar-Rum - Glorify at specific times (30:17-18)
  33: 'salah',    // Al-Ahzab - Remember Allah much (33:41)
  36: 'salah',    // Yaseen - Worship and prostration
  51: 'salah',    // Adh-Dhariyat - Created to worship (51:56)
  62: 'salah',    // Al-Jumu'ah - Friday prayer
  73: 'salah',    // Al-Muzzammil - Night prayer
  74: 'salah',    // Al-Muddaththir - Stand and warn
  76: 'salah',    // Al-Insan - Morning/evening remembrance (76:25)
  87: 'salah',    // Al-A'la - Glorify the name of your Lord
  96: 'salah',    // Al-Alaq - Prostration
  107: 'salah',   // Al-Ma'un - Neglecting prayer warning
  108: 'salah',   // Al-Kawthar - "Pray to your Lord"

  // ZAKAT (19) - Charity/Wealth/Spending
  3: 'zakat',     // Ali Imran - Spending in Allah's way (3:92)
  5: 'zakat',     // Al-Ma'idah - Establish prayer and give zakat (5:55)
  9: 'zakat',     // At-Tawbah - Zakat collection and distribution
  18: 'zakat',    // Al-Kahf - Wealth trials (garden parable)
  21: 'zakat',    // Al-Anbiya - Righteous spending
  23: 'zakat',    // Al-Mu'minun - Successful believers give zakat (23:4)
  25: 'zakat',    // Al-Furqan - Moderate spending (25:67)
  31: 'zakat',    // Luqman - Wisdom about wealth
  34: 'zakat',    // Saba - Spending from provision (34:39)
  35: 'zakat',    // Fatir - Those who recite and spend (35:29)
  41: 'zakat',    // Fussilat - Who give zakat (41:7)
  42: 'zakat',    // Ash-Shura - Spend from what We provided (42:38)
  47: 'zakat',    // Muhammad - Spending in Allah's cause (47:38)
  57: 'zakat',    // Al-Hadid - Spend from what He made you trustees
  58: 'zakat',    // Al-Mujadila - Charity before consultation (58:12-13)
  59: 'zakat',    // Al-Hashr - Distribution to the poor (59:7)
  63: 'zakat',    // Al-Munafiqun - Spend before death comes (63:10)
  64: 'zakat',    // At-Taghabun - Believe and spend (64:16)
  92: 'zakat',    // Al-Lail - The righteous one who gives (92:18)

  // SAWM (19) - Fasting/Patience/Self-Discipline
  12: 'sawm',     // Yusuf - Patience of Yusuf
  13: 'sawm',     // Ar-Ra'd - Patient endurance (13:22-24)
  15: 'sawm',     // Al-Hijr - Patience with mockers (15:85)
  26: 'sawm',     // Ash-Shu'ara - Patience until judgment (26:216)
  28: 'sawm',     // Al-Qasas - Patient endurance better (28:54, 80)
  29: 'sawm',     // Al-Ankabut - Patience under trial (29:59)
  32: 'sawm',     // As-Sajdah - Patient and certain (32:24)
  38: 'sawm',     // Sad - Patience of Ayyub (38:44)
  39: 'sawm',     // Az-Zumar - Patient will be rewarded (39:10)
  40: 'sawm',     // Ghafir - Bear with patience (40:55)
  43: 'sawm',     // Az-Zukhruf - Patience and forbearance
  46: 'sawm',     // Al-Ahqaf - Be patient as messengers were (46:35)
  52: 'sawm',     // At-Tur - Patience and waiting
  53: 'sawm',     // An-Najm - Prostration and patience
  54: 'sawm',     // Al-Qamar - Taste our punishment patiently
  68: 'sawm',     // Al-Qalam - Bear patiently (68:48)
  70: 'sawm',     // Al-Ma'arij - Be patient with beautiful patience (70:5)
  90: 'sawm',     // Al-Balad - Among those who have patience (90:17)
  97: 'sawm',     // Al-Qadr - Night of Power (Ramadan)

  // HAJJ (19) - Pilgrimage/Sacred Journey/Ka'bah
  8: 'hajj',      // Al-Anfal - Sacred months and fighting
  22: 'hajj',     // Al-Hajj - Main Hajj surah
  27: 'hajj',     // An-Naml - Journeys of prophets
  37: 'hajj',     // As-Saffat - Abraham and sacrifice
  44: 'hajj',     // Ad-Dukhan - Sacred night
  45: 'hajj',     // Al-Jathiya - Travel and see (45:20)
  48: 'hajj',     // Al-Fath - Treaty of Hudaybiyyah (umrah)
  49: 'hajj',     // Al-Hujurat - Pilgrimage ethics
  55: 'hajj',     // Ar-Rahman - Journey to afterlife
  56: 'hajj',     // Al-Waqi'ah - The Event/journey
  60: 'hajj',     // Al-Mumtahana - Testing during journey
  61: 'hajj',     // As-Saff - Striving in Allah's way
  65: 'hajj',     // At-Talaq - Journey provisions
  66: 'hajj',     // At-Tahrim - Striving and journey
  72: 'hajj',     // Al-Jinn - Journey of jinn to faith
  93: 'hajj',     // Ad-Duha - Find you lost and guide you
  95: 'hajj',     // At-Tin - This secure city (Makkah)
  106: 'hajj',    // Quraysh - Ka'bah custodians
  111: 'hajj',    // Al-Masad - Abu Lahab's opposition

  // GENERAL (19) - Mixed Themes/Legal/Stories
  75: 'general',  // Al-Qiyamah - Resurrection
  78: 'general',  // An-Naba - The Announcement
  79: 'general',  // An-Nazi'at - Those who extract
  80: 'general',  // Abasa - He Frowned
  82: 'general',  // Al-Infitar - The Cleaving
  83: 'general',  // Al-Mutaffifin - Defrauding
  85: 'general',  // Al-Buruj - The Constellations
  88: 'general',  // Al-Ghashiya - The Overwhelming
  94: 'general',  // Ash-Sharh - The Relief
  98: 'general',  // Al-Bayyina - The Clear Evidence
  99: 'general',  // Az-Zalzala - The Earthquake
  100: 'general', // Al-Adiyat - The Chargers
  101: 'general', // Al-Qari'a - The Striking Calamity
  102: 'general', // At-Takathur - Competition in increase
  103: 'general', // Al-Asr - The Time
  104: 'general', // Al-Humazah - The Slanderer
  105: 'general', // Al-Fil - The Elephant
  110: 'general', // An-Nasr - Divine support
  69: 'general',  // Al-Haaqqa - The Reality
}

/**
 * Distribution Summary:
 * - Shahada: 19 surahs (center vertical column)
 * - Salah: 19 surahs (inner ring R=30)
 * - Zakat: 19 surahs (ring R=50)
 * - Sawm: 19 surahs (ring R=70)
 * - Hajj: 19 surahs (outer ring R=90)
 * - General: 19 surahs (elevated plane R=60, Y+15)
 *
 * TOTAL: 114 surahs ✓
 *
 * Visual Benefits:
 * - Perfectly balanced rings (all equal ~19 surahs)
 * - No overcrowding in center or elevated plane
 * - Aesthetically pleasing circular distribution
 * - Each ring clearly visible and distinct
 */

export { SURAH_PILLARS, type Pillar }
