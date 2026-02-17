import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { getStoredUser, setStoredUser, clearStoredUser } from '../store/authStore'
import { api } from '../services/api'
import { useOrg } from './OrgContext'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (
    email: string,
    password: string,
    nombres?: string,
    apellidos?: string,
    dni?: string,
    organizationId?: string,
    createOrganization?: {
      nombre: string
      slug: string
      verticalSlug: string
      modulosAdicionales?: string[]
    }
  ) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { setOrganization } = useOrg()

  useEffect(() => {
    // Intentar cargar usuario guardado
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
      // TODO: Verificar token/sesión con backend
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await api.auth.login(email, password)
      
      if (response.user) {
        const userData = response.user as any
        const user: User = {
          id: userData.id,
          email: userData.email,
          nombres: userData.nombres || '',
          apellidos: userData.apellidos || '',
          fotoUrl: userData.fotoUrl || null,
          portadaUrl: userData.portadaUrl || null,
          organizationId: userData.organizationId,
          rol: userData.rol || 'beneficiario',
        }
        
        setUser(user)
        setStoredUser(user)

        // Actualizar organización si hay branding
        if (response.branding) {
          const branding = response.branding as any
          setOrganization({
            id: userData.organization?.id || branding.id,
            nombre: userData.organization?.nombre || branding.nombre,
            slug: userData.organization?.slug || branding.slug,
            logoUrl: branding.logoUrl || userData.organization?.logoUrl,
            portadaUrl: branding.portadaUrl || userData.organization?.portadaUrl,
            primaryColor: branding.primaryColor || userData.organization?.primaryColor,
            secondaryColor: branding.secondaryColor || userData.organization?.secondaryColor,
            verticalSlug: userData.organization?.verticalSlug || branding.verticalSlug,
            terminologia: userData.organization?.terminologia || branding.terminologia,
          })
        } else if (userData.organization) {
          setOrganization({
            id: userData.organization.id,
            nombre: userData.organization.nombre,
            slug: userData.organization.slug,
            logoUrl: userData.organization.logoUrl,
            portadaUrl: userData.organization.portadaUrl,
            primaryColor: userData.organization.primaryColor,
            secondaryColor: userData.organization.secondaryColor,
            verticalSlug: userData.organization.verticalSlug,
            terminologia: userData.organization.terminologia,
          })
        }

        return true
      }
      return false
    } catch (error: any) {
      console.error('Error en login:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    nombres?: string,
    apellidos?: string,
    dni?: string,
    organizationId?: string,
    createOrganization?: {
      nombre: string
      slug: string
      verticalSlug: string
      modulosAdicionales?: string[]
    }
  ): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await api.auth.register({
        email,
        password,
        nombres,
        apellidos,
        dni,
        organizationId,
        createOrganization,
      })

      if (response.user) {
        const userData = response.user as any
        const user: User = {
          id: userData.id,
          email: userData.email,
          nombres: userData.nombres || '',
          apellidos: userData.apellidos || '',
          fotoUrl: userData.fotoUrl || null,
          portadaUrl: userData.portadaUrl || null,
          organizationId: userData.organizationId,
          rol: userData.rol || 'beneficiario',
        }

        setUser(user)
        setStoredUser(user)

        // Actualizar organización
        if (response.organization) {
          const org = response.organization as any
          setOrganization({
            id: org.id,
            nombre: org.nombre,
            slug: org.slug,
            logoUrl: org.logoUrl,
            portadaUrl: org.portadaUrl,
            primaryColor: org.primaryColor,
            secondaryColor: org.secondaryColor,
            verticalSlug: org.verticalSlug,
            terminologia: org.terminologia,
          })
        }

        return true
      }
      return false
    } catch (error: any) {
      console.error('Error en registro:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    clearStoredUser()
    setOrganization(null)
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates }
      setUser(updated)
      setStoredUser(updated)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
