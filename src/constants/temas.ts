import type { VerticalSlug } from '../types/verticales'

export interface TemaColores {
  primary: string
  secondary: string
  accent: string
  success: string
  warning: string
  error: string
  background: string
  surface: string
  text: string
  textSecondary?: string
}

export interface TemaVertical {
  verticalSlug: VerticalSlug
  nombre: string
  colores: TemaColores
  iconografia?: Record<string, string>
}

/**
 * Temas predefinidos por vertical
 * Cada vertical tiene una paleta de colores única que se aplica automáticamente
 */
export const TEMAS_VERTICALES: Record<VerticalSlug, TemaVertical> = {
  HaiEduCore: {
    verticalSlug: 'HaiEduCore',
    nombre: 'Educación',
    colores: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      accent: '#10b981',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      surface: '#eff6ff',
      text: '#1e3a8a',
      textSecondary: '#3b82f6',
    },
    iconografia: {
      estudiantes: '👥',
      docentes: '👨‍🏫',
      calendario: '📅',
      biblioteca: '📚',
    },
  },
  HaiCommunity: {
    verticalSlug: 'HaiCommunity',
    nombre: 'Comunidades y ONG',
    colores: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#ec4899',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      surface: '#f5f3ff',
      text: '#5b21b6',
      textSecondary: '#7c3aed',
    },
    iconografia: {
      socios: '👥',
      eventos: '📅',
      cuotas: '💰',
      voluntarios: '🤝',
    },
  },
  HaiBizFlow: {
    verticalSlug: 'HaiBizFlow',
    nombre: 'Empresas',
    colores: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#f59e0b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      surface: '#eef2ff',
      text: '#3730a3',
      textSecondary: '#4f46e5',
    },
    iconografia: {
      empleados: '👥',
      beneficios: '🎁',
      solicitudes: '📝',
      nomina: '💰',
    },
  },
  HaiActive: {
    verticalSlug: 'HaiActive',
    nombre: 'Gimnasio y Deporte',
    colores: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f97316',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      surface: '#fef2f2',
      text: '#991b1b',
      textSecondary: '#dc2626',
    },
    iconografia: {
      miembros: '👥',
      clases: '🏋️',
      planes: '📋',
      acceso: '🔐',
    },
  },
  HaiCare: {
    verticalSlug: 'HaiCare',
    nombre: 'Salud',
    colores: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      surface: '#f0fdf4',
      text: '#064e3b',
      textSecondary: '#059669',
    },
    iconografia: {
      pacientes: '👥',
      agenda: '📅',
      historia: '📁',
      especialidades: '🏥',
    },
  },
  HaiFacility: {
    verticalSlug: 'HaiFacility',
    nombre: 'Vecindarios',
    colores: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#14b8a6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      surface: '#f0f9ff',
      text: '#0c4a6e',
      textSecondary: '#0284c7',
    },
    iconografia: {
      espacios: '🏢',
      reservas: '📅',
      incidencias: '🔧',
      facturacion: '💳',
    },
  },
}

/**
 * Obtiene el tema de una vertical
 */
export function obtenerTemaPorVertical(verticalSlug: VerticalSlug): TemaVertical {
  return TEMAS_VERTICALES[verticalSlug] || TEMAS_VERTICALES.HaiEduCore
}

/**
 * Genera un tema dinámico desde un color primario
 */
export function generarTemaDinamico(primaryColor: string): TemaColores {
  // Convertir hex a RGB
  const hex = primaryColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calcular colores derivados
  const secondary = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`
  const accent = `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`

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
    textSecondary: '#4a5568',
  }
}
