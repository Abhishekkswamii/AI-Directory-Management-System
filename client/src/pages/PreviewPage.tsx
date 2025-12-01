import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Folder, File, ChevronRight, Sparkles } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { OrbButton } from '../components/OrbButton'
import { useStore } from '../store/useStore'

export function PreviewPage() {
  const navigate = useNavigate()
  const { organizedStructure, files } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showTree, setShowTree] = useState(false)

  useEffect(() => {
    if (!organizedStructure || files.length === 0) {
      navigate('/workspace')
      return
    }

    // Animate in after a delay
    setTimeout(() => setShowTree(true), 1000)
  }, [organizedStructure, files, navigate])

  if (!organizedStructure) {
    return null
  }

  const categories = Object.keys(organizedStructure)
  const totalCategories = categories.length

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-cosmic-violet to-cosmic-purple',
      'from-cosmic-cyan to-cosmic-violet',
      'from-cosmic-pink to-cosmic-violet',
      'from-cosmic-purple to-cosmic-pink',
      'from-cosmic-cyan to-cosmic-pink',
    ]
    return colors[index % colors.length]
  }

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase()
    if (lower.includes('finance') || lower.includes('invoice')) return '💰'
    if (lower.includes('code') || lower.includes('development')) return '💻'
    if (lower.includes('photo') || lower.includes('image') || lower.includes('memories'))
      return '📸'
    if (lower.includes('document') || lower.includes('work')) return '📄'
    if (lower.includes('creative') || lower.includes('design')) return '🎨'
    if (lower.includes('music') || lower.includes('audio')) return '🎵'
    if (lower.includes('video')) return '🎬'
    return '📁'
  }

  const countFilesInCategory = (category: string): number => {
    let count = 0
    const categoryData = organizedStructure[category]
    Object.values(categoryData).forEach((subcategory) => {
      Object.values(subcategory).forEach((folder) => {
        count += folder.length
      })
    })
    return count
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="container mx-auto px-8 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-16 h-16 text-cosmic-cyan" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
            Your Perfect Universe
          </h1>
          <p className="text-xl text-white/70">
            {files.length} files organized into {totalCategories} beautiful categories
          </p>
        </motion.div>

        {/* Category Rings */}
        <div className="relative max-w-6xl mx-auto mb-16" style={{ height: '600px' }}>
          {/* Center hub */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <div className="w-32 h-32 rounded-full glass-strong glow-violet flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalCategories}</div>
                <div className="text-xs text-white/60">categories</div>
              </div>
            </div>
          </motion.div>

          {/* Orbiting category cards */}
          {categories.map((category, index) => {
            const angle = (index / totalCategories) * Math.PI * 2 - Math.PI / 2
            const radius = 250
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            const fileCount = countFilesInCategory(category)

            return (
              <motion.div
                key={category}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, z: 50 }}
                  onClick={() => setSelectedCategory(category)}
                  className="cursor-pointer"
                >
                  <GlassCard
                    glowColor={index % 2 === 0 ? 'cyan' : 'violet'}
                    className="w-48 p-6"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{getCategoryIcon(category)}</div>
                      <h3 className="font-bold mb-1 text-sm">{category}</h3>
                      <div className="text-xs text-white/60">{fileCount} files</div>
                    </div>

                    {/* Preview thumbnails */}
                    <div className="flex gap-1 mt-3 justify-center">
                      {[...Array(Math.min(fileCount, 5))].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-violet"
                        />
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Connection line to center */}
                <svg
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    width: Math.abs(x) * 2 + 100,
                    height: Math.abs(y) * 2 + 100,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <motion.line
                    x1="50%"
                    y1="50%"
                    x2={x > 0 ? '0%' : '100%'}
                    y2={y > 0 ? '0%' : '100%'}
                    stroke="rgba(99, 102, 241, 0.2)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  />
                </svg>
              </motion.div>
            )
          })}
        </div>

        {/* File Tree Preview */}
        <AnimatePresence>
          {showTree && (
            <motion.div
              className="max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlassCard glowColor="pink" intensity="strong" className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Folder className="w-6 h-6 text-cosmic-cyan" />
                  Organized Structure
                </h2>

                <div className="space-y-2 font-mono text-sm">
                  {categories.slice(0, 5).map((category, i) => {
                    const subcategories = Object.keys(organizedStructure[category])
                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center gap-2 text-cosmic-cyan">
                          <Folder className="w-4 h-4" />
                          <span className="font-semibold">{category}</span>
                        </div>
                        {subcategories.slice(0, 2).map((sub) => {
                          const folders = Object.keys(organizedStructure[category][sub])
                          return (
                            <div key={sub} className="ml-6">
                              <div className="flex items-center gap-2 text-cosmic-violet">
                                <ChevronRight className="w-3 h-3" />
                                <Folder className="w-4 h-4" />
                                <span>{sub}</span>
                              </div>
                              {folders.slice(0, 2).map((folder) => {
                                const fileList = organizedStructure[category][sub][folder]
                                return (
                                  <div key={folder} className="ml-12">
                                    <div className="flex items-center gap-2 text-white/60">
                                      <ChevronRight className="w-3 h-3" />
                                      <Folder className="w-4 h-4" />
                                      <span>{folder}</span>
                                      <span className="text-xs">({fileList.length} files)</span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })}
                      </motion.div>
                    )
                  })}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <OrbButton size="xl" variant="primary" onClick={() => navigate('/success')}>
            <span className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Make It Real
            </span>
          </OrbButton>
        </motion.div>
      </div>

      {/* Particle Effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -100],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
