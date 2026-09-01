/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        story: {
          rain: { light: '#E0F2FE', DEFAULT: '#0284C7', dark: '#0C4A6E' },
          thunder: { light: '#F3E8FF', DEFAULT: '#7C3AED', dark: '#3B0764' },
          spell: { light: '#FEF3C7', DEFAULT: '#D97706', dark: '#78350F' },
          wind: { light: '#D1FAE5', DEFAULT: '#059669', dark: '#064E3B' },
          fire: { light: '#FFE4E6', DEFAULT: '#E11D48', dark: '#881337' },
          water: { light: '#DBEAFE', DEFAULT: '#2563EB', dark: '#1E3A8A' },
          earth: { light: '#FEF9C3', DEFAULT: '#CA8A04', dark: '#713F12' },
          light: { light: '#FFF7ED', DEFAULT: '#EA580C', dark: '#7C2D12' },
        }
      },
      fontFamily: {
        playful: ['"Nunito"', 'sans-serif'],
        story: ['"Fredoka"', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out 1.5s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(251, 191, 36, 0.6)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      }
    }
  },
  plugins: [],
}
