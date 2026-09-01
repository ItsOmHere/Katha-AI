import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { initDatabase } from './db/init.js'
import storiesRouter from './routes/stories.js'
import storyGenerateRouter from './routes/story.js'
import analyticsRouter from './routes/analytics.js'
import transcribeRouter from './routes/transcribe.js'
import teacherRouter from './routes/teacher.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() })
app.use('/api/transcribe', upload.single('audio'))

// Routes
app.use('/api/story', storyGenerateRouter)
app.use('/api/stories', storiesRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/transcribe', transcribeRouter)
app.use('/api/teacher', teacherRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
async function start() {
  try {
    await initDatabase()
    app.listen(PORT, () => {
      console.log(`🚀 KathaAI server running on http://localhost:${PORT}`)
      console.log(`📊 Dashboard: http://localhost:${PORT}/teacher`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
