import { createContext, useContext, useState, useCallback } from 'react'
import { getLanguage, LANGUAGE_INSTRUCTIONS } from '../utils/languages'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentStory, setCurrentStory] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [sensorTags, setSensorTags] = useState([])
  const [language, setLanguage] = useState('en-IN')

  const lang = getLanguage(language)

  const generateStory = useCallback(async (prompt) => {
    setIsGenerating(true)
    try {
      const langCode = language
      const langInstruction = LANGUAGE_INSTRUCTIONS[langCode] || ''
      const res = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language: langCode }),
      })
      const data = await res.json()
      if (data.story) {
        setCurrentStory(data.story)
        setTranscript(prompt)
        // Extract sensor tags
        const tags = []
        const tagRegex = /<(rain|thunder|spell|wind|fire|water|earth|light)(?::\d+(?:ms|s))?>/g
        let match
        while ((match = tagRegex.exec(data.story))) {
          tags.push({ type: match[1], duration: match[2] || 'default' })
        }
        setSensorTags(tags)
        return { story: data.story, tags }
      }
    } catch (err) {
      console.error('Story generation failed:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [language])

  const speakStory = useCallback((text, onEnd) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      // Set voice language based on selected language
      const langCode = language
      utterance.lang = langCode
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        if (onEnd) onEnd()
      }
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }, [language])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return (
    <AppContext.Provider value={{
      currentStory,
      transcript,
      isGenerating,
      isSpeaking,
      sensorTags,
      language,
      setLanguage,
      lang,
      generateStory,
      speakStory,
      stopSpeaking,
      setCurrentStory,
      setTranscript,
      setSensorTags,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
