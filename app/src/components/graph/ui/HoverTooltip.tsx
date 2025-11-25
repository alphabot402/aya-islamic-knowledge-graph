/**
 * HoverTooltip Component
 * Displays quick preview when hovering over nodes
 * Extracted from QuranGraph.tsx (lines 522-542)
 */

'use client'

import { GraphNode } from '@/hooks/useGraphData'
import { PILLAR_INFO } from '../nodes/SurahNode'
import { getSurahName } from '@/lib/surah-names'

interface HoverTooltipProps {
  node: GraphNode
}

export default function HoverTooltip({ node }: HoverTooltipProps) {
  const surahInfo = node.type === 'surah' ? getSurahName(node.surahNumber) : null

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="bg-black/95 backdrop-blur-md border border-purple-500/50 rounded-lg p-4 max-w-sm shadow-xl">
        {node.type === 'surah' ? (
          <>
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
              {PILLAR_INFO[node.pillar].name}
            </div>
            {surahInfo && (
              <>
                <div
                  className="text-right font-arabic text-lg mb-1"
                  style={{ color: PILLAR_INFO[node.pillar].color }}
                >
                  سورة {surahInfo.nameArabic}
                </div>
                <div className="text-gray-200 font-semibold text-base mb-1">
                  {surahInfo.nameEnglish}
                </div>
                <div className="text-gray-400 text-xs italic">
                  &quot;{surahInfo.meaningEnglish}&quot;
                </div>
              </>
            )}
            {!surahInfo && (
              <div className="text-gray-300 text-sm">
                Surah {node.surahNumber}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">
              {node.verseCount} verses • {surahInfo?.revelationType}
            </div>
          </>
        ) : (
          <>
            <div className="text-amber-400 font-semibold text-xs mb-1">
              Hadith {node.hadith.idInBook}
            </div>
            <div className="text-gray-100 text-sm line-clamp-3">
              {node.hadith.english.text}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
