import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeProvider'

/**
 * Animated gradient background that shifts colors based on the current theme
 */
export default function AnimatedBackground() {
  const { theme } = useTheme()
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let frame
    const animate = () => {
      setOffset((prev) => (prev + 0.1) % 100)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-1000"
      style={{
        background: `
          radial-gradient(ellipse at ${offset}% ${50 + Math.sin(offset * 0.02) * 20}%, ${theme.primary}15 0%, transparent 50%),
          radial-gradient(ellipse at ${100 - offset}% ${60 + Math.cos(offset * 0.015) * 15}%, ${theme.secondary}10 0%, transparent 40%),
          ${theme.gradientSoft}
        `,
      }}
      aria-hidden="true"
    />
  )
}
