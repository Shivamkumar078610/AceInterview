'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Brain, Code2, Mic, FileText, TrendingUp, Trophy,
  Target, Zap, ArrowRight, Clock,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatRelativeTime, getScoreColor } from '@/lib/utils'

interface RecentSession {
  id: string
  title: string
  type: string
  status: string
  overallScore: number | null
  duration: number | null
  createdAt: Date
  completedAt: Date | null
}

interface DashboardData {
  user: { name?: string | null; email?: string | null }
  profile: {
    totalXp: number
    level: number
    targetRole?: string | null
  } | null
  subscription: {
    plan: string
    interviewsUsed: number
    monthlyInterviewLimit: number
  } | null
  recentSessions: RecentSession[]
  stats: {
    totalInterviews: number
    avgScore: number
    totalXp: number
    level: number
    interviewsUsed: number
    interviewsLimit: number
  }
  chartData: Array<{ label: string; score: number; type: string }>
}

const quickActions = [
  {
    icon: Brain,
    label: 'HR Interview',
    href: '/interview/new?type=HR',
    color: 'from-blue-500 to-cyan-500',
    desc: 'Cultural fit & motivations',
  },
  {
    icon: Code2,
    label: 'Coding',
    href: '/interview/coding',
    color: 'from-violet-500 to-purple-500',
    desc: 'Algorithms & data structures',
  },
  {
    icon: Mic,
    label: 'Voice Interview',
    href: '/interview/voice',
    color: 'from-pink-500 to-rose-500',
    desc: 'Communication skills',
  },
  {
    icon: FileText,
    label: 'Resume',
    href: '/resume',
    color: 'from-emerald-500 to-teal-500',
    desc: 'ATS optimization',
  },
]

const typeColors: Record<string, string> = {
  HR: '#3B82F6',
  TECHNICAL: '#8B5CF6',
  BEHAVIORAL: '#10B981',
  CODING: '#F59E0B',
  SYSTEM_DESIGN: '#EC4899',
  VOICE: '#06b6d4',
}

export function DashboardContent({ data }: { data: DashboardData }) {
  const { user, profile, subscription, recentSessions, stats, chartData } = data
  const firstName = user.name?.split(' ')[0] || 'there'
  const usagePercent = Math.min(
    (stats.interviewsUsed / (stats.interviewsLimit === -1 ? 100 : stats.interviewsLimit || 5)) * 100,
    100
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading">
            Good {greeting},{' '}
            <span className="gradient-text">{firstName}!</span> 👋
          </h1>
          <p className="text-text-secondary mt-1">
            {profile?.targetRole
              ? `Preparing for ${profile.targetRole} roles`
              : 'Ready to ace your next interview?'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-warning" fill="currentColor" />
            <span className="text-sm font-semibold">Level {stats.level}</span>
          </div>
          <Link href="/interview/new" className="btn-primary text-sm">
            <Brain className="w-4 h-4" />
            Start Interview
          </Link>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Interviews', value: stats.totalInterviews, icon: Brain, color: '#3B82F6' },
          { label: 'Avg Score', value: `${stats.avgScore}/100`, icon: TrendingUp, color: '#10B981' },
          { label: 'Total XP', value: stats.totalXp.toLocaleString(), icon: Zap, color: '#F59E0B' },
          {
            label: 'This Month',
            value: `${stats.interviewsUsed}/${stats.interviewsLimit === -1 ? '∞' : stats.interviewsLimit}`,
            icon: Target,
            color: '#8B5CF6',
            showBar: true,
          },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-xs font-medium">{stat.label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold font-heading">{stat.value}</div>
              {stat.showBar && stats.interviewsLimit !== -1 && (
                <div className="progress-bar mt-2">
                  <div className="progress-fill" style={{ width: `${usagePercent}%` }} />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold font-heading mb-4">Quick Start</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.label} href={action.href}>
                <div className="glass-card hover:border-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:shadow-glow-sm transition-all`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-semibold text-white text-sm mb-1">{action.label}</div>
                  <div className="text-text-secondary text-xs">{action.desc}</div>
                  <ArrowRight className="w-4 h-4 text-text-secondary mt-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Chart + Sessions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress chart */}
        <motion.div
          className="glass-card lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold font-heading">Score Progress</h2>
            <span className="badge-primary text-xs">Last {chartData.length} sessions</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(11,17,32,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                  dot={{ fill: '#3B82F6', r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center">
              <TrendingUp className="w-10 h-10 text-text-secondary mb-3" />
              <p className="text-text-secondary text-sm">Complete your first interview to see progress</p>
              <Link href="/interview/new" className="btn-primary text-sm mt-4">
                Start Now
              </Link>
            </div>
          )}
        </motion.div>

        {/* Recent sessions */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-heading">Recent Sessions</h2>
            <Link href="/history" className="text-primary text-xs hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <Link key={session.id} href={`/interview/${session.id}`}>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${typeColors[session.type] || '#3B82F6'}20` }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ color: typeColors[session.type] || '#3B82F6' }}
                      >
                        {session.type[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{session.title}</p>
                      <p className="text-xs text-text-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(session.createdAt)}
                      </p>
                    </div>
                    {session.overallScore !== null && (
                      <span
                        className="text-sm font-bold flex-shrink-0"
                        style={{ color: getScoreColor(session.overallScore) }}
                      >
                        {session.overallScore}
                      </span>
                    )}
                    {session.status === 'IN_PROGRESS' && (
                      <span className="badge-primary text-xs flex-shrink-0">Live</span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <Brain className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                <p className="text-text-secondary text-xs">No sessions yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
