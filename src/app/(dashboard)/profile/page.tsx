import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ProfilePage } from '@/components/dashboard/ProfilePage'

export const metadata: Metadata = { title: 'Profile | AceInterview AI' }

export default async function Profile() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, createdAt: true },
  })

  return <ProfilePage user={user} profile={profile} />
}
