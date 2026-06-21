import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center group">
          <img src="/logo.png?v=2" alt="AceInterview AI" className="h-12 w-auto object-contain" />
        </Link>
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}
