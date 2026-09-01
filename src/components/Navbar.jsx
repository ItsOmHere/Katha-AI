import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeProvider'

export default function Navbar() {
  const location = useLocation()
  const { theme } = useTheme()
  const isTeacher = location.pathname.startsWith('/teacher')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: `1px solid ${theme.primary}20` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:rotate-12"
              style={{ background: theme.gradient }}
            >
              📖
            </div>
            <span
              className="font-story text-xl font-bold tracking-tight"
              style={{ color: theme.text }}
            >
              Katha<span style={{ color: theme.primary }}>AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-2">
            {!isTeacher ? (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all btn-press ${
                    location.pathname === '/' ? 'text-white' : ''
                  }`}
                  style={location.pathname === '/' ? { background: theme.gradient } : { color: theme.text }}
                >
                  Home
                </Link>
                <Link
                  to="/story"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all btn-press ${
                    location.pathname === '/story' ? 'text-white' : ''
                  }`}
                  style={location.pathname === '/story' ? { background: theme.gradient } : { color: theme.text }}
                >
                  Tell a Story
                </Link>
                <Link
                  to="/teacher/login"
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all btn-press"
                  style={{
                    background: `${theme.primary}15`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}30`,
                  }}
                >
                  👩‍🏫 Teacher
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/teacher"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all btn-press ${
                    location.pathname === '/teacher' ? 'text-white' : ''
                  }`}
                  style={location.pathname === '/teacher' ? { background: theme.gradient } : { color: theme.text }}
                >
                  Stories
                </Link>
                <Link
                  to="/teacher/analytics"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all btn-press ${
                    location.pathname === '/teacher/analytics' ? 'text-white' : ''
                  }`}
                  style={location.pathname === '/teacher/analytics' ? { background: theme.gradient } : { color: theme.text }}
                >
                  Analytics
                </Link>
                <Link
                  to="/"
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all btn-press"
                  style={{
                    background: `${theme.primary}15`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}30`,
                  }}
                >
                  Exit
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
