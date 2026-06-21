'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, FileText, Brain, Loader2, CheckCircle, AlertCircle, TrendingUp, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface MatchResult {
  matchScore: number
  skillGaps: string[]
  matchingSkills: string[]
  missingKeywords: string[]
  summary: string
  optimizations: string[]
  customQuestions: Array<{ question: string; tip: string }>
  learningRoadmap: Array<{ skill: string; priority: string; timeEstimate: string }>
}

export function JDMatcherPage() {
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)

  const handleMatch = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      toast.error('Please fill in both your resume and the job description')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/resume/jd-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jdText }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Analysis failed'); return }
      setResult(data)
      toast.success('JD match analysis complete!')
    } catch {
      toast.error('Failed to analyze. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) =>
    score >= 80 ? '#10B981' : score >= 60 ? '#3B82F6' : score >= 40 ? '#F59E0B' : '#EF4444'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">JD Matcher</h1>
        <p className="text-text-secondary">Paste your resume and a job description to get an AI match score and gap analysis</p>
      </div>

      {!result && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Your Resume
              </label>
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your resume text here…"
                className="input-glass h-64 resize-none text-xs leading-relaxed"
              />
              <p className="text-text-secondary text-xs mt-1">{resumeText.length} characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" /> Job Description
              </label>
              <textarea
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                placeholder="Paste the job description here…"
                className="input-glass h-64 resize-none text-xs leading-relaxed"
              />
              <p className="text-text-secondary text-xs mt-1">{jdText.length} characters</p>
            </div>
          </div>

          <button
            onClick={handleMatch}
            disabled={loading || !resumeText.trim() || !jdText.trim()}
            className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing match…</>
            ) : (
              <><Brain className="w-5 h-5" /> Analyze Match</>
            )}
          </button>
        </>
      )}

      <AnimatePresence>
        {result && (
          <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Score */}
            <div className="glass-card text-center py-8">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                  <motion.circle
                    cx="64" cy="64" r="56"
                    stroke={getScoreColor(result.matchScore)}
                    strokeWidth="12" fill="none"
                    strokeDasharray={`${(result.matchScore / 100) * 351.9} 351.9`}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 351.9` }}
                    animate={{ strokeDasharray: `${(result.matchScore / 100) * 351.9} 351.9` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: getScoreColor(result.matchScore) }}>
                    {result.matchScore}%
                  </span>
                  <span className="text-text-secondary text-xs">Match</span>
                </div>
              </div>
              <p className="text-text-secondary max-w-lg mx-auto text-sm">{result.summary}</p>
            </div>

            {/* Skills */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" /> Matching Skills ({result.matchingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchingSkills.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30">{s}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" /> Skill Gaps ({result.skillGaps.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.skillGaps.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning border border-warning/30">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Likely questions */}
            <div className="glass-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> Likely Interview Questions
              </h3>
              <div className="space-y-3">
                {result.customQuestions.slice(0, 5).map((q, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5">
                    <p className="text-sm font-medium text-white mb-1">Q: {q.question}</p>
                    <p className="text-text-secondary text-xs">💡 {q.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning roadmap */}
            <div className="glass-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" /> Learning Roadmap
              </h3>
              <div className="space-y-2">
                {result.learningRoadmap.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      item.priority === 'high' ? 'bg-error/20 text-error' :
                      item.priority === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-primary/20 text-primary'
                    }`}>{item.priority}</span>
                    <span className="text-sm flex-1">{item.skill}</span>
                    <span className="text-text-secondary text-xs flex-shrink-0">{item.timeEstimate}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <a href="/interview/new" className="btn-primary flex-1 justify-center">
                <Brain className="w-4 h-4" /> Practice Interview
              </a>
              <button onClick={() => setResult(null)} className="btn-secondary flex-1 justify-center">
                <Zap className="w-4 h-4" /> Analyze Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
