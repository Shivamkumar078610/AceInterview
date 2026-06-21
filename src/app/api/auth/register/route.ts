import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { hashPassword, validatePasswordStrength } from '@/lib/auth/password'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    // Check password strength
    const strength = validatePasswordStrength(password)
    if (!strength.valid) {
      return NextResponse.json(
        { error: 'Password too weak', feedback: strength.feedback },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user with profile and subscription
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })

      await tx.profile.create({
        data: { userId: newUser.id },
      })

      await tx.subscription.create({
        data: {
          userId: newUser.id,
          plan: 'FREE',
          status: 'FREE',
          monthlyInterviewLimit: parseInt(process.env.FREE_TIER_MONTHLY_INTERVIEWS || '5'),
          monthlyTokenLimit: parseInt(process.env.FREE_TIER_MONTHLY_AI_TOKENS || '50000'),
        },
      })

      // Log audit
      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'SIGNUP',
          details: { method: 'credentials' },
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
        },
      })

      return newUser
    })

    return NextResponse.json(
      {
        message: 'Account created successfully',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
