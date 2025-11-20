import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'violet' | 'cyan' | 'pink' | 'none'
  intensity?: 'normal' | 'strong'
  hover?: boolean
}

export function GlassCard({
  children,
  className,
  glowColor = 'violet',
  intensity = 'normal',
  hover = true,
}: GlassCardProps) {
  const glowClass = glowColor !== 'none' ? `glow-${glowColor}` : ''

  return (
    <motion.div
      className={clsx(
        'rounded-3xl',
        intensity === 'strong' ? 'glass-strong' : 'glass',
        glowClass,
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}
