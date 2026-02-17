import type { OrgConfigModulos } from '../types/verticales'
import { getModulosBaseByVertical } from './modulos'
import type { VerticalSlug } from '../types/verticales'

/**
 * Genera la configuración por defecto para una vertical:
 * base = todas las claves base de la vertical
 * adicionales = array vacío (el admin elige al crear la org)
 */
export function defaultOrgConfigForVertical(vertical: VerticalSlug): OrgConfigModulos {
  const base = getModulosBaseByVertical(vertical).map((m) => m.clave)
  return {
    vertical,
    base,
    adicionales: [],
  }
}

/**
 * Configuración por defecto para UNMSM (HaiEduCore) con módulos adicionales
 * típicos de una universidad: comedor, transporte, biblioteca, clínica, tutorías, etc.
 */
export const ORG_CONFIG_UNMSM: OrgConfigModulos = {
  vertical: 'HaiEduCore',
  base: [
    'estudiantes',
    'matriculas',
    'calendario',
    'docentes',
    'asistencia',
    'evaluaciones',
    'expedientes',
  ],
  adicionales: [
    'comedor',
    'transporte',
    'biblioteca',
    'clinica',
    'gimnasio',
    'sum',
    'idiomas',
    'aula_virtual',
    'mapa',
    'tutorias',
    'pagos',
    'certificados',
  ],
}
