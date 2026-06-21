'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Brain, Code2, Mic, GitBranch, Users, Heart,
  ChevronRight, Zap, Target, Building, Loader2
} from 'lucide-react'
import { toast } from 'sonner'

const interviewTypes = [
  { id: 'HR', icon: Heart, label: 'HR Interview', desc: 'Cultural fit, motivations, career goals', color: 'from-blue-500 to-cyan-500', glow: 'rgba(59,130,246,0.3)' },
  { id: 'BEHAVIORAL', icon: Users, label: 'Behavioral', desc: 'STAR method, leadership, conflict resolution', color: 'from-violet-500 to-purple-500', glow: 'rgba(139,92,246,0.3)' },
  { id: 'TECHNICAL', icon: Brain, label: 'Technical', desc: 'CS fundamentals, architecture, best practices', color: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.3)' },
  { id: 'CODING', icon: Code2, label: 'Coding', desc: 'Algorithms, data structures, problem solving', color: 'from-orange-500 to-amber-500', glow: 'rgba(245,158,11,0.3)' },
  { id: 'SYSTEM_DESIGN', icon: GitBranch, label: 'System Design', desc: 'Scalable systems, architecture decisions', color: 'from-pink-500 to-rose-500', glow: 'rgba(236,72,153,0.3)' },
  { id: 'VOICE', icon: Mic, label: 'Voice Interview', desc: 'Spoken responses, communication scoring', color: 'from-cyan-500 to-blue-500', glow: 'rgba(6,182,212,0.3)' },
]

const difficulties = [
  { value: 1, label: 'Junior', desc: '0-2 years experience', color: 'text-success' },
  { value: 2, label: 'Mid-level', desc: '3-5 years experience', color: 'text-primary' },
  { value: 3, label: 'Senior', desc: '6+ years experience', color: 'text-accent' },
]

export function NewInterviewForm() {
  const router = useRouter()
  const [type, setType] = useState<string>('HR')
  const [difficulty, setDifficulty] = useState<number>(2)
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/interview/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, difficulty, jobTitle: jobTitle || undefined, company: company || undefined, jobDescription: jobDescription || undefined }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Failed to create session')
        return
      }

      const session = await res.json()
      toast.success('Interview session created!')

      if (type === 'CODING') {
        router.push(`/interview/coding?sessionId=${session.id}`)
      } else if (type === 'VOICE') {
        router.push(`/interview/voice?sessionId=${session.id}`)
      } else {
        router.push(`/interview/${session.id}`)
      }
    } catch {
      toast.error('Failed to create interview session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Interview type */}
      <div className="glass-card">
        <h2 className="font-semibold font-heading mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Interview Type
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {interviewTypes.map((t) => {
            const Icon = t.icon
            const selected = type === t.id
            return (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 border ${
                  selected
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={selected ? { boxShadow: `0 0 20px ${t.glow}` } : {}}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="font-medium text-sm">{t.label}</div>
                <div className="text-text-secondary text-xs mt-0.5 leading-tight">{t.desc}</div>
                {selected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div className="glass-card">
        <h2 className="font-semibold font-heading mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Difficulty Level
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={`p-4 rounded-xl text-center transition-all border ${
                difficulty === d.value
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-white/8 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className={`font-semibold ${d.color}`}>{d.label}</div>
              <div className="text-text-secondary text-xs mt-1">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Optional context */}
      <div className="glass-card">
        <h2 className="font-semibold font-heading mb-4 flex items-center gap-2">
          <Building className="w-4 h-4 text-primary" />
          Context (Optional)
        </h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-secondary mb-1.5 block">Job Title</label>
              <input
                type="text"
                placeholder="Software Engineer"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className="input-glass text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1.5 block">Company</label>
              <input
                type="text"
                placeholder="Google, Amazon..."
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="input-glass text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1.5 block">Job Description (paste for personalized questions)</label>
            <textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={4}
              className="input-glass text-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Start button */}
      <motion.button
        type="button"
        onClick={handleStart}
        disabled={loading}
        className="btn-primary w-full justify-center py-4 text-base"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Creating session...</>
        ) : (
          <><Brain className="w-5 h-5" /> Start {interviewTypes.find(t => t.id === type)?.label} <ChevronRight className="w-4 h-4" /></>
        )}
      </motion.button>
    </div>
  )
}
