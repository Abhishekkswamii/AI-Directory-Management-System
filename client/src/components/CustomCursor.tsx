import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>()
  const { settings } = useStore()

  useEffect(() => {
    if (!settings.cursorTrail) return

    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // Smooth cursor follow
      currentX += (mouseX - currentX) * 0.15
      currentY += (mouseY - currentY) * 0.15

      if (cursor) {
        cursor.style.transform = `translate(${currentX}px, ${currentY}px)`
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [settings.cursorTrail])

  if (!settings.cursorTrail) return null

  return (
    <div
      ref={cursorRef}
      className="cursor-trail pointer-events-none fixed z-[9999] mix-blend-screen"
      style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(34, 211, 238, 0.3) 50%, transparent 70%)',
        filter: 'blur(8px)',
      }}
    />
  )
}
