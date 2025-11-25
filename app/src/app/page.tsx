'use client'

import QuranGraph from '@/components/graph/QuranGraph'

/**
 * Main homepage - shows the Islamic Knowledge Graph visualization
 * This is the polished, final version with all UI components
 */
export default function Home() {
  return (
    <main className="fixed inset-0 w-full h-full">
      <QuranGraph />
    </main>
  )
}
