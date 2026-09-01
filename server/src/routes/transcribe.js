import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Language-specific transcription instructions
const TRANSCRIBE_INSTRUCTIONS = {
  'en-IN': 'Transcribe this audio to text in English. Return only the transcription.',
  'hi-IN': 'इस ऑडियो का अनुवाद हिंदी (देवनागरी) में करें। केवल अनुवाद वापस करें।',
  'mr-IN': 'या ऑडिओचे रूपांतर मराठी (देवनागरी) मध्ये करा. फक्त रूपांतर परत करा.',
  'bn-IN': 'এই অডিওটিকে বাংলায় অনুবাদ করুন। শুধুমাত্র অনুবাদ ফিরিয়ে দিন।',
  'ta-IN': 'இந்த ஆடியோவை தமிழில் மொழிபெயர்க்கவும். மொழிபெயர்ப்பை மட்டும் திரும்ப கொடுக்கவும்.',
  'te-IN': 'ఈ ఆడియోను తెలుగులో అనువదించండి. అనువాదం మాత్రమే తిరిగి ఇవ్వండి.',
  'kn-IN': 'ಈ ಆಡಿಯೋವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಅನುವಾದಿಸಿ. ಅನುವಾದ ಮಾತ್ರ ತಿರುಗಿ ನೀಡಿ.',
  'ml-IN': 'ഈ ഓഡിയോ മലയാളത്തിൽ മൊഴിപ്പെഴുതുക. മൊഴിപ്പെരുത്തൽ മാത്രം തിരികെ നൽകുക.',
  'gu-IN': 'આ ઑડિયોને ગુજરાતીમાં અનુવાદ કરો. ફક્ત અનુવાદ પાછો આપો.',
  'pa-IN': 'ਇਸ ਆਡੀਓ ਨੂੰ ਪੰਜਾਬੀ ਵਿੱਚ ਅਨੁਵਾਦ ਕਰੋ। ਸਿਰਫ਼ ਅਨੁਵਾਦ ਵਾਪਸ ਕਰੋ।',
  'or-IN': 'ଏହି ଅଡ଼ିଓକୁ ଓଡ଼ିଆରେ ଅନୁବାଦ କରନ୍ତୁ। କେବଳ ଅନୁବାଦ ଫେରାନ୍ତୁ।',
  'ur-IN': 'اس آڈیو کا اردو میں ترجمہ کریں۔ صرف ترجمہ واپس کریں۔',
  'as-IN': 'এই অডিও অসমীয়া ভাষাত লিখক।',
  'ma-IN': 'इस ऑडियोक मैथिलीमे अनुवाद करू। केवल अनुवाद लौतू।',
}

// POST /api/transcribe - Transcribe audio
router.post('/', async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: 'No audio file uploaded' })
    }

    const audioFile = req.files.audio
    const buffer = Buffer.isBuffer(audioFile.data)
      ? audioFile.data
      : Buffer.from(audioFile.data)
    const language = req.body.language || 'en-IN'

    // Use Gemini to transcribe with language instruction
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })
    const instruction = TRANSCRIBE_INSTRUCTIONS[language] || TRANSCRIBE_INSTRUCTIONS['en-IN']

    const result = await model.generateContent([
      {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: audioFile.mimetype || 'audio/webm',
        },
      },
      instruction,
    ])

    const text = result.response.text().trim()
    res.json({ text })
  } catch (err) {
    console.error('Transcription error:', err)
    res.status(500).json({ error: 'Transcription failed' })
  }
})

export default router
