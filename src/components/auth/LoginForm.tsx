'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Loader2, Chrome, Github } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
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
      transform: `translate(${x * 0.15}px, ${y * 0.15}px)`,
    })
  }

  const handleMouseLeave = () => {
    setMagneticStyle({
      transform: '',
      transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    })
  }

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
      } else {
        toast.success('Welcome back!')
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: string) => {
    setOauthLoading(provider)
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch {
      toast.error('OAuth sign-in failed')
      setOauthLoading(null)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
      {/* Background Neural Glows */}
      <div className="neural-glow top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <div 
        className="neural-glow bottom-0 right-0 translate-x-1/3 translate-y-1/3" 
        style={{ background: 'radial-gradient(circle, rgba(0,220,229,0.1) 0%, rgba(17,19,23,0) 70%)' }} 
      />

      <div className="glass-panel w-full rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10 border border-white/5 bg-surface-container-low/40 backdrop-blur-xl">
        
        {/* Left Side: Mascot Animation Showcase */}
        <div className="w-full md:w-1/2 bg-surface-container/60 relative hidden md:flex flex-col items-center justify-center p-12 overflow-hidden border-r border-white/5">
          <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{ 
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
              backgroundSize: '32px 32px' 
            }} 
          />
          
          <div className="z-10 text-center mb-8">
            <h2 className="text-4xl font-bold font-heading text-white mb-4 leading-tight">
              Master the <span className="gradient-text">Interview.</span>
            </h2>
            <p className="text-base text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Elite preparation powered by advanced cognitive models. Your next career leap starts here.
            </p>
          </div>

          {/* Animation Container */}
          <div 
            id="animation-container"
            className={`relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center transition-all duration-500 bg-surface-container-low/30 backdrop-blur-md ${isPrivacyMode ? 'privacy-mode' : ''}`}
            style={{
              filter: isPrivacyMode ? 'brightness(0.7) contrast(1.2)' : '',
              boxShadow: isPrivacyMode ? 'inset 0 0 50px rgba(0,0,0,0.8)' : '',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/10 to-transparent z-0" />
            
            <div className="w-full h-full relative z-10 flex items-center justify-center">
              <svg 
                viewBox="0 0 400 400" 
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>{`
                  @keyframes breathing {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                  }
                  @keyframes typing {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-2px) rotate(2deg); }
                  }
                `}</style>
                <circle cx="200" cy="200" fill="url(#glow_grad)" opacity="0.15" r="160" />
                
                {/* Torso/Body */}
                <g 
                  id="ace-body" 
                  className="origin-bottom"
                  style={{
                    animation: 'breathing 4s ease-in-out infinite',
                  }}
                >
                  <path d="M100 400C100 320 130 260 200 260C270 260 300 320 300 400" fill="#1A1C20" stroke="#2D5BFF" strokeWidth="2" />
                  <path d="M160 260L200 310L240 260" fill="#282A2E" opacity="0.5" />
                  
                  {/* Head Group */}
                  <g 
                    id="ace-head"
                    style={{
                      transform: isPrivacyMode ? 'rotate(15deg)' : 'rotate(0deg)',
                      transformOrigin: '200px 220px',
                      transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    <path d="M150 180C150 120 172.4 100 200 100C227.6 100 250 120 250 180C250 215 227.6 240 200 240C172.4 240 150 215 150 180Z" fill="#E0AC69" />
                    {/* Hair */}
                    <path d="M150 160C150 110 170 90 200 90C230 90 250 110 250 160C250 140 240 125 200 125C160 125 150 140 150 160Z" fill="#2B1D0E" />
                    <path d="M170 95C185 85 215 85 230 95C220 90 180 90 170 95Z" fill="#3D2B1A" />
                    
                    {/* Eyes Open */}
                    <g 
                      id="eyes-open"
                      style={{
                        opacity: isPrivacyMode ? 0 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <circle cx="180" cy="185" fill="#1A1C20" r="5" />
                      <circle cx="220" cy="185" fill="#1A1C20" r="5" />
                      <path d="M175 170C178 168 182 168 185 170" stroke="#2B1D0E" strokeLinecap="round" strokeWidth="1.5" />
                      <path d="M215 170C218 168 222 168 225 170" stroke="#2B1D0E" strokeLinecap="round" strokeWidth="1.5" />
                    </g>
                    
                    {/* Eyes Closed (Privacy) */}
                    <g 
                      id="eyes-closed"
                      style={{
                        opacity: isPrivacyMode ? 1 : 0,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <path d="M175 190C178 193 182 193 185 190" stroke="#1A1C20" strokeLinecap="round" strokeWidth="2" />
                      <path d="M215 190C218 193 222 193 225 190" stroke="#1A1C20" strokeLinecap="round" strokeWidth="2" />
                    </g>
                    
                    {/* Mouth */}
                    <path d="M190 215C195 218 205 218 210 215" fill="none" stroke="#1A1C20" strokeLinecap="round" strokeWidth="1.5" />
                  </g>

                  {/* Laptop */}
                  <g id="laptop">
                    <rect fill="#333539" height="8" rx="2" width="140" x="130" y="320" />
                    <g 
                      id="laptop-screen"
                      style={{
                        transform: isPrivacyMode ? 'rotateY(45deg)' : 'rotateY(0deg)',
                        transformOrigin: '260px 280px',
                        transition: 'transform 0.5s ease',
                      }}
                    >
                      <rect fill="#111317" height="80" rx="4" stroke="#2D5BFF" strokeWidth="2" width="120" x="140" y="240" />
                      <rect fill="#2D5BFF" height="70" opacity="0.1" rx="2" width="110" x="145" y="245" />
                      
                      {/* Animated Code Lines */}
                      <rect fill="#2D5BFF" height="3" opacity="0.4" rx="1" width="40" x="155" y="260">
                        <animate attributeName="width" dur="2s" repeatCount="indefinite" values="40;60;40" />
                      </rect>
                      <rect fill="#9D50BB" height="3" opacity="0.4" rx="1" width="70" x="155" y="270">
                        <animate attributeName="width" dur="3s" repeatCount="indefinite" values="70;50;70" />
                      </rect>
                    </g>
                  </g>

                  {/* Hands */}
                  <circle 
                    cx="150" 
                    cy="330" 
                    fill="#E0AC69" 
                    r="8"
                    style={{
                      animation: 'typing 0.2s infinite',
                    }}
                  />
                  <circle 
                    cx="250" 
                    cy="330" 
                    fill="#E0AC69" 
                    r="8"
                    style={{
                      animation: 'typing 0.2s infinite',
                    }}
                  />
                </g>
                <defs>
                  <radialGradient cx="0" cy="0" gradientTransform="translate(200 200) rotate(90) scale(160)" gradientUnits="userSpaceOnUse" id="glow_grad" r="1">
                    <stop stopColor="#2D5BFF" />
                    <stop offset="1" stopColor="#2D5BFF" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
            
            {/* Mascot Status Badge */}
            <div className="absolute top-4 right-4 bg-surface-variant/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 z-20">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-semibold text-[10px] text-on-surface-variant">System Active</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-surface-dim/90 backdrop-blur-xl">
          <div className="max-w-md w-full mx-auto">
            {/* Brand Logo & Header */}
            <div className="mb-10">
              <Link href="/">
                <img src="/logo.png?v=2" alt="AceInterview AI" className="h-12 w-auto object-contain" />
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">Welcome back.</h1>
            <p className="text-sm text-on-surface-variant mb-8 font-semibold">Sign in to continue your progress.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Email Address */}
              <div className="group">
                <label className="block text-xs font-semibold text-on-surface-variant mb-2 ml-1 transition-colors group-focus-within:text-primary" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-outline-variant group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    {...register('email')}
                    className="neural-input w-full rounded-xl py-4 pl-12 pr-4 text-on-surface font-body-md text-sm placeholder:text-outline-variant focus:ring-0" 
                    id="email" 
                    placeholder="investor@silicon.valley" 
                    type="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-error text-xs mt-1 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="group">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-xs font-semibold text-on-surface-variant transition-colors group-focus-within:text-primary" htmlFor="password">
                    Password
                  </label>
                  <Link className="text-xs font-semibold text-primary hover:text-primary-fixed transition-colors" href="/forgot-password">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-outline-variant group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    {...register('password')}
                    className="neural-input w-full rounded-xl py-4 pl-12 pr-4 text-on-surface font-body-md text-sm placeholder:text-outline-variant focus:ring-0" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    onFocus={() => setIsPrivacyMode(true)}
                    onBlur={() => setIsPrivacyMode(false)}
                  />
                </div>
                {errors.password && (
                  <p className="text-error text-xs mt-1 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* CTA Action Button with Magnetic Effect */}
              <div className="pt-6">
                <button 
                  ref={ctaBtnRef}
                  type="submit"
                  disabled={loading}
                  className="magnetic-btn w-full bg-primary-container text-on-primary-container hover:bg-primary-container/85 rounded-xl py-4 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-200"
                  style={magneticStyle}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-text-secondary text-xs">or continue with OAuth</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* OAuth Sign-In Panel */}
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

            <div className="mt-8 text-center">
              <p className="text-sm font-semibold text-on-surface-variant">
                New to the platform?{' '}
                <Link className="text-primary hover:text-primary-fixed font-bold transition-colors border-b border-transparent hover:border-primary ml-1" href="/signup">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
