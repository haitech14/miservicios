import { SERVICIOS, type Servicio, type ServicioClave } from './servicios'

/**
 * Mapeo de clave de módulo (OrgConfig) a clave de servicio (catálogo SERVICIOS).
 * Las claves que coinciden no se listan; solo las que difieren (ej. aula_virtual -> aula-virtual).
 */
export const MODULO_A_SERVICIO: Record<string, ServicioClave> = {
  aula_virtual: 'aula-virtual',
}

/**
 * Dado un conjunto de claves de módulos activos (base + adicionales de la org),
 * devuelve las claves de servicio que deben mostrarse en el catálogo.
 */
export function clavesServicioDesdeModulos(modulosActivos: string[]): ServicioClave[] {
  const claves: ServicioClave[] = []
  const serviciosClave = new Set(SERVICIOS.map((s) => s.clave))
  for (const m of modulosActivos) {
    const servicioClave = MODULO_A_SERVICIO[m] ?? (m as ServicioClave)
    if (serviciosClave.has(servicioClave)) {
      claves.push(servicioClave)
    }
  }
  return [...new Set(claves)]
}

/**
 * Devuelve la lista de SERVICIOS filtrada por los módulos activos de la organización.
 * Si modulosActivos está vacío o no se pasa, se devuelven todos (comportamiento por defecto para desarrollo).
 */
export function getServiciosPorOrg(modulosActivos: string[]): Servicio[] {
  if (modulosActivos.length === 0) {
    return SERVICIOS
  }
  const claves = clavesServicioDesdeModulos(modulosActivos)
  return SERVICIOS.filter((s) => claves.includes(s.clave))
}
