import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const initDatabase = async () => {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id SERIAL PRIMARY KEY,
        prompt TEXT NOT NULL,
        story_text TEXT NOT NULL,
        sensor_tags JSONB DEFAULT '[]',
        theme VARCHAR(50) DEFAULT 'default',
        language VARCHAR(20) DEFAULT 'en-IN',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS teacher_pins (
        id SERIAL PRIMARY KEY,
        pin_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Insert default PIN if not exists
      INSERT INTO teacher_pins (pin_hash)
      SELECT md5('1234')
      WHERE NOT EXISTS (SELECT 1 FROM teacher_pins);

      -- Add language column if not exists
      ALTER TABLE stories
        ADD COLUMN IF NOT EXISTS language VARCHAR(20) DEFAULT 'en-IN';

      -- Index for faster theme and language filtering
      CREATE INDEX IF NOT EXISTS idx_stories_theme ON stories(theme);
      CREATE INDEX IF NOT EXISTS idx_stories_created ON stories(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_stories_language ON stories(language);
    `)
    console.log('✅ Database initialized successfully')
  } catch (err) {
    console.error('❌ Database init failed:', err.message)
    throw err
  } finally {
    client.release()
  }
}

export { pool, initDatabase }
