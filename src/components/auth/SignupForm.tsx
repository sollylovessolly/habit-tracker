'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsers, saveUsers, saveSession } from '@/lib/storage'
import Link from 'next/link'

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
    <div className="min-h-screen flex items-center justify-center bg-[#32000c] px-4 border-2 ">
      <div className="w-full max-w-sm bg-[#b04a61] rounded-2xl shadow p-8 border-red-200" >
        <h2 className="text-2xl font-bold text-red-100 mb-6">Create account</h2>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-red-100 mb-1"
            >
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              data-testid="auth-signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-red-100 mb-1"
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              data-testid="auth-signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            data-testid="auth-signup-submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-medium text-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-red-800 transition"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:underline">
            Log in
          </Link> 
        </p>
      </div>
    </div>
  )
}