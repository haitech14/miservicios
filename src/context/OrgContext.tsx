import { createContext, useContext } from 'react'
import { TERMINOLOGIA, type TipoOrganizacion } from '../constants/terminologia'

interface OrgContextType {
  primaryColor: string
  nombre: string
  t: (key: keyof (typeof TERMINOLOGIA)['universidad']) => string
}

const OrgContext = createContext<OrgContextType | null>(null)

const defaultOrg: OrgContextType = {
  primaryColor: '#1a365d',
  nombre: 'UNMSM',
  t: (key) => TERMINOLOGIA.universidad[key],
}

export function OrgProvider({
  children,
  tipo = 'universidad',
}: {
  children: React.ReactNode
  tipo?: TipoOrganizacion
}) {
  const value: OrgContextType = {
    ...defaultOrg,
    t: (key) => TERMINOLOGIA[tipo][key],
  }
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

export function useOrg() {
  const ctx = useContext(OrgContext)
  return ctx ?? defaultOrg
}
