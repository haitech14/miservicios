import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react'
import { useOrg } from './OrgContext'
import { obtenerTemaPorVertical, generarTemaDinamico, type TemaColores } from '../constants/temas'

interface ThemeContextType {
  tema: TemaColores
  aplicarTema: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { vertical, primaryColor } = useOrg()

  // Obtener tema según vertical o color personalizado
  const tema = useMemo(() => {
    if (primaryColor && primaryColor !== '#1a365d') {
      // Si hay color personalizado, generar tema dinámico
      return generarTemaDinamico(primaryColor)
    }
    // Usar tema predefinido de la vertical
    return obtenerTemaPorVertical(vertical).colores
  }, [vertical, primaryColor])

  // Aplicar tema como CSS variables
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', tema.primary)
    root.style.setProperty('--color-secondary', tema.secondary)
    root.style.setProperty('--color-accent', tema.accent)
    root.style.setProperty('--color-success', tema.success)
    root.style.setProperty('--color-warning', tema.warning)
    root.style.setProperty('--color-error', tema.error)
    root.style.setProperty('--color-background', tema.background)
    root.style.setProperty('--color-surface', tema.surface)
    root.style.setProperty('--color-text', tema.text)
    root.style.setProperty('--color-text-secondary', tema.textSecondary || tema.text)
  }, [tema])

  const aplicarTema = () => {
    // Función para re-aplicar tema si es necesario
    const root = document.documentElement
    root.style.setProperty('--color-primary', tema.primary)
    root.style.setProperty('--color-secondary', tema.secondary)
    root.style.setProperty('--color-accent', tema.accent)
    root.style.setProperty('--color-success', tema.success)
    root.style.setProperty('--color-warning', tema.warning)
    root.style.setProperty('--color-error', tema.error)
    root.style.setProperty('--color-background', tema.background)
    root.style.setProperty('--color-surface', tema.surface)
    root.style.setProperty('--color-text', tema.text)
    root.style.setProperty('--color-text-secondary', tema.textSecondary || tema.text)
  }

  const value = useMemo(
    () => ({
      tema,
      aplicarTema,
    }),
    [tema]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    // Tema por defecto si no hay contexto
    const temaDefault = obtenerTemaPorVertical('HaiEduCore').colores
    return {
      tema: temaDefault,
      aplicarTema: () => {},
    }
  }
  return ctx
}
