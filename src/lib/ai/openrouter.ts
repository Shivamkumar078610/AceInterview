import { EventSourceParser, createParser } from 'eventsource-parser'

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export type AIModel =
  | 'anthropic/claude-3.5-sonnet'
  | 'anthropic/claude-3-haiku'
  | 'openai/gpt-4o'
  | 'openai/gpt-4o-mini'
  | 'google/gemini-2.0-flash-001'
  | 'deepseek/deepseek-r1'
  | 'mistralai/mixtral-8x7b-instruct'
  | 'meta-llama/llama-3.1-8b-instruct:free'
  | 'meta-llama/llama-3.3-70b-instruct:free'
  | 'openrouter/free'

export const AI_MODELS: Record<string, AIModel> = {
  INTERVIEW: 'anthropic/claude-3.5-sonnet',
  CODE_REVIEW: 'openai/gpt-4o',
  QUICK: 'google/gemini-2.0-flash-001',
  RESUME: 'anthropic/claude-3-haiku',
  FALLBACK: 'openrouter/free',
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: { role: string; content: string }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

export interface StreamCallbacks {
  onToken?: (token: string) => void
  onFinish?: (fullText: string, usage: { total_tokens: number }) => void
  onError?: (error: Error) => void
}

// Prompt injection protection
export function sanitizeUserInput(input: string): string {
  // Remove potential injection patterns
  const injectionPatterns = [
    /ignore (all |previous |above |prior )?instructions/gi,
    /disregard (all |previous |above |prior )?instructions/gi,
    /forget (all |previous |above |prior )?instructions/gi,
    /you are now/gi,
    /new persona/gi,
    /jailbreak/gi,
    /dan mode/gi,
    /\[SYSTEM\]/gi,
    /\[INST\]/gi,
    /<\|system\|>/gi,
    /reveal (your |the )?(system |internal |hidden )?prompt/gi,
    /what (are|were) your instructions/gi,
    /print (your |the )?(system |internal )?prompt/gi,
  ]

  let sanitized = input
  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[FILTERED]')
  }

  // Limit length to prevent token exhaustion
  return sanitized.slice(0, 8000)
}

export async function chatCompletion(
  messages: ChatMessage[],
  model: AIModel = AI_MODELS.INTERVIEW,
  options: {
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<{ content: string; usage: { total_tokens: number }; model: string }> {
  let response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'AceInterview AI',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      stream: false,
    }),
  })

  // Automatic fallback to a free model if paid model is unavailable or balance is insufficient
  if (!response.ok && response.status !== 401 && model !== 'openrouter/free') {
    console.warn(`Model ${model} failed with status ${response.status}. Falling back to free openrouter/free.`);
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'AceInterview AI (Fallback)',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
        stream: false,
      }),
    })
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} ${error}`)
  }

  const data = (await response.json()) as OpenRouterResponse
  return {
    content: data.choices[0].message.content,
    usage: { total_tokens: data.usage.total_tokens },
    model: data.model,
  }
}

export async function* streamCompletion(
  messages: ChatMessage[],
  model: AIModel = AI_MODELS.INTERVIEW,
  options: {
    temperature?: number
    maxTokens?: number
  } = {}
): AsyncGenerator<string, void, unknown> {
  let response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'AceInterview AI',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      stream: true,
    }),
  })

  // Automatic fallback to a free model if paid model is unavailable or balance is insufficient
  if (!response.ok && response.status !== 401 && model !== 'openrouter/free') {
    console.warn(`Model ${model} failed with status ${response.status}. Falling back to free openrouter/free.`);
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'AceInterview AI (Fallback)',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
        stream: true,
      }),
    })
  }

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') return
        try {
          const parsed = JSON.parse(data)
          const token = parsed.choices?.[0]?.delta?.content
          if (token) yield token
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}

export function createStreamResponse(
  generator: AsyncGenerator<string, void, unknown>
): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const token of generator) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
          )
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
