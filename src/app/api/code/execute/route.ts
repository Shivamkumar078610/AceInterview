import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'

export const runtime = 'nodejs'

const schema = z.object({
  language: z.string().max(50),
  code: z.string().max(20000),
  stdin: z.string().max(1000).optional().default(''),
  version: z.string().optional().default('*'),
})

const PISTON_API = 'https://emkc.org/api/v2/piston'

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

    const { language, code, stdin, version } = parsed.data

    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        version,
        files: [{ content: code }],
        stdin,
        args: [],
        run_timeout: 10000,  // 10 second timeout
        compile_timeout: 10000,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      throw new Error('Code execution service unavailable')
    }

    const result = await response.json()
    return NextResponse.json({
      stdout: result.run?.stdout || '',
      stderr: result.run?.stderr || result.compile?.stderr || '',
      exitCode: result.run?.code ?? -1,
      language: result.language,
      version: result.version,
    })
  } catch (error) {
    console.error('Code execution error:', error)
    return NextResponse.json(
      { error: 'Code execution failed. Please try again.' },
      { status: 500 }
    )
  }
}
