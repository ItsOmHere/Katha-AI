import { useState, useRef } from 'react'

export default function MicrophoneButton({ onResult, disabled, language = 'en-IN' }) {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000 } })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')
        formData.append('language', language)

        try {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          })
          const data = await res.json()
          if (data.text) {
            onResult(data.text)
          }
        } catch (err) {
          setError('Transcription failed. Try typing instead.')
        } finally {
          stream.getTracks().forEach(t => t.stop())
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow mic access and try again.')
      } else {
        setError('Could not access microphone. Please type your story prompt.')
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all btn-press ${
          isRecording ? 'animate-pulse' : ''
        }`}
        style={{
          background: isRecording
            ? 'linear-gradient(135deg, #EF4444, #DC2626)'
            : 'var(--theme-gradient, linear-gradient(135deg, #7C3AED, #0284C7))',
          color: 'white',
          boxShadow: isRecording
            ? '0 0 0 0 rgba(239, 68, 68, 0.4)'
            : '0 4px 20px rgba(124, 58, 237, 0.3)',
        }}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <div className="w-5 h-5 rounded-sm bg-white" />
        ) : (
          '🎤'
        )}
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-30" />
            <span className="absolute -bottom-6 text-xs font-semibold text-red-500 animate-pulse">
              Recording...
            </span>
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-500 text-center max-w-xs" role="alert">{error}</p>
      )}
    </div>
  )
}
