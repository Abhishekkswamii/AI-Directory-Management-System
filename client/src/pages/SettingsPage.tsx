import { motion } from 'framer-motion'
import { Cpu, Database, Sparkles } from 'lucide-react'
import { OrbitalMenu } from '../components/OrbitalMenu'
import { GlassCard } from '../components/GlassCard'
import { useStore } from '../store/useStore'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

export function SettingsPage() {
  const { settings, toggleSetting } = useStore()
  const [aiProvider, setAiProvider] = useState<'ollama' | 'gemini'>('ollama')
  const [hasGeminiKey, setHasGeminiKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    // Load settings from backend
    fetch('http://localhost:8001/api/settings')
      .then(res => res.json())
      .then(data => {
        console.log('[Settings] Loaded from backend:', data)
        setAiProvider(data.ai_provider || 'ollama')
        const hasKey = data.gemini_api_key && data.gemini_api_key !== '' && data.gemini_api_key !== 'null'
        console.log('[Settings] Gemini API Key status:', { raw: data.gemini_api_key, hasKey })
        setHasGeminiKey(hasKey)
      })
      .catch(err => console.error('Failed to load settings:', err))
  }, [])

  const saveAiSettings = async (newProvider: 'ollama' | 'gemini') => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const response = await fetch('http://localhost:8001/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ai_provider: newProvider
        })
      })

      if (response.ok) {
        setAiProvider(newProvider)
        setSaveMessage('✅ AI provider switched successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('❌ Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveMessage('❌ Error saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleProviderChange = (newProvider: 'ollama' | 'gemini') => {
    if (newProvider === 'gemini' && !hasGeminiKey) {
      setSaveMessage('⚠️ Please configure GEMINI_API_KEY in server/.env file first')
      setTimeout(() => setSaveMessage(''), 4000)
      return
    }
    saveAiSettings(newProvider)
  }

  const Toggle = ({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) => (
    <button
      onClick={onToggle}
      aria-label={label}
      className={clsx(
        'w-12 h-6 rounded-full relative transition-colors duration-300 border-2',
        active ? 'bg-cosmic-violet border-cosmic-violet shadow-[0_0_15px_rgba(99,102,241,0.8)]' : 'bg-white/10 border-white/30'
      )}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        animate={{ left: active ? 'calc(100% - 1.25rem)' : '0.25rem' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )

  return (
    <div className="relative w-full min-h-screen">
      <OrbitalMenu />

      <div className="container mx-auto px-8 py-16 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-xl text-white/70">Configure LUMINA to your preferences</p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard glowColor="violet" className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-6 h-6 text-cosmic-violet drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                <h2 className="text-2xl font-bold text-white">AI Engine</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-white/90">Model Provider</label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => handleProviderChange('ollama')}
                      disabled={isSaving}
                      className={clsx(
                        'p-4 rounded-xl border-2 transition-all duration-300',
                        aiProvider === 'ollama'
                          ? 'bg-cosmic-violet/20 border-cosmic-violet shadow-[0_0_20px_rgba(99,102,241,0.6)]'
                          : 'bg-white/5 border-white/20 hover:border-white/40',
                        isSaving && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={clsx(
                          'w-3 h-3 rounded-full',
                          aiProvider === 'ollama' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-gray-500'
                        )} />
                        <span className="font-bold text-white">Ollama</span>
                      </div>
                      <p className="text-xs text-white/60 text-left">
                        Local AI - Free & Private
                      </p>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleProviderChange('gemini')}
                      disabled={isSaving}
                      className={clsx(
                        'p-4 rounded-xl border-2 transition-all duration-300',
                        aiProvider === 'gemini'
                          ? 'bg-cosmic-cyan/20 border-cosmic-cyan shadow-[0_0_20px_rgba(34,211,238,0.6)]'
                          : 'bg-white/5 border-white/20 hover:border-white/40',
                        isSaving && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={clsx(
                          'w-3 h-3 rounded-full',
                          aiProvider === 'gemini' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-gray-500'
                        )} />
                        <span className="font-bold text-white">Gemini</span>
                      </div>
                      <p className="text-xs text-white/60 text-left">
                        Google AI - Cloud Based
                      </p>
                    </button>
                  </div>

                  <div className="bg-white/5 border-2 border-white/20 rounded-xl p-4">
                    {aiProvider === 'ollama' ? (
                      <>
                        <p className="text-sm text-white/70 mb-2">
                          <strong>Status:</strong> Running locally on your machine
                        </p>
                        <p className="text-xs text-white/50">
                          Maximum privacy, zero cost, no internet required
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-white/70 mb-2">
                          <strong>Status:</strong> {hasGeminiKey ? 'API Key Configured ✓' : 'API Key Not Found'}
                        </p>
                        <p className="text-xs text-white/50">
                          {hasGeminiKey 
                            ? 'Using Google Gemini AI for file processing'
                            : 'Configure GEMINI_API_KEY in server/.env file'}
                        </p>
                        {!hasGeminiKey && (
                          <p className="mt-2 text-xs text-white/50">
                            Get your API key from{' '}
                            <a
                              href="https://makersuite.google.com/app/apikey"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cosmic-cyan hover:underline"
                            >
                              Google AI Studio
                            </a>
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {saveMessage && (
                    <p className={clsx(
                      'text-sm text-center mt-3',
                      saveMessage.startsWith('✅') ? 'text-green-400' : 
                      saveMessage.startsWith('⚠️') ? 'text-yellow-400' : 'text-red-400'
                    )}>
                      {saveMessage}
                    </p>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard glowColor="cyan" className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-cosmic-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <h2 className="text-2xl font-bold text-white">Storage</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Client-side Processing</span>
                  <Toggle
                    active={settings.clientSideProcessing}
                    onToggle={() => toggleSetting('clientSideProcessing')}
                    label="Toggle client-side processing"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Save History</span>
                  <Toggle
                    active={settings.saveHistory}
                    onToggle={() => toggleSetting('saveHistory')}
                    label="Toggle save history"
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard glowColor="pink" className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-cosmic-pink drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                <h2 className="text-2xl font-bold text-white">Appearance</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Cosmic Cursor Trail</span>
                  <Toggle
                    active={settings.cursorTrail}
                    onToggle={() => toggleSetting('cursorTrail')}
                    label="Toggle cosmic cursor trail"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Particle Effects</span>
                  <Toggle
                    active={settings.particles}
                    onToggle={() => toggleSetting('particles')}
                    label="Toggle particle effects"
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
