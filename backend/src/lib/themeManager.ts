import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Temas predefinidos por vertical
 */
const temasPredefinidos: Record<string, any> = {
  HaiEduCore: {
    primary: '#1a365d',
    secondary: '#2c5282',
    accent: '#4299e1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f7fafc',
    text: '#1a202c',
  },
  HaiCommunity: {
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f0fdf4',
    text: '#064e3b',
  },
  HaiBizFlow: {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#eff6ff',
    text: '#1e3a8a',
  },
  HaiActive: {
    primary: '#ea580c',
    secondary: '#f97316',
    accent: '#fb923c',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#fff7ed',
    text: '#9a3412',
  },
  HaiCare: {
    primary: '#dc2626',
    secondary: '#f87171',
    accent: '#fca5a5',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#fef2f2',
    text: '#991b1b',
  },
  HaiFacility: {
    primary: '#374151',
    secondary: '#6b7280',
    accent: '#9ca3af',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
  },
}

/**
 * Obtiene el tema predefinido de una vertical
 */
export async function obtenerTemaPorVertical(verticalSlug: string) {
  const vertical = await prisma.vertical.findUnique({
    where: { slug: verticalSlug },
  })

  if (!vertical) {
    return temasPredefinidos.HaiEduCore
  }

  // Si la vertical tiene tema personalizado, usarlo
  if (vertical.temaColores) {
    try {
      return JSON.parse(vertical.temaColores)
    } catch {
      // Si hay error parseando, usar predefinido
    }
  }

  // Usar tema predefinido
  return temasPredefinidos[verticalSlug] || temasPredefinidos.HaiEduCore
}

/**
 * Aplica el tema de una organización
 * Si la organización tiene colores personalizados, los usa
 * Si no, usa el tema de la vertical
 */
export async function aplicarTemaOrganizacion(orgId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: { config: true },
  })

  if (!org) {
    return temasPredefinidos.HaiEduCore
  }

  // Si la organización tiene colores personalizados, generarlos
  if (org.primaryColor) {
    return generarTemaDinamico(org.primaryColor)
  }

  // Usar tema de la vertical
  return await obtenerTemaPorVertical(org.verticalSlug)
}

/**
 * Genera un tema completo desde un color primario
 */
export function generarTemaDinamico(primaryColor: string) {
  // Convertir hex a RGB
  const hex = primaryColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calcular colores derivados
  const secondary = `#${Math.max(0, r - 30).toString(16).padStart(2, '0')}${Math.max(0, g - 30).toString(16).padStart(2, '0')}${Math.max(0, b - 30).toString(16).padStart(2, '0')}`
  const accent = `#${Math.min(255, r + 50).toString(16).padStart(2, '0')}${Math.min(255, g + 50).toString(16).padStart(2, '0')}${Math.min(255, b + 50).toString(16).padStart(2, '0')}`

  return {
    primary: primaryColor,
    secondary,
    accent,
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f7fafc',
    text: '#1a202c',
  }
}
