import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeProvider'
import { LANGUAGES } from '../utils/languages'
import BackgroundParticles from '../components/BackgroundParticles'

const THEME_COLORS = {
  rain: '#0284C7',
  thunder: '#7C3AED',
  spell: '#D97706',
  wind: '#059669',
  fire: '#E11D48',
  water: '#2563EB',
  earth: '#CA8A04',
  light: '#EA580C',
  default: '#6B7280',
}

const THEME_ICONS = {
  rain: '🌧️',
  thunder: '⚡',
  spell: '✨',
  wind: '🌿',
  fire: '🔥',
  water: '🌊',
  earth: '🌍',
  light: '☀️',
  default: '📖',
}

const LANG_ICONS = {
  'en-IN': '🇬🇧',
  'hi-IN': '🇮🇳',
  'mr-IN': '🇮🇳',
  'bn-IN': '🇮🇳',
  'ta-IN': '🇮🇳',
  'te-IN': '🇮🇳',
  'kn-IN': '🇮🇳',
  'ml-IN': '🇮🇳',
  'gu-IN': '🇮🇳',
  'pa-IN': '🇮🇳',
  'or-IN': '🇮🇳',
  'ur-IN': '🇮🇳',
  'as-IN': '🇮🇳',
  'ma-IN': '🇮🇳',
  default: '🌐',
}

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [langFilter, setLangFilter] = useState('all')

  useEffect(() => {
    if (!sessionStorage.getItem('kathaai_teacher')) {
      navigate('/teacher/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [storiesRes, analyticsRes] = await Promise.all([
        fetch('/api/stories'),
        fetch('/api/analytics'),
      ])
      const storiesData = await storiesRes.json()
      const analyticsData = await analyticsRes.json()
      setStories(storiesData.stories || [])
      setAnalytics(analyticsData)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStories = langFilter === 'all'
    ? stories
    : stories.filter(s => s.language === langFilter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <BackgroundParticles />
        <div className="relative z-10">
          <div className="text-5xl animate-bounce mb-4">📊</div>
          <p className="font-story text-lg" style={{ color: theme.text }}>
            Loading analytics...
          </p>
        </div>
      </div>
    )
  }

  // Calculate theme distribution from filtered
  const themeCounts = {}
  filteredStories.forEach((s) => {
    const t = s.theme || 'default'
    themeCounts[t] = (themeCounts[t] || 0) + 1
  })
  const totalStories = filteredStories.length
  const topTheme = Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="min-h-screen relative">
      <BackgroundParticles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/teacher')}
              className="flex items-center gap-1 text-sm font-semibold mb-2 transition-all hover:gap-2 btn-press"
              style={{ color: theme.primary }}
            >
              ← Back to Dashboard
            </button>
            <h1 className="font-story text-3xl font-bold" style={{ color: theme.text }}>
              📊 Analytics
            </h1>
          </div>
        </div>

        {/* Language Filter */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-2" style={{ color: theme.textMuted }}>
            Filter by Language
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
                  : {
                      background: `${theme.primary}10`,
                      color: theme.text,
                      border: `1px solid ${theme.primary}20`,
                    }
              }
            >
              🌐 All Languages
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
                    : {
                        background: `${theme.primary}10`,
                        color: theme.text,
                        border: `1px solid ${theme.primary}20`,
                      }
                }
              >
                {LANG_ICONS[l.code] || '🌐'} {l.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Stories', value: totalStories, icon: '📖', color: theme.primary },
            {
              label: 'Top Theme',
              value: topTheme ? THEME_ICONS[topTheme[0]] : '—',
              icon: '',
              color: topTheme ? THEME_COLORS[topTheme[0]] : '#6B7280',
            },
            {
              label: 'This Week',
              value: stories.filter(s => {
                const d = new Date(s.createdAt)
                const w = new Date()
                w.setDate(w.getDate() - 7)
                return d >= w
              }).length,
              icon: '📅',
              color: '#10B981',
            },
            {
              label: 'Unique Prompts',
              value: new Set(filteredStories.map(s => s.prompt.toLowerCase())).size,
              icon: '💡',
              color: '#F59E0B',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 text-center"
              style={{ background: `${theme.surface}F0`, border: `1px solid ${stat.color}20` }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-story text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: theme.textMuted }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Theme Distribution */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: `${theme.surface}F0`, border: `1px solid ${theme.primary}20` }}
        >
          <h2 className="font-story text-xl font-bold mb-4" style={{ color: theme.text }}>
            Theme Distribution
          </h2>
          <div className="space-y-3">
            {Object.entries(themeCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([t, count]) => {
                const pct = totalStories > 0 ? (count / totalStories) * 100 : 0
                const color = THEME_COLORS[t] || '#6B7280'
                return (
                  <div key={t} className="flex items-center gap-3">
                    <span className="text-lg w-8">{THEME_ICONS[t] || '📖'}</span>
                    <span className="text-sm font-semibold w-20" style={{ color: theme.text }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                    <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: `${theme.primary}10` }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                    <span className="text-sm font-bold w-12 text-right" style={{ color }}>
                      {count}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Language Distribution */}
        {analytics?.languageDistribution && analytics.languageDistribution.length > 1 && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: `${theme.surface}F0`, border: `1px solid ${theme.primary}20` }}
          >
            <h2 className="font-story text-xl font-bold mb-4" style={{ color: theme.text }}>
              Language Distribution
            </h2>
            <div className="space-y-3">
              {analytics.languageDistribution
                .sort((a, b) => b.count - a.count)
                .map((row) => {
                  const lang = LANGUAGES.find((l) => l.code === row.language)
                  const pct = totalStories > 0 ? (row.count / totalStories) * 100 : 0
                  return (
                    <div key={row.language} className="flex items-center gap-3">
                      <span className="text-lg w-8">{LANG_ICONS[row.language] || '🌐'}</span>
                      <span className="text-sm font-semibold w-28" style={{ color: theme.text }}>
                        {lang?.nativeName || row.language}
                      </span>
                      <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: `${theme.primary}10` }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: theme.primary }}
                        />
                      </div>
                      <span className="text-sm font-bold w-12 text-right" style={{ color: theme.primary }}>
                        {row.count}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div
          className="rounded-2xl p-6"
          style={{ background: `${theme.surface}F0`, border: `1px solid ${theme.primary}20` }}
        >
          <h2 className="font-story text-xl font-bold mb-4" style={{ color: theme.text }}>
            Recent Stories
          </h2>
          {filteredStories.length === 0 ? (
            <p className="text-center py-8" style={{ color: theme.textMuted }}>
              {langFilter === 'all'
                ? 'No stories yet. Start telling some! 🎙️'
                : `No stories in ${LANGUAGES.find(l => l.code === langFilter)?.nativeName || langFilter}. Try a different language!`}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredStories
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((story) => {
                  const t = story.theme || 'default'
                  const lang = LANGUAGES.find((l) => l.code === story.language)
                  return (
                    <div
                      key={story.id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-102 cursor-pointer"
                      style={{ background: `${theme.primary}05` }}
                      onClick={() => navigate(`/teacher/story/${story.id}`)}
                    >
                      <span className="text-2xl">{THEME_ICONS[t] || '📖'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-playful text-sm font-semibold truncate" style={{ color: theme.text }}>
                          {story.prompt}
                        </p>
                        <p className="text-xs" style={{ color: theme.textMuted }}>
                          {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ background: THEME_COLORS[t] || '#6B7280' }}
                      >
                        {t}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${theme.primary}15`, color: theme.primary }}
                      >
                        {lang?.nativeName || story.language}
                      </span>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
