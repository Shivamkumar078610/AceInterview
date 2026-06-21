import type { Metadata } from 'next'
import { NewInterviewForm } from '@/components/interview/NewInterviewForm'

export const metadata: Metadata = {
  title: 'New Interview | AceInterview AI',
  description: 'Start a new AI interview session',
}

export default function NewInterviewPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Start New Interview</h1>
        <p className="text-text-secondary">
          Configure your interview session and let AI challenge you.
        </p>
      </div>
      <NewInterviewForm />
    </div>
  )
}
