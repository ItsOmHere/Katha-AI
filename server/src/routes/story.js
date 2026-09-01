import { Router } from 'express'
import { pool } from '../db/init.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Language-specific prompt instructions
const LANGUAGE_PROMPTS = {
  'en-IN': '',
  'hi-IN': 'लେखने की भषा: हिनदी (देवनगर)। बच्चों के लिए सरल और स्पष् हिनदी का प्रयोग करें।',
  'mr-IN': 'लେखना भषा: मरठ (देवनगर)। मुलंसठी सोपी आणि स्पष् मरठ वاپرا.',
  'bn-IN': 'লেখার ভাষা: বাল। শিশুদের জন্য সহজ ও স্পষ বাল ব্যবহার করুন।',
  'ta-IN': 'எழுதும் மொழி: தமிழ். குழந்தைகளுக்கு எளிய தமிழ் பயன்படுத்தவும்.',
  'te-IN': 'మాలిన భాష: తెలుగు. బచలకు సరళమైన తెలుగు వాడండి.',
  'kn-IN': 'ಬರಹದ ಭಾಷ: ಕನ್ನಡ. ಮಕಳಿಗೆ ಸರಳ ಕನ್ನಡ ಬಳಸಿ.',
  'ml-IN': 'ലേഖന ഭാഷ: മലയാളം. കുഞ്ഞങ്ങൾക്ക് എളുപ്പമുള്ള മലയാളം ഉപയോഗിക്കുക.',
  'gu-IN': 'લખાણ ભાષા: ગુજરાતી. બાળકો માટે સરળ ગુજરાતી વાપરો.',
  'pa-IN': 'ਲਿਖਣ ਦੀ ਭਾਸ਼ਾ: ਪੰਜਾਬੀ (ਗੁਰਮੁਖੀ)। ਬਚਿਆਂ ਲਈ ਸਰਲ ਪੰਜਾਬੀ ਵਰਤੋਂ।',
  'or-IN': 'ଲେଖନ ଭାଷା: ଓଡ଼ିଆ। ବାଲକମାନଙ୍କ ପାଇଁ ସରଳ ଓଡ଼ିଆ ବ୍ୟବହାର କରନ୍ତୁ।',
  'ur-IN': 'لکھنے کی زبان: اردو (نستعلیق)۔ بچوں کے لیے سادہ اردو استعمال کریں۔',
  'as-IN': 'লেখাৰ ভাষা: অসমীয়া। শিশুৰ বাবে সৰল অসমীয়া ব্যৱহাৰ কৰক।',
  'ma-IN': 'लखनेक भाषा: मैथिली (देवनागरी)। बच्चोंके लए सरल मैथिली प्रयोग करू।'
}

const SENSORY_SYSTEM_PROMPT = `You are a children's story writer for KathaAI, an accessibility tool for visually impaired students.
Write engaging, age-appropriate stories (150-250 words) that include sensory markers.

SENSORY MARKERS to use naturally in the story:
- <rain> - rain sounds/feelings
- <thunder> - thunder/storm moments
- <spell> - magical/enchanted moments
- <wind> - wind/breeze descriptions
- <fire> - warmth/fire moments
- <water> - water/ocean descriptions
- <earth> - nature/ground moments
- <light> - brightness/light moments

Example: "The little rabbit hopped through the forest. <wind> A gentle breeze rustled the leaves...</wind> <thunder> Suddenly, dark clouds gathered and thunder rumbled in the distance..."

Rules:
1. Always include at least 3 sensory markers
2. Keep language simple and vivid for children
3. Make stories immersive and engaging
4. Use the markers naturally within the narrative
5. End with a positive, uplifting message`

// POST /api/story - Generate a story
router.post('/', async (req, res) => {
  try {
    const { prompt, language = 'en-IN' } = req.body
    if (!prompt || prompt.trim().length < 2) {
      return res.status(400).json({ error: 'Prompt must be at least 2 characters' })
    }

    const langInstruction = LANGUAGE_PROMPTS[language] || ''
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })
    const result = await model.generateContent(
      `Create a magical story based on this prompt: "${prompt}". ${SENSORY_SYSTEM_PROMPT}\n\n${langInstruction}`
    )
    const story = result.response.text().trim()
    const cleanStory = story.replace(/^.*?(The|Once|In|A |An |One |एक|এক|ഒരു|ஒரு)/i, '$1')

    res.json({ story: cleanStory })
  } catch (err) {
    console.error('Story generation error:', err)
    res.status(500).json({ error: 'Failed to generate story' })
  }
})

export default router
