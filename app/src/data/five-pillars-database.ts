/**
 * Five Pillars Master Database - 100 Authenticated References
 * Comprehensive mapping of Quranic verses and authentic Hadiths
 * organized by the Five Pillars of Islam
 */

export type SourceType = 'Quran' | 'Bukhari' | 'Muslim'
export type PillarType = 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj'

export interface PillarReference {
  refId: string
  source: SourceType
  citation: string
  function: string
  coreText: string
  tags: string[]
}

/**
 * Generate API links for each reference
 */
export function getApiLink(source: SourceType, citation: string): string {
  if (source === 'Quran') {
    return `https://quran.com/${citation.replace(':', '/')}`
  } else if (source === 'Bukhari') {
    return `https://sunnah.com/bukhari:${citation}`
  } else {
    return `https://sunnah.com/muslim:${citation}`
  }
}

/**
 * SHAHADA (Faith & Tawheed) - 20 Entries
 */
export const SHAHADA_REFERENCES: PillarReference[] = [
  { refId: 'SH-01', source: 'Quran', citation: '51:56', function: 'Purpose', coreText: 'I did not create the jinn and mankind except to worship Me.', tags: ['Purpose', 'Worship'] },
  { refId: 'SH-02', source: 'Quran', citation: '47:19', function: 'Mandate', coreText: 'So know... that there is no deity except Allah and ask forgiveness...', tags: ['Tawheed', 'Obligation'] },
  { refId: 'SH-03', source: 'Quran', citation: '112:1-4', function: 'Creed', coreText: 'Say, He is Allah, [who is] One... He neither begets nor is born.', tags: ['Aqidah', 'Definition'] },
  { refId: 'SH-04', source: 'Quran', citation: '3:18', function: 'Witness', coreText: 'Allah witnesses that there is no deity except Him, and [so do] the angels...', tags: ['Witness', 'Angels'] },
  { refId: 'SH-05', source: 'Quran', citation: '4:48', function: 'Warning', coreText: 'Indeed, Allah does not forgive association with Him (Shirk), but He forgives less than that.', tags: ['Shirk', 'Forgiveness'] },
  { refId: 'SH-06', source: 'Quran', citation: '2:255', function: 'Attributes', coreText: 'Ayat al-Kursi: Allah - there is no deity except Him, the Ever-Living, the Sustainer...', tags: ['Kursi', 'Protection'] },
  { refId: 'SH-07', source: 'Quran', citation: '59:22', function: 'Names', coreText: 'He is Allah... the Sovereign, the Pure, the Perfection, the Bestower of Faith...', tags: ['AsmaulHusna', 'Names'] },
  { refId: 'SH-08', source: 'Quran', citation: '6:102', function: 'Tawheed', coreText: 'That is Allah, your Lord... the Creator of all things, so worship Him.', tags: ['Creator', 'Lordship'] },
  { refId: 'SH-09', source: 'Quran', citation: '7:172', function: 'Covenant', coreText: 'Am I not your Lord? They said, "Yes, we have testified."', tags: ['Mithaq', 'Souls'] },
  { refId: 'SH-10', source: 'Quran', citation: '2:285', function: 'Belief', coreText: 'The Messenger has believed... in Allah and His angels and His books...', tags: ['Iman', 'Prophets'] },
  { refId: 'SH-11', source: 'Bukhari', citation: '8', function: 'Foundation', coreText: 'Hadith Jibreel: Islam is "To worship Allah alone and none else..."', tags: ['Pillars', 'Jibreel'] },
  { refId: 'SH-12', source: 'Bukhari', citation: '123', function: 'Reward', coreText: 'Whoever says "La ilaha illal-lah" sincerely... will enter Jannah.', tags: ['Jannah', 'Sincerity'] },
  { refId: 'SH-13', source: 'Muslim', citation: '23', function: 'Sanctity', coreText: 'I have been commanded to fight... until they say "La ilaha illallah".', tags: ['Sanctity', 'Law'] },
  { refId: 'SH-14', source: 'Bukhari', citation: '16', function: 'Spiritual', coreText: 'Whoever possesses [love of Allah/Messenger]... finds the sweetness of faith.', tags: ['Love', 'Sweetness'] },
  { refId: 'SH-15', source: 'Muslim', citation: '30', function: 'Salvation', coreText: 'Whoever meets Allah without associating anything with Him will enter Paradise.', tags: ['Salvation', 'ZeroShirk'] },
  { refId: 'SH-16', source: 'Bukhari', citation: '50', function: 'Branches', coreText: 'Faith has 60+ branches. Highest is La ilaha illallah, lowest is removing harm.', tags: ['Action', 'Character'] },
  { refId: 'SH-17', source: 'Muslim', citation: '34', function: 'Hypocrisy', coreText: 'Signs of a Munafiq: When he speaks he lies, breaks promises, betrays trust.', tags: ['Nifaq', 'Warning'] },
  { refId: 'SH-18', source: 'Bukhari', citation: '24', function: 'Character', coreText: 'Haya (Modesty/Shyness) is a part of faith.', tags: ['Haya', 'Modesty'] },
  { refId: 'SH-19', source: 'Bukhari', citation: '13', function: 'Brotherhood', coreText: 'None of you believes until he loves for his brother what he loves for himself.', tags: ['Community', 'Love'] },
  { refId: 'SH-20', source: 'Muslim', citation: '26', function: 'Ending', coreText: 'He who died knowing that there is no God but Allah will enter Paradise.', tags: ['Death', 'Khatimah'] }
]

/**
 * SALAH (Prayer) - 22 Entries
 */
export const SALAH_REFERENCES: PillarReference[] = [
  { refId: 'SL-01', source: 'Quran', citation: '20:14', function: 'Mandate', coreText: 'Establish prayer for My Remembrance (Dhikr).', tags: ['Dhikr', 'Obligation'] },
  { refId: 'SL-02', source: 'Quran', citation: '4:103', function: 'Rules', coreText: 'Prayer has been decreed upon the believers at specified times.', tags: ['Time', 'Discipline'] },
  { refId: 'SL-03', source: 'Quran', citation: '29:45', function: 'Wisdom', coreText: 'Prayer prohibits immorality and wrongdoing.', tags: ['Morality', 'Protection'] },
  { refId: 'SL-04', source: 'Quran', citation: '2:144', function: 'Condition', coreText: 'Qibla: Turn your face toward al-Masjid al-Haram.', tags: ['Qibla', 'Direction'] },
  { refId: 'SL-05', source: 'Quran', citation: '5:6', function: 'Purity', coreText: 'Wudu: Wash your faces and your forearms to the elbows...', tags: ['Wudu', 'Taharah'] },
  { refId: 'SL-06', source: 'Quran', citation: '62:9', function: 'Mandate', coreText: 'When the call is made for prayer on Friday, hasten to remembrance.', tags: ['Jumuah', 'Friday'] },
  { refId: 'SL-07', source: 'Quran', citation: '2:238', function: 'Rules', coreText: 'Maintain the Middle Prayer (Salat al-Wusta / Asr).', tags: ['Asr', 'Focus'] },
  { refId: 'SL-08', source: 'Quran', citation: '107:4', function: 'Warning', coreText: 'So woe to those who pray, [but] who are heedless of their prayer.', tags: ['Khushoo', 'Warning'] },
  { refId: 'SL-09', source: 'Quran', citation: '23:1-2', function: 'Quality', coreText: 'Successful are the believers... who are humble (Khashi\'un) in their prayers.', tags: ['Success', 'Humility'] },
  { refId: 'SL-10', source: 'Quran', citation: '11:114', function: 'Expiation', coreText: 'Good deeds (prayer) do away with misdeeds.', tags: ['Forgiveness', 'GoodDeeds'] },
  { refId: 'SL-11', source: 'Quran', citation: '17:79', function: 'Voluntary', coreText: 'And from [part of] the night, pray with it as additional [worship].', tags: ['Tahajjud', 'Night'] },
  { refId: 'SL-12', source: 'Bukhari', citation: '528', function: 'Metaphor', coreText: 'The 5 prayers are like a river at one\'s door; bathing 5 times leaves no dirt.', tags: ['River', 'Cleansing'] },
  { refId: 'SL-13', source: 'Muslim', citation: '82', function: 'Warning', coreText: 'Between a man and Shirk is the abandonment of the prayer.', tags: ['Kufr', 'Warning'] },
  { refId: 'SL-14', source: 'Bukhari', citation: '645', function: 'Incentive', coreText: 'Prayer in congregation is 27 times superior to prayer alone.', tags: ['Jamaah', 'Community'] },
  { refId: 'SL-15', source: 'Muslim', citation: '223', function: 'Purity', coreText: 'Purification is half of faith.', tags: ['Cleanliness', 'Iman'] },
  { refId: 'SL-16', source: 'Bukhari', citation: '615', function: 'Call', coreText: 'When the Adhan is pronounced, Satan takes to his heels...', tags: ['Adhan', 'Satan'] },
  { refId: 'SL-17', source: 'Bukhari', citation: '553', function: 'Warning', coreText: 'Whoever misses the Asr prayer, it is as if his family and property were lost.', tags: ['Loss', 'Asr'] },
  { refId: 'SL-18', source: 'Muslim', citation: '657', function: 'Account', coreText: 'The first thing brought to account on Judgment Day is prayer.', tags: ['Judgment', 'Priority'] },
  { refId: 'SL-19', source: 'Muslim', citation: '666', function: 'Hypocrisy', coreText: 'The most burdensome prayers for hypocrites are Isha and Fajr.', tags: ['Nifaq', 'Test'] },
  { refId: 'SL-20', source: 'Bukhari', citation: '1145', function: 'Night', coreText: 'The Lord descends every night asking "Who is calling Me?"', tags: ['Dua', 'Tahajjud'] },
  { refId: 'SL-21', source: 'Muslim', citation: '649', function: 'Virtue', coreText: 'The servant is in prayer so long as he is waiting for the prayer.', tags: ['Patience', 'Reward'] },
  { refId: 'SL-22', source: 'Muslim', citation: '533', function: 'Building', coreText: 'Whoever builds a Mosque for Allah, Allah will build a house for him in Paradise.', tags: ['Mosque', 'Charity'] }
]

/**
 * ZAKAT (Charity) - 20 Entries
 */
export const ZAKAT_REFERENCES: PillarReference[] = [
  { refId: 'ZK-01', source: 'Quran', citation: '2:43', function: 'Mandate', coreText: 'Establish prayer and give Zakah.', tags: ['Obligation', 'Pillar'] },
  { refId: 'ZK-02', source: 'Quran', citation: '9:60', function: 'Rules', coreText: 'The 8 Categories: For the poor, needy, administrators, hearts reconciled...', tags: ['Recipients', 'Fiqh'] },
  { refId: 'ZK-03', source: 'Quran', citation: '9:103', function: 'Purpose', coreText: 'Take charity to purify them and cause them increase.', tags: ['Purification', 'Growth'] },
  { refId: 'ZK-04', source: 'Quran', citation: '2:261', function: 'Multiplier', coreText: 'Like a grain that grows 7 ears, each with 100 grains.', tags: ['Investment', 'Reward'] },
  { refId: 'ZK-05', source: 'Quran', citation: '9:34', function: 'Warning', coreText: 'Warning for hoarding gold/silver: Tidings of a painful punishment.', tags: ['Hoarding', 'Hellfire'] },
  { refId: 'ZK-06', source: 'Quran', citation: '2:276', function: 'Blessing', coreText: 'Allah destroys interest (Riba) and gives increase for charities.', tags: ['Barakah', 'Riba'] },
  { refId: 'ZK-07', source: 'Quran', citation: '2:264', function: 'Etiquette', coreText: 'Do not invalidate your charities with reminders or injury.', tags: ['Manners', 'Kindness'] },
  { refId: 'ZK-08', source: 'Quran', citation: '30:39', function: 'Logic', coreText: 'What you give in Riba does not increase... Zakat will have manifold increase.', tags: ['Economics', 'Justice'] },
  { refId: 'ZK-09', source: 'Quran', citation: '63:10', function: 'Urgency', coreText: 'Spend... before death comes and one says "Lord, delay me so I may give charity".', tags: ['Death', 'Regret'] },
  { refId: 'ZK-10', source: 'Quran', citation: '2:271', function: 'Secrecy', coreText: 'If you conceal charity, it is better for you.', tags: ['Privacy', 'Sincerity'] },
  { refId: 'ZK-11', source: 'Bukhari', citation: '1395', function: 'System', coreText: 'Taken from the rich and given to the poor.', tags: ['SocialJustice', 'System'] },
  { refId: 'ZK-12', source: 'Muslim', citation: '992', function: 'Punishment', coreText: 'Withholders of Zakat will be branded with plates of fire.', tags: ['Punishment', 'Gold'] },
  { refId: 'ZK-13', source: 'Bukhari', citation: '1447', function: 'Rules', coreText: 'No Zakat on less than 5 Wasqs / 5 Camels / 5 Uqiyas.', tags: ['Nisab', 'Threshold'] },
  { refId: 'ZK-14', source: 'Bukhari', citation: '1503', function: 'Rules', coreText: 'Zakat al-Fitr is obligatory on every Muslim, slave or free.', tags: ['Fitrah', 'Ramadan'] },
  { refId: 'ZK-15', source: 'Muslim', citation: '1014', function: 'Reality', coreText: 'Charity does not decrease wealth.', tags: ['Promise', 'Wealth'] },
  { refId: 'ZK-16', source: 'Bukhari', citation: '1423', function: 'Sincerity', coreText: 'Seven under Shade: ...a man who gives so secretly his left hand doesn\'t know.', tags: ['Shade', 'Hidden'] },
  { refId: 'ZK-17', source: 'Bukhari', citation: '1417', function: 'Protection', coreText: 'Save yourself from Hellfire even with half a date.', tags: ['Protection', 'SmallDeeds'] },
  { refId: 'ZK-18', source: 'Muslim', citation: '1631', function: 'Legacy', coreText: 'When a man dies, acts cease except three: Sadaqah Jariyah...', tags: ['Legacy', 'Ongoing'] },
  { refId: 'ZK-19', source: 'Muslim', citation: '1009', function: 'Kinship', coreText: 'Charity to a relative is two: charity and upholding ties.', tags: ['Family', 'Silah'] },
  { refId: 'ZK-20', source: 'Muslim', citation: '1010', function: 'Goodness', coreText: 'Every Tasbih is charity... and a good word is charity.', tags: ['Speech', 'Dhikr'] }
]

/**
 * SAWM (Fasting) - 18 Entries
 */
export const SAWM_REFERENCES: PillarReference[] = [
  { refId: 'SM-01', source: 'Quran', citation: '2:183', function: 'Goal', coreText: 'Decreed upon you is fasting... that you may attain Taqwa.', tags: ['Taqwa', 'Purpose'] },
  { refId: 'SM-02', source: 'Quran', citation: '2:185', function: 'Rules', coreText: 'Whoever sights the moon, let him fast it.', tags: ['Moon', 'Ramadan'] },
  { refId: 'SM-03', source: 'Quran', citation: '2:184', function: 'Exemption', coreText: 'For those who can only do it with hardship, a ransom (Fidya).', tags: ['Ease', 'Fidya'] },
  { refId: 'SM-04', source: 'Quran', citation: '2:187', function: 'Rules', coreText: 'Eat and drink until the white thread of dawn becomes distinct...', tags: ['Suhoor', 'Timing'] },
  { refId: 'SM-05', source: 'Quran', citation: '97:1-3', function: 'Virtue', coreText: 'Laylatul Qadr is better than a thousand months.', tags: ['NightOfPower', 'Rewards'] },
  { refId: 'SM-06', source: 'Bukhari', citation: '38', function: 'Forgiveness', coreText: 'Whoever fasts Ramadan out of faith... previous sins forgiven.', tags: ['Forgiveness', 'Iman'] },
  { refId: 'SM-07', source: 'Bukhari', citation: '1894', function: 'Shield', coreText: 'Fasting is a shield from the Fire.', tags: ['Protection', 'Hellfire'] },
  { refId: 'SM-08', source: 'Muslim', citation: '1151', function: 'Special', coreText: 'Allah says: "Fasting is for Me and I shall reward it."', tags: ['Divine', 'Personal'] },
  { refId: 'SM-09', source: 'Bukhari', citation: '1896', function: 'Reward', coreText: 'The gate of Ar-Rayyan is exclusively for those who fast.', tags: ['Jannah', 'Gate'] },
  { refId: 'SM-10', source: 'Bukhari', citation: '1923', function: 'Sunnah', coreText: 'Take Suhoor, for there is blessing in it.', tags: ['Blessing', 'Meal'] },
  { refId: 'SM-11', source: 'Bukhari', citation: '1903', function: 'Character', coreText: 'Whoever does not give up false speech... Allah needs not his hunger.', tags: ['Lying', 'Behavior'] },
  { refId: 'SM-12', source: 'Muslim', citation: '1096', function: 'Distinction', coreText: 'The difference between our fasting and People of the Book is Suhoor.', tags: ['Identity', 'Ritual'] },
  { refId: 'SM-13', source: 'Bukhari', citation: '1904', function: 'Joy', coreText: 'Two joys: when he breaks the fast and when he meets his Lord.', tags: ['Iftar', 'MeetingAllah'] },
  { refId: 'SM-14', source: 'Bukhari', citation: '2014', function: 'Sunnah', coreText: 'The Prophet used to practice I\'tikaf in the last ten days.', tags: ['Itikaf', 'Seclusion'] },
  { refId: 'SM-15', source: 'Muslim', citation: '1162', function: 'Voluntary', coreText: 'Fasting Ramadan then 6 of Shawwal is like fasting a lifetime.', tags: ['Shawwal', 'Lifetime'] },
  { refId: 'SM-16', source: 'Bukhari', citation: '2004', function: 'Voluntary', coreText: 'Fasting the day of Ashura (10th Muharram) expiates the previous year.', tags: ['Ashura', 'Moses'] },
  { refId: 'SM-17', source: 'Bukhari', citation: '1955', function: 'Voluntary', coreText: 'The Prophet used to fast on Mondays and Thursdays.', tags: ['SunnahFasts', 'Weekly'] },
  { refId: 'SM-18', source: 'Bukhari', citation: '1913', function: 'Rules', coreText: 'If one forgets and eats/drinks, let him complete his fast; Allah fed him.', tags: ['Mercy', 'Forgetfulness'] }
]

/**
 * HAJJ (Pilgrimage) - 20 Entries
 */
export const HAJJ_REFERENCES: PillarReference[] = [
  { refId: 'HJ-01', source: 'Quran', citation: '3:97', function: 'Mandate', coreText: 'Pilgrimage to the House is a duty... for whoever is able (Istita\'ah).', tags: ['Ability', 'Duty'] },
  { refId: 'HJ-02', source: 'Quran', citation: '22:27', function: 'Call', coreText: 'Proclaim to the people the Hajj...', tags: ['Ibrahim', 'Call'] },
  { refId: 'HJ-03', source: 'Quran', citation: '2:196', function: 'Rules', coreText: 'Complete the Hajj and \'Umrah for Allah.', tags: ['Umrah', 'Completion'] },
  { refId: 'HJ-04', source: 'Quran', citation: '2:197', function: 'Provision', coreText: 'The best provision is Taqwa (Fear of Allah).', tags: ['Taqwa', 'Travel'] },
  { refId: 'HJ-05', source: 'Quran', citation: '2:125', function: 'Station', coreText: 'Take the Station of Ibrahim as a place of prayer.', tags: ['MaqamIbrahim', 'Salah'] },
  { refId: 'HJ-06', source: 'Quran', citation: '2:158', function: 'Symbols', coreText: 'Safa and Marwah are among the symbols of Allah.', tags: ['Ritual', 'Sai'] },
  { refId: 'HJ-07', source: 'Quran', citation: '22:29', function: 'Ritual', coreText: 'Perform Tawaf around the Ancient House (Kaaba).', tags: ['Tawaf', 'Kaaba'] },
  { refId: 'HJ-08', source: 'Quran', citation: '2:198', function: 'Rite', coreText: 'Remember Allah at al-Mash\'ar al-Haram (Muzdalifah).', tags: ['Muzdalifah', 'Dhikr'] },
  { refId: 'HJ-09', source: 'Quran', citation: '22:37', function: 'Sacrifice', coreText: 'Their meat/blood does not reach Allah, but your piety reaches Him.', tags: ['Qurbani', 'Sincerity'] },
  { refId: 'HJ-10', source: 'Bukhari', citation: '1773', function: 'Reward', coreText: 'Reward for Hajj Mabrur is nothing less than Paradise.', tags: ['Jannah', 'Ultimate'] },
  { refId: 'HJ-11', source: 'Bukhari', citation: '1521', function: 'Rebirth', coreText: 'Returns (sinless) as the day his mother bore him.', tags: ['Forgiveness', 'Newborn'] },
  { refId: 'HJ-12', source: 'Muslim', citation: '1348', function: 'Mercy', coreText: 'No day Allah frees more slaves from Fire than Arafah.', tags: ['Arafah', 'Mercy'] },
  { refId: 'HJ-13', source: 'Bukhari', citation: '1549', function: 'Talbiyah', coreText: 'Labbayk Allahumma Labbayk (Here I am, O Allah).', tags: ['Chant', 'Response'] },
  { refId: 'HJ-14', source: 'Bukhari', citation: '1623', function: 'Equality', coreText: 'Farewell Sermon: No superiority of Arab over non-Arab except by Taqwa.', tags: ['Equality', 'Racism'] },
  { refId: 'HJ-15', source: 'Bukhari', citation: '1520', function: 'Jihad', coreText: 'The best Jihad (for women/weak) is Hajj Mabrur.', tags: ['Struggle', 'Women'] },
  { refId: 'HJ-16', source: 'Bukhari', citation: '1597', function: 'Sunnah', coreText: 'Black Stone: You are a stone... I kiss you because I saw the Prophet kiss you.', tags: ['Sunnah', 'Obedience'] },
  { refId: 'HJ-17', source: 'Bukhari', citation: '1782', function: 'Expiation', coreText: 'Umrah to Umrah is an expiation for what is between them.', tags: ['Umrah', 'Forgiveness'] },
  { refId: 'HJ-18', source: 'Bukhari', citation: '1556', function: 'Blessing', coreText: 'Zamzam water is for whatever it is drunk for.', tags: ['Zamzam', 'Healing'] },
  { refId: 'HJ-19', source: 'Muslim', citation: '1184', function: 'Ihram', coreText: 'A Muhrim should not wear sewn clothes (shirt, trousers, turban).', tags: ['Ihram', 'Rules'] },
  { refId: 'HJ-20', source: 'Muslim', citation: '1218', function: 'Ritual', coreText: 'The Prophet threw pebbles at the Jamrah.', tags: ['Jamarat', 'Stoning'] }
]

/**
 * Get all references for a specific pillar
 */
export function getReferencesByPillar(pillar: PillarType): PillarReference[] {
  switch (pillar) {
    case 'shahada':
      return SHAHADA_REFERENCES
    case 'salah':
      return SALAH_REFERENCES
    case 'zakat':
      return ZAKAT_REFERENCES
    case 'sawm':
      return SAWM_REFERENCES
    case 'hajj':
      return HAJJ_REFERENCES
    default:
      return []
  }
}

/**
 * Get all 100 references combined
 */
export function getAllReferences(): PillarReference[] {
  return [
    ...SHAHADA_REFERENCES,
    ...SALAH_REFERENCES,
    ...ZAKAT_REFERENCES,
    ...SAWM_REFERENCES,
    ...HAJJ_REFERENCES
  ]
}

/**
 * Get reference count by pillar
 */
export function getReferenceCounts(): Record<PillarType, number> {
  return {
    shahada: SHAHADA_REFERENCES.length,
    salah: SALAH_REFERENCES.length,
    zakat: ZAKAT_REFERENCES.length,
    sawm: SAWM_REFERENCES.length,
    hajj: HAJJ_REFERENCES.length
  }
}
