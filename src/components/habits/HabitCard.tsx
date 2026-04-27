'use client'

import { useState } from 'react'
import { Habit } from '@/types/habit'
import { getHabitSlug } from '@/lib/slug'
import { calculateCurrentStreak } from '@/lib/streaks'
import { toggleHabitCompletion } from '@/lib/habits'

type Props = {
  habit: Habit
  onUpdate: (habit: Habit) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
}

export default function HabitCard({ habit, onUpdate, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const slug = getHabitSlug(habit.name)
  const today = new Date().toISOString().split('T')[0]
  const isCompleted = habit.completions.includes(today)
  const streak = calculateCurrentStreak(habit.completions)

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today)
    onUpdate(updated)
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(habit.id)
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl shadow p-5 mb-3 border-2 transition-all ${
        isCompleted
          ? 'bg-green-50 border-green-300'
          : 'bg-white border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {habit.description}
            </p>
          )}
          <p
        data-testid={`habit-streak-${slug}`}
        className="text-xs font-medium mt-1"
        >
        {streak > 0 ? (
            <span className="text-indigo-600">🔥 {streak} day streak</span>
        ) : (
            <span className="text-orange-400">⚡ Complete today to continue your streak!</span>
        )}
        </p>
        </div>

        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          className={`shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 text-gray-300 hover:border-indigo-400'
          }`}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted ? '✓' : '○'}
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="text-xs text-gray-500 hover:text-indigo-600 focus:outline-none focus:underline transition"
        >
          Edit
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            data-testid={`habit-delete-${slug}`}
            onClick={handleDelete}
            className="text-xs text-gray-500 hover:text-red-500 focus:outline-none focus:underline transition"
          >
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600">Are you sure?</span>
            <button
              type="button"
              data-testid="confirm-delete-button"
              onClick={handleDelete}
              className="text-xs font-semibold text-red-600 hover:underline focus:outline-none"
            >
              Yes, delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-gray-500 hover:underline focus:outline-none"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}