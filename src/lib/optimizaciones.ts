/**
 * Utilidades de optimización para la plataforma
 */

import { useState } from 'react'

/**
 * Debounce para funciones
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle para funciones
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Lazy load de imágenes
 */
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src
        observer.unobserve(img)
      }
    })
  })
  observer.observe(img)
}

/**
 * Cache simple en memoria
 */
class SimpleCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private ttl: number

  constructor(ttl: number = 5 * 60 * 1000) {
    // 5 minutos por defecto
    this.ttl = ttl
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    return item.data
  }

  clear() {
    this.cache.clear()
  }
}

export const apiCache = new SimpleCache(5 * 60 * 1000)

/**
 * Validación de formularios en tiempo real
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' }
  }
  return { valid: true }
}

export function validateSlug(slug: string): { valid: boolean; message?: string } {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { valid: false, message: 'Solo letras minúsculas, números y guiones' }
  }
  if (slug.length < 3) {
    return { valid: false, message: 'El slug debe tener al menos 3 caracteres' }
  }
  return { valid: true }
}

/**
 * Formateo de números y fechas
 */
export function formatCurrency(amount: number, currency: string = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  const minutos = Math.floor(diff / 60000)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)

  if (minutos < 1) return 'Ahora'
  if (minutos < 60) return `Hace ${minutos} min`
  if (horas < 24) return `Hace ${horas} h`
  if (dias < 7) return `Hace ${dias} días`
  return formatDate(dateObj)
}

/**
 * Confirmación para acciones críticas
 */
export function confirmAction(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.confirm(message)) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

/**
 * Manejo de errores con feedback visual
 */
export function handleError(error: unknown, defaultMessage: string = 'Ocurrió un error'): string {
  if (error instanceof Error) {
    return error.message || defaultMessage
  }
  if (typeof error === 'string') {
    return error
  }
  return defaultMessage
}

/**
 * Loading state helper
 */
export function createLoadingState() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)
      const result = await fn()
      return result
    } catch (err) {
      const errorMessage = handleError(err)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, execute }
}
