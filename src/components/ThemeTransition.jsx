import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeProvider'

/**
 * Full-screen theme transition overlay — flashes the theme color briefly when switching
 */
export default function ThemeTransition({ children }) {
  const { theme } = useTheme()
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    setFlashing(true)
    const timer = setTimeout(() => setFlashing(false), 600)
    return () => clearTimeout(timer)
  }, [theme.name])

  return (
    <>
      {children}
      {flashing && (
        <div
          className="fixed inset-0 z-[100] pointer-events-none transition-opacity duration-500"
          style={{
            background: theme.primary,
            opacity: 0.08,
          }}
          aria-hidden="true"
        />
      )}
    </>
  )
}
