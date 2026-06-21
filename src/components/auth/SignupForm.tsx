'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Check, Eye, EyeOff, Loader2, ArrowRight, Chrome, Github, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

const passwordRequirements = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
]

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [isPrivacyMode, setIsPrivacyMode] = useState(false)

  // Magnetic CTA Button state & handlers
  const ctaBtnRef = useRef<HTMLButtonElement>(null)
  const [magneticStyle, setMagneticStyle] = useState<React.CSSProperties>({})

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ctaBtnRef.current) return
    const rect = ctaBtnRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setMagneticStyle({
      transform: `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`,
    })
  }

  const handleMouseLeave = () => {
    setMagneticStyle({
      transform: 'translate(0px, 0px) scale(1)',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    })
  }

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      })

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.error || 'Registration failed')
        return
      }

      // Auto sign in
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        toast.success('Account created! Welcome to AceInterview AI 🎉')
        router.push('/dashboard')
        router.refresh()
      } else {
        router.push('/login')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: string) => {
    setOauthLoading(provider)
    await signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="flex w-full min-h-screen">
      
      {/* Left Side: Mascot Canvas (60%) */}
      <div className="hidden lg:flex w-[60%] relative items-center justify-center border-r border-white/5 overflow-hidden">
        {/* Subtle Grid overlay */}
        <div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVoNDBNMzkuNSAwdi00MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50 z-0" 
        />
        
        <div 
          id="mascot-wrapper" 
          className={`relative z-10 flex flex-col items-center mascot-container animate-fade-in ${isPrivacyMode ? 'privacy-mode' : ''}`}
        >
          <img 
            id="ace-mascot"
            className="w-[400px] h-auto object-contain drop-shadow-[0_0_40px_rgba(45,91,255,0.3)] transition-all duration-500" 
            alt="AI Mascot"
            src="https://lh3.googleusercontent.com/aida/AP1WRLsr1nGwkMcOOgHXNGaw4ZllMH9Q4J80MYkv9ekEhL0Ie3fR5xHbxZJtU5fKn4wJwPTheWfpvnoUvxXwTXdLoa5KeHhC7tlrHZl2YQ7EFzmU4A_ax7kfBpzV_UgNKUhk-zS6cwn3v7sf-OiOKEahhqX5DV2Q-opbiRSjQ7NmkLJnu3HKTg5q5kPa05sap-rBfM57QjMFWQ9KnCbUs1StOFUul8n1K4uf1BIdJ0HtSwBr-SaPpIZur5bDT-iw"
            style={{
              transform: isPrivacyMode ? 'scale(0.95) rotate(-5deg)' : 'scale(1) rotate(0deg)',
              opacity: isPrivacyMode ? 0.7 : 1,
              filter: isPrivacyMode ? 'blur(2px)' : 'none',
            }}
          />
          <div className="mt-8 text-center max-w-md">
            <h2 className="text-2xl font-bold font-heading text-white mb-4">Neural Synchronization</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Initialize your profile to begin high-stakes scenario simulations. Ace is ready to analyze.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form Canvas (40%) */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative z-10 bg-surface-dim/90 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="mb-12 animate-fade-in">
          <div className="mb-2">
            <Link href="/">
              <img src="/logo.png?v=2" alt="AceInterview AI" className="h-12 w-auto object-contain" />
            </Link>
          </div>
          <p className="text-sm text-on-surface-variant font-semibold">Establish Secure Identity</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-fade-in delay-100" id="signup-form">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest block ml-1">
              Operative Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none" />
              <input 
                {...register('name')}
                className="neural-input w-full bg-surface-container-low text-on-surface rounded-lg py-4 pl-12 pr-4 font-body-md text-sm placeholder:text-on-surface-variant/30 focus:ring-0" 
                placeholder="John Doe" 
                type="text"
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <p className="text-error text-xs mt-1 ml-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest block ml-1">
              Communication Channel
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none" />
              <input 
                {...register('email')}
                className="neural-input w-full bg-surface-container-low text-on-surface rounded-lg py-4 pl-12 pr-4 font-body-md text-sm placeholder:text-on-surface-variant/30 focus:ring-0" 
                placeholder="signal@domain.com" 
                type="email"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-error text-xs mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password (Encryption Key) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest block ml-1">
              Encryption Key
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none" />
              <input 
                {...register('password', { onChange: e => setPassword(e.target.value) })}
                className="neural-input w-full bg-surface-container-low text-on-surface rounded-lg py-4 pl-12 pr-12 font-body-md text-sm placeholder:text-on-surface-variant/30 focus:ring-0" 
                id="password-input" 
                placeholder="••••••••" 
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                onFocus={() => setIsPrivacyMode(true)}
                onBlur={() => setIsPrivacyMode(false)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password requirements */}
            {password.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2 ml-1 px-1 py-1 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-text-secondary flex items-center gap-1 font-semibold">
                  <ShieldAlert className="w-3 h-3 text-warning" />
                  Key Constraints
                </span>
                <div className="flex gap-3">
                  {passwordRequirements.map(req => (
                    <div key={req.label} className={`flex items-center gap-1 text-[10px] font-semibold ${ req.test(password) ? 'text-success' : 'text-text-secondary' }`}>
                      <Check className="w-3 h-3" />
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-error text-xs mt-1 ml-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password (Verify Key) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest block ml-1">
              Verify Key
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none" />
              <input 
                {...register('confirmPassword')}
                className="neural-input w-full bg-surface-container-low text-on-surface rounded-lg py-4 pl-12 pr-12 font-body-md text-sm placeholder:text-on-surface-variant/30 focus:ring-0" 
                id="confirm-password-input" 
                placeholder="••••••••" 
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                onFocus={() => setIsPrivacyMode(true)}
                onBlur={() => setIsPrivacyMode(false)}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-error text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pt-6 animate-fade-in delay-200">
            <button 
              ref={ctaBtnRef}
              type="submit"
              disabled={loading}
              className="magnetic-btn w-full py-4 px-6 rounded-lg text-white hover:opacity-90 font-bold flex items-center justify-center gap-2 group transition-opacity duration-200"
              style={magneticStyle}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Initializing...</>
              ) : (
                <>
                  <span>Initialize Protocol</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-text-secondary text-xs">or sign up with OAuth</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={!!oauthLoading}
            className="btn-secondary justify-center text-sm py-3.5 border border-white/10 flex items-center gap-2 rounded-xl text-white hover:bg-white/5 transition-all duration-300"
          >
            {oauthLoading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Chrome className="w-4 h-4" />
            )}
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            disabled={!!oauthLoading}
            className="btn-secondary justify-center text-sm py-3.5 border border-white/10 flex items-center gap-2 rounded-xl text-white hover:bg-white/5 transition-all duration-300"
          >
            {oauthLoading === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            GitHub
          </button>
        </div>

        {/* Existing User Redirect Link */}
        <div className="mt-8 text-center animate-fade-in delay-300">
          <p className="text-sm font-semibold text-on-surface-variant">
            Existing operative?{' '}
            <Link 
              className="text-primary hover:text-tertiary transition-all duration-300 font-bold ml-1 relative" 
              href="/login"
            >
              Authenticate Here
            </Link>
          </p>
        </div>
      </div>
      
    </div>
  )
}
