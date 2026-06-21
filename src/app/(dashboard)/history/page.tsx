import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { HistoryList } from '@/components/dashboard/HistoryList'
import { Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Interview History | AceInterview AI',
  description: 'Review your past mock interview sessions, scores, and AI evaluations.',
}

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      difficulty: true,
      overallScore: true,
      duration: true,
      createdAt: true,
      completedAt: true,
      jobTitle: true,
      company: true,
    },
  })

  // Format dates to string to prevent serialization errors across Server-Client boundary
  const serializedSessions = sessions.map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    completedAt: s.completedAt ? s.completedAt.toISOString() : null,
  }))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
          <Clock className="w-7 h-7 text-primary" /> Interview History
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Browse and review your past mock interviews, scores, and detailed AI evaluations.
        </p>
      </div>

      <HistoryList initialSessions={serializedSessions} />
    </div>
  )
}
