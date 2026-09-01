import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeProvider'
import BackgroundParticles from '../components/BackgroundParticles'
import { getPattern, playHaptic, extractSensoryTags } from '../utils/haptics'

export default function StoryViewer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hapticSupported] = useState('vibrate' in navigator)

  useEffect(() => {
    if (!sessionStorage.getItem('kathaai_teacher')) {
      navigate('/teacher/login')
      return
    }

    fetch(`/api/stories/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setStory(data.story)
        if (data.story?.theme) {
          setTheme(data.story.theme)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleSpeak = () => {
    if (!story || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const cleanText = story.storyText.replace(/<[^>]+>/g, ' ')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const handleHaptic = async (type) => {
    await playHaptic(type, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <BackgroundParticles />
        <div className="relative z-10 text-center">
          <div className="text-5xl animate-bounce mb-4">📖</div>
          <p className="font-story text-lg" style={{ color: theme.text }}>
            Loading story...
          </p>
        </div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <BackgroundParticles />
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-story text-xl font-bold mb-2" style={{ color: theme.text }}>
            Story not found
          </h2>
          <button
            onClick={() => navigate('/teacher')}
            className="px-6 py-2 rounded-full font-story font-bold text-white transition-all btn-press"
            style={{ background: theme.gradient }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const tags = extractSensoryTags(story.storyText)
  const dominantTheme = story.theme || tags[0]?.type || 'default'
  const dominantPattern = getPattern(dominantTheme)

  return (
    <div className="min-h-screen relative">
      <BackgroundParticles />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/teacher')}
          className="flex items-center gap-1 text-sm font-semibold mb-6 transition-all hover:gap-2 btn-press"
          style={{ color: theme.primary }}
        >
          ← Back to Dashboard
        </button>

        {/* Story Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{dominantPattern?.icon || '📖'}</span>
          <div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: theme.primary }}
            >
              {dominantTheme.charAt(0).toUpperCase() + dominantTheme.slice(1)} Theme
            </span>
          </div>
        </div>

        {/* Story Content */}
        <div
          className="rounded-3xl p-6 sm:p-8 mb-6"
          style={{
            background: `${theme.surface}F0`,
            border: `2px solid ${theme.primary}20`,
          }}
        >
          <div
            className="font-playful text-lg leading-relaxed whitespace-pre-wrap"
            style={{ color: theme.text }}
          >
            {story.storyText}
          </div>
        </div>

        {/* Prompt */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{ background: `${theme.primary}08` }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: theme.textMuted }}>
            ORIGINAL PROMPT
          </p>
          <p className="font-playful italic" style={{ color: theme.text }}>
            "{story.prompt}"
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-story font-bold text-white transition-all btn-press disabled:opacity-50"
            style={{ background: theme.gradient }}
          >
            {isSpeaking ? (
              <>
                <span className="animate-pulse">🔊</span> Playing...
              </>
            ) : (
              <>🔊 Listen</>
            )}
          </button>
        </div>

        {/* Haptic Patterns */}
        {tags.length > 0 && (
          <div>
            <h3 className="font-story text-lg font-bold mb-3" style={{ color: theme.text }}>
              Haptic Patterns
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...new Set(tags.map((t) => t.type))].map((type) => {
                const p = getPattern(type)
                return (
                  <button
                    key={type}
                    onClick={() => handleHaptic(type)}
                    className="rounded-2xl p-3 text-center transition-all hover:scale-105 btn-press"
                    style={{
                      background: `${theme.primary}10`,
                      border: `1px solid ${theme.primary}20`,
                    }}
                  >
                    <div className="text-2xl mb-1">{p?.icon}</div>
                    <div className="font-story font-bold text-xs" style={{ color: theme.text }}>
                      {p?.name || type}
                    </div>
                    <div className="text-xs mt-1" style={{ color: theme.textMuted }}>
                      {p?.description}
                    </div>
                    {!hapticSupported && (
                      <div className="text-xs mt-1" style={{ color: theme.textMuted }}>
                        (visual only)
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="mt-6 text-center text-xs" style={{ color: theme.textMuted }}>
          Created {new Date(story.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  )
}
