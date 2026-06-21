import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { streamCompletion, createStreamResponse, sanitizeUserInput, AI_MODELS } from '@/lib/ai/openrouter'
import { buildInterviewSystemPrompt, buildEvaluationPrompt } from '@/lib/ai/prompts'
import { calculateLevel } from '@/lib/utils'

export const runtime = 'nodejs'
export const maxDuration = 60

const messageSchema = z.object({
  sessionId: z.string(),
  message: z.string().max(4000),
  isEvaluationRequest: z.boolean().optional().default(false),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = messageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { sessionId, message, isEvaluationRequest } = parsed.data

    // Verify session belongs to user
    const interviewSession = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId: session.user.id, status: { in: ['PENDING', 'IN_PROGRESS'] } },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        user: { include: { profile: true, subscription: true } },
      },
    })

    if (!interviewSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check usage limits
    const sub = interviewSession.user.subscription
    if (sub && sub.tokensUsed >= sub.monthlyTokenLimit) {
      return NextResponse.json(
        { error: 'Monthly AI token limit reached. Please upgrade your plan.' },
        { status: 429 }
      )
    }

    // Build conversation history
    const systemPrompt = buildInterviewSystemPrompt({
      type: interviewSession.type as 'HR' | 'TECHNICAL' | 'BEHAVIORAL' | 'SYSTEM_DESIGN',
      difficulty: interviewSession.difficulty as 1 | 2 | 3,
      jobTitle: interviewSession.jobTitle || undefined,
      company: interviewSession.company || undefined,
      skills: interviewSession.user.profile?.skills || [],
      resumeSummary: interviewSession.resumeSnapshot ? JSON.stringify(interviewSession.resumeSnapshot).slice(0, 1000) : undefined,
      questionCount: 8,
    })

    const sanitizedMessage = sanitizeUserInput(message)

    const conversationMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...interviewSession.messages.map(m => ({
        role: m.role.toLowerCase() as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: sanitizedMessage },
    ]

    // Handle evaluation request
    if (isEvaluationRequest) {
      const evaluationPrompt = buildEvaluationPrompt(
        conversationMessages,
        {
          type: interviewSession.type as 'HR' | 'TECHNICAL' | 'BEHAVIORAL' | 'SYSTEM_DESIGN',
          difficulty: interviewSession.difficulty as 1 | 2 | 3,
        }
      )

      const generator = streamCompletion(
        [{ role: 'user', content: evaluationPrompt }],
        AI_MODELS.INTERVIEW,
        { temperature: 0.3 }
      )

      let fullResponse = ''
      const wrappedGenerator = async function* () {
        for await (const token of generator) {
          fullResponse += token
          yield token
        }

        // Parse overallScore and details from JSON
        let scores: Record<string, number | null> = {
          overallScore: 70,
          technicalScore: null,
          communicationScore: null,
          confidenceScore: null,
          problemSolvingScore: null,
          leadershipScore: null,
        }
        let strengths: string[] = []
        let improvements: string[] = []
        let rawJson: any = {}

        try {
          const jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            rawJson = JSON.parse(jsonMatch[0])
            if (typeof rawJson.overallScore === 'number') scores.overallScore = rawJson.overallScore
            if (typeof rawJson.technicalScore === 'number') scores.technicalScore = rawJson.technicalScore
            if (typeof rawJson.communicationScore === 'number') scores.communicationScore = rawJson.communicationScore
            if (typeof rawJson.confidenceScore === 'number') scores.confidenceScore = rawJson.confidenceScore
            if (typeof rawJson.problemSolvingScore === 'number') scores.problemSolvingScore = rawJson.problemSolvingScore
            if (typeof rawJson.leadershipScore === 'number') scores.leadershipScore = rawJson.leadershipScore
            if (Array.isArray(rawJson.strengths)) strengths = rawJson.strengths
            if (Array.isArray(rawJson.improvements)) improvements = rawJson.improvements
          }
        } catch (e) {
          console.error('Failed to parse evaluation JSON:', e)
        }

        // Save evaluation to DB as an ASSISTANT message, update session status and overall score
        await prisma.interviewMessage.create({
          data: {
            sessionId,
            role: 'ASSISTANT',
            content: fullResponse,
            isQuestion: false,
          },
        })

        await prisma.interviewSession.update({
          where: { id: sessionId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            overallScore: scores.overallScore,
            technicalScore: scores.technicalScore,
            communicationScore: scores.communicationScore,
            confidenceScore: scores.confidenceScore,
            problemSolvingScore: scores.problemSolvingScore,
            leadershipScore: scores.leadershipScore,
            strengths,
            improvements,
            aiFeedback: rawJson,
          },
        })

        // Gamification: Update user profile with new XP and level
        try {
          const completedSessions = await prisma.interviewSession.findMany({
            where: { userId: session.user.id, status: 'COMPLETED', NOT: { id: sessionId } },
            select: { overallScore: true },
          })
          const allScores = completedSessions.map(s => s.overallScore || 0)
          if (scores.overallScore !== null) {
            allScores.push(scores.overallScore)
          }
          const newAvgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0
          const xpEarned = 150 + (scores.overallScore ? Math.round(scores.overallScore * 2) : 0)

          const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id }
          })
          const newTotalXp = (profile?.totalXp || 0) + xpEarned
          const newLevel = calculateLevel(newTotalXp)

          await prisma.profile.update({
            where: { userId: session.user.id },
            data: {
              totalInterviews: { increment: 1 },
              avgScore: newAvgScore,
              totalXp: newTotalXp,
              level: newLevel,
            }
          })

          await prisma.xpLog.create({
            data: {
              userId: session.user.id,
              amount: xpEarned,
              reason: `Completed ${interviewSession.type} Interview`,
              sourceType: 'interview',
              sourceId: sessionId,
            }
          })
        } catch (profileErr) {
          console.error('Failed to update gamification profile stats:', profileErr)
        }
      }

      return createStreamResponse(wrappedGenerator())
    }

    // Save user message
    await prisma.interviewMessage.create({
      data: {
        sessionId,
        role: 'USER',
        content: sanitizedMessage,
        questionNumber: interviewSession.messages.filter(m => m.role === 'USER').length + 1,
      },
    })

    // Update session to in progress
    if (interviewSession.status === 'PENDING') {
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: { status: 'IN_PROGRESS', startedAt: new Date() },
      })
    }

    // Stream AI response
    const generator = streamCompletion(
      conversationMessages,
      AI_MODELS.INTERVIEW,
      { temperature: 0.7, maxTokens: 1500 }
    )

    // We need to collect the full response to save it
    let fullResponse = ''
    const wrappedGenerator = async function* () {
      for await (const token of generator) {
        fullResponse += token
        yield token
      }

      // Save assistant message after streaming completes
      await prisma.interviewMessage.create({
        data: {
          sessionId,
          role: 'ASSISTANT',
          content: fullResponse,
          isQuestion: true,
          questionNumber: interviewSession.messages.filter(m => m.role === 'ASSISTANT').length + 1,
        },
      })

      // Update question count and token usage (approximate)
      const tokensApprox = Math.ceil((systemPrompt.length + sanitizedMessage.length + fullResponse.length) / 4)
      await prisma.$transaction([
        prisma.interviewSession.update({
          where: { id: sessionId },
          data: {
            questionCount: { increment: 1 },
            tokensUsed: { increment: tokensApprox },
          },
        }),
        prisma.subscription.update({
          where: { userId: session.user.id },
          data: { tokensUsed: { increment: tokensApprox } },
        }),
      ])
    }

    return createStreamResponse(wrappedGenerator())
  } catch (error) {
    console.error('Interview AI error:', error)
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }
}
