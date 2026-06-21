import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account | AceInterview AI',
  description: 'Create your AceInterview AI account and start practicing',
}

export default function SignupPage() {
  return <SignupForm />
}
