'use client'

import { useState } from 'react'
import { Habit } from '@/types/habit'
import { getHabitSlug } from '@/lib/slug'
import { calculateCurrentStreak } from '@/lib/streaks'
import { toggleHabitCompletion } from '@/lib/habits'
import { useTheme } from '@/lib/ThemeContext'

type Props = {
  habit: Habit
  onUpdate: (habit: Habit) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
}

export default function HabitCard({ habit, onUpdate, onEdit, onDelete }: Props) {
  const { dark } = useTheme()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const slug = getHabitSlug(habit.name)
  const today = new Date().toISOString().split('T')[0]
  const isCompleted = habit.completions.includes(today)
  const streak = calculateCurrentStreak(habit.completions)

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today)
    onUpdate(updated)
  }

  return (
    <>
      {/* DELETE MODAL */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(false)}
          />
          {/* Modal */}
          <div className={`relative z-10 w-full max-w-sm rounded-2xl shadow-2xl p-6 ${
            dark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-rose-100'
          }`}>
            
            <h3 className={`text-lg font-bold text-center mb-1 ${dark ? 'text-white' : 'text-gray-800'}`}>
              Delete habit?
            </h3>
            <p className={`text-sm text-center mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              &quot;{habit.name}&quot; will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition focus:outline-none ${
                  dark
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid="confirm-delete-button"
                onClick={() => { setConfirmDelete(false); onDelete(habit.id) }}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition focus:outline-none"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HABIT CARD */}
      <div
        data-testid={`habit-card-${slug}`}
        className={`rounded-2xl shadow p-4 mb-3 border-2 transition-all w-full ${
          isCompleted
            ? dark ? 'bg-pink-950 border-pink-700' : 'bg-rose-100 border-rose-400'
            : dark ? 'bg-pink-900 border-transparent' : 'bg-white border-rose-100'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${
              isCompleted
                ? dark ? 'text-gray-400' : 'text-gray-400 line-through'
                : dark ? 'text-pink-100' : 'text-gray-800'
            }`}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className={`text-sm mt-0.5 truncate ${dark ? 'text-pink-300' : 'text-gray-500'}`}>
                {habit.description}
              </p>
            )}
            <p data-testid={`habit-streak-${slug}`} className="text-xs font-medium mt-1">
              {streak > 0 ? (
                <span className={dark ? 'text-red-400 font-bold' : 'text-rose-600 font-bold'}>
                  ⭐ {streak} day streak
                </span>
              ) : (
                <span className="text-orange-400 font-bold">💫 Complete today!</span>
              )}
            </p>
          </div>

          <button
            type="button"
            data-testid={`habit-complete-${slug}`}
            onClick={handleToggle}
            className={`shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg focus:outline-none focus:ring-2 transition ${
              isCompleted
                ? dark ? 'bg-red-900 border-red-300 text-white focus:ring-red-400'
                        : 'bg-rose-500 border-rose-300 text-white focus:ring-rose-400'
                : dark ? 'border-gray-500 text-gray-400 hover:border-pink-400 focus:ring-pink-400'
                        : 'border-rose-300 text-rose-300 hover:border-rose-500 focus:ring-rose-400'
            }`}
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {isCompleted ? '✓' : '○'}
          </button>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            type="button"
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            className={`text-xs px-3 py-1.5 rounded-xl border transition focus:outline-none ${
              dark
                ? 'text-pink-300 border-pink-700 bg-pink-950 hover:bg-pink-800'
                : 'text-rose-600 border-rose-300 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirmDelete(true)}
            className={`text-xs px-3 py-1.5 rounded-xl border transition focus:outline-none ${
              dark
                ? 'text-pink-300 border-pink-700 bg-pink-950 hover:text-red-400 hover:bg-red-950'
                : 'text-rose-600 border-rose-300 bg-rose-50 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  )
}