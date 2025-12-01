import { useState } from 'react'
import { motion } from 'framer-motion'

declare global {
  interface Window {
    electron?: {
      windowMinimize: () => void
      windowMaximize: () => void
      windowClose: () => void
      platform: string
    }
  }
}

export const WindowControls = () => {
  const [isMaximized, setIsMaximized] = useState(false)

  const handleMinimize = () => {
    window.electron?.windowMinimize()
  }

  const handleMaximize = () => {
    window.electron?.windowMaximize()
    setIsMaximized(!isMaximized)
  }

  const handleClose = () => {
    window.electron?.windowClose()
  }

  // Don't show on web version
  if (!window.electron) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2">
      {/* Minimize Button */}
      <motion.button
        onClick={handleMinimize}
        className="group relative w-10 h-10 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Gradient glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon */}
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white/80 group-hover:text-cyan-300 transition-colors duration-300"
          >
            <line
              x1="3"
              y1="8"
              x2="13"
              y2="8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
      </motion.button>

      {/* Maximize/Restore Button */}
      <motion.button
        onClick={handleMaximize}
        className="group relative w-10 h-10 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Gradient glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon */}
        <div className="relative w-full h-full flex items-center justify-center">
          {isMaximized ? (
            // Restore icon (two overlapping squares)
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white/80 group-hover:text-purple-300 transition-colors duration-300"
            >
              <rect
                x="5"
                y="5"
                width="8"
                height="8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 3H9V4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.5 9H11V3H5V3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            // Maximize icon (single square)
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white/80 group-hover:text-purple-300 transition-colors duration-300"
            >
              <rect
                x="4"
                y="4"
                width="8"
                height="8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
      </motion.button>

      {/* Close Button */}
      <motion.button
        onClick={handleClose}
        className="group relative w-10 h-10 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Red gradient glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon */}
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white/80 group-hover:text-red-400 transition-colors duration-300"
          >
            <line
              x1="4"
              y1="4"
              x2="12"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="4"
              x2="4"
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Outer glow - red for close button */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
      </motion.button>
    </div>
  )
}
