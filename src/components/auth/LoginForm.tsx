'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsers, saveSession } from '@/lib/storage'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const users = getUsers()
    const user = users.find(
      (u) => u.email === email && u.password === password
    )

    if (!user) {
      setError('Invalid email or password')
      return
    }

    saveSession({ userId: user.id, email: user.email })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#32000c] px-4">
      <div className="w-full max-w-sm bg-[#b04a61] rounded-2xl shadow p-8 border-2 border-red-100">
        <h2 className="text-2xl font-bold text-red-100 mb-6">Welcome back</h2>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-red-100 mb-1"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              data-testid="auth-login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-red-100 mb-1"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              data-testid="auth-login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            data-testid="auth-login-submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-medium text-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
          >
            Log in
          </button>
        </form>

        <p className="mt-4 text-sm text-center  text-gray-700">
          No account?{' '}
          <Link href="/signup" className="text-white hover:underline">
            Sign Up
        </Link>
        </p>
      </div>
    </div>
  )
}