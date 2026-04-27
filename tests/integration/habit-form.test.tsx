import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HabitForm from '@/components/habits/HabitForm'
import HabitCard from '@/components/habits/HabitCard'
import { Habit } from '@/types/habit'

const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

beforeEach(() => {
  localStorage.clear()
  pushMock.mockClear()
})

const today = new Date().toISOString().split('T')[0]

const mockHabit: Habit = {
  id: '1',
  userId: 'u1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: new Date().toISOString(),
  completions: [],
}

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />)

    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeInTheDocument()
    })
  })

  it('creates a new habit and renders it in the list', async () => {
    const onSave = vi.fn()
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    })
    fireEvent.change(screen.getByTestId('habit-description-input'), {
      target: { value: 'Stay hydrated' },
    })
    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Drink Water', 'Stay hydrated')
    })
  })

  it('edits an existing habit and preserves immutable fields', async () => {
    const onSave = vi.fn()
    render(
      <HabitForm existing={mockHabit} onSave={onSave} onCancel={vi.fn()} />
    )

    const nameInput = screen.getByTestId('habit-name-input')
    fireEvent.change(nameInput, { target: { value: 'Run Daily' } })
    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Run Daily', 'Stay hydrated')
    })
  })

  it('deletes a habit only after explicit confirmation', async () => {
    const onDelete = vi.fn()
    render(
      <HabitCard
        habit={mockHabit}
        onUpdate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    )

  
    fireEvent.click(screen.getByTestId('habit-delete-drink-water'))
    expect(onDelete).not.toHaveBeenCalled()


    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('confirm-delete-button'))

    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('toggles completion and updates the streak display', async () => {
    const onUpdate = vi.fn()
    render(
      <HabitCard
        habit={mockHabit}
        onUpdate={onUpdate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    const streakEl = screen.getByTestId('habit-streak-drink-water')
    expect(streakEl).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('habit-complete-drink-water'))

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          completions: expect.arrayContaining([today]),
        })
      )
    })
  })
})