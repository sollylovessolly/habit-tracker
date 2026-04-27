'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { clearSession } from '@/lib/storage'
import { useTheme } from '@/lib/ThemeContext'

type Props = {
  email: string
  children: React.ReactNode
}

const navItems = [
  { icon: '/icons/habit.svg', label: 'My Habits' },
  { icon: '/icons/profile.svg', label: 'View Profile' },
  { icon: '/icons/stats.svg', label: 'View Stats' },
  { icon: '/icons/calendar.svg', label: 'Calendar' },
  { icon: '/icons/settings.svg', label: 'Settings' },
]

export default function AppShell({ email, children }: Props) {
  const router = useRouter()
  const { dark, toggleTheme } = useTheme()
  const displayName = email.split('@')[0]
  const avatar = displayName[0]?.toUpperCase() ?? '?'

  function handleLogout() {
    clearSession()
    router.push('/login')
  }

  return (
    <div className={`min-h-screen flex w-full overflow-x-hidden ${dark ? 'bg-[#32000c]' : 'bg-rose-50'}`}>

      {/* SIDEBAR — desktop only */}
      <aside className={`hidden md:flex flex-col w-64 border-r fixed h-full z-20 shadow-2xl ${
        dark
          ? 'bg-pink-900 border-red-700 shadow-pink-900'
          : 'bg-white border-rose-200 shadow-rose-100'
      }`}>


        <div className={`px-6 py-5 border-b ${dark ? 'border-red-900' : 'border-rose-200'}`}>
          <h1 className={`text-xl font-bold ${dark ? 'text-white' : 'text-rose-700'}`}>
            ⭐ Habit Tracker
          </h1>
        </div>

  
        <div className={`px-6 py-5 flex items-center gap-3 border-b ${dark ? 'border-red-900' : 'border-rose-200'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${dark ? 'bg-pink-600' : 'bg-rose-500'}`}>
            {avatar}
          </div>
          <div className="min-w-0">
            <p className={`font-semibold truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
              {displayName}
            </p>
            <p className="text-xs text-gray-400 truncate">{email}</p>
          </div>
        </div>


        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <p className={`text-xs font-semibold uppercase tracking-wider px-2 mb-3 ${dark ? 'text-pink-300' : 'text-rose-400'}`}>
            Menu
          </p>
          {navItems.map(({ icon, label }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2 mb-1 rounded-lg text-sm font-medium transition focus:outline-none ${
                dark
                  ? 'text-pink-100 bg-pink-800 hover:bg-pink-700'
                  : 'text-rose-700 hover:bg-rose-100'
              }`}
            >
              <Image
                src={icon}
                alt={label}
                width={18}
                height={18}
                className={`shrink-0 `}
              />
              {label}
            </button>
          ))}
        </nav>


        <div className={`px-4 py-4 border-t space-y-2 ${dark ? 'border-red-900' : 'border-rose-200'}`}>
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition focus:outline-none ${
              dark
                ? 'text-pink-200 hover:bg-pink-800'
                : 'text-gray-600 hover:bg-rose-100'
            }`}
          >
            <Image
              src={dark ? '/icons/sun.svg' : '/icons/moon.svg'}
              alt="toggle theme"
              width={18}
              height={18}
              
            />
            {dark ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            type="button"
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm border transition focus:outline-none ${
              dark
                ? 'border-red-800 text-gray-400 hover:text-red-400 hover:bg-red-950'
                : 'border-rose-300 text-gray-500 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            
            Log out
          </button>
        </div>
      </aside>

      
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">

        {/* TOP NAVBAR for mobile only */}
        <header className={`md:hidden border-b sticky top-0 z-10 ${
          dark
            ? 'bg-pink-950 border-red-900'
            : 'bg-white border-rose-200'
        }`}>
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className={`text-lg font-bold ${dark ? 'text-white' : 'text-rose-700'}`}>
              ⭐ Habit Tracker
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="focus:outline-none"
                aria-label="Toggle theme"
              >
                <Image
                  src={dark ? '/icons/sun.svg' : '/icons/moon.svg'}
                  alt="toggle theme"
                  width={20}
                  height={20}
                 
                  
                />
              </button>
              <div className='border h-8'></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${dark ? 'bg-pink-600' : 'bg-rose-500'}`}>
                {avatar}
              </div>
              <button
                type="button"
                data-testid="auth-logout-button"
                onClick={handleLogout}
                className={`text-sm transition focus:outline-none ${
                  dark ? 'text-gray-300 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        
        <main className="flex-1 w-full min-w-0 px-4 py-6 max-w-2xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}