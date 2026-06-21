import type { Metadata } from 'next'
import { VoiceInterview } from '@/components/interview/VoiceInterview'

export const metadata: Metadata = {
  title: 'Voice Interview | AceInterview AI',
  description: 'Practice speaking your answers aloud with AI voice interview',
}

export default function VoiceInterviewPage() {
  return <VoiceInterview />
}
