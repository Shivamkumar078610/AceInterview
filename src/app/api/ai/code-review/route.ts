import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { chatCompletion, AI_MODELS, sanitizeUserInput } from '@/lib/ai/openrouter'

export const runtime = 'nodejs'
export const maxDuration = 30

const schema = z.object({
  code: z.string().max(10000),
  language: z.string().max(50),
  problem: z.string().max(1000).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { code, language, problem } = parsed.data
    const sanitizedCode = sanitizeUserInput(code)

    const prompt = `You are an expert code reviewer. Review the following ${language} code${problem ? ` for this problem: ${problem}` : ''}.

CODE:
\`\`\`${language}
${sanitizedCode}
\`\`\`

Provide your review in the following JSON format:
{
  "score": <0-100>,
  "timeComplexity": "<Big-O notation>",
  "spaceComplexity": "<Big-O notation>",
  "isCorrect": <true|false>,
  "bugs": ["<bug description>"],
  "suggestions": ["<improvement suggestion>"],
  "positives": ["<what was done well>"],
  "optimizedApproach": "<description of a better approach if applicable>",
  "explanation": "<detailed explanation of the code and review>"
}

Only output valid JSON.`

    const result = await chatCompletion(
      [{ role: 'user', content: prompt }],
      AI_MODELS.CODE_REVIEW,
      { temperature: 0.3 }
    )

    const review = JSON.parse(result.content)
    return NextResponse.json(review)
  } catch (error) {
    console.error('Code review error:', error)
    return NextResponse.json({ error: 'Code review failed' }, { status: 500 })
  }
}
