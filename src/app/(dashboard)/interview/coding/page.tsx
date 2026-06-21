import type { Metadata } from 'next'
import { CodingInterview } from '@/components/interview/CodingInterview'

export const metadata: Metadata = { title: 'Coding Interview | AceInterview AI' }

export default function CodingPage() {
  return <CodingInterview />
}
