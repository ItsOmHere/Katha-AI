import { Router } from 'express'
import { pool } from '../db/init.js'

const router = Router()

// Language-specific prompt instructions
// Sensory prompt engineering
// GET /api/stories - List all stories
router.get('/', async (req, res) => {
  try {
    const { theme, search, language, limit = 50, offset = 0 } = req.query
    let query = 'SELECT * FROM stories'
    const params = []
    const whereClauses = []

    if (theme && theme !== 'all') {
      whereClauses.push(`theme = $${params.length + 1}`)
      params.push(theme)
    }
    if (language && language !== 'all') {
      whereClauses.push(`language = $${params.length + 1}`)
      params.push(language)
    }
    if (search) {
      whereClauses.push(`(prompt ILIKE $${params.length + 1} OR story_text ILIKE $${params.length + 1})`)
      params.push(`%${search}%`)
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ')
    }
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(parseInt(limit), parseInt(offset))

    const result = await pool.query(query, params)
    res.json({ stories: result.rows })
  } catch (err) {
    console.error('Fetch stories error:', err)
    res.status(500).json({ error: 'Failed to fetch stories' })
  }
})

// POST /api/stories - Save a story
router.post('/', async (req, res) => {
  try {
    const { prompt, storyText, sensorTags, theme, language = 'en-IN' } = req.body
    if (!prompt || !storyText) {
      return res.status(400).json({ error: 'Prompt and storyText are required' })
    }

    const result = await pool.query(
      `INSERT INTO stories (prompt, story_text, sensor_tags, theme, language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [prompt, storyText, sensorTags || '[]', theme || 'default', language]
    )
    res.status(201).json({ story: result.rows[0] })
  } catch (err) {
    console.error('Save story error:', err)
    res.status(500).json({ error: 'Failed to save story' })
  }
})

// GET /api/stories/:id - Get single story
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM stories WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' })
    }
    res.json({ story: result.rows[0] })
  } catch (err) {
    console.error('Fetch story error:', err)
    res.status(500).json({ error: 'Failed to fetch story' })
  }
})

export default router
