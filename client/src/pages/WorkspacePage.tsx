import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FolderOpen, Sparkles, AlertCircle, RefreshCw, ArrowLeft, X, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { OrbitalMenu } from '../components/OrbitalMenu'
import { GlassCard } from '../components/GlassCard'
import { OrbButton } from '../components/OrbButton'
import { useStore } from '../store/useStore'
import { pickDirectory, processFiles, isFileSystemAccessSupported } from '../utils/fileProcessor'
import { analyzeFiles, healthCheck } from '../utils/api'

export function WorkspacePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileCount, setFileCount] = useState(0)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [directoryPath, setDirectoryPath] = useState<string>('')

  const {
    files,
    setFiles,
    setIsProcessing,
    setProcessingMessage,
    setProgress,
    setOrganizedStructure,
    setCollectionId,
    isProcessing,
    processingMessage,
    progress,
  } = useStore()

  const poeticMessages = [
    'Scanning your files…',
    'Reading your memories…',
    'Learning your style…',
    'Understanding your world…',
    'Extracting text from documents…',
    'Generating embeddings…',
    'Creating beauty from chaos…',
    'Weaving digital harmony…',
    'Discovering hidden patterns…',
    'Organizing your universe…',
    'Building perfect order…',
  ]

  // Health check on component mount with retry logic
  useEffect(() => {
    const checkBackend = async () => {
      const maxRetries = 5
      const baseDelay = 1000 // 1 second

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          await healthCheck()
          setBackendStatus('connected')
          setError(null) // Clear any stale errors
          console.log('Backend health check successful')
          return
        } catch (err) {
          console.error(`Backend health check failed (attempt ${attempt + 1}/${maxRetries}):`, err)

          if (attempt < maxRetries - 1) {
            // Wait before retrying with exponential backoff
            const delay = baseDelay * Math.pow(2, attempt)
            console.log(`Retrying in ${delay}ms...`)
            await new Promise(resolve => setTimeout(resolve, delay))
          } else {
            // Final attempt failed
            setBackendStatus('error')
            setError('Cannot connect to the backend server. The server may still be starting up. Please wait a moment and try again.')
          }
        }
      }
    }

    checkBackend()
  }, [])

  const handleCancelProcessing = () => {
    setIsProcessing(false)
    setProcessingMessage('')
    setProgress(0)
    setFileCount(0)
    setFiles([])
  }

  const handleFilesSelected = (files: File[], path?: string) => {
    setSelectedFiles(files)
    setFileCount(files.length)
    if (path) {
      setDirectoryPath(path)
    } else if (files.length > 0) {
      // Extract common path or first file's path
      const firstPath = files[0].webkitRelativePath || files[0].name
      const pathParts = firstPath.split('/')
      setDirectoryPath(pathParts.length > 1 ? pathParts[0] : 'Selected files')
    }
    setError(null)
  }

  const handleOrganize = async () => {
    if (selectedFiles.length === 0) return
    await handleFileSelect(selectedFiles)
  }

  const handleFileSelect = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return

    setError(null)
    setFileCount(selectedFiles.length)
    setIsProcessing(true)
    setProcessingMessage(`Found ${selectedFiles.length} files. Starting analysis…`)
    setProgress(0)

    try {
      // Step 1: Process files locally (extract text)
      let messageIndex = 0
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % poeticMessages.length
        setProcessingMessage(poeticMessages[messageIndex])
      }, 3000)

      setProcessingMessage('Extracting text from your files…')
      const processed = await processFiles(selectedFiles, (current, total) => {
        setProgress((current / total) * 40) // First 40% for file processing
        setProcessingMessage(`Processing file ${current} of ${total}…`)
      })

      setFiles(processed)
      setProgress(40)

      // Step 2: Send to backend for AI analysis
      setProcessingMessage('Sending to AI for analysis…')
      setProgress(50)

      console.log('Sending files to backend:', processed.length)
      console.log('First file sample:', processed[0])
      console.log('Full payload:', JSON.stringify({ files: processed.slice(0, 2) }, null, 2))

      const result = await analyzeFiles(processed)

      console.log('Received result from backend:', result)

      setProgress(90)
      setProcessingMessage('Finalizing organization structure…')

      setOrganizedStructure(result.organized_structure)
      setCollectionId(result.collection_id)

      setProgress(100)
      clearInterval(messageInterval)

      // Navigate to preview
      setTimeout(() => {
        setIsProcessing(false)
        navigate('/preview')
      }, 1000)

    } catch (error: any) {
      console.error('Error processing files:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })

      // Clear interval if it exists
      setIsProcessing(false)

      // Provide user-friendly error messages
      let errorMessage = 'Something went wrong. '

      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage += 'Cannot connect to the backend server. Please ensure the backend is running and try again.'
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error: ' + (error.response.data?.detail || 'Check the backend logs for details.')
      } else if (error.response?.status === 400) {
        errorMessage += 'Bad request: ' + (error.response.data?.detail || 'Invalid data sent to server.')
      } else if (error.message?.includes('timeout')) {
        errorMessage += 'Request timed out. Try with fewer files or check your connection.'
      } else {
        errorMessage += error.message || 'Please try again.'
      }

      setError(errorMessage)
      setProcessingMessage('')
      setProgress(0)
    }
  }

  const handleDirectoryPicker = async () => {
    try {
      setError(null)
      const files = await pickDirectory()
      handleFilesSelected(files)
    } catch (error: any) {
      console.error('Directory picker error:', error)
      if (error.name !== 'AbortError') {
        setError('Failed to access directory. Please try again.')
      }
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFilesSelected(files)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const items = Array.from(e.dataTransfer.items)
    const files: File[] = []

    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry()
        if (entry) {
          await collectFiles(entry, files)
        }
      }
    }

    if (files.length > 0) {
      handleFilesSelected(files)
    }
  }

  const collectFiles = async (entry: any, files: File[], path: string = ''): Promise<void> => {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => entry.file(resolve))
      Object.defineProperty(file, 'webkitRelativePath', {
        value: path + file.name,
        writable: false,
      })
      files.push(file)
    } else if (entry.isDirectory) {
      const reader = entry.createReader()
      const entries = await new Promise<any[]>((resolve) => reader.readEntries(resolve))
      for (const childEntry of entries) {
        await collectFiles(childEntry, files, `${path}${entry.name}/`)
      }
    }
  }

  const handleRetry = () => {
    setError(null)
    setProgress(0)
    setProcessingMessage('')
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <OrbitalMenu />

      <div className="flex items-center justify-center h-full pl-32 pr-8 py-8">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
              Upload Your Files
            </h1>
            <p className="text-base text-white/70">
              Drop a folder or choose a directory to begin the magic
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <GlassCard glowColor="violet" className="p-6 border-2 border-red-500/50">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
                      <p className="text-white/80 mb-4">{error}</p>
                      <button
                        onClick={handleRetry}
                        className="text-sm px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all duration-200"
                      >
                        <RefreshCw className="w-4 h-4 inline mr-2" />
                        Try Again
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Area or Selected Files Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {selectedFiles.length === 0 ? (
                <motion.div
                  key="upload-area"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard
                    glowColor="violet"
                    intensity="strong"
                    hover={false}
                    className="relative overflow-hidden"
                  >
                    <div
                      className={`p-12 text-center transition-all duration-300 ${isDragging ? 'bg-cosmic-violet/20 scale-105' : ''
                        }`}
                      onDrop={handleDrop}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                      }}
                      onDragLeave={() => setIsDragging(false)}
                    >
                      {/* Animated background effect */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background:
                            'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />

                      <div className="relative z-10">
                        <motion.div
                          className="mb-4 inline-block"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Upload className="w-16 h-16 text-cosmic-cyan drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] mx-auto mb-2" />
                        </motion.div>

                        <h2 className="text-2xl font-bold mb-3 text-white">Drop Your Folder Here</h2>
                        <p className="text-white/60 mb-6 text-base">
                          Or click below to browse
                        </p>

                        <div className="flex justify-center">
                          <OrbButton
                            size="lg"
                            variant="primary"
                            onClick={isFileSystemAccessSupported() ? handleDirectoryPicker : () => fileInputRef.current?.click()}
                          >
                            <FolderOpen className="w-5 h-5 mr-2" />
                            Choose Directory
                          </OrbButton>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          // @ts-ignore
                          webkitdirectory=""
                          className="hidden"
                          onChange={handleInputChange}
                          aria-label="File upload input"
                        />

                        <div className="mt-4 text-xs text-white/40">
                          <p>Supports all file types • Privacy-first processing</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  key="selected-files"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard
                    glowColor="cyan"
                    intensity="strong"
                    hover={false}
                    className="relative overflow-hidden"
                  >
                    <div className="p-12 text-center">
                      {/* Animated background effect */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background:
                            'radial-gradient(circle at center, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />

                      <div className="relative z-10">
                        <div className="mb-4 inline-block">
                          <FolderOpen className="w-16 h-16 text-cosmic-cyan drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] mx-auto mb-2" />
                        </div>

                        <h2 className="text-2xl font-bold mb-3 text-cosmic-cyan">
                          Files Selected
                        </h2>
                        
                        <p className="text-white/80 mb-2 text-lg">
                          <span className="font-semibold">{directoryPath}</span>
                        </p>
                        <p className="text-white/60 mb-6 text-base">
                          {fileCount} {fileCount === 1 ? 'file' : 'files'} ready to organize
                        </p>

                        {/* Show first few files */}
                        <div className="mb-6 max-h-32 overflow-y-auto">
                          {selectedFiles.slice(0, 5).map((file, idx) => (
                            <div key={idx} className="text-sm text-white/60">
                              • {file.name}
                            </div>
                          ))}
                          {selectedFiles.length > 5 && (
                            <div className="text-sm text-white/50 mt-2">
                              ... and {selectedFiles.length - 5} more files
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                          <OrbButton
                            size="lg"
                            variant="primary"
                            onClick={handleOrganize}
                          >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Organize Now
                          </OrbButton>

                          <OrbButton
                            size="lg"
                            variant="secondary"
                            onClick={() => {
                              setSelectedFiles([])
                              setDirectoryPath('')
                              setFileCount(0)
                            }}
                          >
                            <X className="w-5 h-5 mr-2" />
                            Cancel
                          </OrbButton>
                        </div>

                        <div className="mt-4 text-xs text-white/40">
                          <p>Supports all file types • Privacy-first processing</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              {
                icon: '🧠',
                title: 'AI-Powered',
                desc: 'Advanced language models understand your files',
              },
              {
                icon: '🔒',
                title: 'Private & Secure',
                desc: 'Your data never leaves your control',
              },
              {
                icon: '⚡',
                title: 'Instant Results',
                desc: 'See your organized files in seconds',
              },
            ].map((feature, i) => (
              <GlassCard key={i} glowColor="cyan" className="p-4 text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="text-base font-semibold mb-1 text-white">{feature.title}</h3>
                <p className="text-xs text-white/60">{feature.desc}</p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic-void/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center max-w-md px-8">
              <motion.div
                className="relative w-32 h-32 mx-auto mb-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-32 h-32 text-cosmic-violet" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-full h-full rounded-full border-4 border-cosmic-cyan" />
                </motion.div>
              </motion.div>

              <motion.h2
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent"
                key={processingMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {processingMessage}
              </motion.h2>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mx-auto mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <p className="text-white/60 text-lg">
                {Math.round(progress)}% complete
              </p>

              {fileCount > 0 && (
                <p className="text-white/40 text-sm mt-2">
                  Processing {fileCount} files
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center mt-8">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-200 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleCancelProcessing}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-200 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
