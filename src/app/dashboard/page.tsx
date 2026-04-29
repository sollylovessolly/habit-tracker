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

export default function DashboardPage() {
  const router = useRouter()
  const { dark } = useTheme()
  const [habits, setHabits] = useState<Habit[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [activeSection, setActiveSection] = useState<ShellSection>('habits')
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

  const today = new Date().toISOString().split('T')[0]
  const completedToday = habits.filter((habit) => habit.completions.includes(today)).length
  const totalCompletions = habits.reduce((count, habit) => count + habit.completions.length, 0)

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
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {Array.from({ length: 14 }, (_, index) => {
                const date = new Date()
                date.setDate(date.getDate() - (13 - index))
                const key = date.toISOString().split('T')[0]
                const dayCompletions = habits.filter((habit) => habit.completions.includes(key)).length

                return (
                  <div
                    key={key}
                    className={`rounded-lg p-2 border ${dayCompletions > 0
                      ? dark ? 'bg-pink-700 border-pink-500' : 'bg-rose-100 border-rose-300'
                      : dark ? 'border-pink-800' : 'border-rose-100'
                    }`}
                    aria-label={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${dayCompletions} completions`}
                  >
                    <p>{date.getDate()}</p>
                    <p className="font-bold">{dayCompletions}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {activeSection === 'settings' && (
          <section data-testid="settings-section" className={panelClass} aria-label="Settings">
            <p className="font-semibold">Preferences</p>
            <p className="mt-2 text-sm opacity-75">
              Theme switching and logout are available in the sidebar. Habit data is saved locally in this browser.
            </p>
          </section>
        )}
      </div>
    </AppShell>
  )
}
