'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Search, Brain, Clock, Calendar, ArrowRight, Filter, ChevronRight,
  TrendingUp, Award, PlayCircle, ClipboardCheck, Trash2
} from 'lucide-react'
import { formatRelativeTime, getScoreColor, formatDuration } from '@/lib/utils'

interface Session {
  id: string
  title: string
  type: string
  status: string
  difficulty: number
  overallScore: number | null
  duration: number | null
  createdAt: Date | string
  completedAt: Date | string | null
  jobTitle?: string | null
  company?: string | null
}

const TYPE_COLORS: Record<string, string> = {
  HR: '#3B82F6',
  TECHNICAL: '#8B5CF6',
  BEHAVIORAL: '#10B981',
  CODING: '#F59E0B',
  SYSTEM_DESIGN: '#EC4899',
  VOICE: '#06b6d4',
  MIXED: '#64748B',
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
}

export function HistoryList({ initialSessions }: { initialSessions: Session[] }) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [difficultyFilter, setDifficultyFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('newest')

  // Calculate statistics
  const stats = useMemo(() => {
    const completed = sessions.filter(s => s.status === 'COMPLETED')
    const totalCount = sessions.length
    const completedCount = completed.length
    
    const avgScore = completedCount > 0
      ? Math.round(completed.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / completedCount)
      : 0
      
    const totalDurationSeconds = sessions.reduce((sum, s) => sum + (s.duration ?? 0), 0)
    const totalHours = Math.floor(totalDurationSeconds / 3600)
    const totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60)
    const totalTimeString = totalHours > 0 
      ? `${totalHours}h ${totalMinutes}m` 
      : `${totalMinutes}m`

    return {
      totalCount,
      completedCount,
      avgScore,
      totalTimeString,
    }
  }, [sessions])

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    return sessions
      .filter(s => {
        const matchesSearch = 
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          (s.jobTitle && s.jobTitle.toLowerCase().includes(search.toLowerCase())) ||
          (s.company && s.company.toLowerCase().includes(search.toLowerCase()))

        const matchesType = typeFilter === 'ALL' || s.type === typeFilter
        const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
        const matchesDifficulty = difficultyFilter === 'ALL' || s.difficulty.toString() === difficultyFilter

        return matchesSearch && matchesType && matchesStatus && matchesDifficulty
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
        if (sortBy === 'score_desc') {
          return (b.overallScore ?? 0) - (a.overallScore ?? 0)
        }
        if (sortBy === 'score_asc') {
          return (a.overallScore ?? 999) - (b.overallScore ?? 999)
        }
        if (sortBy === 'duration') {
          return (b.duration ?? 0) - (a.duration ?? 0)
        }
        return 0
      })
  }, [sessions, search, typeFilter, statusFilter, difficultyFilter, sortBy])

  // Delete session handler
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) return

    try {
      const res = await fetch(`/api/interview/sessions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== id))
      } else {
        alert('Failed to delete session')
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting session')
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: stats.totalCount, icon: Brain, color: '#3B82F6' },
          { label: 'Completed', value: stats.completedCount, icon: ClipboardCheck, color: '#10B981' },
          { label: 'Avg Score', value: `${stats.avgScore}/100`, icon: TrendingUp, color: '#F59E0B' },
          { label: 'Practice Time', value: stats.totalTimeString, icon: Clock, color: '#8B5CF6' }
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className="glass-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-xs font-medium">{stat.label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold font-heading">{stat.value}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Filters Toolbar */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by title, role, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glass pl-9 pr-4 py-2 w-full text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-glass py-1.5 px-3 w-auto text-xs"
            >
              <option value="ALL">All Types</option>
              <option value="HR">HR Interview</option>
              <option value="TECHNICAL">Technical</option>
              <option value="BEHAVIORAL">Behavioral</option>
              <option value="CODING">Coding</option>
              <option value="SYSTEM_DESIGN">System Design</option>
              <option value="VOICE">Voice</option>
              <option value="MIXED">Mixed</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input-glass py-1.5 px-3 w-auto text-xs"
            >
              <option value="ALL">All Levels</option>
              <option value="1">Junior (Easy)</option>
              <option value="2">Mid-Level (Medium)</option>
              <option value="3">Senior (Hard)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-glass py-1.5 px-3 w-auto text-xs"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING">Pending</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-glass py-1.5 px-3 w-auto text-xs"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score_desc">Highest Score</option>
              <option value="score_asc">Lowest Score</option>
              <option value="duration">Longest Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                className="group relative"
              >
                <Link href={`/interview/${session.id}`}>
                  <div className="glass-card p-4 hover:bg-white/5 transition-all duration-300 hover:border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer">
                    <div className="flex items-start gap-4">
                      {/* Color Coded Indicator Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${TYPE_COLORS[session.type] || '#3B82F6'}18` }}
                      >
                        <Brain
                          className="w-5 h-5"
                          style={{ color: TYPE_COLORS[session.type] || '#3B82F6' }}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-sm sm:text-base">
                            {session.title}
                          </h3>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: `${TYPE_COLORS[session.type] || '#3B82F6'}15`,
                              color: TYPE_COLORS[session.type] || '#3B82F6',
                              border: `1px solid ${TYPE_COLORS[session.type] || '#3B82F6'}30`
                            }}
                          >
                            {session.type}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-text-secondary">
                            {DIFFICULTY_LABELS[session.difficulty]}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(session.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          {session.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(session.duration)}
                            </span>
                          )}
                          {session.company && (
                            <span className="text-text-secondary/70">
                              @{session.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                      {/* Status & Score */}
                      <div className="flex items-center gap-3">
                        {session.status === 'COMPLETED' ? (
                          <>
                            {session.overallScore !== null && (
                              <div className="flex flex-col items-end">
                                <span
                                  className="text-lg font-bold font-heading"
                                  style={{ color: getScoreColor(session.overallScore) }}
                                >
                                  {session.overallScore}
                                </span>
                                <span className="text-[9px] text-text-secondary tracking-wider uppercase">Score</span>
                              </div>
                            )}
                            <span className="badge-success text-[10px]">Completed</span>
                          </>
                        ) : session.status === 'IN_PROGRESS' ? (
                          <>
                            <span className="badge-primary text-[10px] flex items-center gap-1 animate-pulse">
                              <PlayCircle className="w-3 h-3" /> Live Session
                            </span>
                          </>
                        ) : (
                          <span className="badge-warning text-[10px]">Pending</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDelete(session.id, e)}
                          className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          title="Delete Session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <ChevronRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="glass-card text-center py-16">
              <Brain className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-60" />
              <h3 className="font-semibold text-lg mb-1">No sessions match your search</h3>
              <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
                Try adjusting your search criteria, type, difficulty or status filters.
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setTypeFilter('ALL')
                  setDifficultyFilter('ALL')
                  setStatusFilter('ALL')
                }}
                className="btn-secondary text-xs"
              >
                Clear all filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
