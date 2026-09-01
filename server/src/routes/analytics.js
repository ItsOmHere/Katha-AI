import { Router } from 'express'
import { pool } from '../db/init.js'

const router = Router()

// GET /api/analytics - Get analytics data
router.get('/', async (req, res) => {
  try {
    const totalRes = await pool.query('SELECT COUNT(*) as count FROM stories')
    const totalStories = parseInt(totalRes.rows[0].count)

    const themeRes = await pool.query(
      'SELECT theme, COUNT(*) as count FROM stories GROUP BY theme ORDER BY count DESC'
    )
    const langRes = await pool.query(
      'SELECT language, COUNT(*) as count FROM stories GROUP BY language ORDER BY count DESC'
    )
    const weekRes = await pool.query(
      "SELECT COUNT(*) as count FROM stories WHERE created_at >= NOW() - INTERVAL '7 days'"
    )
    const thisWeek = parseInt(weekRes.rows[0].count)

    const uniqueRes = await pool.query(
      'SELECT COUNT(DISTINCT LOWER(prompt)) as count FROM stories'
    )
    const uniquePrompts = parseInt(uniqueRes.rows[0].count)

    res.json({
      totalStories,
      themeDistribution: themeRes.rows,
      languageDistribution: langRes.rows,
      thisWeek,
      uniquePrompts,
    })
  } catch (err) {
    console.error('Analytics error:', err)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

export default router
