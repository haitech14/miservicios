/**
 * Tipos para el catálogo de verticales (líneas de producto) y módulos.
 * Cada organización tiene una vertical y un conjunto de módulos (base + adicionales).
 */

export type VerticalSlug =
  | 'HaiEduCore'
  | 'HaiBizFlow'
  | 'HaiActive'
  | 'HaiCare'
  | 'HaiCommunity'
  | 'HaiFacility'

export type PerfilOrganizacion =
  | 'universidad'
  | 'empresa'
  | 'gimnasio'
  | 'clinica'
  | 'comunidad'
  | 'facility'

export interface Vertical {
  id: string
  slug: VerticalSlug
  nombre: string
  descripcion: string
  perfil: PerfilOrganizacion
  destinatarios: string
}

export interface Modulo {
  id: string
  clave: string
  nombre: string
  verticalSlug: VerticalSlug
  esBase: boolean
  icono?: string
  descripcion?: string
}

export interface OrgConfigModulos {
  vertical: VerticalSlug
  base: string[]
  adicionales: string[]
}

export function modulosActivosFromConfig(config: OrgConfigModulos): string[] {
  return [...config.base, ...config.adicionales]
}
