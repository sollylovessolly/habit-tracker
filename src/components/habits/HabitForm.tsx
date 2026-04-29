'use client'

import { FormEvent, useEffect, useId, useRef, useState } from 'react'
import { Habit } from '@/types/habit'
import { validateHabitName } from '@/lib/validators'
import { useTheme } from '@/lib/ThemeContext'

type Props = {
  onSave: (name: string, description: string) => void
  onCancel: () => void
  existing?: Habit
}

export default function HabitForm({ onSave, onCancel, existing }: Props) {
  const { dark } = useTheme()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const errorId = useId()
  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    nameInputRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  function handleSave() {
    const result = validateHabitName(name)
    if (!result.valid) {
      setError(result.error!)
      return
    }
    setError('')
    onSave(result.value, description.trim())
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    handleSave()
  }

  const inputClass = `w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 border ${
    dark
      ? 'bg-pink-950 border-pink-700 text-white placeholder-pink-400 focus:ring-pink-400'
      : 'bg-white border-rose-300 text-gray-800 placeholder-gray-400 focus:ring-rose-400'
  }`

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      aria-labelledby={titleId}
      aria-describedby={error ? errorId : undefined}
      className={`rounded-2xl shadow p-4 mb-4 w-full ${
        dark ? 'bg-[#b04a61]' : 'bg-white border border-rose-200'
      }`}
    >
      <h3 id={titleId} className={`text-lg font-semibold mb-4 ${dark ? 'text-red-100' : 'text-gray-800'}`}>
        {existing ? 'Edit Habit' : 'New Habit'}
      </h3>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mb-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          {error}
        </p>
      )}

      <div className="space-y-3">
        <div>
          <label htmlFor="habit-name" className={`block text-sm font-medium mb-1 ${dark ? 'text-white' : 'text-gray-700'}`}>
            Habit name <span className="text-red-400">*</span>
          </label>
          <input
            id="habit-name"
            ref={nameInputRef}
            type="text"
            data-testid="habit-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Drink Water"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="habit-description" className={`block text-sm font-medium mb-1 ${dark ? 'text-white' : 'text-gray-700'}`}>
            Description
          </label>
          <input
            id="habit-description"
            type="text"
            data-testid="habit-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="habit-frequency" className={`block text-sm font-medium mb-1 ${dark ? 'text-white' : 'text-gray-700'}`}>
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            defaultValue="daily"
            aria-label="Frequency"
            className={`${inputClass} cursor-pointer`}
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="flex gap-2 pt-1 w-full">
          <button
            type="submit"
            data-testid="habit-save-button"
            className={`flex-1 min-w-0 cursor-pointer py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition ${
              dark
                ? 'bg-pink-700 text-white hover:bg-pink-600 focus:ring-pink-400'
                : 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400'
            }`}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel habit form"
            className={`flex-1 min-w-0 cursor-pointer py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition ${
              dark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-400'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
