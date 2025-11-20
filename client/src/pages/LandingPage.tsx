import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { OrbButton } from '../components/OrbButton'
import { FeaturesSection } from '../components/FeaturesSection'
import { Sparkles, ChevronDown } from 'lucide-react'
import { useRef } from 'react'

export function LandingPage() {
  const navigate = useNavigate()
  const featuresRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToTop = () => {
    heroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <div ref={heroRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
          {/* Logo/Brand */}
          <motion.div
            className="mb-8 relative"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <motion.div
              className="text-8xl font-black bg-gradient-to-r from-cosmic-violet via-cosmic-cyan to-cosmic-pink bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              LUMINA
            </motion.div>
            
            {/* Floating particles around logo */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI * 2) / 6) * 120],
                  y: [0, Math.sin((i * Math.PI * 2) / 6) * 120],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="max-w-3xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Drop a folder anywhere.</span>
              <br />
              <span className="bg-gradient-to-r from-cosmic-cyan via-cosmic-violet to-cosmic-pink bg-clip-text text-transparent text-glow">
                Watch AI create order from chaos.
              </span>
            </h1>
            
            <motion.p
              className="text-xl text-white/70 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              The final evolution of personal computing. AI that understands every document, photo, 
              code file, invoice, note — then reorganizes everything into perfect harmony.
            </motion.p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="relative"
          >
            {/* Pulsing ring behind button */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            
            <OrbButton
              size="xl"
              variant="primary"
              onClick={() => navigate('/workspace')}
              className="relative z-10"
            >
              <span className="flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                <span>Begin</span>
              </span>
            </OrbButton>
          </motion.div>

          {/* Feature hints */}
          <motion.div
            className="mt-16 flex gap-8 text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cosmic-violet animate-pulse" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cosmic-cyan animate-pulse" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cosmic-pink animate-pulse" />
              <span>Instant Results</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator with click handler */}
        <motion.button
          onClick={scrollToFeatures}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative">
            {/* Glowing background */}
            <motion.div
              className="absolute inset-0 rounded-full bg-cosmic-violet/30 blur-xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Arrow icon */}
            <div className="relative w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm group-hover:border-cosmic-violet group-hover:bg-cosmic-violet/20 transition-all duration-300">
              <ChevronDown className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* Features Section */}
      <div ref={featuresRef}>
        <FeaturesSection onCTAClick={scrollToTop} />
      </div>
    </div>
  )
}
