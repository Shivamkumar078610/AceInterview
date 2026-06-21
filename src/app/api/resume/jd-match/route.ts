import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { chatCompletion, AI_MODELS, sanitizeUserInput } from '@/lib/ai/openrouter'
import { buildJDMatchPrompt } from '@/lib/ai/prompts'

export const runtime = 'nodejs'
export const maxDuration = 30

const schema = z.object({
  resumeText: z.string().max(10000),
  jdText: z.string().max(10000),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const prompt = buildJDMatchPrompt(parsed.data.resumeText, parsed.data.jdText)

    const result = await chatCompletion(
      [{ role: 'user', content: prompt }],
      AI_MODELS.QUICK,
      { temperature: 0.3, maxTokens: 2000 }
    )

    const jsonMatch = result.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (error) {
    console.error('JD match error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
