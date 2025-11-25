/**
 * SearchBar Component
 * Search input for filtering nodes
 * Extracted from QuranGraph.tsx (lines 463-472)
 */

'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search surahs or hadiths...'
}: SearchBarProps) {
  return (
    <div className="absolute top-52 left-4 right-4 flex gap-3">
      <div className="flex-1 max-w-md bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg p-3 shadow-lg">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-gray-100 placeholder-gray-400 outline-none text-sm"
        />
      </div>
    </div>
  )
}
