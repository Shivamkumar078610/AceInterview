import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

const createSessionSchema = z.object({
  type: z.enum(['HR', 'TECHNICAL', 'BEHAVIORAL', 'CODING', 'SYSTEM_DESIGN', 'VOICE', 'MIXED']),
  difficulty: z.number().min(1).max(3).default(2),
  jobTitle: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  jobDescription: z.string().max(5000).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      difficulty: true,
      overallScore: true,
      duration: true,
      jobTitle: true,
      company: true,
      questionCount: true,
      createdAt: true,
      completedAt: true,
    },
  })

  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = createSessionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { type, difficulty, jobTitle, company, jobDescription } = parsed.data

    // Check usage limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (subscription && subscription.monthlyInterviewLimit !== -1) {
      if (subscription.interviewsUsed >= subscription.monthlyInterviewLimit) {
        return NextResponse.json(
          { error: 'Monthly interview limit reached. Please upgrade your plan.' },
          { status: 429 }
        )
      }
    }

    // Get user profile for resume context
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    const title = `${type} Interview${jobTitle ? ` — ${jobTitle}` : ''}${company ? ` at ${company}` : ''}`

    const interviewSession = await prisma.$transaction(async (tx) => {
      const newSession = await tx.interviewSession.create({
        data: {
          userId: session.user.id,
          title,
          type,
          difficulty,
          jobTitle,
          company,
          jobDescription,
          resumeSnapshot: profile ? {
            skills: profile.skills,
            targetRole: profile.targetRole,
            yearsExperience: profile.yearsExperience,
          } : undefined,
        },
      })

      // Increment interviews used
      await tx.subscription.update({
        where: { userId: session.user.id },
        data: { interviewsUsed: { increment: 1 } },
      })

      return newSession
    })

    return NextResponse.json(interviewSession, { status: 201 })
  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
