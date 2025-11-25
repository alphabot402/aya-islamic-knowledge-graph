/**
 * Header Component
 * Main title and explanation for the AYA visualization
 * Helps users immediately understand the purpose and value
 */

'use client'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <div className={`absolute top-4 left-4 right-4 max-w-6xl mx-auto ${className}`}>
      <div className="bg-black/95 backdrop-blur-xl border-2 border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-amber-400"></div>

        <div className="p-8">
          {/* Title - Centered and prominent */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-amber-400 tracking-tight">
              AYA
            </h1>
            <span className="text-5xl font-arabic text-purple-300">آية</span>
          </div>

          {/* Subtitle - Clear and direct */}
          <h2 className="text-center text-2xl font-semibold text-gray-100 mb-4">
            Islamic Knowledge Navigator
          </h2>

          {/* Core Message - Direct and simple */}
          <div className="text-center space-y-3 mb-5">
            <p className="text-gray-300 text-lg">
              Explore <span className="text-purple-400 font-semibold">114 Quran chapters</span> connected to{' '}
              <span className="text-amber-400 font-semibold">72 authenticated hadiths</span>{' '}
              through <span className="text-teal-400 font-semibold">101 scholarly connections</span>
            </p>
            <p className="text-gray-400 text-base">
              Organized by the Five Pillars of Islam • Interactive 3D visualization
            </p>
          </div>

          {/* Quick Guide */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="hover:text-purple-300 transition-all duration-200 cursor-default">Click to read</span>
            <span className="text-gray-600">•</span>
            <span className="hover:text-amber-300 transition-all duration-200 cursor-default">Drag to explore</span>
            <span className="text-gray-600">•</span>
            <span className="hover:text-teal-300 transition-all duration-200 cursor-default">Filter below</span>
          </div>
        </div>
      </div>
    </div>
  )
}
