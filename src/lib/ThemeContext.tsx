'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ThemeContextType = {
  dark: boolean
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('habit-tracker-theme')
    if (saved === 'dark') setDark(true)
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    localStorage.setItem('habit-tracker-theme', next ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}