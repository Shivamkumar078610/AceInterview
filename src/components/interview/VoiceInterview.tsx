'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Bot, Volume2, Loader2, Brain, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

// Web Speech API types — not in TS DOM lib by default
interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: { resultIndex: number; results: SpeechRecognitionResultList }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

const getSpeechRecognition = (): { new(): SpeechRecognitionInstance } | null => {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) ?? null
}

interface Message {
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

const VOICE_QUESTIONS = [
  "Tell me about yourself and your professional background.",
  "What are your greatest strengths and how do they apply to this role?",
  "Describe a challenging project you've worked on and how you overcame obstacles.",
  "Where do you see yourself in 5 years?",
  "Why are you interested in this position and our company?",
  "How do you handle working under pressure or tight deadlines?",
  "Tell me about a time you demonstrated leadership.",
  "What motivates you in your work?",
]

export function VoiceInterview() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [fillerWords, setFillerWords] = useState(0)
  const [wordsSpoken, setWordsSpoken] = useState(0)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    return () => {
      synthRef.current?.cancel()
      recognitionRef.current?.stop()
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speak = (text: string) => {
    if (!synthRef.current) return
    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Try to use a nice voice
    const voices = synthRef.current.getVoices()
    const preferred = voices.find(
      (v) =>
        v.name.includes('Samantha') ||
        v.name.includes('Google US English') ||
        v.name.includes('Karen')
    )
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    synthRef.current.speak(utterance)
  }

  const startInterview = () => {
    setStarted(true)
    const firstQuestion = VOICE_QUESTIONS[0]
    setMessages([{ role: 'ai', content: firstQuestion, timestamp: new Date() }])
    speak(firstQuestion)
  }

  const startListening = () => {
    const SpeechRecognitionAPI = getSpeechRecognition()
    if (!SpeechRecognitionAPI) {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome.')
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      setTranscript(final || interim)
    }

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        toast.error(`Speech error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)

    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
    setTranscript('')
    toast.success('Listening… Speak your answer!')
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const submitAnswer = async () => {
    if (!transcript.trim()) {
      toast.error('No answer detected. Please try again.')
      return
    }

    const userAnswer = transcript
    setTranscript('')
    stopListening()

    // Count filler words
    const fillers = (userAnswer.match(/\b(um|uh|like|you know|basically|literally|actually|so)\b/gi) || []).length
    setFillerWords((prev) => prev + fillers)
    setWordsSpoken((prev) => prev + userAnswer.split(' ').length)

    const userMsg: Message = { role: 'user', content: userAnswer, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])

    setLoading(true)
    try {
      // Get next question or wrap up
      const nextIdx = currentQuestion + 1
      if (nextIdx < VOICE_QUESTIONS.length) {
        setCurrentQuestion(nextIdx)
        const nextQ = VOICE_QUESTIONS[nextIdx]
        const aiMsg: Message = { role: 'ai', content: nextQ, timestamp: new Date() }
        setMessages((prev) => [...prev, aiMsg])
        speak(nextQ)
      } else {
        const wrapUp = `Thank you! That was the last question. You've answered ${VOICE_QUESTIONS.length} questions. Overall, you spoke ${wordsSpoken + userAnswer.split(' ').length} words and used ${fillerWords + fillers} filler words. Great job practicing your voice interview skills!`
        const aiMsg: Message = { role: 'ai', content: wrapUp, timestamp: new Date() }
        setMessages((prev) => [...prev, aiMsg])
        speak(wrapUp)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-6 shadow-glow-md">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-heading mb-3">Voice Interview Practice</h1>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Practice speaking your answers aloud. The AI will ask you questions and listen to your
            responses. Get feedback on fluency, pace, and filler words.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: '🎤', label: 'Real-time speech recognition' },
              { icon: '🔊', label: 'AI voice questions' },
              { icon: '📊', label: 'Filler word tracking' },
            ].map((f) => (
              <div key={f.label} className="glass rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-xs text-text-secondary">{f.label}</div>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm mb-6">
            ⚠️ This feature requires microphone access and works best in Chrome.
          </p>
          <button onClick={startInterview} className="btn-primary px-10 py-4 text-base">
            <Mic className="w-5 h-5" />
            Start Voice Interview
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="glass-card mb-4 flex items-center justify-between py-3">
        <div>
          <h1 className="font-bold font-heading">Voice Interview</h1>
          <p className="text-text-secondary text-xs">
            Question {Math.min(currentQuestion + 1, VOICE_QUESTIONS.length)} of {VOICE_QUESTIONS.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-lg px-3 py-1.5 text-xs text-text-secondary">
            {wordsSpoken} words · {fillerWords} fillers
          </div>
          {speaking && (
            <div className="flex items-center gap-1.5 text-primary text-xs">
              <Volume2 className="w-4 h-4 animate-pulse" />
              Speaking…
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai'
                  ? 'bg-pink-500/20 border border-pink-500/30'
                  : 'bg-accent/20 border border-accent/30'
              }`}
            >
              {msg.role === 'ai' ? (
                <Bot className="w-4 h-4 text-pink-400" />
              ) : (
                <Mic className="w-4 h-4 text-accent" />
              )}
            </div>
            <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </motion.div>
        ))}

        {/* Live transcript */}
        {isListening && transcript && (
          <motion.div
            className="flex gap-3 flex-row-reverse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Mic className="w-4 h-4 text-accent" />
            </div>
            <div className="chat-bubble-user opacity-70 italic">
              {transcript}
              <span className="inline-block w-1 h-4 bg-accent animate-pulse ml-1" />
            </div>
          </motion.div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Controls */}
      <div className="mt-4 glass-card py-4">
        <div className="flex items-center justify-center gap-4">
          {!isListening ? (
            <motion.button
              onClick={startListening}
              disabled={speaking || loading}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-7 h-7 text-white" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-4">
              <motion.button
                onClick={stopListening}
                className="w-16 h-16 rounded-full bg-error/80 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <MicOff className="w-7 h-7 text-white" />
              </motion.button>
              <button
                onClick={submitAnswer}
                disabled={!transcript.trim() || loading}
                className="btn-primary px-6 py-3"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Answer'}
              </button>
            </div>
          )}
        </div>
        <p className="text-center text-text-secondary text-xs mt-3">
          {isListening
            ? 'Recording… Click the red button to stop, then Submit'
            : speaking
            ? 'AI is speaking… Wait for your turn'
            : 'Click the mic to answer the question'}
        </p>
      </div>
    </div>
  )
}
