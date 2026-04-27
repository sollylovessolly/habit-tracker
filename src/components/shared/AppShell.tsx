'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearSession } from '@/lib/storage'

type Props = {
  email: string
  children: React.ReactNode
}

export default function AppShell({ email, children }: Props) {
  const router = useRouter()
  const displayName = email.split('@')[0]
  const avatar = displayName[0]?.toUpperCase() ?? '?'

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR — desktop only */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-indigo-600">🔥 Habit Tracker</h1>
        </div>

        {/* Profile */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {avatar}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{email}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Menu
          </p>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50"
          >
            <span>📋</span> My Habits
          </button>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            type="button"
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition focus:outline-none"
          >
            <span>🚪</span> Log out
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col md:ml-64">

        {/* TOP NAVBAR — mobile only */}
        <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold text-indigo-600">🔥 Habit Tracker</h1>

            <div className="flex items-center gap-3">
              {/* Mini avatar */}
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {avatar}
              </div>
              <button
                type="button"
                data-testid="auth-logout-button"
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 transition focus:outline-none"
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 max-w-2xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}