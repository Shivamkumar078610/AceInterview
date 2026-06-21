import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard'

export const metadata: Metadata = { title: 'Analytics | AceInterview AI' }

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      type: true,
      difficulty: true,
      overallScore: true,
      duration: true,
      createdAt: true,
    },
    take: 50,
  })

  return <AnalyticsDashboard sessions={sessions} />
}
