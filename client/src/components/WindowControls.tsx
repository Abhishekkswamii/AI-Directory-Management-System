import { useState } from 'react'


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

  const isMac = window.electron.platform === 'darwin'

  return (
    <>
      {/* Draggable Title Bar Area */}
      <div
        className="fixed top-0 left-0 w-full h-8 z-[9998]"
        style={{ WebkitAppRegion: 'drag' } as any}
      />

      {isMac ? (
        <div className="fixed top-4 left-4 z-[9999] flex items-center gap-2 group/controls">
          {/* Close Button (Red) */}
          <button
            onClick={handleClose}
            className="group relative w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center overflow-hidden transition-all duration-200"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <svg
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-0 group-hover:opacity-100 group-hover/controls:opacity-100 text-[#4D0000] transition-opacity duration-200"
            >
              <path
                d="M1 1L5 5M5 1L1 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Minimize Button (Yellow) */}
          <button
            onClick={handleMinimize}
            className="group relative w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center overflow-hidden transition-all duration-200"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <svg
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-0 group-hover:opacity-100 group-hover/controls:opacity-100 text-[#995700] transition-opacity duration-200"
            >
              <path
                d="M1 3H5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Maximize Button (Green) */}
          <button
            onClick={handleMaximize}
            className="group relative w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center overflow-hidden transition-all duration-200"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <svg
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-0 group-hover:opacity-100 group-hover/controls:opacity-100 text-[#006500] transition-opacity duration-200"
            >
              {isMaximized ? (
                <path
                  d="M1 3L3 1L5 3M1 3V5H5V3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M1 1L5 5M1 5L5 1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className="rotate-45 origin-center"
                />
              )}
              <path
                d="M1.5 1.5L4.5 4.5M4.5 1.5L1.5 4.5"
                stroke="none"
              />
              <path d="M1 1H5V5H1V1Z" stroke="none" />
              {/* Simple arrows for maximize/restore to keep it clean at small size */}
              <path
                d="M1.5 2V4.5H4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isMaximized ? "opacity-100" : "opacity-0"}
              />
              <path
                d="M4.5 4V1.5H2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={!isMaximized ? "opacity-100" : "opacity-0"}
              />
            </svg>
          </button>
        </div>
      ) : (
        // Windows/Linux Controls
        <div className="fixed top-0 right-0 z-[9999] flex items-center h-8">
          {/* Minimize */}
          <button
            onClick={handleMinimize}
            className="h-full w-12 flex items-center justify-center hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            title="Minimize"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5H9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>

          {/* Maximize/Restore */}
          <button
            onClick={handleMaximize}
            className="h-full w-12 flex items-center justify-center hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            title={isMaximized ? "Restore" : "Maximize"}
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              {isMaximized ? (
                <>
                  <rect x="3" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1" fill="none" />
                  <path d="M1 3V9H7" stroke="currentColor" strokeWidth="1" fill="none" />
                </>
              ) : (
                <rect x="1.5" y="1.5" width="7" height="7" stroke="currentColor" strokeWidth="1" fill="none" />
              )}
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={handleClose}
            className="h-full w-12 flex items-center justify-center hover:bg-[#E81123] hover:text-white transition-colors text-white/80"
            title="Close"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
