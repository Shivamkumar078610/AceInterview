'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Brain,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  Loader2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { getScoreColor } from '@/lib/utils'

interface AnalysisResult {
  atsScore: number
  grammarScore: number
  formatScore: number
  overallScore: number
  summary: string
  strengths: string[]
  improvements: string[]
  keywordsFound: string[]
  keywordsMissing: string[]
  detectedSkills: string[]
  suggestions: Array<{ section: string; suggestion: string; priority: string }>
  atsIssues: string[]
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const color = getScoreColor(score)
  const circumference = 2 * Math.PI * 28
  const strokeDash = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  )
}

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [resumeText, setResumeText] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB.'); return }

    setFile(f)
    setResult(null)
    toast.loading('Extracting text from PDF…', { id: 'parse' })

    const formData = new FormData()
    formData.append('resume', f)

    try {
      const res = await fetch('/api/resume/parse', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setResumeText(data.text || '')
        toast.success('Resume uploaded!', { id: 'parse' })
      } else {
        toast.dismiss('parse')
      }
    } catch {
      toast.dismiss('parse')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!resumeText && !file) { toast.error('Please upload a resume first'); return }
    setAnalyzing(true)
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: resumeText || 'Please analyze based on general best practices.',
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Analysis failed'); return }
      setResult(data)
      toast.success('Analysis complete!')
    } catch {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setResumeText('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Resume Analyzer</h1>
        <p className="text-text-secondary">
          AI-powered ATS optimization and actionable resume feedback
        </p>
      </div>

      {/* Upload zone */}
      {!result && (
        <>
          <div
            {...getRootProps()}
            className={`glass-card border-2 border-dashed cursor-pointer transition-all duration-300 text-center py-14 ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : file
                ? 'border-success/50 bg-success/5'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success/20 border border-success/30 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-white">{file.name}</p>
                  <p className="text-text-secondary text-sm mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB · Click to replace
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {isDragActive ? 'Drop your resume here' : 'Drop your resume here'}
                  </p>
                  <p className="text-text-secondary text-sm">or click to browse · PDF only · Max 5MB</p>
                </div>
              </div>
            )}
          </div>

          {file && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="btn-primary w-full justify-center py-4 text-base"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI…
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" /> Analyze Resume
                </>
              )}
            </button>
          )}
        </>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Score overview */}
            <div className="glass-card">
              <h2 className="font-bold font-heading text-lg mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Analysis Results
              </h2>
              <div className="flex flex-wrap justify-center gap-8 mb-6">
                <ScoreCircle score={result.overallScore} label="Overall" />
                <ScoreCircle score={result.atsScore} label="ATS Score" />
                <ScoreCircle score={result.grammarScore} label="Grammar" />
                <ScoreCircle score={result.formatScore} label="Format" />
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-text-secondary text-sm leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-success mt-0.5 flex-shrink-0">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" /> Improvements
                </h3>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-warning mt-0.5 flex-shrink-0">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keywords */}
            <div className="glass-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Keywords Analysis
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-secondary mb-2">
                    Found ({result.keywordsFound.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordsFound.map((k) => (
                      <span
                        key={k}
                        className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-2">
                    Missing ({result.keywordsMissing.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordsMissing.map((k) => (
                      <span
                        key={k}
                        className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning border border-warning/30"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" /> Improvement Suggestions
              </h3>
              <div className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 self-start mt-0.5 ${
                        s.priority === 'high'
                          ? 'bg-error/20 text-error'
                          : s.priority === 'medium'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {s.priority}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{s.section}</p>
                      <p className="text-text-secondary text-xs mt-0.5">{s.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleReset} className="btn-secondary w-full justify-center">
              <RefreshCw className="w-4 h-4" /> Analyze Another Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
