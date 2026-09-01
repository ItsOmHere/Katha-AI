# KathaAI — Web Prototype

**Voice-powered storytelling with haptic feedback for visually impaired students.**

## Quick Start

### 1. Install Dependencies
```bash
# Frontend
cd kathaai-web
npm install

# Backend
cd server
npm install
```

### 2. Configure Environment
```bash
# Copy and fill in secrets
cp server/.env.example server/.env
cp .env.example .env
```

Set your:
- `DATABASE_URL` — PostgreSQL connection (use [Neon](https://neon.tech) free tier)
- `GEMINI_API_KEY` — Google AI Studio API key
- `TEACHER_PIN` — 6-digit teacher access PIN

### 3. Run
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
npm run dev
```

Open http://localhost:5173

## Features

### Student Experience
- 🎤 **Voice input** — Speak your story idea (requires microphone permission)
- ✍️ **Text input** — Type your prompt instead
- 🤖 **AI stories** — Gemini generates stories with sensory markers
- 🔊 **TTS playback** — Text-to-speech narration with haptic sync
- 📳 **Haptic feedback** — Real vibrations on supported devices + visual patterns

### Teacher Dashboard
- 🔐 **PIN-protected** — Simple 4-6 digit PIN access
- 📚 **Story library** — Browse, search, and filter all student stories
- 📊 **Analytics** — Theme distribution, weekly stats, unique prompts
- 🎧 **Story playback** — Listen to any saved story with TTS

### Dynamic Theming
Stories automatically change the entire UI theme based on sensory markers:
| Theme | Trigger | Colors |
|-------|---------|--------|
| 🌧️ Rain | `<rain>`, water words | Blue tones |
| ⚡ Thunder | `<thunder>`, storm words | Purple tones |
| ✨ Spell | `<spell>`, magic words | Amber/gold |
| 🌿 Wind | `<wind>`, breeze words | Green tones |
| 🔥 Fire | `<fire>`, warmth words | Red/coral |
| 🌊 Water | `<water>`, ocean words | Deep blue |
| 🌍 Earth | `<earth>`, nature words | Earth tones |
| ☀️ Light | `<light>`, bright words | Orange/warm |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/story` | Generate story from prompt |
| POST | `/api/transcribe` | Transcribe audio → text |
| GET | `/api/stories` | List all stories |
| POST | `/api/stories` | Save a story |
| GET | `/api/stories/:id` | Get single story |
| GET | `/api/analytics` | Get analytics data |
| POST | `/api/teacher/auth` | Verify teacher PIN |

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Render)
```bash
cd server && npm start
# Set env vars: DATABASE_URL, GEMINI_API_KEY, TEACHER_PIN
```

### Database (Neon)
1. Create a free PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. The server auto-initializes the schema on first run

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Express.js + PostgreSQL
- **AI**: Google Gemini 2.0 Flash
- **TTS**: Web Speech API
- **Haptics**: Web Vibration API
- **Voice**: MediaRecorder API (Web Audio)

## Accessibility
- Full keyboard navigation
- ARIA labels on all interactive elements
- `prefers-reduced-motion` respected
- 4.5:1+ contrast ratios
- Touch targets ≥ 44×44px
- Semantic HTML structure
