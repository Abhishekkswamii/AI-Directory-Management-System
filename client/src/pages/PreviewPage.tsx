import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Folder, File, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react'
import { GlassCard } from '../components/GlassCard'
import { OrbButton } from '../components/OrbButton'
import { OrbitalMenu } from '../components/OrbitalMenu'
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
    <div className="relative w-full h-screen overflow-hidden">
      <OrbitalMenu />
      
      <div className="h-full pl-32 pr-8 py-6 flex flex-col">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-4">
          <OrbButton
            size="sm"
            variant="secondary"
            onClick={() => navigate('/workspace')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </OrbButton>
          
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Sparkles className="w-8 h-8 text-cosmic-cyan" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
            Your Perfect Universe
          </h1>
          <p className="text-sm text-white/70">
            {files.length} files organized into {totalCategories} beautiful {totalCategories === 1 ? 'category' : 'categories'}
          </p>
        </motion.div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {categories.map((category, index) => {
              const fileCount = countFilesInCategory(category)

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    className="cursor-pointer"
                  >
                    <GlassCard
                      glowColor={index % 2 === 0 ? 'cyan' : 'violet'}
                      className="p-4 h-full"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{getCategoryIcon(category)}</div>
                        <h3 className="font-bold mb-1 text-base">{category}</h3>
                        <div className="text-xs text-white/60 mb-2">{fileCount} files</div>
                      </div>

                      {/* Preview dots */}
                      <div className="flex gap-1 justify-center">
                        {[...Array(Math.min(fileCount, 6))].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cosmic-cyan to-cosmic-violet"
                          />
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {/* File Tree Preview */}
          <AnimatePresence>
            {showTree && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard glowColor="pink" intensity="strong" className="p-4">
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-cosmic-cyan" />
                    Organized Structure
                  </h2>

                  <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto custom-scrollbar">
                    {categories.map((category, i) => {
                      const subcategories = Object.keys(organizedStructure[category])
                      const isExpanded = selectedCategory === category
                      
                      return (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div 
                            className="flex items-center gap-2 text-cosmic-cyan hover:text-cosmic-violet cursor-pointer py-0.5"
                            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                          >
                            <Folder className="w-3 h-3 flex-shrink-0" />
                            <span className="font-semibold text-xs">{category}</span>
                            <span className="text-white/40 text-xs">({countFilesInCategory(category)} files)</span>
                          </div>
                          
                          {(isExpanded || categories.length === 1) && subcategories.map((sub) => {
                            const folders = Object.keys(organizedStructure[category][sub])
                            return (
                              <div key={sub} className="ml-3">
                                <div className="flex items-center gap-2 text-cosmic-violet py-0.5">
                                  <ChevronRight className="w-2 h-2 flex-shrink-0" />
                                  <Folder className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate text-xs">{sub}</span>
                                </div>
                                {folders.map((folder) => {
                                  const fileList = organizedStructure[category][sub][folder]
                                  return (
                                    <div key={folder} className="ml-3">
                                      <div className="flex items-center gap-2 text-white/60 py-0.5">
                                        <ChevronRight className="w-2 h-2 flex-shrink-0" />
                                        <Folder className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate text-xs">{folder}</span>
                                        <span className="text-xs whitespace-nowrap">({fileList.length})</span>
                                      </div>
                                      {/* Show first 2 files */}
                                      {fileList.slice(0, 2).map((file, idx) => (
                                        <div key={idx} className="ml-3 flex items-center gap-2 text-white/40 py-0.5">
                                          <File className="w-2 h-2 flex-shrink-0" />
                                          <span className="truncate text-xs">{file.name}</span>
                                        </div>
                                      ))}
                                      {fileList.length > 2 && (
                                        <div className="ml-3 text-white/30 text-xs py-0.5">
                                          ... {fileList.length - 2} more
                                        </div>
                                      )}
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
        </div>

        {/* Action Button */}
        <motion.div
          className="text-center pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <OrbButton size="xl" variant="primary" onClick={() => navigate('/success')}>
            <span className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Continue to Download
            </span>
          </OrbButton>
          
          <motion.p
            className="mt-4 text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Click on categories to expand • All processing done locally
          </motion.p>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>
    </div>
  )
}
