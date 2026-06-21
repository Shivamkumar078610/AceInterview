import type { Metadata } from 'next'
import { JDMatcherPage } from '@/components/resume/JDMatcher'

export const metadata: Metadata = {
  title: 'JD Matcher | AceInterview AI',
  description: 'Match your resume against a job description',
}

export default function JDMatchPage() {
  return <JDMatcherPage />
}
