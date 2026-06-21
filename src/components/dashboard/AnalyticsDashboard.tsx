'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, Target } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts'

interface SessionData {
  id: string
  type: string
  difficulty: number
  overallScore: number | null
  duration: number | null
  createdAt: Date
}

const TYPE_COLORS: Record<string, string> = {
  HR: '#3B82F6',
  TECHNICAL: '#8B5CF6',
  BEHAVIORAL: '#10B981',
  SYSTEM_DESIGN: '#F59E0B',
  CODING: '#EC4899',
  VOICE: '#06b6d4',
}

export function AnalyticsDashboard({ sessions }: { sessions: SessionData[] }) {
  const totalSessions = sessions.length
  const avgScore = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / totalSessions)
    : 0
  const avgDuration = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.duration ?? 0), 0) / totalSessions / 60)
    : 0

  // Score trend over time
  const trendData = sessions.map((s, i) => ({
    index: i + 1,
    score: s.overallScore ?? 0,
    type: s.type,
  }))

  // Per-type breakdown
  const typeData = Object.entries(
    sessions.reduce((acc, s) => {
      if (!acc[s.type]) acc[s.type] = { count: 0, totalScore: 0 }
      acc[s.type].count++
      acc[s.type].totalScore += s.overallScore ?? 0
      return acc
    }, {} as Record<string, { count: number; totalScore: number }>)
  ).map(([type, data]) => ({
    type,
    count: data.count,
    avgScore: Math.round(data.totalScore / data.count),
    color: TYPE_COLORS[type] || '#3B82F6',
  }))

  // Radar data for skill breakdown
  const radarData = [
    { skill: 'HR', score: typeData.find(t => t.type === 'HR')?.avgScore ?? 0 },
    { skill: 'Technical', score: typeData.find(t => t.type === 'TECHNICAL')?.avgScore ?? 0 },
    { skill: 'Behavioral', score: typeData.find(t => t.type === 'BEHAVIORAL')?.avgScore ?? 0 },
    { skill: 'System Design', score: typeData.find(t => t.type === 'SYSTEM_DESIGN')?.avgScore ?? 0 },
    { skill: 'Coding', score: typeData.find(t => t.type === 'CODING')?.avgScore ?? 0 },
  ]

  const stats = [
    { label: 'Total Sessions', value: totalSessions, icon: BarChart3, color: '#3B82F6' },
    { label: 'Avg Score', value: `${avgScore}/100`, icon: TrendingUp, color: '#10B981' },
    { label: 'Avg Duration', value: `${avgDuration} min`, icon: Clock, color: '#F59E0B' },
    { label: 'Best Score', value: sessions.length > 0 ? Math.max(...sessions.map(s => s.overallScore ?? 0)) : 0, icon: Target, color: '#8B5CF6' },
  ]

  if (totalSessions === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24">
        <BarChart3 className="w-16 h-16 text-text-secondary mx-auto mb-4" />
        <h1 className="text-2xl font-bold font-heading mb-2">No data yet</h1>
        <p className="text-text-secondary mb-6">Complete your first interview to see analytics</p>
        <a href="/interview/new" className="btn-primary">Start First Interview</a>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Analytics</h1>
        <p className="text-text-secondary">Track your interview performance over time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-xs">{stat.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold font-heading">{stat.value}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Score trend */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-semibold font-heading mb-6">Score Progress</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="index" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Session #', position: 'insideBottom', fill: '#94A3B8', dy: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'rgba(11,17,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff' }} />
            <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: '#3B82F6', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Type breakdown + Radar */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-semibold font-heading mb-6">Sessions by Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="type" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(11,17,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff' }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="font-semibold font-heading mb-6">Skill Radar</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
              <Radar name="Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
