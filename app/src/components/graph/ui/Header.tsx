/**
 * Header Component
 * Main title and explanation for the AYA visualization
 * Compact, mobile-responsive design that takes ~25% of screen
 */

'use client'

import { useState } from 'react'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`absolute top-0 left-0 right-0 z-20 ${className}`}>
      {/* Glass morphism container with enhanced visuals */}
      <div className="relative bg-gradient-to-b from-black/90 via-black/85 to-transparent backdrop-blur-2xl border-b border-purple-500/30 shadow-2xl">
        {/* Animated gradient border */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-purple-500 via-purple-400 to-amber-400"></div>

        {/* Main content - Compact layout */}
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          {/* Title row - Always visible */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Logo/Title */}
              <div className="flex items-center gap-2 md:gap-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-amber-400 tracking-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  AYA
                </h1>
                <span className="text-3xl md:text-4xl lg:text-5xl font-arabic text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,0.5)]">آية</span>
              </div>

              {/* Subtitle - Hidden on small screens */}
              <div className="hidden lg:block border-l border-purple-500/30 pl-4 ml-2">
                <h2 className="text-lg font-semibold text-gray-200 drop-shadow-lg">
                  Islamic Knowledge Navigator
                </h2>
              </div>
            </div>

            {/* Expand/Collapse button - Mobile only */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-300 text-sm hover:bg-purple-500/30 transition-all duration-300 backdrop-blur-sm"
              aria-label={isExpanded ? "Collapse info" : "Expand info"}
            >
              {isExpanded ? '✕' : 'ℹ️'}
            </button>
          </div>

          {/* Stats and info - Compact row, expandable on mobile */}
          <div className={`space-y-2 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 md:max-h-96 opacity-0 md:opacity-100'}`}>
            {/* Stats badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm md:text-base">
              <div className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <span className="font-semibold">114</span> Quran chapters
              </div>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <div className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 backdrop-blur-sm shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                <span className="font-semibold">72</span> authenticated hadiths
              </div>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <div className="px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/50 text-teal-300 backdrop-blur-sm shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <span className="font-semibold">101</span> scholarly connections
              </div>
            </div>

            {/* Quick guide - Compact */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-gray-400">
              <span className="hover:text-purple-300 transition-colors cursor-default flex items-center gap-1">
                🖱️ <span className="hidden sm:inline">Click to read</span><span className="sm:hidden">Click</span>
              </span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-amber-300 transition-colors cursor-default flex items-center gap-1">
                ✋ <span className="hidden sm:inline">Drag to explore</span><span className="sm:hidden">Drag</span>
              </span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-teal-300 transition-colors cursor-default flex items-center gap-1">
                🔍 <span className="hidden sm:inline">Scroll to zoom</span><span className="sm:hidden">Zoom</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute inset-x-0 -bottom-px h-20 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none"></div>
      </div>
    </div>
  )
}
