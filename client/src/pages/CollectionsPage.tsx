import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Calendar, Files } from 'lucide-react'
import { OrbitalMenu } from '../components/OrbitalMenu'
import { GlassCard } from '../components/GlassCard'
import { getAllCollections } from '../utils/api'

export function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    try {
      const data = await getAllCollections()
      setCollections(data)
    } catch (error) {
      console.error('Error loading collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen">
      <OrbitalMenu />

      <div className="container mx-auto px-8 py-16 max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
            Your Collections
          </h1>
          <p className="text-xl text-white/70">
            All your organized file collections in one place
          </p>
        </motion.div>

        {/* Collections Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-cosmic-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.collection_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover glowColor={index % 2 === 0 ? 'violet' : 'cyan'} className="p-6">
                  <div className="mb-4">
                    <FolderOpen className="w-12 h-12 text-cosmic-cyan mb-3" />
                    <h3 className="text-xl font-bold mb-2">
                      Collection {index + 1}
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <Files className="w-4 h-4" />
                      <span>{collection.total_files} files</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <FolderOpen className="w-4 h-4" />
                      <span>{collection.categories.length} categories</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(collection.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {collection.categories.slice(0, 3).map((cat: string) => (
                      <span
                        key={cat}
                        className="px-2 py-1 rounded-full bg-cosmic-violet/20 text-xs text-cosmic-violet"
                      >
                        {cat}
                      </span>
                    ))}
                    {collection.categories.length > 3 && (
                      <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-white/60">
                        +{collection.categories.length - 3}
                      </span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-4">No collections yet</p>
            <p className="text-white/40">Upload your first folder to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
