import { Router } from 'express'

const router = Router()

// POST /api/teacher/auth - Verify teacher PIN
router.post('/auth', async (req, res) => {
  try {
    const { pin } = req.body
    if (!pin) {
      return res.status(400).json({ error: 'PIN is required' })
    }

    // Simple hash comparison (in production, use bcrypt)
    const crypto = await import('crypto')
    const hash = crypto.default.createHash('md5').update(pin).digest('hex')

    // Check against env PIN
    const expectedHash = crypto.default.createHash('md5').update(process.env.TEACHER_PIN || '1234').digest('hex')

    if (hash === expectedHash) {
      res.json({ authenticated: true })
    } else {
      res.status(401).json({ error: 'Invalid PIN' })
    }
  } catch (err) {
    console.error('Auth error:', err)
    res.status(500).json({ error: 'Authentication failed' })
  }
})

export default router
