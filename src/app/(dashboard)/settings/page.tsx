import type { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Settings } from 'lucide-react'

export const metadata: Metadata = { title: 'Settings | AceInterview AI' }

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
          <Settings className="w-7 h-7 text-primary" /> Settings
        </h1>
        <p className="text-text-secondary mt-1">Manage your preferences and account settings</p>
      </div>

      <div className="glass-card space-y-6">
        <div>
          <h2 className="font-semibold font-heading mb-4">Notifications</h2>
          <div className="space-y-3">
            {['Email interview reminders', 'Weekly performance summary', 'New feature announcements'].map(label => (
              <label key={label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/8 transition-colors">
                <span className="text-sm">{label}</span>
                <div className="w-11 h-6 rounded-full bg-primary/30 relative">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1" />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h2 className="font-semibold font-heading mb-4">AI Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Default Interview Difficulty</label>
              <select className="input-glass">
                <option value="1">Junior (Easy)</option>
                <option value="2" selected>Mid-Level (Medium)</option>
                <option value="3">Senior (Hard)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Preferred AI Model</label>
              <select className="input-glass">
                <option value="claude">Claude 3.5 Sonnet (Best quality)</option>
                <option value="gpt4o">GPT-4o (Balanced)</option>
                <option value="gemini">Gemini Flash (Fastest)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h2 className="font-semibold font-heading mb-4 text-error">Danger Zone</h2>
          <button className="btn-secondary border-error/30 text-error hover:bg-error/10 text-sm">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
