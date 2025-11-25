/**
 * NodeDetailsPanel Component
 * Detailed information panel when a node is selected
 * Extracted from QuranGraph.tsx (lines 544-616)
 */

'use client'

import { GraphNode } from '@/hooks/useGraphData'
import { PILLAR_INFO } from '../nodes/SurahNode'
import { getSurahName } from '@/lib/surah-names'

interface NodeDetailsPanelProps {
  node: GraphNode
  onClose: () => void
}

export default function NodeDetailsPanel({
  node,
  onClose
}: NodeDetailsPanelProps) {
  // Get surah name info for surah nodes
  const surahInfo = node.type === 'surah' ? getSurahName(node.surahNumber) : null

  return (
    <>
      {/* Semi-transparent backdrop - click to close */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Details panel - compact modal on mobile, side panel on desktop */}
      <div className="fixed left-2 right-2 bottom-14 top-auto md:inset-auto md:top-4 md:right-4 md:left-auto md:w-96 max-w-lg md:max-w-md mx-auto md:mx-0 bg-black/95 backdrop-blur-xl border border-blue-400/50 rounded-2xl shadow-2xl shadow-blue-500/20 overflow-hidden z-50 max-h-[60vh] md:max-h-[85vh] flex flex-col">
      {/* Content - scrollable */}
      <div className="overflow-y-auto p-4 flex-1">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {node.type === 'surah' ? (
            <>
              <div
                className="text-xs uppercase tracking-wide mb-2"
                style={{ color: PILLAR_INFO[node.pillar].color }}
              >
                {PILLAR_INFO[node.pillar].name}
              </div>
              {surahInfo && (
                <>
                  <div
                    className="text-right font-arabic text-2xl mb-2 leading-relaxed"
                    style={{ color: PILLAR_INFO[node.pillar].color }}
                  >
                    سورة {surahInfo.nameArabic}
                  </div>
                  <div className="text-gray-200 font-semibold text-lg mb-1">
                    {surahInfo.nameEnglish}
                  </div>
                  <div className="text-gray-400 text-sm italic mb-2">
                    &quot;{surahInfo.meaningEnglish}&quot;
                  </div>
                  <div className="text-gray-500 text-xs">
                    Surah {node.surahNumber}
                  </div>
                </>
              )}
              {!surahInfo && (
                <div className="text-gray-300 text-sm">
                  Surah {node.surahNumber}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-amber-400 font-semibold text-sm">
                Hadith {node.hadith.idInBook}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Sahih al-Bukhari
              </div>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-lg"
        >
          ×
        </button>
      </div>

      {node.type === 'surah' ? (
        <div className="border-t border-purple-500/20 pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Verses</span>
            <span className="text-gray-200">{node.verseCount}</span>
          </div>
          {surahInfo && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Revelation</span>
              <span className={surahInfo.revelationType === 'Meccan' ? 'text-teal-400' : 'text-amber-400'}>
                {surahInfo.revelationType}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Pillar Category</span>
            <span style={{ color: PILLAR_INFO[node.pillar].color }}>
              {PILLAR_INFO[node.pillar].name}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="border-t border-amber-500/20 pt-3">
            <div className="text-xs text-amber-400 font-semibold mb-1 uppercase tracking-wide">
              Narrator
            </div>
            <div className="text-sm text-gray-300 mb-3">
              {node.hadith.english.narrator}
            </div>

            <div className="text-xs text-amber-400 font-semibold mb-1 uppercase tracking-wide">
              English
            </div>
            <div className="text-sm text-gray-100 leading-relaxed mb-3">
              {node.hadith.english.text}
            </div>

            <div className="text-xs text-amber-400 font-semibold mb-1 uppercase tracking-wide">
              Arabic
            </div>
            <div className="text-right font-arabic text-base text-gray-100 leading-relaxed">
              {node.hadith.arabic}
            </div>
          </div>

          {node.connections.length > 0 && (
            <div className="border-t border-amber-500/20 pt-3 mt-3">
              <div className="text-xs text-amber-400 font-semibold mb-2 uppercase tracking-wide">
                Connected Surahs ({node.connections.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {node.connections.map(conn => (
                  <span
                    key={conn}
                    className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-xs text-amber-300"
                  >
                    {conn.replace('surah-', '')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      </div>
      </div>
    </>
  )
}
