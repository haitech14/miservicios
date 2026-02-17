import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ServicioClave } from '../constants/servicios'

const STORAGE_KEY = 'mi-servicios-config'

export interface SeccionesSistema {
  inicio: boolean
  servicios: boolean
  noticias: boolean
  comunidad: boolean
}

export interface SeccionesPerfil {
  datosPersonales: boolean
  gamificacion: boolean
  notificaciones: boolean
  privacidad: boolean
}

export interface ConfiguracionUsuario {
  nombreOrganizacion?: string
  seccionesSistema: SeccionesSistema
  seccionesPerfil: SeccionesPerfil
  modulosDeshabilitados: ServicioClave[]
}

const defaultSeccionesSistema: SeccionesSistema = {
  inicio: true,
  servicios: true,
  noticias: true,
  comunidad: true,
}

const defaultSeccionesPerfil: SeccionesPerfil = {
  datosPersonales: true,
  gamificacion: true,
  notificaciones: true,
  privacidad: true,
}

function loadFromStorage(): Partial<ConfiguracionUsuario> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        nombreOrganizacion: parsed.nombreOrganizacion,
        seccionesSistema: { ...defaultSeccionesSistema, ...parsed.seccionesSistema },
        seccionesPerfil: { ...defaultSeccionesPerfil, ...parsed.seccionesPerfil },
        modulosDeshabilitados: Array.isArray(parsed.modulosDeshabilitados) ? parsed.modulosDeshabilitados : [],
      }
    }
  } catch (_) {}
  return {}
}

function saveToStorage(config: Partial<ConfiguracionUsuario>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (_) {}
}

interface ConfiguracionContextType extends ConfiguracionUsuario {
  setNombreOrganizacion: (nombre: string | undefined) => void
  setSeccionSistema: (k: keyof SeccionesSistema, v: boolean) => void
  setSeccionPerfil: (k: keyof SeccionesPerfil, v: boolean) => void
  toggleModulo: (clave: ServicioClave) => void
  isModuloHabilitado: (clave: ServicioClave) => boolean
  getNombreOrgDisplay: (nombreOrg: string) => string
}

const ConfiguracionContext = createContext<ConfiguracionContextType | null>(null)

export function ConfiguracionProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ConfiguracionUsuario>(() => ({
    nombreOrganizacion: undefined,
    seccionesSistema: defaultSeccionesSistema,
    seccionesPerfil: defaultSeccionesPerfil,
    modulosDeshabilitados: [],
    ...loadFromStorage(),
  }))

  useEffect(() => {
    saveToStorage({
      nombreOrganizacion: config.nombreOrganizacion,
      seccionesSistema: config.seccionesSistema,
      seccionesPerfil: config.seccionesPerfil,
      modulosDeshabilitados: config.modulosDeshabilitados,
    })
  }, [config])

  const setNombreOrganizacion = useCallback((nombre: string | undefined) => {
    setConfig((c) => ({ ...c, nombreOrganizacion: nombre || undefined }))
  }, [])

  const setSeccionSistema = useCallback((k: keyof SeccionesSistema, v: boolean) => {
    setConfig((c) => ({
      ...c,
      seccionesSistema: { ...c.seccionesSistema, [k]: v },
    }))
  }, [])

  const setSeccionPerfil = useCallback((k: keyof SeccionesPerfil, v: boolean) => {
    setConfig((c) => ({
      ...c,
      seccionesPerfil: { ...c.seccionesPerfil, [k]: v },
    }))
  }, [])

  const toggleModulo = useCallback((clave: ServicioClave) => {
    setConfig((c) => {
      const list = c.modulosDeshabilitados
      const idx = list.indexOf(clave)
      const nueva = idx >= 0 ? list.filter((x) => x !== clave) : [...list, clave]
      return { ...c, modulosDeshabilitados: nueva }
    })
  }, [])

  const isModuloHabilitado = useCallback(
    (clave: ServicioClave) => !config.modulosDeshabilitados.includes(clave),
    [config.modulosDeshabilitados]
  )

  const getNombreOrgDisplay = useCallback(
    (nombreOrg: string) => config.nombreOrganizacion?.trim() || nombreOrg,
    [config.nombreOrganizacion]
  )

  const value: ConfiguracionContextType = {
    ...config,
    setNombreOrganizacion,
    setSeccionSistema,
    setSeccionPerfil,
    toggleModulo,
    isModuloHabilitado,
    getNombreOrgDisplay,
  }

  return <ConfiguracionContext.Provider value={value}>{children}</ConfiguracionContext.Provider>
}

export function useConfiguracion() {
  const ctx = useContext(ConfiguracionContext)
  if (!ctx) {
    return {
      nombreOrganizacion: undefined,
      seccionesSistema: defaultSeccionesSistema,
      seccionesPerfil: defaultSeccionesPerfil,
      modulosDeshabilitados: [] as ServicioClave[],
      setNombreOrganizacion: () => {},
      setSeccionSistema: () => {},
      setSeccionPerfil: () => {},
      toggleModulo: () => {},
      isModuloHabilitado: () => true,
      getNombreOrgDisplay: (n: string) => n,
    } as ConfiguracionContextType
  }
  return ctx
}
