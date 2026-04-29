import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'

const replaceMock = vi.fn()
const pushMock = vi.fn()
const routerMock = { replace: replaceMock, push: pushMock }

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
}))

vi.mock('@/components/shared/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('dashboard page', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    localStorage.clear()
    replaceMock.mockClear()
    pushMock.mockClear()
    vi.stubGlobal('scrollTo', vi.fn())
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'new-habit-id'),
    })
  })

  it('adds new habits to the top of the list', async () => {
    localStorage.setItem(
      'habit-tracker-session',
      JSON.stringify({ userId: 'u1', email: 'test@example.com' })
    )
    localStorage.setItem(
      'habit-tracker-habits',
      JSON.stringify([
        {
          id: 'h1',
          userId: 'u1',
          name: 'Read',
          description: '',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
        {
          id: 'h2',
          userId: 'u1',
          name: 'Walk',
          description: '',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
      ])
    )

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('create-habit-button')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('create-habit-button'))
    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    })
    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      const cards = screen.getAllByTestId(/habit-card-/)
      expect(cards[0]).toHaveAttribute('data-testid', 'habit-card-drink-water')
    })
  })

  it('scrolls to the top for edits and moves the edited habit to the top', async () => {
    const scrollToMock = vi.mocked(window.scrollTo)

    localStorage.setItem(
      'habit-tracker-session',
      JSON.stringify({ userId: 'u1', email: 'test@example.com' })
    )
    localStorage.setItem(
      'habit-tracker-habits',
      JSON.stringify([
        {
          id: 'h1',
          userId: 'u1',
          name: 'Read',
          description: '',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
        {
          id: 'h2',
          userId: 'u1',
          name: 'Walk',
          description: '',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
      ])
    )

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('habit-edit-walk')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('habit-edit-walk'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Walk')).toBeInTheDocument()
    })
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Walk Outside' },
    })
    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      const cards = screen.getAllByTestId(/habit-card-/)
      expect(cards[0]).toHaveAttribute('data-testid', 'habit-card-walk-outside')
    })
  })

  it('closes the habit form when escape is pressed', async () => {
    localStorage.setItem(
      'habit-tracker-session',
      JSON.stringify({ userId: 'u1', email: 'test@example.com' })
    )

    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('create-habit-button')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('create-habit-button'))
    expect(screen.getByTestId('habit-form')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByTestId('habit-form')).not.toBeInTheDocument()
    })
  })
})
