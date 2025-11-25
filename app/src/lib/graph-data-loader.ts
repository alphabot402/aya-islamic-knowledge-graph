import { QuranVerse } from '@/types/quran'

export interface GraphVerseNode {
  id: string
  surah: number
  verse: number
  text: string
  textSimple: string
  position: [number, number, number]
  connections: string[]
  metadata?: {
    revelationType?: 'Meccan' | 'Medinan'
    juz?: number
  }
}

interface SurahData {
  surah: number
  verses: QuranVerse[]
  revelationType: 'Meccan' | 'Medinan'
}

interface GraphApiResponse {
  surahs: SurahData[]
}

/**
 * Load Quran verses for graph visualization from API
 */
export async function loadGraphData(): Promise<GraphVerseNode[]> {
  try {
    const response = await fetch('/api/quran')
    if (!response.ok) {
      throw new Error('Failed to fetch Quran data')
    }
    
    const data: GraphApiResponse = await response.json()
    const verses: GraphVerseNode[] = []
    let totalIndex = 0
    
    // Process each surah
    data.surahs.forEach(surahData => {
      const versesInSurah = surahData.verses.length
      
      surahData.verses.forEach((verse, verseIdx) => {
        verses.push({
          id: `${surahData.surah}:${verse.index}`,
          surah: surahData.surah,
          verse: verse.index,
          text: verse.text_uthmani,
          textSimple: verse.text_simple,
          position: generatePosition(totalIndex, versesInSurah, surahData.surah, verseIdx),
          connections: [],
          metadata: {
            revelationType: surahData.revelationType
          }
        })
        totalIndex++
      })
    })
    
    // Create connections
    createSequentialConnections(verses)
    createCrossReferences(verses)
    
    return verses
  } catch (error) {
    console.error('Error loading graph data:', error)
    return []
  }
}

/**
 * Generate 3D positions for verses in clustered surah layout
 * Each surah gets its own cluster in 3D space
 */
function generatePosition(index: number, totalInGroup: number, surahNumber: number, verseIndex: number): [number, number, number] {
  // Arrange surahs in a larger circular pattern
  const surahAngle = (surahNumber * Math.PI * 2) / 114
  const surahRadius = 15 + Math.floor(surahNumber / 20) * 5 // Expand outward as surah numbers increase
  
  // Center position for this surah cluster
  const centerX = Math.cos(surahAngle) * surahRadius
  const centerZ = Math.sin(surahAngle) * surahRadius
  const centerY = Math.sin(surahNumber * 0.1) * 3 // Vertical variation
  
  // Position within the surah cluster (small circle around center)
  const verseAngle = (verseIndex * Math.PI * 2) / Math.max(totalInGroup, 1)
  const clusterRadius = Math.min(2 + totalInGroup * 0.1, 3) // Larger clusters for more verses
  
  const x = centerX + Math.cos(verseAngle) * clusterRadius
  const y = centerY + Math.sin(verseAngle * 2) * 0.5 // Slight vertical spread
  const z = centerZ + Math.sin(verseAngle) * clusterRadius
  
  return [x, y, z]
}

/**
 * Create sequential connections (verse to next verse in same surah)
 */
function createSequentialConnections(verses: GraphVerseNode[]) {
  verses.forEach((verse, index) => {
    // Connect to next verse in same surah
    const nextVerse = verses.find(
      v => v.surah === verse.surah && v.verse === verse.verse + 1
    )
    if (nextVerse) {
      verse.connections.push(nextVerse.id)
    }
  })
}

/**
 * Create meaningful cross-references between verses
 * Based on common Islamic knowledge
 */
function createCrossReferences(verses: GraphVerseNode[]) {
  // Example: Connect verses that mention similar concepts
  
  // Connect first verse of each surah (all start with Bismillah concept)
  const firstVerses = verses.filter(v => v.verse === 1)
  firstVerses.forEach((verse, index) => {
    if (index < firstVerses.length - 1) {
      verse.connections.push(firstVerses[index + 1].id)
    }
  })
  
  // Connect verses about Allah's names (Al-Rahman, Al-Rahim)
  // Surah 1:1 and 1:3 both mention these names
  const verse1_1 = verses.find(v => v.id === '1:1')
  const verse1_3 = verses.find(v => v.id === '1:3')
  if (verse1_1 && verse1_3 && !verse1_1.connections.includes('1:3')) {
    verse1_1.connections.push('1:3')
  }
  
  // Connect verses about worship
  // 1:5 (You alone we worship) connects to concept verses in other surahs
  const verse1_5 = verses.find(v => v.id === '1:5')
  const verse2_21 = verses.find(v => v.id === '2:21')
  if (verse1_5 && verse2_21) {
    verse1_5.connections.push('2:21')
  }
}
