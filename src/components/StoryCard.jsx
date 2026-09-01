import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeProvider'
import { getPattern } from '../utils/haptics'
import { LANGUAGES } from '../utils/languages'

export default function StoryCard({ story }) {
  const { theme } = useTheme()
  const tags = story.sensorTags || []
  const dominantTag = tags[0]?.type || 'default'
  const pattern = getPattern(dominantTag)
  const lang = LANGUAGES.find((l) => l.code === story.language)

  return (
    <Link
      to={`/teacher/story/${story.id}`}
      className="story-card block rounded-2xl p-5 glass"
      style={{ background: `${theme.surface}CC`, border: `1px solid ${theme.primary}20` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{pattern?.icon || '📖'}</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: theme.primary }}>
            {dominantTag.charAt(0).toUpperCase() + dominantTag.slice(1)}
          </span>
          {lang && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: `${theme.primary}15`, color: theme.primary }}
            >
              🌐 {lang.nativeName}
            </span>
          )}
        </div>
        <span className="text-xs" style={{ color: theme.textMuted }}>
          {new Date(story.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="font-story text-base font-semibold mb-2 line-clamp-2" style={{ color: theme.text }}>
        {story.storyText.replace(/<[^>]+>/g, '').substring(0, 100)}...
      </p>

      <p className="text-sm italic mb-3 line-clamp-1" style={{ color: theme.textMuted }}>
        Prompt: "{story.prompt}"
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => {
            const t = getPattern(tag.type)
            return (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: `${theme.primary}15`, color: theme.primary }}
              >
                {t?.icon} {tag.type}
              </span>
            )
          })}
        </div>
      )}
    </Link>
  )
}
