import { createContext, useContext, useState, useEffect } from 'react'

const THEMES = {
  default: {
    name: 'default',
    primary: '#7C3AED',
    secondary: '#0284C7',
    accent: '#F59E0B',
    bg: '#FAF5FF',
    surface: '#FFFFFF',
    text: '#1E1B4B',
    textMuted: '#6B7280',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientSoft: 'linear-gradient(135deg, #FAF5FF 0%, #F0F9FF 100%)',
    particles: ['✨', '⭐', '🌟', '💫'],
    particleColors: ['#7C3AED', '#0284C7', '#F59E0B', '#10B981'],
  },
  rain: {
    name: 'rain',
    primary: '#0284C7',
    secondary: '#0EA5E9',
    accent: '#38BDF8',
    bg: '#E0F2FE',
    surface: '#F0F9FF',
    text: '#0C4A6E',
    textMuted: '#0369A1',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #38BDF8 100%)',
    gradientSoft: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    particles: ['💧', '🌧️', '💦', '🌊'],
    particleColors: ['#0284C7', '#0EA5E9', '#38BDF8', '#7DD3FC'],
  },
  thunder: {
    name: 'thunder',
    primary: '#7C3AED',
    secondary: '#A855F7',
    accent: '#F59E0B',
    bg: '#F3E8FF',
    surface: '#FAF5FF',
    text: '#3B0764',
    textMuted: '#6D28D9',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
    gradientSoft: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
    particles: ['⚡', '🌩️', '💜', '✨'],
    particleColors: ['#7C3AED', '#A855F7', '#EC4899', '#F59E0B'],
  },
  spell: {
    name: 'spell',
    primary: '#D97706',
    secondary: '#F59E0B',
    accent: '#FCD34D',
    bg: '#FEF3C7',
    surface: '#FFFBEB',
    text: '#78350F',
    textMuted: '#92400E',
    gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FCD34D 100%)',
    gradientSoft: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    particles: ['✨', '🪄', '⭐', '🔮'],
    particleColors: ['#D97706', '#F59E0B', '#FCD34D', '#FBBF24'],
  },
  wind: {
    name: 'wind',
    primary: '#059669',
    secondary: '#10B981',
    accent: '#34D399',
    bg: '#D1FAE5',
    surface: '#ECFDF5',
    text: '#064E3B',
    textMuted: '#065F46',
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
    gradientSoft: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    particles: ['🍃', '🌿', '💨', '🌱'],
    particleColors: ['#059669', '#10B981', '#34D399', '#6EE7B7'],
  },
  fire: {
    name: 'fire',
    primary: '#E11D48',
    secondary: '#F43F5E',
    accent: '#FB923C',
    bg: '#FFE4E6',
    surface: '#FFF1F2',
    text: '#881337',
    textMuted: '#9F1239',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #F43F5E 50%, #FB923C 100%)',
    gradientSoft: 'linear-gradient(135deg, #FFE4E6 0%, #FECACA 100%)',
    particles: ['🔥', '✨', '💫', '🌟'],
    particleColors: ['#E11D48', '#F43F5E', '#FB923C', '#FBBF24'],
  },
  water: {
    name: 'water',
    primary: '#2563EB',
    secondary: '#3B82F6',
    accent: '#60A5FA',
    bg: '#DBEAFE',
    surface: '#EFF6FF',
    text: '#1E3A8A',
    textMuted: '#1D4ED8',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
    gradientSoft: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    particles: ['🌊', '💧', '🐚', '⭐'],
    particleColors: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'],
  },
  earth: {
    name: 'earth',
    primary: '#CA8A04',
    secondary: '#D97706',
    accent: '#B45309',
    bg: '#FEF9C3',
    surface: '#FFFFF0',
    text: '#713F12',
    textMuted: '#854D0E',
    gradient: 'linear-gradient(135deg, #CA8A04 0%, #D97706 50%, #B45309 100%)',
    gradientSoft: 'linear-gradient(135deg, #FEF9C3 0%, #FEF3C7 100%)',
    particles: ['🌍', '🪨', '🌿', '🍂'],
    particleColors: ['#CA8A04', '#D97706', '#B45309', '#92400E'],
  },
  light: {
    name: 'light',
    primary: '#EA580C',
    secondary: '#F97316',
    accent: '#FB923C',
    bg: '#FFF7ED',
    surface: '#FFFBEB',
    text: '#7C2D12',
    textMuted: '#9A3412',
    gradient: 'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)',
    gradientSoft: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    particles: ['☀️', '✨', '🌅', '⭐'],
    particleColors: ['#EA580C', '#F97316', '#FB923C', '#FCD34D'],
  },
}

const ThemeContext = createContext({
  theme: THEMES.default,
  setTheme: () => {},
  detectTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(THEMES.default)

  const setTheme = (key) => {
    const t = THEMES[key] || THEMES.default
    setThemeState(t)
    document.documentElement.style.setProperty('--theme-primary', t.primary)
    document.documentElement.style.setProperty('--theme-secondary', t.secondary)
    document.documentElement.style.setProperty('--theme-accent', t.accent)
    document.documentElement.style.setProperty('--theme-bg', t.bg)
    document.documentElement.style.setProperty('--theme-surface', t.surface)
    document.documentElement.style.setProperty('--theme-text', t.text)
    document.documentElement.style.setProperty('--theme-text-muted', t.textMuted)
  }

  const detectTheme = (storyText) => {
    if (!storyText) return 'default'
    const lower = storyText.toLowerCase()
    if (lower.includes('<rain>') || lower.includes('rain') || lower.includes('rainy') || lower.includes('droplet')) return 'rain'
    if (lower.includes('<thunder>') || lower.includes('thunder') || lower.includes('storm') || lower.includes('lightning')) return 'thunder'
    if (lower.includes('<spell>') || lower.includes('magic') || lower.includes('wizard') || lower.includes('enchant')) return 'spell'
    if (lower.includes('<wind>') || lower.includes('wind') || lower.includes('breeze') || lower.includes('gust')) return 'wind'
    if (lower.includes('<fire>') || lower.includes('fire') || lower.includes('flame') || lower.includes('hot')) return 'fire'
    if (lower.includes('<water>') || lower.includes('water') || lower.includes('ocean') || lower.includes('river')) return 'water'
    if (lower.includes('<earth>') || lower.includes('earth') || lower.includes('forest') || lower.includes('mountain')) return 'earth'
    if (lower.includes('<light>') || lower.includes('light') || lower.includes('sun') || lower.includes('bright')) return 'light'
    return 'default'
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, detectTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
