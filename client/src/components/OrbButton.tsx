import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface OrbButtonProps {
  children: ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  className?: string
}

export function OrbButton({
  children,
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  className,
}: OrbButtonProps) {
  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-12 py-6 text-lg',
    xl: 'px-16 py-8 text-2xl',
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-[0_0_30px_rgba(99,102,241,0.8)] text-white font-bold border-2 border-indigo-400/50',
    secondary: 'glass-strong glow-cyan text-cyan-400 font-semibold border-2 border-cyan-400/50',
    ghost: 'border border-white/20 text-white hover:bg-white/10',
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded-full relative overflow-hidden',
        'transition-all duration-300',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
      />
      
      {/* Orbiting particles */}
      {variant === 'primary' && (
        <>
          <motion.div
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{ top: '20%', left: '50%' }}
            animate={{
              rotate: 360,
              x: [0, 30, 0, -30, 0],
              y: [0, -30, 0, 30, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
            style={{ top: '70%', left: '30%' }}
            animate={{
              rotate: -360,
              x: [0, -25, 0, 25, 0],
              y: [0, 25, 0, -25, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
