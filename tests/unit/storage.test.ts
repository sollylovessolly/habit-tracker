import { describe, it, expect, beforeEach } from 'vitest'
import {
  getUsers, saveUsers,
  getSession, saveSession, clearSession,
  getHabits, saveHabits,
} from '@/lib/storage'

beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('saves and retrieves users', () => {
    const users = [{ id: '1', email: 'a@b.com', password: '123', createdAt: '2025-01-01' }]
    saveUsers(users)
    expect(getUsers()).toEqual(users)
  })

  it('returns empty array when no users exist', () => {
    expect(getUsers()).toEqual([])
  })

  it('saves and retrieves session', () => {
    const session = { userId: '1', email: 'a@b.com' }
    saveSession(session)
    expect(getSession()).toEqual(session)
  })

  it('clears session', () => {
    saveSession({ userId: '1', email: 'a@b.com' })
    clearSession()
    expect(getSession()).toBeNull()
  })

  it('saves and retrieves habits', () => {
    const habits = [{
      id: '1', userId: 'u1', name: 'Run', description: '',
      frequency: 'daily' as const, createdAt: '2025-01-01', completions: []
    }]
    saveHabits(habits)
    expect(getHabits()).toEqual(habits)
  })

  it('returns empty array when no habits exist', () => {
    expect(getHabits()).toEqual([])
  })
})