import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeProvider'

export default function BackgroundParticles() {
  const { theme } = useTheme()
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const count = 15
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: theme.particles[i % theme.particles.length],
      left: Math.random() * 100,
      size: 16 + Math.random() * 24,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      color: theme.particleColors[i % theme.particleColors.length],
    }))
    setParticles(newParticles)
  }, [theme])

  return (
    <div className="bg-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            color: p.color,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
