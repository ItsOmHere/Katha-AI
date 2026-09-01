import { useEffect, useRef } from 'react'

/**
 * Hook to trigger haptic feedback based on sensor tags in a story
 * Syncs with TTS playback
 */
export function useHapticSync(sensorTags, isSpeaking, stopSpeaking) {
  const timeoutsRef = useRef([])
  const isSupported = 'vibrate' in navigator

  const clearAll = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
    if (isSupported) navigator.vibrate(0)
  }

  useEffect(() => {
    if (!isSpeaking || !sensorTags.length) {
      clearAll()
      return
    }

    let elapsed = 0
    sensorTags.forEach((tag) => {
      const type = tag.type
      const duration = tag.duration || 1000
      const pattern = getPattern(type)
      if (!pattern) return

      // Schedule haptic at the right time
      const triggerAt = elapsed
      const timeout = setTimeout(() => {
        if (isSupported) {
          const seq = pattern.sequence
          const vibrationArray = []
          let seqElapsed = 0
          for (const [dur, amp] of seq) {
            if (seqElapsed >= duration) break
            vibrationArray.push(dur, amp)
            seqElapsed += dur
          }
          navigator.vibrate(vibrationArray)
        }
      }, triggerAt)

      timeoutsRef.current.push(timeout)
      elapsed += duration
    })

    return clearAll
  }, [isSpeaking, sensorTags])

  return isSupported
}

function getPattern(type) {
  const patterns = {
    rain: { sequence: [[6,128],[4,0],[6,128],[4,0],[6,160],[4,0],[6,128],[4,0],[6,192],[4,0],[6,128],[4,0],[6,160],[4,0],[6,128],[4,0]] },
    thunder: { sequence: [[200,255],[50,220],[50,180],[50,140],[50,100],[50,70],[50,48],[50,32],[50,20],[100,10]] },
    spell: { sequence: [[60,60],[60,80],[60,100],[60,120],[60,140],[60,160],[60,180],[60,160],[60,140],[60,120],[60,100],[60,80]] },
    wind: { sequence: [[40,100],[30,140],[40,180],[30,140],[40,100],[30,60],[40,100],[30,140],[40,180],[30,140],[40,100]] },
    fire: { sequence: [[30,200],[20,0],[30,220],[20,0],[30,180],[20,0],[40,255],[20,0],[30,200],[20,0],[30,220],[20,0]] },
    water: { sequence: [[100,50],[100,100],[100,150],[100,100],[100,50],[100,0],[100,50],[100,100],[100,150],[100,100]] },
    earth: { sequence: [[150,180],[100,0],[150,200],[100,0],[150,180],[100,0],[150,200]] },
    light: { sequence: [[200,80],[100,120],[200,80],[100,0],[200,100],[100,140],[200,80]] },
  }
  return patterns[type] || null
}
