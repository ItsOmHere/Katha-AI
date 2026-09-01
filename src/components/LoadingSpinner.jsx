import { useTheme } from '../context/ThemeProvider'

export default function LoadingSpinner({ text = 'Generating your story...' }) {
  const { theme } = useTheme()
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-opacity-20"
          style={{ borderColor: theme.primary }}
        />
        {/* Spinning ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: theme.primary,
            borderRightColor: theme.secondary,
            animation: 'spin 1s linear infinite',
          }}
        />
        {/* Book icon */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          📖
        </div>
      </div>
      <p className="font-story text-lg font-semibold" style={{ color: theme.text }}>
        {text}
      </p>
      <p className="text-sm" style={{ color: theme.textMuted }}>
        Our AI is weaving a magical story...
      </p>
    </div>
  )
}
