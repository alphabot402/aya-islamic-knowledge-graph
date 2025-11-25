import { NextResponse } from 'next/server'
import { loadSurah } from '@/lib/quran-data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const surahNumber = searchParams.get('surah')
    
    if (surahNumber) {
      // Load specific surah
      const surah = await loadSurah(parseInt(surahNumber))
      if (!surah) {
        return NextResponse.json({ error: 'Surah not found' }, { status: 404 })
      }
      return NextResponse.json(surah)
    }
    
    // Load ALL 114 surahs for complete Quran representation
    // Shorter surahs: all verses, Longer surahs: first 10 verses
    const surahsToLoad = Array.from({ length: 114 }, (_, i) => {
      const surahNumber = i + 1
      // Shorter surahs (after surah 78) get all verses, others get first 10
      const maxVerses = surahNumber >= 78 ? 999 : 10
      return { number: surahNumber, maxVerses }
    })
    
    const graphData = {
      surahs: await Promise.all(
        surahsToLoad.map(async ({ number, maxVerses }) => {
          const surah = await loadSurah(number)
          if (!surah) return null
          
          return {
            surah: number,
            verses: surah.verses.slice(0, Math.min(maxVerses, surah.verses.length)),
            revelationType: getRevelationType(number)
          }
        })
      ).then(surahs => surahs.filter(s => s !== null))
    }
    
    return NextResponse.json(graphData)
  } catch (error) {
    console.error('Error loading Quran data:', error)
    return NextResponse.json({ error: 'Failed to load Quran data' }, { status: 500 })
  }
}

// Helper function to determine revelation type
function getRevelationType(surahNumber: number): 'Meccan' | 'Medinan' {
  // Medinan surahs: 2, 3, 4, 5, 8, 9, 22, 24, 33, 47, 48, 49, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 110
  const medinanSurahs = [2, 3, 4, 5, 8, 9, 22, 24, 33, 47, 48, 49, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 110]
  return medinanSurahs.includes(surahNumber) ? 'Medinan' : 'Meccan'
}
