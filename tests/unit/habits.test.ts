import { describe, it, expect } from 'vitest'
import { toggleHabitCompletion } from '@/lib/habits'
import { Habit } from '@/types/habit'

const baseHabit: Habit = {
  id: '1',
  userId: 'u1',
  name: 'Drink Water',
  description: '',
  frequency: 'daily',
  createdAt: '2025-01-01T00:00:00.000Z',
  completions: [],
}

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(baseHabit, '2025-04-26')
    expect(result.completions).toContain('2025-04-26')
  })

  it('removes a completion date when the date already exists', () => {
    const habit = { ...baseHabit, completions: ['2025-04-26'] }
    const result = toggleHabitCompletion(habit, '2025-04-26')
    expect(result.completions).not.toContain('2025-04-26')
  })

  it('does not mutate the original habit object', () => {
    const habit = { ...baseHabit, completions: ['2025-04-25'] }
    toggleHabitCompletion(habit, '2025-04-26')
    expect(habit.completions).toEqual(['2025-04-25'])
  })

  it('does not return duplicate completion dates', () => {
    const habit = { ...baseHabit, completions: ['2025-04-26'] }
    const result = toggleHabitCompletion(
      { ...habit, completions: ['2025-04-26', '2025-04-26'] },
      '2025-04-25'
    )
    const count = result.completions.filter((d) => d === '2025-04-26').length
    expect(count).toBe(1)
  })
})