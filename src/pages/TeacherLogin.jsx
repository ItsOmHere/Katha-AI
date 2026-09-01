import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeProvider'
import BackgroundParticles from '../components/BackgroundParticles'
import { verifyTeacherPin } from '../utils/api'

const TEACHER_PIN = import.meta.env.VITE_TEACHER_PIN || '1234'

export default function TeacherLogin() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const isValid = await verifyTeacherPin(pin)
      if (isValid || pin === TEACHER_PIN) {
        sessionStorage.setItem('kathaai_teacher', 'authenticated')
        navigate('/teacher')
      } else {
        setError('Incorrect PIN. Please try again.')
        setPin('')
      }
    } catch {
      // Fallback to local PIN check
      if (pin === TEACHER_PIN) {
        sessionStorage.setItem('kathaai_teacher', 'authenticated')
        navigate('/teacher')
      } else {
        setError('Incorrect PIN. Please try again.')
        setPin('')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <BackgroundParticles />
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-3xl p-8 glass text-center"
          style={{
            background: `${theme.surface}F0`,
            border: `2px solid ${theme.primary}20`,
          }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: theme.gradient }}
          >
            👩‍🏫
          </div>

          <h1
            className="font-story text-2xl font-bold mb-2"
            style={{ color: theme.text }}
          >
            Teacher Dashboard
          </h1>
          <p
            className="text-sm mb-6"
            style={{ color: theme.textMuted }}
          >
            Enter the class PIN to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter PIN"
                className="w-full text-center text-3xl font-story tracking-[0.5em] py-4 rounded-xl outline-none"
                style={{
                  background: `${theme.primary}08`,
                  border: `2px solid ${error ? '#EF4444' : `${theme.primary}30`}`,
                  color: theme.text,
                }}
                autoFocus
                aria-label="Teacher PIN"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || pin.length < 4}
              className="w-full py-4 rounded-xl font-story font-bold text-white text-lg transition-all btn-press disabled:opacity-50"
              style={{ background: theme.gradient }}
            >
              {loading ? '⏳ Checking...' : 'Enter Dashboard'}
            </button>
          </form>

          <p className="text-xs mt-6" style={{ color: theme.textMuted }}>
            Default PIN: <code className="font-mono bg-black/5 px-1 py-0.5 rounded">1234</code>
          </p>
        </div>
      </div>
    </div>
  )
}
