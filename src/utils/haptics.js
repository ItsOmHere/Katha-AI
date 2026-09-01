/**
 * Haptic pattern definitions synced to KathaAI sensory markers
 * Each pattern is a sequence of [duration_ms, amplitude_0-255]
 */

const HAPTIC_PATTERNS = {
  rain: {
    name: 'Rain',
    icon: '🌧️',
    description: 'Light tapping like raindrops',
    sequence: [
      [6, 128], [4, 0], [6, 128], [4, 0],
      [6, 160], [4, 0], [6, 128], [4, 0],
      [6, 192], [4, 0], [6, 128], [4, 0],
      [6, 160], [4, 0], [6, 128], [4, 0],
    ],
    css: 'staccato',
  },
  thunder: {
    name: 'Thunder',
    icon: '⚡',
    description: 'Deep rumbling that fades',
    sequence: [
      [200, 255], [50, 220], [50, 180], [50, 140],
      [50, 100], [50, 70], [50, 48], [50, 32],
      [50, 20], [100, 10],
    ],
    css: 'rumble',
  },
  spell: {
    name: 'Spell',
    icon: '✨',
    description: 'Rising magic energy sweep',
    sequence: [
      [60, 60], [60, 80], [60, 100], [60, 120],
      [60, 140], [60, 160], [60, 180], [60, 160],
      [60, 140], [60, 120], [60, 100], [60, 80],
    ],
    css: 'sweep',
  },
  wind: {
    name: 'Wind',
    icon: '🌿',
    description: 'Smooth whooshing motion',
    sequence: [
      [40, 100], [30, 140], [40, 180], [30, 140],
      [40, 100], [30, 60], [40, 100], [30, 140],
      [40, 180], [30, 140], [40, 100],
    ],
    css: 'oscillate',
  },
  fire: {
    name: 'Fire',
    icon: '🔥',
    description: 'Rapid crackling bursts',
    sequence: [
      [30, 200], [20, 0], [30, 220], [20, 0],
      [30, 180], [20, 0], [40, 255], [20, 0],
      [30, 200], [20, 0], [30, 220], [20, 0],
    ],
    css: 'crackle',
  },
  water: {
    name: 'Water',
    icon: '🌊',
    description: 'Smooth wave-like pulse',
    sequence: [
      [100, 50], [100, 100], [100, 150], [100, 100],
      [100, 50], [100, 0], [100, 50], [100, 100],
      [100, 150], [100, 100],
    ],
    css: 'wave',
  },
  earth: {
    name: 'Earth',
    icon: '🌍',
    description: 'Steady grounded thud',
    sequence: [
      [150, 180], [100, 0], [150, 200], [100, 0],
      [150, 180], [100, 0], [150, 200],
    ],
    css: 'thud',
  },
  light: {
    name: 'Light',
    icon: '☀️',
    description: 'Gentle warm glow pulse',
    sequence: [
      [200, 80], [100, 120], [200, 80], [100, 0],
      [200, 100], [100, 140], [200, 80],
    ],
    css: 'glow',
  },
}

/**
 * Play a haptic pattern using the Web Vibration API
 * Falls back to visual-only on unsupported devices
 */
export async function playHaptic(type, durationMs = null) {
  const pattern = HAPTIC_PATTERNS[type]
  if (!pattern) return false

  if ('vibrate' in navigator) {
    const seq = pattern.sequence
    const totalDuration = seq.reduce((sum, [d]) => sum + d, 0)
    const effectiveDuration = durationMs ? Math.min(durationMs, totalDuration) : totalDuration
    const vibrationArray = []
    let elapsed = 0
    for (const [dur, amp] of seq) {
      if (elapsed >= effectiveDuration) break
      vibrationArray.push(dur, amp)
      elapsed += dur
    }
    navigator.vibrate(vibrationArray)
    return true
  }
  return false
}

/**
 * Get the CSS class for a haptic pattern's animation
 */
export function getHapticClass(type) {
  return HAPTIC_PATTERNS[type]?.css || 'staccato'
}

/**
 * Get pattern metadata
 */
export function getPattern(type) {
  return HAPTIC_PATTERNS[type] || null
}

/**
 * List all available patterns
 */
export function getAllPatterns() {
  return HAPTIC_PATTERNS
}

/**
 * Extract sensor tags from story text
 */
export function extractSensoryTags(text) {
  if (!text) return []
  const tags = []
  const regex = /<(rain|thunder|spell|wind|fire|water|earth|light)(?::(\d+(?:ms|s)))?>/g
  let match
  while ((match = regex.exec(text)) !== null) {
    const durationStr = match[2]
    let duration = null
    if (durationStr) {
      if (durationStr.endsWith('ms')) duration = parseInt(durationStr)
      else if (durationStr.endsWith('s')) duration = parseInt(durationStr) * 1000
    }
    tags.push({ type: match[1], duration })
  }
  return tags
}

/**
 * Detect dominant theme from story text
 */
export function detectDominantTheme(text) {
  if (!text) return 'default'
  const counts = {}
  const regex = /<(rain|thunder|spell|wind|fire|water|earth|light)>/g
  let match
  while ((match = regex.exec(text)) !== null) {
    counts[match[1]] = (counts[match[1]] || 0) + 1
  }
  let maxCount = 0
  let dominant = 'default'
  for (const [type, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count
      dominant = type
    }
  }
  return dominant
}
