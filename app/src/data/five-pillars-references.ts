/**
 * The Five Pillars: Master Authenticated Database (100 Entries)
 * Curated mapping of primary evidences (Adillah) with external API links
 *
 * Sources: Quran (quran.com API) + Hadith (sunnah.com API)
 */

export type PillarType = 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj'
export type SourceType = 'quran' | 'bukhari' | 'muslim'
export type FunctionType =
  | 'Purpose' | 'Mandate' | 'Creed' | 'Witness' | 'Warning'
  | 'Rules' | 'Wisdom' | 'Condition' | 'Purity' | 'Quality'
  | 'Voluntary' | 'Incentive' | 'Account' | 'Virtue' | 'Building'
  | 'Multiplier' | 'Blessing' | 'Etiquette' | 'Logic' | 'Urgency'
  | 'Goal' | 'Exemption' | 'Shield' | 'Special' | 'Forgiveness'
  | 'Call' | 'Provision' | 'Station' | 'Symbols' | 'Ritual'
  | 'Reward' | 'Rebirth' | 'Mercy' | 'Equality' | 'Character'

export interface PillarReference {
  refId: string
  pillar: PillarType
  source: SourceType
  citation: string // e.g., "2:255" or "528"
  function: FunctionType
  coreText: string
  tags: string[]
  apiLink: string
}

/**
 * Generate API link for Quran.com
 */
function quranLink(citation: string): string {
  const [surah, ayah] = citation.split(':')
  return `https://quran.com/${surah}${ayah ? `/${ayah}` : ''}`
}

/**
 * Generate API link for Sunnah.com
 */
function hadithLink(collection: 'bukhari' | 'muslim', number: string): string {
  return `https://sunnah.com/${collection}:${number}`
}

/**
 * THE FIVE PILLARS MASTER DATABASE (100 Authenticated References)
 */
export const FIVE_PILLARS_REFERENCES: PillarReference[] = [
  // ============================================================================
  // 1. SHAHADA (Faith & Tawheed) - 20 Entries
  // ============================================================================
  {
    refId: 'SH-01',
    pillar: 'shahada',
    source: 'quran',
    citation: '51:56',
    function: 'Purpose',
    coreText: 'I did not create the jinn and mankind except to worship Me.',
    tags: ['Purpose', 'Worship'],
    apiLink: quranLink('51:56')
  },
  {
    refId: 'SH-02',
    pillar: 'shahada',
    source: 'quran',
    citation: '47:19',
    function: 'Mandate',
    coreText: 'So know... that there is no deity except Allah and ask forgiveness...',
    tags: ['Tawheed', 'Obligation'],
    apiLink: quranLink('47:19')
  },
  {
    refId: 'SH-03',
    pillar: 'shahada',
    source: 'quran',
    citation: '112:1-4',
    function: 'Creed',
    coreText: 'Say, He is Allah, [who is] One... He neither begets nor is born.',
    tags: ['Aqidah', 'Definition'],
    apiLink: quranLink('112:1')
  },
  {
    refId: 'SH-04',
    pillar: 'shahada',
    source: 'quran',
    citation: '3:18',
    function: 'Witness',
    coreText: 'Allah witnesses that there is no deity except Him, and [so do] the angels...',
    tags: ['Witness', 'Angels'],
    apiLink: quranLink('3:18')
  },
  {
    refId: 'SH-05',
    pillar: 'shahada',
    source: 'quran',
    citation: '4:48',
    function: 'Warning',
    coreText: 'Indeed, Allah does not forgive association with Him (Shirk), but He forgives less than that.',
    tags: ['Shirk', 'Forgiveness'],
    apiLink: quranLink('4:48')
  },
  {
    refId: 'SH-06',
    pillar: 'shahada',
    source: 'quran',
    citation: '2:255',
    function: 'Creed',
    coreText: 'Ayat al-Kursi: Allah - there is no deity except Him, the Ever-Living, the Sustainer...',
    tags: ['Kursi', 'Protection'],
    apiLink: quranLink('2:255')
  },
  {
    refId: 'SH-07',
    pillar: 'shahada',
    source: 'quran',
    citation: '59:22',
    function: 'Creed',
    coreText: 'He is Allah... the Sovereign, the Pure, the Perfection, the Bestower of Faith...',
    tags: ['AsmaulHusna', 'Names'],
    apiLink: quranLink('59:22')
  },
  {
    refId: 'SH-08',
    pillar: 'shahada',
    source: 'quran',
    citation: '6:102',
    function: 'Creed',
    coreText: 'That is Allah, your Lord... the Creator of all things, so worship Him.',
    tags: ['Creator', 'Lordship'],
    apiLink: quranLink('6:102')
  },
  {
    refId: 'SH-09',
    pillar: 'shahada',
    source: 'quran',
    citation: '7:172',
    function: 'Creed',
    coreText: 'Am I not your Lord? They said, "Yes, we have testified".',
    tags: ['Mithaq', 'Souls'],
    apiLink: quranLink('7:172')
  },
  {
    refId: 'SH-10',
    pillar: 'shahada',
    source: 'quran',
    citation: '2:285',
    function: 'Creed',
    coreText: 'The Messenger has believed... in Allah and His angels and His books...',
    tags: ['Iman', 'Prophets'],
    apiLink: quranLink('2:285')
  },
  {
    refId: 'SH-11',
    pillar: 'shahada',
    source: 'bukhari',
    citation: '8',
    function: 'Purpose',
    coreText: 'Hadith Jibreel: Islam is "To worship Allah alone and none else..."',
    tags: ['Pillars', 'Jibreel'],
    apiLink: hadithLink('bukhari', '8')
  },
  {
    refId: 'SH-12',
    pillar: 'shahada',
    source: 'bukhari',
    citation: '123',
    function: 'Reward',
    coreText: 'Whoever says "La ilaha illal-lah" sincerely... will enter Jannah.',
    tags: ['Jannah', 'Sincerity'],
    apiLink: hadithLink('bukhari', '123')
  },
  {
    refId: 'SH-13',
    pillar: 'shahada',
    source: 'muslim',
    citation: '23',
    function: 'Mandate',
    coreText: 'I have been commanded to fight... until they say "La ilaha illallah".',
    tags: ['Sanctity', 'Law'],
    apiLink: hadithLink('muslim', '23')
  },
  {
    refId: 'SH-14',
    pillar: 'shahada',
    source: 'bukhari',
    citation: '16',
    function: 'Character',
    coreText: 'Whoever possesses [love of Allah/Messenger]... finds the sweetness of faith.',
    tags: ['Love', 'Sweetness'],
    apiLink: hadithLink('bukhari', '16')
  },
  {
    refId: 'SH-15',
    pillar: 'shahada',
    source: 'muslim',
    citation: '30',
    function: 'Reward',
    coreText: 'Whoever meets Allah without associating anything with Him will enter Paradise.',
    tags: ['Salvation', 'ZeroShirk'],
    apiLink: hadithLink('muslim', '30')
  },
  {
    refId: 'SH-16',
    pillar: 'shahada',
    source: 'bukhari',
    citation: '50',
    function: 'Character',
    coreText: 'Faith has 60+ branches. Highest is La ilaha illallah, lowest is removing harm.',
    tags: ['Action', 'Character'],
    apiLink: hadithLink('bukhari', '50')
  },
  {
    refId: 'SH-17',
    pillar: 'shahada',
    source: 'muslim',
    citation: '34',
    function: 'Warning',
    coreText: 'Signs of a Munafiq: When he speaks he lies, breaks promises, betrays trust.',
    tags: ['Nifaq', 'Warning'],
    apiLink: hadithLink('muslim', '34')
  },
  {
    refId: 'SH-18',
    pillar: 'shahada',
    source: 'bukhari',
    citation: '24',
    function: 'Character',
    coreText: 'Haya (Modesty/Shyness) is a part of faith.',
    tags: ['Haya', 'Modesty'],
    apiLink: hadithLink('bukhari', '24')
  },
  {
    refId: 'SH-19',
    pillar: 'shahada',
    source: 'bukhari',
    citation: '13',
    function: 'Character',
    coreText: 'None of you believes until he loves for his brother what he loves for himself.',
    tags: ['Community', 'Love'],
    apiLink: hadithLink('bukhari', '13')
  },
  {
    refId: 'SH-20',
    pillar: 'shahada',
    source: 'muslim',
    citation: '26',
    function: 'Reward',
    coreText: 'He who died knowing that there is no God but Allah will enter Paradise.',
    tags: ['Death', 'Khatimah'],
    apiLink: hadithLink('muslim', '26')
  },

  // ============================================================================
  // 2. SALAH (Prayer) - 22 Entries
  // ============================================================================
  {
    refId: 'SL-01',
    pillar: 'salah',
    source: 'quran',
    citation: '20:14',
    function: 'Mandate',
    coreText: 'Establish prayer for My Remembrance (Dhikr).',
    tags: ['Dhikr', 'Obligation'],
    apiLink: quranLink('20:14')
  },
  {
    refId: 'SL-02',
    pillar: 'salah',
    source: 'quran',
    citation: '4:103',
    function: 'Rules',
    coreText: 'Prayer has been decreed upon the believers at specified times.',
    tags: ['Time', 'Discipline'],
    apiLink: quranLink('4:103')
  },
  {
    refId: 'SL-03',
    pillar: 'salah',
    source: 'quran',
    citation: '29:45',
    function: 'Wisdom',
    coreText: 'Prayer prohibits immorality and wrongdoing.',
    tags: ['Morality', 'Protection'],
    apiLink: quranLink('29:45')
  },
  {
    refId: 'SL-04',
    pillar: 'salah',
    source: 'quran',
    citation: '2:144',
    function: 'Condition',
    coreText: 'Qibla: Turn your face toward al-Masjid al-Haram.',
    tags: ['Qibla', 'Direction'],
    apiLink: quranLink('2:144')
  },
  {
    refId: 'SL-05',
    pillar: 'salah',
    source: 'quran',
    citation: '5:6',
    function: 'Purity',
    coreText: 'Wudu: Wash your faces and your forearms to the elbows...',
    tags: ['Wudu', 'Taharah'],
    apiLink: quranLink('5:6')
  },
  {
    refId: 'SL-06',
    pillar: 'salah',
    source: 'quran',
    citation: '62:9',
    function: 'Mandate',
    coreText: 'When the call is made for prayer on Friday, hasten to remembrance.',
    tags: ['Jumuah', 'Friday'],
    apiLink: quranLink('62:9')
  },
  {
    refId: 'SL-07',
    pillar: 'salah',
    source: 'quran',
    citation: '2:238',
    function: 'Rules',
    coreText: 'Maintain the Middle Prayer (Salat al-Wusta / Asr).',
    tags: ['Asr', 'Focus'],
    apiLink: quranLink('2:238')
  },
  {
    refId: 'SL-08',
    pillar: 'salah',
    source: 'quran',
    citation: '107:4',
    function: 'Warning',
    coreText: 'So woe to those who pray, [but] who are heedless of their prayer.',
    tags: ['Khushoo', 'Warning'],
    apiLink: quranLink('107:4')
  },
  {
    refId: 'SL-09',
    pillar: 'salah',
    source: 'quran',
    citation: '23:1-2',
    function: 'Quality',
    coreText: 'Successful are the believers... who are humble (Khashi\'un) in their prayers.',
    tags: ['Success', 'Humility'],
    apiLink: quranLink('23:1')
  },
  {
    refId: 'SL-10',
    pillar: 'salah',
    source: 'quran',
    citation: '11:114',
    function: 'Forgiveness',
    coreText: 'Good deeds (prayer) do away with misdeeds.',
    tags: ['Forgiveness', 'GoodDeeds'],
    apiLink: quranLink('11:114')
  },
  {
    refId: 'SL-11',
    pillar: 'salah',
    source: 'quran',
    citation: '17:79',
    function: 'Voluntary',
    coreText: 'And from [part of] the night, pray with it as additional [worship].',
    tags: ['Tahajjud', 'Night'],
    apiLink: quranLink('17:79')
  },
  {
    refId: 'SL-12',
    pillar: 'salah',
    source: 'bukhari',
    citation: '528',
    function: 'Forgiveness',
    coreText: 'The 5 prayers are like a river at one\'s door; bathing 5 times leaves no dirt.',
    tags: ['River', 'Cleansing'],
    apiLink: hadithLink('bukhari', '528')
  },
  {
    refId: 'SL-13',
    pillar: 'salah',
    source: 'muslim',
    citation: '82',
    function: 'Warning',
    coreText: 'Between a man and Shirk is the abandonment of the prayer.',
    tags: ['Kufr', 'Warning'],
    apiLink: hadithLink('muslim', '82')
  },
  {
    refId: 'SL-14',
    pillar: 'salah',
    source: 'bukhari',
    citation: '645',
    function: 'Incentive',
    coreText: 'Prayer in congregation is 27 times superior to prayer alone.',
    tags: ['Jamaah', 'Community'],
    apiLink: hadithLink('bukhari', '645')
  },
  {
    refId: 'SL-15',
    pillar: 'salah',
    source: 'muslim',
    citation: '223',
    function: 'Purity',
    coreText: 'Purification is half of faith.',
    tags: ['Cleanliness', 'Iman'],
    apiLink: hadithLink('muslim', '223')
  },
  {
    refId: 'SL-16',
    pillar: 'salah',
    source: 'bukhari',
    citation: '615',
    function: 'Ritual',
    coreText: 'When the Adhan is pronounced, Satan takes to his heels...',
    tags: ['Adhan', 'Satan'],
    apiLink: hadithLink('bukhari', '615')
  },
  {
    refId: 'SL-17',
    pillar: 'salah',
    source: 'bukhari',
    citation: '553',
    function: 'Warning',
    coreText: 'Whoever misses the Asr prayer, it is as if his family and property were lost.',
    tags: ['Loss', 'Asr'],
    apiLink: hadithLink('bukhari', '553')
  },
  {
    refId: 'SL-18',
    pillar: 'salah',
    source: 'muslim',
    citation: '657',
    function: 'Account',
    coreText: 'The first thing brought to account on Judgment Day is prayer.',
    tags: ['Judgment', 'Priority'],
    apiLink: hadithLink('muslim', '657')
  },
  {
    refId: 'SL-19',
    pillar: 'salah',
    source: 'muslim',
    citation: '666',
    function: 'Warning',
    coreText: 'The most burdensome prayers for hypocrites are Isha and Fajr.',
    tags: ['Nifaq', 'Test'],
    apiLink: hadithLink('muslim', '666')
  },
  {
    refId: 'SL-20',
    pillar: 'salah',
    source: 'bukhari',
    citation: '1145',
    function: 'Mercy',
    coreText: 'The Lord descends every night asking "Who is calling Me?"',
    tags: ['Dua', 'Tahajjud'],
    apiLink: hadithLink('bukhari', '1145')
  },
  {
    refId: 'SL-21',
    pillar: 'salah',
    source: 'muslim',
    citation: '649',
    function: 'Virtue',
    coreText: 'The servant is in prayer so long as he is waiting for the prayer.',
    tags: ['Patience', 'Reward'],
    apiLink: hadithLink('muslim', '649')
  },
  {
    refId: 'SL-22',
    pillar: 'salah',
    source: 'muslim',
    citation: '533',
    function: 'Building',
    coreText: 'Whoever builds a Mosque for Allah, Allah will build a house for him in Paradise.',
    tags: ['Mosque', 'Charity'],
    apiLink: hadithLink('muslim', '533')
  },

  // ============================================================================
  // 3. ZAKAT (Charity) - 20 Entries
  // ============================================================================
  {
    refId: 'ZK-01',
    pillar: 'zakat',
    source: 'quran',
    citation: '2:43',
    function: 'Mandate',
    coreText: 'Establish prayer and give Zakah.',
    tags: ['Obligation', 'Pillar'],
    apiLink: quranLink('2:43')
  },
  {
    refId: 'ZK-02',
    pillar: 'zakat',
    source: 'quran',
    citation: '9:60',
    function: 'Rules',
    coreText: 'The 8 Categories: For the poor, needy, administrators, hearts reconciled...',
    tags: ['Recipients', 'Fiqh'],
    apiLink: quranLink('9:60')
  },
  {
    refId: 'ZK-03',
    pillar: 'zakat',
    source: 'quran',
    citation: '9:103',
    function: 'Purpose',
    coreText: 'Take charity to purify them and cause them increase.',
    tags: ['Purification', 'Growth'],
    apiLink: quranLink('9:103')
  },
  {
    refId: 'ZK-04',
    pillar: 'zakat',
    source: 'quran',
    citation: '2:261',
    function: 'Multiplier',
    coreText: 'Like a grain that grows 7 ears, each with 100 grains.',
    tags: ['Investment', 'Reward'],
    apiLink: quranLink('2:261')
  },
  {
    refId: 'ZK-05',
    pillar: 'zakat',
    source: 'quran',
    citation: '9:34',
    function: 'Warning',
    coreText: 'Warning for hoarding gold/silver: "Tidings of a painful punishment".',
    tags: ['Hoarding', 'Hellfire'],
    apiLink: quranLink('9:34')
  },
  {
    refId: 'ZK-06',
    pillar: 'zakat',
    source: 'quran',
    citation: '2:276',
    function: 'Blessing',
    coreText: 'Allah destroys interest (Riba) and gives increase for charities.',
    tags: ['Barakah', 'Riba'],
    apiLink: quranLink('2:276')
  },
  {
    refId: 'ZK-07',
    pillar: 'zakat',
    source: 'quran',
    citation: '2:264',
    function: 'Etiquette',
    coreText: 'Do not invalidate your charities with reminders or injury.',
    tags: ['Manners', 'Kindness'],
    apiLink: quranLink('2:264')
  },
  {
    refId: 'ZK-08',
    pillar: 'zakat',
    source: 'quran',
    citation: '30:39',
    function: 'Logic',
    coreText: 'What you give in Riba does not increase... Zakat will have manifold increase.',
    tags: ['Economics', 'Justice'],
    apiLink: quranLink('30:39')
  },
  {
    refId: 'ZK-09',
    pillar: 'zakat',
    source: 'quran',
    citation: '63:10',
    function: 'Urgency',
    coreText: 'Spend... before death comes and one says "Lord, delay me so I may give charity".',
    tags: ['Death', 'Regret'],
    apiLink: quranLink('63:10')
  },
  {
    refId: 'ZK-10',
    pillar: 'zakat',
    source: 'quran',
    citation: '2:271',
    function: 'Etiquette',
    coreText: 'If you conceal charity, it is better for you.',
    tags: ['Privacy', 'Sincerity'],
    apiLink: quranLink('2:271')
  },
  {
    refId: 'ZK-11',
    pillar: 'zakat',
    source: 'bukhari',
    citation: '1395',
    function: 'Rules',
    coreText: 'Taken from the rich and given to the poor.',
    tags: ['SocialJustice', 'System'],
    apiLink: hadithLink('bukhari', '1395')
  },
  {
    refId: 'ZK-12',
    pillar: 'zakat',
    source: 'muslim',
    citation: '992',
    function: 'Warning',
    coreText: 'Withholders of Zakat will be branded with plates of fire.',
    tags: ['Punishment', 'Gold'],
    apiLink: hadithLink('muslim', '992')
  },
  {
    refId: 'ZK-13',
    pillar: 'zakat',
    source: 'bukhari',
    citation: '1447',
    function: 'Rules',
    coreText: 'No Zakat on less than 5 Wasqs / 5 Camels / 5 Uqiyas.',
    tags: ['Nisab', 'Threshold'],
    apiLink: hadithLink('bukhari', '1447')
  },
  {
    refId: 'ZK-14',
    pillar: 'zakat',
    source: 'bukhari',
    citation: '1503',
    function: 'Rules',
    coreText: 'Zakat al-Fitr is obligatory on every Muslim, slave or free.',
    tags: ['Fitrah', 'Ramadan'],
    apiLink: hadithLink('bukhari', '1503')
  },
  {
    refId: 'ZK-15',
    pillar: 'zakat',
    source: 'muslim',
    citation: '1014',
    function: 'Blessing',
    coreText: 'Charity does not decrease wealth.',
    tags: ['Promise', 'Wealth'],
    apiLink: hadithLink('muslim', '1014')
  },
  {
    refId: 'ZK-16',
    pillar: 'zakat',
    source: 'bukhari',
    citation: '1423',
    function: 'Reward',
    coreText: 'Seven under Shade: ...a man who gives so secretly his left hand doesn\'t know.',
    tags: ['Shade', 'Hidden'],
    apiLink: hadithLink('bukhari', '1423')
  },
  {
    refId: 'ZK-17',
    pillar: 'zakat',
    source: 'bukhari',
    citation: '1417',
    function: 'Mercy',
    coreText: 'Save yourself from Hellfire even with half a date.',
    tags: ['Protection', 'SmallDeeds'],
    apiLink: hadithLink('bukhari', '1417')
  },
  {
    refId: 'ZK-18',
    pillar: 'zakat',
    source: 'muslim',
    citation: '1631',
    function: 'Reward',
    coreText: 'When a man dies, acts cease except three: Sadaqah Jariyah...',
    tags: ['Legacy', 'Ongoing'],
    apiLink: hadithLink('muslim', '1631')
  },
  {
    refId: 'ZK-19',
    pillar: 'zakat',
    source: 'muslim',
    citation: '1009',
    function: 'Virtue',
    coreText: 'Charity to a relative is two: charity and upholding ties.',
    tags: ['Family', 'Silah'],
    apiLink: hadithLink('muslim', '1009')
  },
  {
    refId: 'ZK-20',
    pillar: 'zakat',
    source: 'muslim',
    citation: '1010',
    function: 'Virtue',
    coreText: 'Every Tasbih is charity... and a good word is charity.',
    tags: ['Speech', 'Dhikr'],
    apiLink: hadithLink('muslim', '1010')
  },

  // ============================================================================
  // 4. SAWM (Fasting) - 18 Entries
  // ============================================================================
  {
    refId: 'SM-01',
    pillar: 'sawm',
    source: 'quran',
    citation: '2:183',
    function: 'Goal',
    coreText: 'Decreed upon you is fasting... that you may attain Taqwa.',
    tags: ['Taqwa', 'Purpose'],
    apiLink: quranLink('2:183')
  },
  {
    refId: 'SM-02',
    pillar: 'sawm',
    source: 'quran',
    citation: '2:185',
    function: 'Rules',
    coreText: 'Whoever sights the moon, let him fast it.',
    tags: ['Moon', 'Ramadan'],
    apiLink: quranLink('2:185')
  },
  {
    refId: 'SM-03',
    pillar: 'sawm',
    source: 'quran',
    citation: '2:184',
    function: 'Exemption',
    coreText: 'For those who can only do it with hardship, a ransom (Fidya).',
    tags: ['Ease', 'Fidya'],
    apiLink: quranLink('2:184')
  },
  {
    refId: 'SM-04',
    pillar: 'sawm',
    source: 'quran',
    citation: '2:187',
    function: 'Rules',
    coreText: 'Eat and drink until the white thread of dawn becomes distinct...',
    tags: ['Suhoor', 'Timing'],
    apiLink: quranLink('2:187')
  },
  {
    refId: 'SM-05',
    pillar: 'sawm',
    source: 'quran',
    citation: '97:1-3',
    function: 'Virtue',
    coreText: 'Laylatul Qadr is better than a thousand months.',
    tags: ['NightOfPower', 'Rewards'],
    apiLink: quranLink('97:1')
  },
  {
    refId: 'SM-06',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '38',
    function: 'Forgiveness',
    coreText: 'Whoever fasts Ramadan out of faith... previous sins forgiven.',
    tags: ['Forgiveness', 'Iman'],
    apiLink: hadithLink('bukhari', '38')
  },
  {
    refId: 'SM-07',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '1894',
    function: 'Shield',
    coreText: 'Fasting is a shield from the Fire.',
    tags: ['Protection', 'Hellfire'],
    apiLink: hadithLink('bukhari', '1894')
  },
  {
    refId: 'SM-08',
    pillar: 'sawm',
    source: 'muslim',
    citation: '1151',
    function: 'Special',
    coreText: 'Allah says: "Fasting is for Me and I shall reward it".',
    tags: ['Divine', 'Personal'],
    apiLink: hadithLink('muslim', '1151')
  },
  {
    refId: 'SM-09',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '1896',
    function: 'Reward',
    coreText: 'The gate of Ar-Rayyan is exclusively for those who fast.',
    tags: ['Jannah', 'Gate'],
    apiLink: hadithLink('bukhari', '1896')
  },
  {
    refId: 'SM-10',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '1923',
    function: 'Rules',
    coreText: 'Take Suhoor, for there is blessing in it.',
    tags: ['Blessing', 'Meal'],
    apiLink: hadithLink('bukhari', '1923')
  },
  {
    refId: 'SM-11',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '1903',
    function: 'Character',
    coreText: 'Whoever does not give up false speech... Allah needs not his hunger.',
    tags: ['Lying', 'Behavior'],
    apiLink: hadithLink('bukhari', '1903')
  },
  {
    refId: 'SM-12',
    pillar: 'sawm',
    source: 'muslim',
    citation: '1096',
    function: 'Rules',
    coreText: 'The difference between our fasting and People of the Book is Suhoor.',
    tags: ['Identity', 'Ritual'],
    apiLink: hadithLink('muslim', '1096')
  },
  {
    refId: 'SM-13',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '1904',
    function: 'Reward',
    coreText: 'Two joys: when he breaks the fast and when he meets his Lord.',
    tags: ['Iftar', 'MeetingAllah'],
    apiLink: hadithLink('bukhari', '1904')
  },
  {
    refId: 'SM-14',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '2014',
    function: 'Voluntary',
    coreText: 'The Prophet used to practice I\'tikaf in the last ten days.',
    tags: ['Itikaf', 'Seclusion'],
    apiLink: hadithLink('bukhari', '2014')
  },
  {
    refId: 'SM-15',
    pillar: 'sawm',
    source: 'muslim',
    citation: '1162',
    function: 'Voluntary',
    coreText: 'Fasting Ramadan then 6 of Shawwal is like fasting a lifetime.',
    tags: ['Shawwal', 'Lifetime'],
    apiLink: hadithLink('muslim', '1162')
  },
  {
    refId: 'SM-16',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '2004',
    function: 'Voluntary',
    coreText: 'Fasting the day of Ashura (10th Muharram) expiates the previous year.',
    tags: ['Ashura', 'Moses'],
    apiLink: hadithLink('bukhari', '2004')
  },
  {
    refId: 'SM-17',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '1955',
    function: 'Voluntary',
    coreText: 'The Prophet used to fast on Mondays and Thursdays.',
    tags: ['SunnahFasts', 'Weekly'],
    apiLink: hadithLink('bukhari', '1955')
  },
  {
    refId: 'SM-18',
    pillar: 'sawm',
    source: 'bukhari',
    citation: '1913',
    function: 'Rules',
    coreText: 'If one forgets and eats/drinks, let him complete his fast; Allah fed him.',
    tags: ['Mercy', 'Forgetfulness'],
    apiLink: hadithLink('bukhari', '1913')
  },

  // ============================================================================
  // 5. HAJJ (Pilgrimage) - 20 Entries
  // ============================================================================
  {
    refId: 'HJ-01',
    pillar: 'hajj',
    source: 'quran',
    citation: '3:97',
    function: 'Mandate',
    coreText: 'Pilgrimage to the House is a duty... for whoever is able (Istita\'ah).',
    tags: ['Ability', 'Duty'],
    apiLink: quranLink('3:97')
  },
  {
    refId: 'HJ-02',
    pillar: 'hajj',
    source: 'quran',
    citation: '22:27',
    function: 'Call',
    coreText: 'Proclaim to the people the Hajj...',
    tags: ['Ibrahim', 'Call'],
    apiLink: quranLink('22:27')
  },
  {
    refId: 'HJ-03',
    pillar: 'hajj',
    source: 'quran',
    citation: '2:196',
    function: 'Rules',
    coreText: 'Complete the Hajj and \'Umrah for Allah.',
    tags: ['Umrah', 'Completion'],
    apiLink: quranLink('2:196')
  },
  {
    refId: 'HJ-04',
    pillar: 'hajj',
    source: 'quran',
    citation: '2:197',
    function: 'Provision',
    coreText: 'The best provision is Taqwa (Fear of Allah).',
    tags: ['Taqwa', 'Travel'],
    apiLink: quranLink('2:197')
  },
  {
    refId: 'HJ-05',
    pillar: 'hajj',
    source: 'quran',
    citation: '2:125',
    function: 'Station',
    coreText: 'Take the Station of Ibrahim as a place of prayer.',
    tags: ['MaqamIbrahim', 'Salah'],
    apiLink: quranLink('2:125')
  },
  {
    refId: 'HJ-06',
    pillar: 'hajj',
    source: 'quran',
    citation: '2:158',
    function: 'Symbols',
    coreText: 'Safa and Marwah are among the symbols of Allah.',
    tags: ['Ritual', 'Sai'],
    apiLink: quranLink('2:158')
  },
  {
    refId: 'HJ-07',
    pillar: 'hajj',
    source: 'quran',
    citation: '22:29',
    function: 'Ritual',
    coreText: 'Perform Tawaf around the Ancient House (Kaaba).',
    tags: ['Tawaf', 'Kaaba'],
    apiLink: quranLink('22:29')
  },
  {
    refId: 'HJ-08',
    pillar: 'hajj',
    source: 'quran',
    citation: '2:198',
    function: 'Ritual',
    coreText: 'Remember Allah at al-Mash\'ar al-Haram (Muzdalifah).',
    tags: ['Muzdalifah', 'Dhikr'],
    apiLink: quranLink('2:198')
  },
  {
    refId: 'HJ-09',
    pillar: 'hajj',
    source: 'quran',
    citation: '22:37',
    function: 'Ritual',
    coreText: 'Their meat/blood does not reach Allah, but your piety reaches Him.',
    tags: ['Qurbani', 'Sincerity'],
    apiLink: quranLink('22:37')
  },
  {
    refId: 'HJ-10',
    pillar: 'hajj',
    source: 'bukhari',
    citation: '1773',
    function: 'Reward',
    coreText: 'Reward for Hajj Mabrur is nothing less than Paradise.',
    tags: ['Jannah', 'Ultimate'],
    apiLink: hadithLink('bukhari', '1773')
  },
  {
    refId: 'HJ-11',
    pillar: 'hajj',
    source: 'bukhari',
    citation: '1521',
    function: 'Rebirth',
    coreText: 'Returns (sinless) as the day his mother bore him.',
    tags: ['Forgiveness', 'Newborn'],
    apiLink: hadithLink('bukhari', '1521')
  },
  {
    refId: 'HJ-12',
    pillar: 'hajj',
    source: 'muslim',
    citation: '1348',
    function: 'Mercy',
    coreText: 'No day Allah frees more slaves from Fire than Arafah.',
    tags: ['Arafah', 'Mercy'],
    apiLink: hadithLink('muslim', '1348')
  },
  {
    refId: 'HJ-13',
    pillar: 'hajj',
    source: 'bukhari',
    citation: '1549',
    function: 'Ritual',
    coreText: 'Labbayk Allahumma Labbayk (Here I am, O Allah).',
    tags: ['Chant', 'Response'],
    apiLink: hadithLink('bukhari', '1549')
  },
  {
    refId: 'HJ-14',
    pillar: 'hajj',
    source: 'bukhari',
    citation: '1623',
    function: 'Equality',
    coreText: 'Farewell Sermon: No superiority of Arab over non-Arab except by Taqwa.',
    tags: ['Equality', 'Racism'],
    apiLink: hadithLink('bukhari', '1623')
  },
  {
    refId: 'HJ-15',
    pillar: 'hajj',
    source: 'bukhari',
    citation: '1520',
    function: 'Virtue',
    coreText: 'The best Jihad (for women/weak) is Hajj Mabrur.',
    tags: ['Struggle', 'Women'],
    apiLink: hadithLink('bukhari', '1520')
  },
  {
    refId: 'HJ-16',
    pillar: 'hajj',
    source: 'bukhari',
    citation: '1597',
    function: 'Ritual',
    coreText: 'Black Stone: You are a stone... I kiss you because I saw the Prophet kiss you.',
    tags: ['Sunnah', 'Obedience'],
    apiLink: hadithLink('bukhari', '1597')
  },
  {
    refId: 'HJ-17',
    pillar: 'hajj',
    source: 'bukhari',
    citation: '1782',
    function: 'Forgiveness',
    coreText: 'Umrah to Umrah is an expiation for what is between them.',
    tags: ['Umrah', 'Forgiveness'],
    apiLink: hadithLink('bukhari', '1782')
  },
  {
    refId: 'HJ-18',
    pillar: 'hajj',
    source: 'bukhari',
    citation: '1556',
    function: 'Virtue',
    coreText: 'Zamzam water is for whatever it is drunk for.',
    tags: ['Zamzam', 'Healing'],
    apiLink: hadithLink('bukhari', '1556')
  },
  {
    refId: 'HJ-19',
    pillar: 'hajj',
    source: 'muslim',
    citation: '1184',
    function: 'Rules',
    coreText: 'A Muhrim should not wear sewn clothes (shirt, trousers, turban).',
    tags: ['Ihram', 'Rules'],
    apiLink: hadithLink('muslim', '1184')
  },
  {
    refId: 'HJ-20',
    pillar: 'hajj',
    source: 'muslim',
    citation: '1218',
    function: 'Ritual',
    coreText: 'The Prophet threw pebbles at the Jamrah.',
    tags: ['Jamarat', 'Stoning'],
    apiLink: hadithLink('muslim', '1218')
  }
]

/**
 * Extract unique surah numbers for each pillar (from Quranic references only)
 */
export function getSurahsByPillar(pillar: PillarType): number[] {
  const surahNumbers = new Set<number>()

  FIVE_PILLARS_REFERENCES
    .filter(ref => ref.pillar === pillar && ref.source === 'quran')
    .forEach(ref => {
      const [surah] = ref.citation.split(':')
      surahNumbers.add(parseInt(surah))
    })

  return Array.from(surahNumbers).sort((a, b) => a - b)
}

/**
 * Get all references for a specific pillar
 */
export function getReferencesByPillar(pillar: PillarType): PillarReference[] {
  return FIVE_PILLARS_REFERENCES.filter(ref => ref.pillar === pillar)
}

/**
 * Get reference by ID
 */
export function getReferenceById(refId: string): PillarReference | undefined {
  return FIVE_PILLARS_REFERENCES.find(ref => ref.refId === refId)
}
