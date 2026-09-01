import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeProvider'
import { LANGUAGES } from '../utils/languages'
import BackgroundParticles from '../components/BackgroundParticles'
import StoryCard from '../components/StoryCard'

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [langFilter, setLangFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!sessionStorage.getItem('kathaai_teacher')) {
      navigate('/teacher/login')
      return
    }
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories')
      const data = await res.json()
      setStories(data.stories || [])
    } catch (err) {
      console.error('Failed to fetch stories:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStories = stories.filter((s) => {
    const matchesFilter = filter === 'all' || s.theme === filter
    const matchesLang = langFilter === 'all' || s.language === langFilter
    const matchesSearch =
      !search ||
      s.prompt.toLowerCase().includes(search.toLowerCase()) ||
      s.storyText.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesLang && matchesSearch
  })

  const handleLogout = () => {
    sessionStorage.removeItem('kathaai_teacher')
    navigate('/')
  }

  const themes = ['all', 'rain', 'thunder', 'spell', 'wind', 'fire', 'water', 'earth', 'light']
  const themeIcons = {
    all: '📚', rain: '🌧️', thunder: '⚡', spell: '✨',
    wind: '🌿', fire: '🔥', water: '🌊', earth: '🌍', light: '☀️',
  }

  const langIcons = {
    'en-IN': '🇬🇧', 'hi-IN': '🇮🇳', 'mr-IN': '🇮🇳', 'bn-IN': '🇮🇳',
    'ta-IN': '🇮🇳', 'te-IN': '🇮🇳', 'kn-IN': '🇮🇳', 'ml-IN': '🇮🇳',
    'gu-IN': '🇮🇳', 'pa-IN': '🇮🇳', 'or-IN': '🇮🇳', 'ur-IN': '🇮🇳',
    'as-IN': '🇮🇳', 'ma-IN': '🇮🇳',
  }

  return (
    <div className="min-h-screen relative">
      <BackgroundParticles />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-story text-3xl font-bold" style={{ color: theme.text }}>
              📚 Story Library
            </h1>
            <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
              {stories.length} stories generated
            </p>
          </div>
          <Link
            to="/teacher/analytics"
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all btn-press"
            style={{ background: `${theme.primary}15`, color: theme.primary, border: `1px solid ${theme.primary}30` }}
          >
            📊 Analytics
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories..."
            className="w-full px-4 py-3 rounded-xl outline-none font-playful"
            style={{ background: `${theme.surface}EE`, border: `1px solid ${theme.primary}20`, color: theme.text }}
            aria-label="Search stories"
          />
        </div>

        {/* Theme Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all btn-press ${
                filter === t ? 'text-white scale-105' : ''
              }`}
              style={
                filter === t
                  ? { background: theme.gradient }
                  : { background: `${theme.primary}10`, color: theme.text, border: `1px solid ${theme.primary}20` }
              }
            >
              {themeIcons[t]} {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Language Filter */}
        <div className="mb-6">
          <p className="text-xs font-semibold mb-2" style={{ color: theme.textMuted }}>
            LANGUAGES
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLangFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all btn-press ${
                langFilter === 'all' ? 'text-white scale-105' : ''
              }`}
              style={
                langFilter === 'all'
                  ? { background: theme.gradient }
                  : { background: `${theme.primary}10`, color: theme.text, border: `1px solid ${theme.primary}20` }
              }
            >
              🌐 All
            </button>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLangFilter(l.code)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all btn-press ${
                  langFilter === l.code ? 'text-white scale-105' : ''
                }`}
                style={
                  langFilter === l.code
                    ? { background: theme.gradient }
                    : { background: `${theme.primary}10`, color: theme.text, border: `1px solid ${theme.primary}20` }
                }
              >
                {(langIcons[l.code] || '🌐')} {l.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl p-5 h-40 shimmer" style={{ background: `${theme.surface}EE` }} />
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="font-story text-xl font-bold mb-2" style={{ color: theme.text }}>
              No stories yet
            </h2>
            <p className="text-sm" style={{ color: theme.textMuted }}>
              {langFilter !== 'all'
                ? `No stories in ${LANGUAGES.find(l => l.code === langFilter)?.nativeName || langFilter}. Try a different language!`
                : 'Stories will appear here as students create them'}
            </p>
            <Link
              to="/story"
              className="inline-block mt-4 px-6 py-2 rounded-full font-story font-bold text-white transition-all btn-press"
              style={{ background: theme.gradient }}
            >
              ✨ Create First Story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all btn-press"
            style={{ background: `${theme.primary}10`, color: theme.textMuted, border: `1px solid ${theme.primary}20` }}
          >
            🚪 Exit Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
