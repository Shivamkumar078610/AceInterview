'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Edit3, Save, X, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface UserData {
  id: string
  name: string | null
  email: string | null
  image: string | null
  createdAt: Date
}

interface ProfileData {
  bio: string | null
  targetRole: string | null
  targetCompany: string | null
  skills: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  experience: any
  linkedinUrl: string | null
  githubUrl: string | null
  portfolioUrl: string | null
  totalXp: number
  level: number
  totalInterviews: number
}

export function ProfilePage({
  user,
  profile,
}: {
  user: UserData | null
  profile: ProfileData | null
}) {
  const { update } = useSession()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    bio: profile?.bio ?? '',
    targetRole: profile?.targetRole ?? '',
    targetCompany: profile?.targetCompany ?? '',
    linkedinUrl: profile?.linkedinUrl ?? '',
    githubUrl: profile?.githubUrl ?? '',
    portfolioUrl: profile?.portfolioUrl ?? '',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      await update({ name: form.name })
      toast.success('Profile updated!')
      setEditing(false)
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const avatarLetter = (user?.name?.[0] || user?.email?.[0] || '?').toUpperCase()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Profile</h1>
          <p className="text-text-secondary">Manage your account and preferences</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary">
            <Edit3 className="w-4 h-4" />Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary">
              <X className="w-4 h-4" />Cancel
            </button>
          </div>
        )}
      </div>

      {/* Avatar */}
      <motion.div className="glass-card flex items-center gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
            {avatarLetter}
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-surface border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Camera className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        </div>
        <div>
          <div className="font-bold text-xl">{user?.name || 'User'}</div>
          <div className="text-text-secondary text-sm flex items-center gap-1.5 mt-1">
            <Mail className="w-3.5 h-3.5" />{user?.email}
          </div>
          <div className="text-text-secondary text-sm flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5" />Member since {user?.createdAt ? formatDate(user.createdAt) : '—'}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-center">
            <div className="text-xl font-bold gradient-text">Level {profile?.level ?? 1}</div>
            <div className="text-text-secondary text-xs">{profile?.totalXp ?? 0} XP</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{profile?.totalInterviews ?? 0}</div>
            <div className="text-text-secondary text-xs">Interviews</div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div className="glass-card space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="font-semibold font-heading">Personal Info</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', key: 'name', icon: User },
            { label: 'Target Role', key: 'targetRole', icon: null },
            { label: 'Target Company', key: 'targetCompany', icon: null },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-text-secondary mb-1">{label}</label>
              {editing ? (
                <input
                  className="input-glass"
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={label}
                />
              ) : (
                <div className="px-4 py-3 rounded-xl bg-white/5 text-sm">
                  {form[key as keyof typeof form] || <span className="text-text-secondary italic">Not set</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs text-text-secondary mb-1">Bio</label>
          {editing ? (
            <textarea
              className="input-glass h-24 resize-none"
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell interviewers a bit about yourself…"
            />
          ) : (
            <div className="px-4 py-3 rounded-xl bg-white/5 text-sm">
              {form.bio || <span className="text-text-secondary italic">No bio yet</span>}
            </div>
          )}
        </div>

        <h2 className="font-semibold font-heading pt-2">Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'LinkedIn URL', key: 'linkedinUrl' },
            { label: 'GitHub URL', key: 'githubUrl' },
            { label: 'Portfolio URL', key: 'portfolioUrl' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-text-secondary mb-1">{label}</label>
              {editing ? (
                <input
                  className="input-glass"
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={`https://…`}
                />
              ) : (
                <div className="px-4 py-3 rounded-xl bg-white/5 text-sm truncate">
                  {form[key as keyof typeof form] ? (
                    <a href={form[key as keyof typeof form]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {form[key as keyof typeof form]}
                    </a>
                  ) : <span className="text-text-secondary italic">Not set</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
