import { motion } from 'framer-motion'
import { Cpu, Database, Sparkles } from 'lucide-react'
import { OrbitalMenu } from '../components/OrbitalMenu'
import { GlassCard } from '../components/GlassCard'
import { useStore } from '../store/useStore'
import clsx from 'clsx'

export function SettingsPage() {
  const { settings, toggleSetting } = useStore()

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Model Provider</label>
                  <select className="w-full bg-white/5 border-2 border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cosmic-violet focus:shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    <option>OpenAI GPT-4o</option>
                    <option>Ollama (Local)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">API Key</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    className="w-full bg-white/5 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cosmic-violet focus:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  />
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
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Save History</span>
                  <Toggle
                    active={settings.saveHistory}
                    onToggle={() => toggleSetting('saveHistory')}
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
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Particle Effects</span>
                  <Toggle
                    active={settings.particles}
                    onToggle={() => toggleSetting('particles')}
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
