'use client'

import { startTransition, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/storage'

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.push('/login')
    } else {
      startTransition(() => setAuthorized(true))
    }
  }, [router])

  if (!authorized) return null

  return <>{children}</>
}
