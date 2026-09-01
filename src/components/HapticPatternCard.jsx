import { useState, useEffect, useRef } from 'react'
import { playHaptic, getPattern } from '../utils/haptics'

export default function HapticPatternCard({ type, isActive, onPlay }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)
  const pattern = getPattern(type)

  useEffect(() => {
    if (isActive && onPlay) {
      onPlay(type)
    }
  }, [isActive, type, onPlay])

  const handlePlay = async () => {
    if (!pattern) return
    setIsPlaying(true)
    const supported = await playHaptic(type, 2000)

    // Animate bars
    let step = 0
    intervalRef.current = setInterval(() => {
      step++
      if (step >= pattern.sequence.length) {
        clearInterval(intervalRef.current)
        setIsPlaying(false)
      }
    }, 100)

    if (!supported) {
      setTimeout(() => setIsPlaying(false), 2000)
    }
  }

  if (!pattern) return null

  const barCount = pattern.sequence.length
  const maxAmp = Math.max(...pattern.sequence.map(([, a]) => a))

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-300 cursor-pointer ${
        isActive ? 'ring-2 ring-offset-2 scale-105' : 'hover:scale-102'
      }`}
      style={isActive ? { ringColor: pattern.css === 'staccato' ? '#0284C7' : '#7C3AED' } : {}}
      onClick={handlePlay}
      role="button"
      aria-label={`Play ${pattern.name} haptic pattern`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{pattern.icon}</span>
        <div>
          <p className="font-story font-bold text-sm" style={{ color: 'var(--theme-text)' }}>
            {pattern.name}
          </p>
          <p className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
            {pattern.description}
          </p>
        </div>
        {isActive && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold text-white animate-pulse"
            style={{ background: 'var(--theme-primary)' }}>
            NOW
          </span>
        )}
      </div>

      {/* Visual pattern bars */}
      <div className="flex items-end gap-0.5 h-12">
        {pattern.sequence.map(([dur, amp], i) => (
          <div
            key={i}
            className="haptic-bar rounded-sm flex-1 transition-all"
            style={{
              height: `${(amp / maxAmp) * 100}%`,
              background: `var(--theme-primary)`,
              opacity: isPlaying ? (i <= (step || 0) ? 1 : 0.3) : 0.6,
              animationDelay: `${i * 0.05}s`,
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
            title={`${dur}ms @ ${amp}`}
          />
        ))}
      </div>
    </div>
  )
}
