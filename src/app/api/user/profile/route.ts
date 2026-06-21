import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

const profileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().or(z.literal('')).optional(),
  currentRole: z.string().max(100).optional(),
  targetRole: z.string().max(100).optional(),
  targetCompany: z.string().max(100).optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
  careerGoal: z.string().max(1000).optional(),
  skills: z.array(z.string()).max(50).optional(),
  languages: z.array(z.string()).max(20).optional(),
  preferredLanguage: z.string().optional(),
  githubUrl: z.string().url().or(z.literal('')).optional(),
  linkedinUrl: z.string().url().or(z.literal('')).optional(),
  portfolioUrl: z.string().url().or(z.literal('')).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { user: { select: { name: true, email: true, image: true, createdAt: true } } },
  })

  return NextResponse.json(profile)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = profileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, ...profileData } = parsed.data

    const [profile] = await prisma.$transaction([
      prisma.profile.upsert({
        where: { userId: session.user.id },
        update: profileData,
        create: { userId: session.user.id, ...profileData },
      }),
      ...(name
        ? [
            prisma.user.update({
              where: { id: session.user.id },
              data: { name },
            }),
          ]
        : []),
    ])

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
