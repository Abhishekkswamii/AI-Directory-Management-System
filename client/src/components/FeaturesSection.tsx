import { Brain, Sparkles, Lock, RotateCcw, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard'

interface FeaturesSectionProps {
  onCTAClick: () => void
}

export function FeaturesSection({ onCTAClick }: FeaturesSectionProps) {
  const features = [
    {
      icon: Brain,
      title: 'Truly Understands Your Files',
      description: 'Reads PDFs, Word, images (OCR), code, notes — not just file names.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'One-Click Magic Organization',
      description: 'Creates perfect folders like Finance → Taxes → 2025, Photos → Travel → Japan 2024 — never "Misc".',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Lock,
      title: '100% Private & Offline-First',
      description: 'Works with local Ollama. Your files never leave your computer.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: RotateCcw,
      title: 'Instant Undo Forever',
      description: 'Changed your mind? Undo any organization in one click.',
      color: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-8 py-24">
      {/* Background gradient orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 max-w-7xl w-full">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Why People </span>
            {/* <span className="inline-block"></span> */}
            <span className="text-white"> Are Switching to Lumina</span>
            {/* <span className="bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent">
              Lumina
            </span> */}
          </h2>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard
                glowColor="violet"
                className="p-6 h-full hover:scale-105 transition-transform duration-300"
              >
                <div className="flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div className={`mb-4 p-4 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-20`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <blockquote className="text-2xl md:text-3xl font-light text-white/90 italic mb-4">
            "Finally… an app that organizes my Downloads folder better than I ever could."
          </blockquote>
          <p className="text-white/60 text-lg">– 47k+ users</p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={onCTAClick}
            className="group relative px-8 py-4 bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink rounded-full font-semibold text-lg text-white shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cosmic-pink via-cosmic-violet to-cosmic-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            />

            <span className="relative flex items-center gap-2">
              Start Organizing Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
