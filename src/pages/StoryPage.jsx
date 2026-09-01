import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeProvider'
import { detectDominantTheme, extractSensoryTags, playHaptic, getPattern } from '../utils/haptics'
import { LANGUAGES, getLanguage } from '../utils/languages'
import BackgroundParticles from '../components/BackgroundParticles'
import MicrophoneButton from '../components/MicrophoneButton'
import LoadingSpinner from '../components/LoadingSpinner'
import HapticPatternCard from '../components/HapticPatternCard'

export default function StoryPage() {
  const navigate = useNavigate()
  const {
    currentStory, transcript, isGenerating, generateStory,
    speakStory, isSpeaking, sensorTags, language, setLanguage, lang,
  } = useApp()
  const { theme, setTheme } = useTheme()
  const [input, setInput] = useState('')
  const [currentPattern, setCurrentPattern] = useState(null)
  const [hapticSupported, setHapticSupported] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const storyRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setHapticSupported('vibrate' in navigator)
  }, [])

  // Detect theme from story
  useEffect(() => {
    if (currentStory) {
      const detected = detectDominantTheme(currentStory)
      setTheme(detected)
    }
  }, [currentStory])

  // Auto-scroll to story
  useEffect(() => {
    if (currentStory && storyRef.current) {
      storyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentStory])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowLangDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return
    await generateStory(input.trim())
  }

  const handleMicResult = (text) => {
    setInput(text)
  }

  const handleSpeak = () => {
    if (!currentStory) return
    const cleanText = currentStory.replace(/<[^>]+>/g, ' ')
    speakStory(cleanText)
  }

  const handleHapticPlay = async (type) => {
    await playHaptic(type, 2000)
    setCurrentPattern(type)
    setTimeout(() => setCurrentPattern(null), 2500)
  }

  const handleSave = async () => {
    if (!currentStory) return
    try {
      await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: transcript,
          storyText: currentStory,
          sensorTags: sensorTags,
          theme: detectDominantTheme(currentStory),
          language: language,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }

  const handleNewStory = () => {
    navigate('/story')
    window.scrollTo(0, 0)
  }

  const currentLang = getLanguage(language)

  // Idea suggestions in current language
  const ideaSuggestions = {
    'hi-IN': ['एक वीर कुंवार', 'बात करने वाला पेड़', 'एक समुंदरी शहर', 'एक तारा जो गिर गया'],
    'mr-IN': ['एक धाडसी कुंवार', 'बोलणार झाड', 'एक समुद्री शहर', 'एक तारा जो गेल'],
    'bn-IN': ['এক বীর রাজকুমার', 'কথা বলা গাছ', 'এক সমুদ্র শহর', 'এক তারা যে পড়েছিল'],
    'ta-IN': ['ஒரு வீர குمار', 'பேசும் மரம்', 'ஒரு கடல் நகரம்', 'ஒரு நட்சத்திரம் விழுந்தது'],
    'te-IN': ['ఒక వీర కుమారుడు', 'మాట్లాడే చెట్టు', 'ఒక సముద్ర నగరం', 'ఒక నక్షత్రం పడిపోయింది'],
    'kn-IN': ['ಒಂದು ವೀರ ಕುಮಾರ', 'ಮಾತನಾಡುವ ಮರ', 'ಒಂದು ಸಮುದ್ರ ನಗರ', 'ಒಂದು ನಕ್ಷತ್ರ ಬಿದ್ದಿತು'],
    'ml-IN': ['ഒരു വീര കുമാരൻ', 'സാഷാടുന്ന മരം', 'ഒരു കടൽ നഗരം', 'ഒരു നക്ഷത്രം വീണു'],
    'gu-IN': ['એક વીર કુમાર', 'બોલતો વૃક્ષ', 'એક સમુદ્ર શહેર', 'એક તારો ઊઠ્યો'],
    'pa-IN': ['ਇੱਕ ਵੀਰ ਕੁਮਾਰ', 'ਬੋਲਣ ਵਾਲਾ ਰੁੱਖ', 'ਇੱਕ ਸਮੁੰਦਰੀ ਸ਼ਹਿਰ', 'ਇੱਕ ਤਾਰਾ ਡਿੱਗ ਪਿਆ'],
    'or-IN': ['ଏକ ବୀର କୁମାର', 'ବକ୍ତା ଗଛ', 'ଏକ ସମୁଦ୍ର ନଗର', 'ଏକ ତାରା ପଡିଗଲା'],
    'ur-IN': ['ایک بہادر کمار', 'بولنے والا درخت', 'ایک سمندر کا شہر', 'ایک ستارہ گر گیا'],
    'as-IN': ['এজন ব্যাপীৰ ৰাজকুমাৰ', 'কথಾ কোৱা গছ', 'এটা সমুদ্ৰী নগৰ', 'এটা তৰা পৰি গল'],
    'ma-IN': ['एगो वीर कुमार', 'बोलले वाला बरखंड', 'एगो समुद्री नगरी', 'एगो तारा गिरि गेल'],
    'en-IN': ['A brave knight', 'A talking tree', 'An underwater city', 'A star that fell'],
  }
  const suggestions = ideaSuggestions[language] || ideaSuggestions['en-IN']

  return (
    <div className="min-h-screen relative">
      <BackgroundParticles />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-24">
        {/* Input Section */}
        {!currentStory && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <h1
                className="font-story text-4xl sm:text-5xl font-bold mb-3"
                style={{ color: theme.text }}
              >
                {currentLang.helloPrompt}
              </h1>
              <p className="text-lg" style={{ color: theme.textMuted }}>
                {currentLang.helloSub}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mb-6">
              <div
                className="rounded-2xl p-2 flex items-center gap-2"
                style={{
                  background: `${theme.surface}EE`,
                  border: `2px solid ${theme.primary}30`,
                  boxShadow: `0 4px 20px ${theme.primary}10`,
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={currentLang.placeholder}
                  className="flex-1 px-4 py-3 bg-transparent text-lg outline-none font-playful"
                  style={{ color: theme.text }}
                  disabled={isGenerating}
                  aria-label="Story prompt"
                  dir={language === 'ur-IN' || language === 'hi-IN' || language === 'mr-IN' || language === 'bn-IN' || language === 'ta-IN' || language === 'te-IN' || language === 'kn-IN' || language === 'ml-IN' || language === 'gu-IN' || language === 'pa-IN' || language === 'or-IN' || language === 'as-IN' || language === 'ma-IN' ? 'ltr' : 'ltr'}
                />
                {/* Language Selector */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all btn-press hover:scale-105"
                    style={{
                      background: `${theme.primary}15`,
                      color: theme.primary,
                      border: `1px solid ${theme.primary}30`,
                    }}
                    aria-label="Select language"
                    aria-expanded={showLangDropdown}
                  >
                    <span>🌐</span>
                    <span className="hidden sm:inline">{currentLang.nativeName}</span>
                    <span className="text-xs">▼</span>
                  </button>
                  {showLangDropdown && (
                    <div
                      className="absolute right-0 top-full mt-2 rounded-xl shadow-xl z-50 overflow-hidden"
                      style={{
                        background: `${theme.surface}F5`,
                        border: `1px solid ${theme.primary}20`,
                        minWidth: '180px',
                        maxHeight: '320px',
                        overflowY: 'auto',
                      }}
                    >
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLanguage(l.code)
                            setShowLangDropdown(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                            language === l.code ? 'font-bold' : ''
                          }`}
                          style={{
                            background: language === l.code ? `${theme.primary}20` : 'transparent',
                            color: language === l.code ? theme.primary : theme.text,
                          }}
                        >
                          <span>{l.code === language ? '✓ ' : ''}</span>
                          <span>{l.nativeName}</span>
                          <span className="text-xs opacity-50 ml-auto">{l.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isGenerating || !input.trim()}
                  className="px-6 py-3 rounded-xl font-story font-bold text-white transition-all btn-press disabled:opacity-50"
                  style={{
                    background: isGenerating ? '#9CA3AF' : theme.gradient,
                  }}
                >
                  {isGenerating ? '⏳' : '✨'}
                </button>
              </div>
            </form>

            {/* Mic or typing hint */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <MicrophoneButton
                onResult={handleMicResult}
                disabled={isGenerating}
                language={language}
              />
              <p className="text-sm" style={{ color: theme.textMuted }}>
                {currentLang.micHint}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && <LoadingSpinner />}

        {/* Story Result */}
        {currentStory && !isGenerating && (
          <div ref={storyRef} className="animate-slide-up space-y-6">
            {/* Story Display */}
            <div
              className="rounded-3xl p-6 sm:p-8"
              style={{
                background: `${theme.surface}F0`,
                border: `2px solid ${theme.primary}20`,
                boxShadow: `0 8px 32px ${theme.primary}10`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{getPattern(detectDominantTheme(currentStory))?.icon || '📖'}</span>
                <h2 className="font-story text-2xl font-bold" style={{ color: theme.text }}>
                  {currentLang.listenBtn.replace('🔊 ', '')}
                </h2>
                <span
                  className="ml-auto px-2 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${theme.primary}15`, color: theme.primary }}
                >
                  🌐 {currentLang.nativeName}
                </span>
              </div>

              <div
                className="font-playful text-lg leading-relaxed whitespace-pre-wrap"
                style={{ color: theme.text }}
              >
                {currentStory}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-story font-bold text-white transition-all btn-press disabled:opacity-50"
                style={{ background: theme.gradient }}
              >
                {isSpeaking ? (
                  <>
                    <span className="animate-pulse">🔊</span> {currentLang.listening}
                  </>
                ) : (
                  <>🔊 {currentLang.listenBtn.replace('🔊 ', '')}</>
                )}
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-story font-bold transition-all btn-press"
                style={{
                  background: saved ? '#10B981' : `${theme.primary}15`,
                  color: saved ? 'white' : theme.primary,
                  border: `1px solid ${saved ? '#10B981' : `${theme.primary}40`}`,
                }}
              >
                {saved ? currentLang.savedBtn : currentLang.saveBtn}
              </button>
              <button
                onClick={handleNewStory}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-story font-bold transition-all btn-press"
                style={{
                  background: `${theme.primary}15`,
                  color: theme.primary,
                  border: `1px solid ${theme.primary}30`,
                }}
              >
                {currentLang.newStoryBtn}
              </button>
            </div>

            {/* Haptic Patterns */}
            {sensorTags.length > 0 && (
              <div>
                <h3 className="font-story text-lg font-bold text-center mb-4" style={{ color: theme.text }}>
                  {currentLang.hapticTitle}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[...new Set(sensorTags.map(t => t.type))].map((type) => (
                    <HapticPatternCard
                      key={type}
                      type={type}
                      isActive={currentPattern === type}
                      onPlay={handleHapticPlay}
                    />
                  ))}
                </div>
                {!hapticSupported && (
                  <p className="text-center text-sm mt-3" style={{ color: theme.textMuted }}>
                    {currentLang.hapticNote}
                  </p>
                )}
              </div>
            )}

            {/* Sensory markers legend */}
            <div className="rounded-2xl p-4 text-center" style={{ background: `${theme.primary}08` }}>
              <p className="text-sm font-semibold mb-2" style={{ color: theme.text }}>
                {currentLang.sensoryTitle}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {sensorTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ background: `${theme.primary}20`, color: theme.primary }}
                  >
                    {getPattern(tag.type)?.icon} &lt;{tag.type}&gt;
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no story */}
        {!currentStory && !isGenerating && (
          <div className="text-center mt-12">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {suggestions.map((idea) => (
                <button
                  key={idea}
                  onClick={() => setInput(idea)}
                  className="px-4 py-2 rounded-full text-sm transition-all hover:scale-105 btn-press"
                  style={{
                    background: `${theme.primary}10`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}20`,
                  }}
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
