/**
 * Cliente API para el backend HaiServices.
 * Base URL configurable por env (VITE_API_URL).
 */
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`)
  if (!r.ok) throw new Error(await r.text().catch(() => r.statusText))
  return r.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(await r.text().catch(() => r.statusText))
  return r.json()
}

export interface VerticalDto {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  perfil: string
  destinatarios: string | null
}

export interface ModuloDto {
  id: string
  clave: string
  nombre: string
  verticalId: string
  esBase: boolean
  icono: string | null
}

export interface ModulosByVerticalResponse {
  vertical: VerticalDto
  base: ModuloDto[]
  adicionales: ModuloDto[]
}

export const api = {
  verticales: {
    list: () => get<VerticalDto[]>(`/api/verticales`),
    modulos: (slug: string) => get<ModulosByVerticalResponse>(`/api/verticales/${encodeURIComponent(slug)}/modulos`),
  },
  organizaciones: {
    list: () => get<unknown[]>(`/api/organizaciones`),
    get: (slug: string) => get<{ modulosActivos: string[] } & unknown>(`/api/organizaciones/${encodeURIComponent(slug)}`),
    create: (body: {
      slug: string
      nombre: string
      verticalSlug: string
      modulosAdicionales: string[]
      dominioEmail?: string
      primaryColor?: string
      secondaryColor?: string
      logoUrl?: string
      productSlug?: string
    }) => post<unknown>(`/api/organizaciones`, body),
  },
}
