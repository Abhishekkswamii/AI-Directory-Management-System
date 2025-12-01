import { motion } from 'framer-motion'
import { Home, Upload, FolderOpen, Search, Settings } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import clsx from 'clsx'

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Upload, label: 'Upload', path: '/workspace' },
  { icon: FolderOpen, label: 'Collections', path: '/collections' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function OrbitalMenu() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={clsx(
                'relative w-14 h-14 rounded-full glass-strong',
                'flex items-center justify-center group',
                'transition-all duration-300',
                isActive ? 'glow-violet scale-110' : 'glow-cyan'
              )}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                className={clsx(
                  'w-6 h-6 transition-all duration-300',
                  isActive 
                    ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)] brightness-150' 
                    : 'text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                )}
              />

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-4 py-2 rounded-full glass-strong whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>

              {/* Orbital ring */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cosmic-violet"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
