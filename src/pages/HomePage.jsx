import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeProvider'
import { LANGUAGES } from '../utils/languages'
import BackgroundParticles from '../components/BackgroundParticles'

export default function HomePage() {
  const { theme } = useTheme()
  const lang = LANGUAGES[0] // Default English

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundParticles />

      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ background: `${theme.primary}15`, color: theme.primary, border: `1px solid ${theme.primary}30` }}
          >
            <span className="animate-wiggle inline-block">✨</span>
            AI-Powered Storytelling for Every Child
          </div>

          {/* Title */}
          <h1 className="font-story text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ color: theme.text }}>
            Tell a Story,
            <br />
            <span className="text-gradient">Feel the Magic</span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: theme.textMuted }}>
            KathaAI turns your voice into magical stories with synced haptic
            feedback — perfect for young learners and visually impaired students.
            Available in 14 Indian languages.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/story"
              className="px-8 py-4 rounded-full font-story text-lg font-bold text-white transition-all btn-press animate-pulse-glow"
              style={{ background: theme.gradient }}
            >
              🎙️ Start Telling Stories
            </Link>
            <Link
              to="/teacher/login"
              className="px-8 py-4 rounded-full font-story text-lg font-bold transition-all btn-press"
              style={{ background: `${theme.primary}15`, color: theme.primary, border: `2px solid ${theme.primary}40` }}
            >
              👩‍🏫 Teacher Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 w-full px-4">
          {[
            { icon: '🎤', title: 'Voice or Type', desc: 'Speak your story idea in any of 14 Indian languages, or type it — KathaAI understands both', color: '#7C3AED' },
            { icon: '🤖', title: 'AI Magic', desc: 'Gemini AI creates enchanting stories with sensory markers, tailored to your language', color: '#0284C7' },
            { icon: '📳', title: 'Feel the Story', desc: 'Haptic patterns vibrate in sync with the narration — on supported devices', color: '#059669' },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center transition-all hover:scale-105"
              style={{ background: `${theme.surface}EE`, border: `1px solid ${feature.color}20`, boxShadow: `0 4px 20px ${feature.color}10` }}
            >
              <div className="text-4xl mb-3 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                {feature.icon}
              </div>
              <h3 className="font-story text-lg font-bold mb-2" style={{ color: theme.text }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: theme.textMuted }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Language Support Section */}
      <section className="relative z-10 py-16 px-4" style={{ background: `${theme.primary}08` }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-story text-3xl font-bold mb-4" style={{ color: theme.text }}>
            🌐 14 Languages, One Magical Experience
          </h2>
          <p className="mb-8" style={{ color: theme.textMuted }}>
            Stories are generated, narrated, and experienced in the child's own language
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {LANGUAGES.map((l) => (
              <div
                key={l.code}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-110"
                style={{ background: theme.gradient }}
              >
                <span>{l.nativeName}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sensory Themes Preview */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-story text-3xl font-bold mb-4" style={{ color: theme.text }}>
            8 Magical Themes
          </h2>
          <p className="mb-8" style={{ color: theme.textMuted }}>
            Each story adapts its atmosphere — colors, sounds, and vibrations
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: '🌧️', name: 'Rain', color: '#0284C7' },
              { icon: '⚡', name: 'Thunder', color: '#7C3AED' },
              { icon: '✨', name: 'Spell', color: '#D97706' },
              { icon: '🌿', name: 'Wind', color: '#059669' },
              { icon: '🔥', name: 'Fire', color: '#E11D48' },
              { icon: '🌊', name: 'Water', color: '#2563EB' },
              { icon: '🌍', name: 'Earth', color: '#CA8A04' },
              { icon: '☀️', name: 'Light', color: '#EA580C' },
            ].map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-110"
                style={{ background: t.color }}
              >
                <span>{t.icon}</span>
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm" style={{ color: theme.textMuted, borderTop: `1px solid ${theme.primary}10` }}>
        <p>Made with ❤️ for curious minds · KathaAI © 2026 · 14 Languages</p>
      </footer>
    </div>
  )
}
