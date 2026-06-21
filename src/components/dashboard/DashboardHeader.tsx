'use client'

import Link from 'next/link'
import { Bell, Search } from 'lucide-react'

interface DashboardHeaderProps {
  user: { name?: string | null; email?: string | null; image?: string | null }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search interviews, reports..."
            className="input-glass pl-10 py-2 w-64 text-sm"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto">
          <Link href="/interview/new">
            <button className="btn-primary text-sm py-2 px-4">
              + New Interview
            </button>
          </Link>

          <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-text-secondary hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
          </div>
        </div>
      </div>
    </header>
  )
}
