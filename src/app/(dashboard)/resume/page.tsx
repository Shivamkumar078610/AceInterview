import type { Metadata } from 'next'
import { ResumeAnalyzer } from '@/components/resume/ResumeAnalyzer'

export const metadata: Metadata = {
  title: 'Resume Analyzer | AceInterview AI',
  description: 'AI-powered ATS resume analysis and optimization',
}

export default function ResumePage() {
  return <ResumeAnalyzer />
}
