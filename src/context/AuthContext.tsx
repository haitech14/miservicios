import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { getStoredUser, setStoredUser } from '../store/authStore'
import { MOCK_USER } from '../store/mockData'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, confirmPassword: string, acceptTerms: boolean) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email.endsWith('@unmsm.edu.pe')) return false
    const mockUser = { ...MOCK_USER, email }
    setUser(mockUser)
    setStoredUser(mockUser)
    return true
  }

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
    acceptTerms: boolean
  ): Promise<boolean> => {
    if (!email.endsWith('@unmsm.edu.pe') || password !== confirmPassword || !acceptTerms) return false
    const mockUser = { ...MOCK_USER, email }
    setUser(mockUser)
    setStoredUser(mockUser)
    return true
  }

  const logout = () => {
    setUser(null)
    setStoredUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates }
      setUser(updated)
      setStoredUser(updated)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
