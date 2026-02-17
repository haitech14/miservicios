/**
 * Cargador dinámico de módulos para el frontend
 * Permite cargar componentes de módulos de forma dinámica
 */

import { lazy } from 'react'
import type { ComponentType } from 'react'

export interface ModuleDefinition {
  id: string
  nombre: string
  ruta: string
  componente: () => Promise<{ default: ComponentType<any> }>
  icono?: string
  verticales: string[]
}

const modulosRegistrados: Map<string, ModuleDefinition> = new Map()

/**
 * Registra un módulo dinámico
 */
export function registrarModulo(modulo: ModuleDefinition) {
  modulosRegistrados.set(modulo.id, modulo)
}

/**
 * Obtiene un módulo por ID
 */
export function obtenerModulo(id: string): ModuleDefinition | undefined {
  return modulosRegistrados.get(id)
}

/**
 * Lista todos los módulos registrados
 */
export function listarModulos(): ModuleDefinition[] {
  return Array.from(modulosRegistrados.values())
}

/**
 * Lista módulos por vertical
 */
export function listarModulosPorVertical(verticalSlug: string): ModuleDefinition[] {
  return Array.from(modulosRegistrados.values()).filter((m) => m.verticales.includes(verticalSlug))
}

/**
 * Carga un componente de módulo de forma lazy
 */
export function cargarModulo(id: string): ComponentType<any> | null {
  const modulo = obtenerModulo(id)
  if (!modulo) return null

  return lazy(modulo.componente)
}
