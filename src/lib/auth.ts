import { User, Session } from '@/types/auth'
import { getUsers, saveUsers, saveSession } from '@/lib/storage'

export function signupUser(email: string, password: string): {
  success: boolean
  error: string | null
  session: Session | null
} {
  const users = getUsers()
  const exists = users.find((u) => u.email === email)

  if (exists) {
    return { success: false, error: 'User already exists', session: null }
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])
  const session: Session = { userId: newUser.id, email: newUser.email }
  saveSession(session)

  return { success: true, error: null, session }
}

export function loginUser(email: string, password: string): {
  success: boolean
  error: string | null
  session: Session | null
} {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, error: 'Invalid email or password', session: null }
  }

  const session: Session = { userId: user.id, email: user.email }
  saveSession(session)

  return { success: true, error: null, session }
}