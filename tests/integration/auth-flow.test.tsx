import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'


const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

beforeEach(() => {
  localStorage.clear()
  pushMock.mockClear()
})

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />)

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem('habit-tracker-session') ?? 'null')
      expect(session).not.toBeNull()
      expect(session.email).toBe('test@example.com')
    })

    expect(pushMock).toHaveBeenCalledWith('/dashboard')
  })

  it('shows an error for duplicate signup email', async () => {

    localStorage.setItem(
      'habit-tracker-users',
      JSON.stringify([
        {
          id: '1',
          email: 'test@example.com',
          password: 'password123',
          createdAt: new Date().toISOString(),
        },
      ])
    )

    render(<SignupForm />)

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument()
    })
  })

  it('submits the login form and stores the active session', async () => {
    localStorage.setItem(
      'habit-tracker-users',
      JSON.stringify([
        {
          id: '1',
          email: 'test@example.com',
          password: 'password123',
          createdAt: new Date().toISOString(),
        },
      ])
    )

    render(<LoginForm />)

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem('habit-tracker-session') ?? 'null')
      expect(session).not.toBeNull()
      expect(session.email).toBe('test@example.com')
    })

    expect(pushMock).toHaveBeenCalledWith('/dashboard')
  })

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'wrongpassword' },
    })
    fireEvent.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
  })
})