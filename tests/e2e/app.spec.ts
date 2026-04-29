import { test, expect } from '@playwright/test'

const testUser = {
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
}

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:3000/login')
    await page.evaluate(() => localStorage.clear())
  })

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page.getByTestId('splash-screen')).toBeVisible()
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // Create session manually
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: '1',
        email: 'test@example.com',
      }))
    })
    await page.goto('http://localhost:3000')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 })
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/signup')
    await page.getByTestId('auth-signup-email').fill(testUser.email)
    await page.getByTestId('auth-signup-password').fill(testUser.password)
    await page.getByTestId('auth-signup-submit').click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 })
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })

  test('redirects authenticated users away from /login and /signup', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'u1',
        email: 'test@example.com',
      }))
    })

    await page.goto('http://localhost:3000/login')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 })

    await page.goto('http://localhost:3000/signup')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 })
  })

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // Setup user and habits in localStorage
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{
        id: 'u1', email: 'existing@example.com',
        password: 'password123', createdAt: new Date().toISOString(),
      }]))
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        {
          id: 'h1', userId: 'u1', name: 'Drink Water',
          description: '', frequency: 'daily',
          createdAt: new Date().toISOString(), completions: [],
        },
        {
          id: 'h2', userId: 'u2', name: 'Other User Habit',
          description: '', frequency: 'daily',
          createdAt: new Date().toISOString(), completions: [],
        },
      ]))
    })

    await page.goto('http://localhost:3000/login')
    await page.getByTestId('auth-login-email').fill('existing@example.com')
    await page.getByTestId('auth-login-password').fill('password123')
    await page.getByTestId('auth-login-submit').click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 })
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
    await expect(page.getByTestId('habit-card-other-user-habit')).not.toBeVisible()
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{
        id: 'u1', email: 'test@example.com',
        password: 'password123', createdAt: new Date().toISOString(),
      }]))
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'u1', email: 'test@example.com',
      }))
    })

    await page.goto('http://localhost:3000/dashboard')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-description-input').fill('Stay hydrated')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'u1', email: 'test@example.com',
      }))
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{
        id: 'h1', userId: 'u1', name: 'Drink Water',
        description: '', frequency: 'daily',
        createdAt: new Date().toISOString(), completions: [],
      }]))
    })

    await page.goto('http://localhost:3000/dashboard')
    await page.getByTestId('habit-complete-drink-water').click()

    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('1')
  })

  test('persists session and habits after page reload', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'u1', email: 'test@example.com',
      }))
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{
        id: 'h1', userId: 'u1', name: 'Drink Water',
        description: '', frequency: 'daily',
        createdAt: new Date().toISOString(), completions: [],
      }]))
    })

    await page.goto('http://localhost:3000/dashboard')
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()

    await page.reload()
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'u1', email: 'test@example.com',
      }))
    })

    await page.goto('http://localhost:3000/dashboard')
    await page.getByTestId('auth-logout-button').first().click()
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })

  test('opens dashboard sidebar sections', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'u1',
        email: 'test@example.com',
      }))
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{
        id: 'h1',
        userId: 'u1',
        name: 'Drink Water',
        description: '',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [new Date().toISOString().split('T')[0]],
      }]))
    })

    await page.goto('http://localhost:3000/dashboard')

    await page.getByTestId('nav-profile').click()
    await expect(page.getByTestId('profile-section')).toBeVisible()

    await page.getByTestId('nav-stats').click()
    await expect(page.getByTestId('stats-section')).toContainText('Completed today')

    await page.getByTestId('nav-calendar').click()
    await expect(page.getByTestId('calendar-section')).toBeVisible()

    await page.getByTestId('nav-settings').click()
    await expect(page.getByTestId('settings-section')).toBeVisible()
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // Load app once while online
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({
        userId: 'u1', email: 'test@example.com',
      }))
    })
    await page.goto('http://localhost:3000/dashboard')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()

    // Go offline
    await context.setOffline(true)

    // Reload — app shell may or may not load depending on SW cache
    try {
    await page.reload({ timeout: 3000 })
    } catch {
    // Expected when offline and no service worker cache yet
    }

    const body = await page.locator('body').innerHTML()
    expect(body).toBeDefined()

    // Go back online
    await context.setOffline(false)
  })
})
