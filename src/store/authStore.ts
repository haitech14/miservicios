import type { User } from '../types'

const AUTH_KEY = 'mi-servicios-auth'
const USER_KEY = 'mi-servicios-user'

export function getStoredUser(): User | null {
  try {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(AUTH_KEY, 'true')
  } else {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(AUTH_KEY)
  }
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(AUTH_KEY)
  } catch {
    // Ignorar errores de acceso a localStorage (por ejemplo, en modo privado estricto)
  }
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true'
}
