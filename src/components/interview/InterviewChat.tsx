'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Loader2, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: string  // Prisma MessageRole enum: USER | ASSISTANT | SYSTEM
  content: string
  createdAt: Date
}

interface InterviewSession {
  id: string
  title: string
  type: string
  difficulty: number
  status: string
  messages: Message[]
  [key: string]: unknown
}

interface EvaluationData {
  overallScore?: number
  communicationScore?: number
  problemSolvingScore?: number
  technicalScore?: number
  summary?: string
  strengths?: string[]
  improvements?: string[]
}

export function InterviewChat({
  session,
  user,
}: {
  session: InterviewSession
  user: { name?: string | null }
}) {
  const [messages, setMessages] = useState<Message[]>(session.messages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [isComplete, setIsComplete] = useState(session.status === 'COMPLETED')
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(() => {
    if (session.status === 'COMPLETED') {
      if (session.aiFeedback) {
        try {
          if (typeof session.aiFeedback === 'string') {
            return JSON.parse(session.aiFeedback)
          } else if (typeof session.aiFeedback === 'object' && session.aiFeedback !== null) {
            return session.aiFeedback as EvaluationData
          }
        } catch (e) {
          console.error('Failed to parse initial evaluation feedback:', e)
        }
      }
      
      // Fallback: search messages for JSON structure
      const lastAssistantMsg = [...session.messages]
        .reverse()
        .find(m => m.role === 'ASSISTANT')
      if (lastAssistantMsg) {
        try {
          const jsonMatch = lastAssistantMsg.content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as EvaluationData
          }
        } catch {
          // ignore
        }
      }
    }
    return null
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autoStarted = useRef(false)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  // Auto-start with first AI question if no messages
  useEffect(() => {
    if (messages.length === 0 && !autoStarted.current) {
      autoStarted.current = true
      handleSend("Hello, I'm ready to start the interview.")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const streamResponse = async (body: object) => {
    setLoading(true)
    setStreamingContent('')

    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'AI error occurred')
        return null
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')

      const decoder = new TextDecoder()
      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.token) {
                fullResponse += parsed.token
                setStreamingContent(fullResponse)
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }

      setStreamingContent('')
      return fullResponse
    } catch {
      toast.error('Connection error. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (overrideMessage?: string) => {
    const messageText = overrideMessage || input.trim()
    if (!messageText || loading) return

    setInput('')

    if (!overrideMessage) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'USER',
          content: messageText,
          createdAt: new Date(),
        },
      ])
    }

    const fullResponse = await streamResponse({
      sessionId: session.id,
      message: messageText,
    })

    if (fullResponse) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ASSISTANT',
          content: fullResponse,
          createdAt: new Date(),
        },
      ])
    }
  }

  const handleFinish = async () => {
    if (!confirm('Finish the interview and get your AI evaluation?')) return

    const fullResponse = await streamResponse({
      sessionId: session.id,
      message: 'Please evaluate my overall performance.',
      isEvaluationRequest: true,
    })

    if (fullResponse) {
      // Try to parse JSON evaluation
      try {
        const jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          setEvaluation(JSON.parse(jsonMatch[0]))
        }
      } catch {
        // Show raw response
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ASSISTANT',
          content: fullResponse,
          createdAt: new Date(),
        },
      ])
      setIsComplete(true)
      toast.success('Interview complete! View your evaluation below.')
    }
  }

  const questionCount = messages.filter((m) => m.role === 'ASSISTANT').length

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="glass-card mb-4 flex items-center justify-between py-3">
        <div>
          <h1 className="font-bold font-heading">{session.title}</h1>
          <p className="text-text-secondary text-xs">
            {session.type} · {questionCount} questions asked
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isComplete && questionCount >= 5 && (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Finish & Evaluate
            </button>
          )}
          {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ASSISTANT'
                  ? 'bg-primary/20 border border-primary/30'
                  : 'bg-accent/20 border border-accent/30'
              }`}
            >
              {msg.role === 'ASSISTANT' ? (
                <Bot className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-accent" />
              )}
            </div>
            <div className={msg.role === 'ASSISTANT' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Streaming */}
        {loading && streamingContent && (
          <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="chat-bubble-ai">
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{streamingContent}</ReactMarkdown>
              </div>
              <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-1" />
            </div>
          </motion.div>
        )}

        {/* Typing indicator */}
        {loading && !streamingContent && (
          <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="chat-bubble-ai">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/60"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Evaluation */}
        {evaluation && isComplete && (
          <motion.div
            className="glass-card border border-success/30 mt-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="font-bold font-heading text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-success" />
              Interview Evaluation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Overall', value: evaluation.overallScore },
                { label: 'Communication', value: evaluation.communicationScore },
                { label: 'Problem Solving', value: evaluation.problemSolvingScore },
              ]
                .filter((s) => s.value != null)
                .map((s) => (
                  <div key={s.label} className="text-center glass rounded-xl p-3">
                    <div className="text-2xl font-bold gradient-text">{s.value}</div>
                    <div className="text-text-secondary text-xs">{s.label}</div>
                  </div>
                ))}
            </div>
            {evaluation.summary && (
              <p className="text-text-secondary text-sm mb-4">{evaluation.summary}</p>
            )}
            <div className="flex gap-3">
              <a href="/dashboard" className="btn-primary text-sm">
                Back to Dashboard
              </a>
              <a href="/interview/new" className="btn-secondary text-sm">
                New Interview
              </a>
            </div>
          </motion.div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      {!isComplete && (
        <div className="mt-4 glass-card py-3">
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type your response… (Enter to send, Shift+Enter for new line)"
              className="flex-1 input-glass resize-none min-h-[44px] max-h-[120px] text-sm py-3"
              disabled={loading}
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="btn-primary p-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-text-secondary text-xs mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  )
}
