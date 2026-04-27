'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, getHabits, saveHabits } from '@/lib/storage'
import { Habit } from '@/types/habit'
import HabitList from '@/components/habits/HabitList'
import HabitForm from '@/components/habits/HabitForm'
import AppShell from '@/components/shared/AppShell'
import { ThemeProvider, useTheme } from '@/lib/ThemeContext'

function Dashboard() {
  const router = useRouter()
  const { dark } = useTheme()
  const [habits, setHabits] = useState<Habit[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push('/login')
      return
    }
    setUserEmail(session.email)
    const allHabits = getHabits()
    const myHabits = allHabits.filter((h) => h.userId === session.userId)
    setHabits(myHabits)
    setReady(true)
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
    saveHabits([...allHabits, newHabit])
    setHabits((prev) => [...prev, newHabit])
    setShowForm(false)
  }

  function handleEdit(name: string, description: string) {
    if (!editingHabit) return
    const updatedHabit: Habit = { ...editingHabit, name, description }
    const allHabits = getHabits()
    saveHabits(allHabits.map((h) => h.id === updatedHabit.id ? updatedHabit : h))
    setHabits((prev) => prev.map((h) => h.id === updatedHabit.id ? updatedHabit : h))
    setEditingHabit(null)
  }

  function handleUpdate(updatedHabit: Habit) {
    const allHabits = getHabits()
    saveHabits(allHabits.map((h) => h.id === updatedHabit.id ? updatedHabit : h))
    setHabits((prev) => prev.map((h) => h.id === updatedHabit.id ? updatedHabit : h))
  }

  function handleDelete(id: string) {
    const allHabits = getHabits()
    saveHabits(allHabits.filter((h) => h.id !== id))
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  if (!ready) return (
    <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-[#32000c]' : 'bg-rose-50'}`}>
      <p className="text-pink-400 text-sm animate-pulse">Loading...</p>
    </div>
  )

  return (
    <AppShell email={userEmail}>
      <div data-testid="dashboard-page">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`font-bold text-2xl sm:text-3xl py-3 ${dark ? 'text-rose-400' : 'text-rose-800'}`}>
              MY HABITS
            </h2>
            <p className={`text-sm mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          {!showForm && !editingHabit && (
            <button
              type="button"
              data-testid="create-habit-button"
              onClick={() => setShowForm(true)}
              className={`text-white text-sm px-4 py-2 rounded-lg font-bold focus:outline-none focus:ring-2 transition ${
                dark
                  ? 'bg-pink-700 hover:bg-pink-600 focus:ring-pink-400'
                  : 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-400'
              }`}
            >
              + New habit
            </button>
          )}
        </div>

        {/* Create form */}
        {showForm && (
          <HabitForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
        )}

        {/* Edit form */}
        {editingHabit && (
          <HabitForm
            existing={editingHabit}
            onSave={handleEdit}
            onCancel={() => setEditingHabit(null)}
          />
        )}

        {/* Habits list or empty state */}
        {habits.length === 0 ? (
          <div data-testid="empty-state" className="text-center py-20">
            <p className="text-5xl mb-3">🌱</p>
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
            onEdit={(h) => { setShowForm(false); setEditingHabit(h) }}
            onDelete={handleDelete}
          />
        )}

      </div>
    </AppShell>
  )
}

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}