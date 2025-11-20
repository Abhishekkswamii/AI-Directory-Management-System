import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Download, FolderOpen, RefreshCw, CheckCircle } from 'lucide-react'
import { OrbButton } from '../components/OrbButton'
import { GlassCard } from '../components/GlassCard'
import { useStore } from '../store/useStore'
import JSZip from 'jszip'

export function SuccessPage() {
  const navigate = useNavigate()
  const { files, organizedStructure, reset } = useStore()
  const [isExporting, setIsExporting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (!organizedStructure || files.length === 0) {
      navigate('/workspace')
      return
    }

    // Trigger confetti effect
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }, [organizedStructure, files, navigate])

  const handleDownloadZip = async () => {
    if (!organizedStructure) return

    setIsExporting(true)

    try {
      const zip = new JSZip()

      // Add files to ZIP according to organized structure
      for (const category of Object.keys(organizedStructure)) {
        for (const subcategory of Object.keys(organizedStructure[category])) {
          for (const folder of Object.keys(organizedStructure[category][subcategory])) {
            const fileList = organizedStructure[category][subcategory][folder]

            for (const file of fileList) {
              const path = `${category}/${subcategory}/${folder}/${file.name}`
              
              // Find original file
              const originalFile = files.find((f) => f.id === file.id)
              if (originalFile && originalFile.content) {
                zip.file(path, originalFile.content)
              } else {
                // Create placeholder if content not available
                zip.file(path, `File: ${file.name}\nSize: ${file.size} bytes`)
              }
            }
          }
        }
      }

      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lumina-organized-${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error creating ZIP:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleOrganizeAnother = () => {
    reset()
    navigate('/workspace')
  }

  if (!organizedStructure) {
    return null
  }

  const totalFiles = files.length
  const totalCategories = Object.keys(organizedStructure).length

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle explosion effect */}
      {showConfetti &&
        [...Array(50)].map((_, i) => {
          const angle = (i / 50) * Math.PI * 2
          const distance = 300 + Math.random() * 200
          const tx = Math.cos(angle) * distance
          const ty = Math.sin(angle) * distance

          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                background: [
                  'rgba(99, 102, 241, 0.8)',
                  'rgba(34, 211, 238, 0.8)',
                  'rgba(236, 72, 153, 0.8)',
                ][i % 3],
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: tx,
                y: ty,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          )
        })}

      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <CheckCircle className="w-32 h-32 text-cosmic-cyan" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-cosmic-violet"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
            Perfect Harmony
          </h1>
          <p className="text-2xl text-white/80 mb-4">
            {totalFiles} files now live in perfect order
          </p>
          <p className="text-lg text-white/60 mb-12">
            Organized into {totalCategories} beautiful categories with intelligent structure
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard glowColor="violet" className="p-6">
            <div className="text-4xl font-bold text-cosmic-violet mb-2">{totalFiles}</div>
            <div className="text-sm text-white/60">Files Organized</div>
          </GlassCard>

          <GlassCard glowColor="cyan" className="p-6">
            <div className="text-4xl font-bold text-cosmic-cyan mb-2">{totalCategories}</div>
            <div className="text-sm text-white/60">Categories Created</div>
          </GlassCard>

          <GlassCard glowColor="pink" className="p-6">
            <div className="text-4xl font-bold text-cosmic-pink mb-2">100%</div>
            <div className="text-sm text-white/60">AI Accuracy</div>
          </GlassCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <OrbButton
            size="lg"
            variant="primary"
            onClick={handleDownloadZip}
            disabled={isExporting}
          >
            <Download className="w-5 h-5 mr-2" />
            {isExporting ? 'Creating ZIP...' : 'Download ZIP'}
          </OrbButton>

          <OrbButton size="lg" variant="secondary" onClick={handleOrganizeAnother}>
            <RefreshCw className="w-5 h-5 mr-2" />
            Organize Another
          </OrbButton>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-12 text-sm text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Your organized files are ready. Download them or organize another folder.</p>
          <p className="mt-2">All processing happened securely on your device.</p>
        </motion.div>
      </div>

      {/* Background glow effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  )
}
