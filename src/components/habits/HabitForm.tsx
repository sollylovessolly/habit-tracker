'use client'

import { useState, useEffect } from 'react'
import { Habit } from '@/types/habit'
import { validateHabitName } from '@/lib/validators'

type Props = {
  onSave: (name: string, description: string) => void
  onCancel: () => void
  existing?: Habit
}

export default function HabitForm({ onSave, onCancel, existing }: Props) {
  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [error, setError] = useState('')

  function handleSave() {
    const result = validateHabitName(name)
    if (!result.valid) {
      setError(result.error!)
      return
    }
    setError('')
    onSave(result.value, description.trim())
  }

  return (
    <div
      data-testid="habit-form"
      className="bg-white rounded-2xl shadow p-6 mb-4"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {existing ? 'Edit Habit' : 'New Habit'}
      </h3>

      {error && (
        <p className="mb-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <div>
          <label
            htmlFor="habit-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Habit name <span className="text-red-500">*</span>
          </label>
          <input
            id="habit-name"
            type="text"
            data-testid="habit-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Drink Water"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="habit-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            id="habit-description"
            type="text"
            data-testid="habit-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="habit-frequency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            defaultValue="daily"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            data-testid="habit-save-button"
            onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}