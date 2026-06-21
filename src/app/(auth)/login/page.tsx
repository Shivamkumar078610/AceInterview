import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | AceInterview AI',
  description: 'Sign in to your AceInterview AI account',
}

export default function LoginPage() {
  return <LoginForm />
}
