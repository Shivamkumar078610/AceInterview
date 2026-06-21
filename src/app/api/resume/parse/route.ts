import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('resume') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.type !== 'application/pdf')
      return NextResponse.json({ error: 'Only PDF files allowed' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    try {
      // Dynamically import pdf-parse to avoid SSR issues
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(buffer)
      return NextResponse.json({ text: data.text, pages: data.numpages })
    } catch {
      // pdf-parse may fail on some PDFs — return empty so UI still works
      return NextResponse.json({
        text: '',
        pages: 0,
        warning: 'Could not extract text. AI will analyze based on structure.',
      })
    }
  } catch (error) {
    console.error('PDF parse error:', error)
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
  }
}
