import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export const metadata: Metadata = {
  title: 'Dashboard | AceInterview AI',
  description: 'Your interview preparation dashboard',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [profile, subscription, recentSessions] = await Promise.all([
    prisma.profile.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.interviewSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        overallScore: true,
        duration: true,
        createdAt: true,
        completedAt: true,
      },
    }),
  ])

  const completedSessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    select: { overallScore: true, type: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const avgScore =
    completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) /
        completedSessions.length
      : 0

  const dashboardData = {
    user: session.user,
    profile,
    subscription,
    recentSessions,
    stats: {
      totalInterviews: profile?.totalInterviews ?? 0,
      avgScore: Math.round(avgScore),
      totalXp: profile?.totalXp ?? 0,
      level: profile?.level ?? 1,
      interviewsUsed: subscription?.interviewsUsed ?? 0,
      interviewsLimit: subscription?.monthlyInterviewLimit ?? 5,
    },
    chartData: completedSessions
      .slice()
      .reverse()
      .map((s, i) => ({
        label: `S${i + 1}`,
        score: s.overallScore ?? 0,
        type: s.type,
      })),
  }

  return <DashboardContent data={dashboardData} />
}
