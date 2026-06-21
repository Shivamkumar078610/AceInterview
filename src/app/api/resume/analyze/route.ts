import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { chatCompletion, AI_MODELS, sanitizeUserInput } from '@/lib/ai/openrouter'

export const runtime = 'nodejs'
export const maxDuration = 30

const schema = z.object({
  text: z.string().max(15000),
})

const RESUME_PROMPT = `You are an expert career coach and ATS specialist. Analyze this resume and return a JSON object with this exact structure:

{
  "overallScore": <0-100>,
  "atsScore": <0-100>,
  "grammarScore": <0-100>,
  "formatScore": <0-100>,
  "summary": "<2-3 sentence summary of the resume quality>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "keywordsFound": ["<keyword1>", "<keyword2>"],
  "keywordsMissing": ["<missing keyword1>", "<missing keyword2>"],
  "detectedSkills": ["<skill1>", "<skill2>"],
  "suggestions": [
    {"section": "<section name>", "suggestion": "<specific suggestion>", "priority": "high|medium|low"}
  ],
  "atsIssues": ["<issue1>", "<issue2>"]
}

Return ONLY the JSON object, no other text.`

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const sanitized = sanitizeUserInput(parsed.data.text)

    const result = await chatCompletion(
      [
        { role: 'system', content: RESUME_PROMPT },
        { role: 'user', content: `Resume content:\n\n${sanitized}` },
      ],
      AI_MODELS.RESUME,
      { temperature: 0.3, maxTokens: 2000 }
    )

    // Parse JSON
    const jsonMatch = result.content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response format')

    const analysis = JSON.parse(jsonMatch[0])
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Resume analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
