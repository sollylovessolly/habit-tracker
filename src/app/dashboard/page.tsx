'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, getHabits, saveHabits } from '@/lib/storage'
import { Habit } from '@/types/habit'
import HabitCard from '@/components/habits/HabitCard'
import HabitForm from '@/components/habits/HabitForm'
import AppShell from '@/components/shared/AppShell'

export default function DashboardPage() {
  const router = useRouter()
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

  if (!ready) return null

  return (
    <AppShell email={userEmail}>
      <div data-testid="dashboard-page">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Habits</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          {!showForm && !editingHabit && (
            <button
              type="button"
              data-testid="create-habit-button"
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              + New habit
            </button>
          )}
        </div>


        {showForm && (
          <HabitForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
        )}
        {editingHabit && (
          <HabitForm
            existing={editingHabit}
            onSave={handleEdit}
            onCancel={() => setEditingHabit(null)}
          />
        )}


        {habits.length === 0 ? (
          <div
            data-testid="empty-state"
            className="text-center py-20 text-gray-400"
          >
            <p className="text-5xl mb-3">🌱</p>
            <p className="font-medium text-gray-500">No habits yet</p>
            <p className="text-sm mt-1">Hit &quot;+ New habit&quot; to start</p>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={handleUpdate}
              onEdit={(h) => { setShowForm(false); setEditingHabit(h) }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </AppShell>
  )
}