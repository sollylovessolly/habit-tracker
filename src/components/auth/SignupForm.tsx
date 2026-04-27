'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsers, saveUsers, saveSession } from '@/lib/storage'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const users = getUsers()
    const exists = users.find((u) => u.email === email)

    if (exists) {
      setError('User already exists')
      return
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])
    saveSession({ userId: newUser.id, email: newUser.email })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create account</h2>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              data-testid="auth-signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              data-testid="auth-signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            data-testid="auth-signup-submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}