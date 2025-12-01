import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { settings } = useStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!settings.particles) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create stars
    const stars: Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      opacity: number
      pulseSpeed: number
    }> = []

    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        opacity: Math.random(),
        pulseSpeed: 0.01 + Math.random() * 0.02,
      })
    }

    // Create nebula particles
    const nebulae: Array<{
      x: number
      y: number
      radius: number
      color: string
      opacity: number
      vx: number
      vy: number
    }> = []

    const nebulaColors = [
      'rgba(76, 29, 149, 0.05)',
      'rgba(30, 58, 138, 0.05)',
      'rgba(88, 28, 135, 0.05)',
      'rgba(15, 23, 42, 0.05)',
    ]

    for (let i = 0; i < 8; i++) {
      nebulae.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 200 + Math.random() * 300,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        opacity: 0.1 + Math.random() * 0.2,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
      })
    }

    let animationFrame: number

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw nebulae
      nebulae.forEach((nebula) => {
        nebula.x += nebula.vx
        nebula.y += nebula.vy

        if (nebula.x < -nebula.radius) nebula.x = canvas.width + nebula.radius
        if (nebula.x > canvas.width + nebula.radius) nebula.x = -nebula.radius
        if (nebula.y < -nebula.radius) nebula.y = canvas.height + nebula.radius
        if (nebula.y > canvas.height + nebula.radius) nebula.y = -nebula.radius

        const gradient = ctx.createRadialGradient(
          nebula.x,
          nebula.y,
          0,
          nebula.x,
          nebula.y,
          nebula.radius
        )
        gradient.addColorStop(0, nebula.color)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw stars
      stars.forEach((star) => {
        star.x += star.vx
        star.y += star.vy
        star.opacity += star.pulseSpeed
        if (star.opacity > 1 || star.opacity < 0) {
          star.pulseSpeed = -star.pulseSpeed
        }

        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrame)
    }
  }, [settings.particles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0f1a 100%)' }}
    />
  )
}
