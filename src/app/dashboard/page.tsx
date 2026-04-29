'use client'

import { startTransition, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, getHabits, saveHabits } from '@/lib/storage'
import { Habit } from '@/types/habit'
import HabitList from '@/components/habits/HabitList'
import HabitForm from '@/components/habits/HabitForm'
import AppShell, { ShellSection } from '@/components/shared/AppShell'
import { useTheme } from '@/lib/ThemeContext'

const sectionTitle: Record<ShellSection, string> = {
  habits: 'MY HABITS',
  profile: 'PROFILE',
  stats: 'STATS',
  calendar: 'CALENDAR',
  settings: 'SETTINGS',
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function DashboardPage() {
  const router = useRouter()
  const { dark } = useTheme()
  const [habits, setHabits] = useState<Habit[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [activeSection, setActiveSection] = useState<ShellSection>('habits')
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.replace('/login')
      return
    }

    startTransition(() => {
      setUserEmail(session.email)
      setHabits(getHabits().filter((habit) => habit.userId === session.userId))
      setReady(true)
    })
  }, [router])

  function handleCreate(name: string, description: string) {
    const session = getSession()
    if (!session) return

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name,
      description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    }

    const allHabits = getHabits()
    saveHabits([newHabit, ...allHabits])
    setHabits((prev) => [newHabit, ...prev])
    setShowForm(false)
    setActiveSection('habits')
  }

  function handleEdit(name: string, description: string) {
    if (!editingHabit) return

    const updatedHabit: Habit = { ...editingHabit, name, description }
    const allHabits = getHabits()
    saveHabits([updatedHabit, ...allHabits.filter((habit) => habit.id !== updatedHabit.id)])
    setHabits((prev) => [updatedHabit, ...prev.filter((habit) => habit.id !== updatedHabit.id)])
    setEditingHabit(null)
    setActiveSection('habits')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleUpdate(updatedHabit: Habit) {
    const allHabits = getHabits()
    saveHabits(allHabits.map((habit) => habit.id === updatedHabit.id ? updatedHabit : habit))
    setHabits((prev) => prev.map((habit) => habit.id === updatedHabit.id ? updatedHabit : habit))
  }

  function handleDelete(id: string) {
    const allHabits = getHabits()
    saveHabits(allHabits.filter((habit) => habit.id !== id))
    setHabits((prev) => prev.filter((habit) => habit.id !== id))
  }

  function handleNavigate(section: ShellSection) {
    setShowForm(false)
    setEditingHabit(null)
    setActiveSection(section)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const today = getDateKey(new Date())
  const completedToday = habits.filter((habit) => habit.completions.includes(today)).length
  const totalCompletions = habits.reduce((count, habit) => count + habit.completions.length, 0)
  const calendarYear = calendarDate.getFullYear()
  const calendarMonth = calendarDate.getMonth()
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1)
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
  const monthLabel = calendarDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const calendarDays = Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(calendarYear, calendarMonth, index + 1)
    const key = getDateKey(date)
    const completions = habits.filter((habit) => habit.completions.includes(key)).length

    return {
      date,
      key,
      completions,
      isToday: key === today,
    }
  })

  function changeCalendarMonth(offset: number) {
    setCalendarDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  const panelClass = `rounded-2xl p-5 shadow border ${
    dark ? 'bg-pink-900 border-pink-800 text-pink-100' : 'bg-white border-rose-100 text-gray-800'
  }`

  if (!ready) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-[#32000c]' : 'bg-rose-50'}`}>
        <div className={`w-6 h-6 rounded-full border-2 border-t-transparent animate-spin ${dark ? 'border-pink-400' : 'border-rose-400'}`} />
      </div>
    )
  }

  return (
    <AppShell email={userEmail} activeSection={activeSection} onNavigate={handleNavigate}>
      <div data-testid="dashboard-page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`font-bold text-2xl sm:text-3xl py-3 ${dark ? 'text-pink-200' : 'text-rose-800'}`}>
              {sectionTitle[activeSection]}
            </h2>
            <p className={`text-sm mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          {activeSection === 'habits' && !showForm && !editingHabit && (
            <button
              type="button"
              data-testid="create-habit-button"
              onClick={() => {
                setEditingHabit(null)
                setActiveSection('habits')
                setShowForm(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`text-white text-sm px-4 py-2 rounded-lg font-bold focus:outline-none focus:ring-2 transition ${
                dark
                  ? 'bg-pink-700 hover:bg-pink-600 focus:ring-pink-400'
                  : 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-400'
              } cursor-pointer`}
              aria-expanded={showForm}
              aria-controls="habit-form-panel"
            >
              + New habit
            </button>
          )}
        </div>

        {activeSection === 'habits' && (
          <>
            {showForm && (
              <div id="habit-form-panel">
                <HabitForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
              </div>
            )}

            {editingHabit && (
              <div id="habit-form-panel">
                <HabitForm
                  existing={editingHabit}
                  onSave={handleEdit}
                  onCancel={() => setEditingHabit(null)}
                />
              </div>
            )}

            {habits.length === 0 ? (
              <div data-testid="empty-state" className="text-center py-20">
                <p className="text-5xl mb-3">+</p>
                <p className={`font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No habits yet
                </p>
                <p className={`text-sm mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Hit &quot;+ New habit&quot; to start
                </p>
              </div>
            ) : (
              <HabitList
                habits={habits}
                onUpdate={handleUpdate}
                onEdit={(habit) => {
                  setShowForm(false)
                  setEditingHabit(habit)
                  setActiveSection('habits')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                onDelete={handleDelete}
              />
            )}
          </>
        )}

        {activeSection === 'profile' && (
          <section data-testid="profile-section" className={panelClass} aria-label="Profile summary">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${dark ? 'bg-pink-600' : 'bg-rose-500'}`}>
                {userEmail[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm opacity-75">Signed in as</p>
                <p className="font-semibold truncate">{userEmail}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 mt-6 text-sm">
              <div>
                <dt className="opacity-70">Habits</dt>
                <dd className="text-2xl font-bold">{habits.length}</dd>
              </div>
              <div>
                <dt className="opacity-70">Completions</dt>
                <dd className="text-2xl font-bold">{totalCompletions}</dd>
              </div>
            </dl>
          </section>
        )}

        {activeSection === 'stats' && (
          <section data-testid="stats-section" className="grid gap-3" aria-label="Habit stats">
            {[
              ['Total habits', habits.length],
              ['Completed today', completedToday],
              ['All-time completions', totalCompletions],
            ].map(([label, value]) => (
              <div key={label} className={panelClass}>
                <p className="text-sm opacity-70">{label}</p>
                <p className="mt-1 text-3xl font-bold">{value}</p>
              </div>
            ))}
          </section>
        )}

        {activeSection === 'calendar' && (
          <section data-testid="calendar-section" className={panelClass} aria-label="Completion calendar">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => changeCalendarMonth(-1)}
                className={`h-9 w-9 rounded-lg border text-lg font-bold transition focus:outline-none focus:ring-2 ${
                  dark
                    ? 'border-pink-700 text-pink-100 hover:bg-pink-800 focus:ring-pink-500'
                    : 'border-rose-200 text-rose-700 hover:bg-rose-50 focus:ring-rose-300'
                }`}
                aria-label="Previous month"
              >
                &lt;
              </button>
              <h3 className="text-base font-bold" data-testid="calendar-month">
                {monthLabel}
              </h3>
              <button
                type="button"
                onClick={() => changeCalendarMonth(1)}
                className={`h-9 w-9 rounded-lg border text-lg font-bold transition focus:outline-none focus:ring-2 ${
                  dark
                    ? 'border-pink-700 text-pink-100 hover:bg-pink-800 focus:ring-pink-500'
                    : 'border-rose-200 text-rose-700 hover:bg-rose-50 focus:ring-rose-300'
                }`}
                aria-label="Next month"
              >
                &gt;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs sm:gap-2">
              {weekDays.map((day) => (
                <div key={day} className={`py-1 font-bold ${dark ? 'text-pink-200' : 'text-rose-700'}`}>
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayOfMonth.getDay() }, (_, index) => (
                <div key={`empty-${index}`} aria-hidden="true" />
              ))}

              {calendarDays.map(({ date, key, completions, isToday }) => (
                <div
                  key={key}
                  data-testid={`calendar-day-${key}`}
                  className={`min-h-16 rounded-lg border p-1.5 text-left transition sm:min-h-20 sm:p-2 ${
                    completions > 0
                      ? dark ? 'bg-pink-700 border-pink-500' : 'bg-rose-100 border-rose-300'
                      : dark ? 'border-pink-800 bg-pink-950/40' : 'border-rose-100 bg-rose-50/50'
                  } ${isToday ? dark ? 'ring-2 ring-pink-300' : 'ring-2 ring-rose-400' : ''}`}
                  aria-label={`${date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}: ${completions} completions`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold">{date.getDate()}</span>
                    {isToday && (
                      <span className={`rounded px-1 text-[10px] font-bold ${dark ? 'bg-pink-200 text-pink-950' : 'bg-rose-500 text-white'}`}>
                        Today
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-[11px] font-semibold ${completions > 0 ? '' : 'opacity-60'}`}>
                    {completions} done
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'settings' && (
          <section data-testid="settings-section" className={panelClass} aria-label="Settings">
            <p className="font-semibold">settings</p>
            <p className="mt-2 text-sm opacity-75">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur, ipsa. Ut deleniti quidem optio animi? Dicta quo asperiores cupiditate placeat aut quod ex, fugit officia. 
            </p>
          </section>
        )}
      </div>
    </AppShell>
  )
}
