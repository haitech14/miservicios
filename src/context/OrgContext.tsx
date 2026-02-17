import { createContext, useContext, useMemo } from 'react'
import { TERMINOLOGIA, type TipoOrganizacion } from '../constants/terminologia'
import type { OrgConfigModulos, VerticalSlug } from '../types/verticales'
import { modulosActivosFromConfig } from '../types/verticales'
import { ORG_CONFIG_UNMSM } from '../constants/orgConfigDefault'
import { VERTICALES_BY_SLUG } from '../constants/verticales'

interface OrgContextType {
  primaryColor: string
  nombre: string
  slug?: string
  /** Vertical (línea de producto) de la organización */
  vertical: VerticalSlug
  /** Configuración de módulos: base + adicionales activados */
  orgConfig: OrgConfigModulos
  /** Lista de claves de módulos activos (base + adicionales) para esta org */
  modulosActivos: string[]
  t: (key: keyof (typeof TERMINOLOGIA)['universidad']) => string
}

const defaultOrgConfig = ORG_CONFIG_UNMSM

const defaultOrg: OrgContextType = {
  primaryColor: '#1a365d',
  nombre: 'UNMSM',
  slug: 'unmsm',
  vertical: 'HaiEduCore',
  orgConfig: defaultOrgConfig,
  modulosActivos: modulosActivosFromConfig(defaultOrgConfig),
  t: (key) => TERMINOLOGIA.universidad[key],
}

const OrgContext = createContext<OrgContextType | null>(null)

function tipoFromVertical(vertical: VerticalSlug): TipoOrganizacion {
  const v = VERTICALES_BY_SLUG[vertical]
  return v ? v.perfil : 'universidad'
}

export function OrgProvider({
  children,
  tipo = 'universidad',
  vertical,
  orgConfig,
  nombre = 'UNMSM',
  primaryColor = '#1a365d',
  slug,
}: {
  children: React.ReactNode
  tipo?: TipoOrganizacion
  vertical?: VerticalSlug
  orgConfig?: OrgConfigModulos
  nombre?: string
  primaryColor?: string
  slug?: string
}) {
  const effectiveVertical = vertical ?? (tipo === 'universidad' ? 'HaiEduCore' : tipo === 'empresa' ? 'HaiBizFlow' : 'HaiEduCore')
  const effectiveConfig = orgConfig ?? defaultOrgConfig
  const modulosActivos = useMemo(() => modulosActivosFromConfig(effectiveConfig), [effectiveConfig])
  const effectiveTipo = tipo ?? tipoFromVertical(effectiveVertical)

  const value: OrgContextType = useMemo(
    () => ({
      primaryColor,
      nombre,
      slug,
      vertical: effectiveVertical,
      orgConfig: effectiveConfig,
      modulosActivos,
      t: (key) => TERMINOLOGIA[effectiveTipo][key],
    }),
    [primaryColor, nombre, slug, effectiveVertical, effectiveConfig, modulosActivos, effectiveTipo]
  )

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

export function useOrg() {
  const ctx = useContext(OrgContext)
  return ctx ?? defaultOrg
}
