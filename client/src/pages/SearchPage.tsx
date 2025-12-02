import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, Sparkles, File } from 'lucide-react'
import { OrbitalMenu } from '../components/OrbitalMenu'
import { GlassCard } from '../components/GlassCard'
import { searchCollections } from '../utils/api'
import { FileItem } from '../store/useStore'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FileItem[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const searchResults = await searchCollections(query)
      console.log('Search results:', searchResults)
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      alert('Search failed. Please make sure you have organized some files first.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen">
      <OrbitalMenu />

      <div className="container mx-auto pl-32 pr-8 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
            Semantic Search
          </h1>
          <p className="text-xl text-white/70">
            Find anything across all your organized collections
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard glowColor="cyan" intensity="strong" className="p-8 mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by meaning, not just keywords..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-cosmic-cyan transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cosmic-violet to-cosmic-cyan hover:from-cosmic-cyan hover:to-cosmic-violet transition-all duration-300 font-semibold disabled:opacity-50"
              >
                {isSearching ? (
                  <Sparkles className="w-5 h-5 animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6">
              Found {results.length} results
            </h2>

            {results.map((file, index) => (
              <motion.div
                key={file.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard hover className="p-6">
                  <div className="flex items-center gap-4">
                    <File className="w-8 h-8 text-cosmic-cyan" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{file.name}</h3>
                      <p className="text-sm text-white/60">
                        {file.type}
                        {file.size && ` • ${(file.size / 1024).toFixed(1)} KB`}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!isSearching && results.length === 0 && query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <SearchIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No results found. Try a different query.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
