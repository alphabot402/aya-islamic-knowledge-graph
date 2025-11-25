/**
 * Test Mocks
 * Mock data and utilities for testing
 */

import { GraphNode, SurahNode, HadithNode, Pillar } from '@/hooks/useGraphData'

/**
 * Mock Surah Node
 */
export const mockSurahNode: SurahNode = {
  id: 'surah-1',
  type: 'surah',
  surahNumber: 1,
  name: 'Al-Fatihah',
  englishName: 'The Opening',
  verseCount: 7,
  position: [0, 0, 0],
  pillar: 'shahada' as Pillar,
}

/**
 * Mock Hadith Node
 */
export const mockHadithNode: HadithNode = {
  id: 'hadith-1',
  type: 'hadith',
  position: [10, 0, 10],
  connections: ['surah-1', 'surah-2'],
  pillar: 'general' as Pillar,
  hadith: {
    id: 1,
    idInBook: 1,
    chapterId: 1,
    bookId: 1,
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    english: {
      narrator: 'Umar bin Al-Khattab',
      text: 'Actions are judged by intentions',
    },
  },
}

/**
 * Mock multiple nodes for testing
 */
export const mockNodes: GraphNode[] = [
  mockSurahNode,
  {
    ...mockSurahNode,
    id: 'surah-2',
    surahNumber: 2,
    name: 'Al-Baqarah',
    englishName: 'The Cow',
    verseCount: 286,
    pillar: 'salah' as Pillar,
    position: [5, 0, 0],
  },
  {
    ...mockSurahNode,
    id: 'surah-3',
    surahNumber: 3,
    name: 'Ali Imran',
    englishName: 'The Family of Imran',
    verseCount: 200,
    pillar: 'shahada' as Pillar,
    position: [10, 0, 0],
  },
  mockHadithNode,
]

/**
 * Mock fetch response for Quran API
 */
export const mockQuranApiResponse = {
  success: true,
  surahs: [
    {
      surah: 1,
      name: 'Al-Fatihah',
      verses: Array(7)
        .fill(null)
        .map((_, i) => ({ verse: i + 1, text: `Verse ${i + 1}` })),
    },
    {
      surah: 2,
      name: 'Al-Baqarah',
      verses: Array(286)
        .fill(null)
        .map((_, i) => ({ verse: i + 1, text: `Verse ${i + 1}` })),
    },
  ],
}

/**
 * Mock fetch response for Hadith API
 */
export const mockHadithApiResponse = {
  success: true,
  data: [
    {
      id: 1,
      idInBook: 1,
      chapterId: 1,
      bookId: 1,
      arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
      english: {
        narrator: 'Umar bin Al-Khattab',
        text: 'Actions are judged by intentions',
      },
    },
  ],
}

/**
 * Mock fetch response for Edges API
 */
export const mockEdgesApiResponse = {
  success: true,
  data: [
    {
      verse: { surah: 1, ayah: 1 },
      hadith: { idInBook: 1 },
    },
  ],
}

/**
 * Setup fetch mock for tests
 */
export function setupFetchMock() {
  const mockFetch = global.fetch as jest.Mock

  mockFetch.mockImplementation((url: string) => {
    if (url.includes('/api/quran')) {
      return Promise.resolve({
        ok: true,
        json: async () => mockQuranApiResponse,
      })
    }
    if (url.includes('/api/hadith')) {
      return Promise.resolve({
        ok: true,
        json: async () => mockHadithApiResponse,
      })
    }
    if (url.includes('/api/edges')) {
      return Promise.resolve({
        ok: true,
        json: async () => mockEdgesApiResponse,
      })
    }
    return Promise.reject(new Error('Unknown URL'))
  })
}

/**
 * Reset fetch mock
 */
export function resetFetchMock() {
  const mockFetch = global.fetch as jest.Mock
  mockFetch.mockReset()
}
