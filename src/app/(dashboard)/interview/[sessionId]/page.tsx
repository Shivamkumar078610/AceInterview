import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { InterviewChat } from '@/components/interview/InterviewChat'

export const metadata: Metadata = { title: 'Interview Session | AceInterview AI' }

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const interviewSession = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!interviewSession) notFound()

  return <InterviewChat session={interviewSession} user={session.user} />
}
