'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

// Five Pillars of Islam
type Pillar = 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj' | 'general'

// Pillar colors - professional, scholarly palette
const PILLAR_INFO = {
  shahada: { name: 'Shahada', nameAr: 'الشهادة', color: '#9333ea' },  // Deep Purple
  salah: { name: 'Salah', nameAr: 'الصلاة', color: '#2563eb' },       // Royal Blue
  zakat: { name: 'Zakat', nameAr: 'الزكاة', color: '#059669' },       // Emerald Green
  sawm: { name: 'Sawm', nameAr: 'الصوم', color: '#dc2626' },          // Deep Red
  hajj: { name: 'Hajj', nameAr: 'الحج', color: '#b91c1c' },           // Crimson
  general: { name: 'General', nameAr: 'عام', color: '#475569' }       // Slate Gray
}

// Hadith interface
interface Hadith {
  id: number
  idInBook: number
  chapterId: number
  bookId: number
  arabic: string
  english: {
    narrator: string
    text: string
  }
}

// Node types
interface SurahNode {
  id: string
  type: 'surah'
  surahNumber: number
  name: string
  englishName: string
  verseCount: number
  position: [number, number, number]
  pillar: Pillar
}

interface HadithNode {
  id: string
  type: 'hadith'
  position: [number, number, number]
  connections: string[]
  pillar: Pillar
  hadith: Hadith
}

type GraphNode = SurahNode | HadithNode

// Surah categorization by pillar
const SURAH_PILLARS: Record<number, Pillar> = {
  1: 'shahada', 2: 'salah', 3: 'shahada', 4: 'zakat', 5: 'zakat', 6: 'shahada', 7: 'shahada',
  8: 'general', 9: 'hajj', 10: 'shahada', 11: 'shahada', 12: 'shahada', 13: 'shahada', 
  14: 'shahada', 15: 'general', 16: 'shahada', 17: 'salah', 18: 'shahada', 19: 'shahada',
  20: 'shahada', 21: 'shahada', 22: 'hajj', 23: 'shahada', 24: 'general', 25: 'shahada',
  26: 'shahada', 27: 'shahada', 28: 'shahada', 29: 'shahada', 30: 'shahada', 31: 'shahada',
  32: 'shahada', 33: 'salah', 34: 'shahada', 35: 'shahada', 36: 'shahada', 37: 'shahada',
  38: 'shahada', 39: 'shahada', 40: 'shahada', 41: 'shahada', 42: 'shahada', 43: 'shahada',
  44: 'shahada', 45: 'shahada', 46: 'shahada', 47: 'general', 48: 'general', 49: 'general',
  50: 'shahada', 51: 'shahada', 52: 'shahada', 53: 'shahada', 54: 'shahada', 55: 'shahada',
  56: 'shahada', 57: 'zakat', 58: 'general', 59: 'general', 60: 'general', 61: 'general',
  62: 'salah', 63: 'general', 64: 'shahada', 65: 'general', 66: 'general', 67: 'shahada',
  68: 'shahada', 69: 'shahada', 70: 'shahada', 71: 'shahada', 72: 'shahada', 73: 'salah',
  74: 'shahada', 75: 'shahada', 76: 'general', 77: 'shahada', 78: 'shahada', 79: 'shahada',
  80: 'general', 81: 'shahada', 82: 'shahada', 83: 'general', 84: 'shahada', 85: 'shahada',
  86: 'shahada', 87: 'shahada', 88: 'shahada', 89: 'shahada', 90: 'general', 91: 'shahada',
  92: 'zakat', 93: 'shahada', 94: 'shahada', 95: 'shahada', 96: 'salah', 97: 'sawm',
  98: 'shahada', 99: 'shahada', 100: 'general', 101: 'shahada', 102: 'general', 103: 'shahada',
  104: 'general', 105: 'shahada', 106: 'general', 107: 'salah', 108: 'salah', 109: 'shahada',
  110: 'shahada', 111: 'general', 112: 'shahada', 113: 'shahada', 114: 'shahada'
}

function SurahNodeComponent({ 
  node, 
  isSelected, 
  isHovered,
  onSelect, 
  onHover 
}: { 
  node: SurahNode
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (hover: boolean) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isSelected ? 2.0 : isHovered ? 1.6 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const pillarInfo = PILLAR_INFO[node.pillar]
  const baseColor = pillarInfo.color
  const hoverColor = new THREE.Color(baseColor).multiplyScalar(1.3).getHexString()
  const selectColor = new THREE.Color(baseColor).multiplyScalar(1.6).getHexString()
  
  const color = isSelected ? `#${selectColor}` : isHovered ? `#${hoverColor}` : baseColor
  const baseSize = 0.6 + Math.min(node.verseCount / 120, 1.5)

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={isSelected ? 1.0 : isHovered ? 0.8 : 0.6}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
      
      <Text
        position={[0, baseSize + 0.7, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {node.surahNumber}
      </Text>

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[baseSize + 0.3, baseSize + 0.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  )
}

function HadithNodeComponent({ 
  node, 
  isSelected, 
  isHovered,
  onSelect, 
  onHover 
}: { 
  node: HadithNode
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (hover: boolean) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isSelected ? 2.0 : isHovered ? 1.6 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      meshRef.current.rotation.y += 0.004
    }
  })

  const baseColor = '#d97706'
  const hoverColor = '#f59e0b'
  const selectColor = '#fbbf24'
  
  const color = isSelected ? selectColor : isHovered ? hoverColor : baseColor
  const baseSize = 0.8

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={isSelected ? 1.2 : isHovered ? 1.0 : 0.8}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      
      <Text
        position={[0, baseSize + 0.6, 0]}
        fontSize={0.45}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {node.hadith.idInBook}
      </Text>

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[baseSize + 0.3, baseSize + 0.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}

function ConnectionLine({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#fbbf24" opacity={0.7} transparent linewidth={3} />
      </line>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#fbbf24" opacity={0.4} transparent linewidth={6} />
      </line>
    </>
  )
}

function Scene({ 
  nodes,
  onNodeSelect, 
  onNodeHover 
}: { 
  nodes: GraphNode[],
  onNodeSelect: (node: GraphNode | null) => void, 
  onNodeHover: (node: GraphNode | null) => void 
}) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const handleSelect = (node: GraphNode) => {
    const newSelection = node.id === selectedNode ? null : node.id
    setSelectedNode(newSelection)
    onNodeSelect(newSelection ? node : null)
  }

  const handleHover = (node: GraphNode | null, hover: boolean) => {
    setHoveredNode(hover && node ? node.id : null)
    onNodeHover(hover ? node : null)
  }

  // Draw connections
  const connections: Array<{ source: GraphNode, target: GraphNode }> = []
  nodes.forEach(node => {
    if (node.type === 'hadith') {
      node.connections.forEach(targetId => {
        const target = nodes.find(n => n.id === targetId)
        if (target) {
          connections.push({ source: node, target })
        }
      })
    }
  })

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[20, 20, 20]} intensity={2.5} />
      <pointLight position={[-20, -20, -20]} intensity={1.2} color="#9333ea" />
      <pointLight position={[0, 25, 0]} intensity={1.5} color="#2563eb" />
      <pointLight position={[70, 0, 0]} intensity={2.0} color="#d97706" />

      {connections.map((conn, i) => (
        <ConnectionLine 
          key={i}
          start={conn.source.position}
          end={conn.target.position}
        />
      ))}

      {nodes.map(node => 
        node.type === 'surah' ? (
          <SurahNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isHovered={hoveredNode === node.id}
            onSelect={() => handleSelect(node)}
            onHover={(hover) => handleHover(node, hover)}
          />
        ) : (
          <HadithNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isHovered={hoveredNode === node.id}
            onSelect={() => handleSelect(node)}
            onHover={(hover) => handleHover(node, hover)}
          />
        )
      )}

      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        minDistance={20}
        maxDistance={180}
      />
    </>
  )
}

export default function QuranGraph() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [allNodes, setAllNodes] = useState<GraphNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [pillarFilter, setPillarFilter] = useState<Pillar | 'all'>('all')
  const [filteredNodes, setFilteredNodes] = useState<GraphNode[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const quranResponse = await fetch('/api/quran')
        const quranData = await quranResponse.json()
        
        const surahNodes: SurahNode[] = quranData.surahs.map((surahData: any, index: number) => {
          const angle = (index * Math.PI * 2 * 3.5) / 114
          const radius = 22 + (index / 114) * 35
          const height = Math.sin(index * 0.18) * 10
          
          return {
            id: `surah-${surahData.surah}`,
            type: 'surah' as const,
            surahNumber: surahData.surah,
            name: surahData.name || `Surah ${surahData.surah}`,
            englishName: `Surah ${surahData.surah}`,
            verseCount: surahData.verses.length,
            position: [
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ] as [number, number, number],
            pillar: SURAH_PILLARS[surahData.surah] || 'general'
          }
        })

        const edgesResponse = await fetch('/api/edges')
        const edgesData = await edgesResponse.json()
        
        let hadithNodes: HadithNode[] = []
        
        if (edgesData.success && edgesData.data.length > 0) {
          const hadithResponse = await fetch('/api/hadith')
          const hadithData = await hadithResponse.json()
          
          if (hadithData.success) {
            const connectedHadithIds = new Set(edgesData.data.map((e: any) => e.hadith.idInBook))
            const connectedHadiths = hadithData.data.filter((h: Hadith) => connectedHadithIds.has(h.idInBook))
            
            hadithNodes = connectedHadiths.map((h: Hadith, index: number) => {
              const angle = (index / connectedHadiths.length) * Math.PI * 2
              const radius = 70
              
              return {
                id: `hadith-${h.idInBook}`,
                type: 'hadith' as const,
                position: [
                  Math.cos(angle) * radius,
                  Math.sin(index * 0.5) * 3,
                  Math.sin(angle) * radius
                ] as [number, number, number],
                connections: [],
                pillar: 'general' as Pillar,
                hadith: h
              }
            })

            edgesData.data.forEach((edge: any) => {
              const verseId = `surah-${edge.verse.surah}`
              const hadithId = `hadith-${edge.hadith.idInBook}`
              
              const hadithNode = hadithNodes.find(n => n.id === hadithId)
              
              if (hadithNode && !hadithNode.connections.includes(verseId)) {
                hadithNode.connections.push(verseId)
              }
            })

            console.log(`Loaded ${hadithNodes.length} hadiths with ${edgesData.data.length} connections`)
          }
        }

        setAllNodes([...surahNodes, ...hadithNodes])
        setFilteredNodes([...surahNodes, ...hadithNodes])
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let filtered = allNodes

    if (pillarFilter !== 'all') {
      filtered = filtered.filter(n => {
        if (n.type === 'surah') return n.pillar === pillarFilter
        if (n.type === 'hadith') return true
        return false
      })
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(n => {
        if (n.type === 'surah') {
          return n.surahNumber.toString().includes(query) ||
                 n.name.includes(query) ||
                 n.englishName.toLowerCase().includes(query)
        }
        if (n.type === 'hadith') {
          return n.hadith.english.text.toLowerCase().includes(query) ||
                 n.id.includes(query)
        }
        return false
      })
    }

    setFilteredNodes(filtered)
  }, [searchQuery, pillarFilter, allNodes])

  const pillarCounts = Object.keys(PILLAR_INFO).reduce((acc, pillar) => {
    acc[pillar as Pillar] = allNodes.filter(n => n.type === 'surah' && n.pillar === pillar).length
    return acc
  }, {} as Record<Pillar, number>)

  const hadithCount = allNodes.filter(n => n.type === 'hadith').length
  const connectionCount = allNodes.filter(n => n.type === 'hadith').reduce((sum, n) => 
    sum + (n.type === 'hadith' ? n.connections.length : 0), 0
  )

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [70, 60, 70], fov: 60 }}
        className="bg-transparent"
      >
        {!isLoading && <Scene nodes={filteredNodes} onNodeSelect={setSelectedNode} onNodeHover={setHoveredNode} />}
      </Canvas>

      <div className="absolute top-4 left-4 right-4 flex gap-3">
        <div className="flex-1 max-w-md bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg p-3 shadow-lg">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surahs or hadiths..."
            className="w-full bg-transparent text-gray-100 placeholder-gray-400 outline-none text-sm"
          />
        </div>
      </div>

      <div className="absolute top-20 left-4 right-4 bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg p-3 shadow-lg">
        <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Five Pillars of Islam</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPillarFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              pillarFilter === 'all'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'text-gray-400 hover:text-gray-200 border border-gray-600'
            }`}
          >
            All Surahs
          </button>
          {(Object.keys(PILLAR_INFO) as Pillar[]).map(pillar => {
            const info = PILLAR_INFO[pillar]
            return (
              <button
                key={pillar}
                onClick={() => setPillarFilter(pillar)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors border ${
                  pillarFilter === pillar ? 'border-2' : 'border-gray-600 text-gray-400 hover:text-gray-200'
                }`}
                style={pillarFilter === pillar ? {
                  backgroundColor: `${info.color}30`,
                  borderColor: info.color,
                  color: info.color
                } : {}}
              >
                {info.name} <span className="text-[10px] opacity-70">({pillarCounts[pillar]})</span>
              </button>
            )
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg px-4 py-2">
          <div className="text-purple-400 text-sm font-semibold">Loading Islamic Knowledge Graph...</div>
        </div>
      ) : (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg px-4 py-2 shadow-lg">
          <div className="text-purple-300 text-sm font-semibold">
            114 Surahs • {hadithCount} Hadiths • {connectionCount} Verified Connections
          </div>
        </div>
      )}

      {hoveredNode && !selectedNode && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-black/95 backdrop-blur-md border border-purple-500/50 rounded-lg p-4 max-w-sm shadow-xl">
            {hoveredNode.type === 'surah' ? (
              <>
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{PILLAR_INFO[hoveredNode.pillar].name}</div>
                <div className="text-right font-arabic text-lg mb-2" style={{ color: PILLAR_INFO[hoveredNode.pillar].color }}>
                  {hoveredNode.name}
                </div>
                <div className="text-gray-300 text-sm">Surah {hoveredNode.surahNumber}</div>
                <div className="text-xs text-gray-400 mt-2">{hoveredNode.verseCount} verses</div>
              </>
            ) : (
              <>
                <div className="text-amber-400 font-semibold text-xs mb-1">Hadith {hoveredNode.hadith.idInBook}</div>
                <div className="text-gray-100 text-sm line-clamp-3">{hoveredNode.hadith.english.text}</div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedNode && (
        <div className="absolute top-4 right-4 w-96 bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg p-4 max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              {selectedNode.type === 'surah' ? (
                <>
                  <div className="text-xs uppercase tracking-wide mb-2" style={{ color: PILLAR_INFO[selectedNode.pillar].color }}>
                    {PILLAR_INFO[selectedNode.pillar].name}
                  </div>
                  <div className="text-right font-arabic text-xl mb-2" style={{ color: PILLAR_INFO[selectedNode.pillar].color }}>
                    {selectedNode.name}
                  </div>
                  <div className="text-gray-300 text-sm">Surah {selectedNode.surahNumber}</div>
                </>
              ) : (
                <>
                  <div className="text-amber-400 font-semibold text-sm">Hadith {selectedNode.hadith.idInBook}</div>
                  <div className="text-xs text-gray-400 mt-1">Sahih al-Bukhari</div>
                </>
              )}
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white text-lg">×</button>
          </div>
          
          {selectedNode.type === 'surah' ? (
            <div className="border-t border-purple-500/20 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Verses</span>
                <span className="text-gray-200">{selectedNode.verseCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Category</span>
                <span style={{ color: PILLAR_INFO[selectedNode.pillar].color }}>
                  {PILLAR_INFO[selectedNode.pillar].name}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="border-t border-amber-500/20 pt-3">
                <div className="text-xs text-amber-400 font-semibold mb-1 uppercase tracking-wide">Narrator</div>
                <div className="text-sm text-gray-300 mb-3">{selectedNode.hadith.english.narrator}</div>
                
                <div className="text-xs text-amber-400 font-semibold mb-1 uppercase tracking-wide">English</div>
                <div className="text-sm text-gray-100 leading-relaxed mb-3">{selectedNode.hadith.english.text}</div>
                
                <div className="text-xs text-amber-400 font-semibold mb-1 uppercase tracking-wide">Arabic</div>
                <div className="text-right font-arabic text-base text-gray-100 leading-relaxed">
                  {selectedNode.hadith.arabic}
                </div>
              </div>
              
              {selectedNode.connections.length > 0 && (
                <div className="border-t border-amber-500/20 pt-3 mt-3">
                  <div className="text-xs text-amber-400 font-semibold mb-2 uppercase tracking-wide">
                    Connected Surahs ({selectedNode.connections.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.connections.map(conn => (
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
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-lg px-4 py-2">
        <div className="text-purple-400 text-xs text-center uppercase tracking-wide">
          Drag to Rotate • Scroll to Zoom • Click for Details
        </div>
      </div>
    </div>
  )
}
