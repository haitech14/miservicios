/**
 * Cliente API para el backend HaiCommunity.
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

async function patch<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(await r.text().catch(() => r.statusText))
  return r.json()
}

async function postFormData<T>(path: string, formData: FormData): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    body: formData,
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
  auth: {
    register: (body: {
      email: string
      password: string
      nombres?: string
      apellidos?: string
      dni?: string
      organizationId?: string
      createOrganization?: {
        nombre: string
        slug: string
        verticalSlug: string
        modulosAdicionales?: string[]
      }
    }) => post<{ user: unknown; organization: unknown }>(`/api/auth/register`, body),
    login: (email: string, password: string) => post<{ user: unknown; branding?: unknown }>(`/api/auth/login`, { email, password }),
  },
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
    buscar: (query?: string, verticalSlug?: string) => post<unknown[]>(`/api/organizaciones/buscar`, { query, verticalSlug }),
    publicas: () => get<unknown[]>(`/api/organizaciones/publicas`),
    updateModulos: (slug: string, modulosAdicionales: string[]) => patch<unknown>(`/api/organizaciones/${encodeURIComponent(slug)}/modulos`, { modulosAdicionales }),
  },
  comunidad: {
    socios: {
      list: (organizationId: string) => get<unknown[]>(`/api/community/socios?organizationId=${encodeURIComponent(organizationId)}`),
      create: (body: unknown) => post<unknown>(`/api/community/socios`, body),
    },
    cuotas: {
      list: (organizationId: string, socioId?: string, estado?: string) => {
        const params = new URLSearchParams({ organizationId })
        if (socioId) params.append('socioId', socioId)
        if (estado) params.append('estado', estado)
        return get<unknown[]>(`/api/community/cuotas?${params}`)
      },
      create: (body: unknown) => post<unknown>(`/api/community/cuotas`, body),
      pagar: (id: string, metodoPago?: string) => patch<unknown>(`/api/community/cuotas/${encodeURIComponent(id)}/pagar`, { metodoPago }),
    },
    eventos: {
      list: (organizationId: string, estado?: string) => {
        const params = new URLSearchParams({ organizationId })
        if (estado) params.append('estado', estado)
        return get<unknown[]>(`/api/community/eventos?${params}`)
      },
      create: (body: unknown) => post<unknown>(`/api/community/eventos`, body),
    },
    comunicaciones: {
      list: (organizationId: string) => get<unknown[]>(`/api/community/comunicaciones?organizationId=${encodeURIComponent(organizationId)}`),
      create: (body: unknown) => post<unknown>(`/api/community/comunicaciones`, body),
    },
    voluntarios: {
      list: (organizationId: string) => get<unknown[]>(`/api/community/voluntarios?organizationId=${encodeURIComponent(organizationId)}`),
      create: (body: unknown) => post<unknown>(`/api/community/voluntarios`, body),
    },
    donaciones: {
      list: (organizationId: string) => get<unknown[]>(`/api/community/donaciones?organizationId=${encodeURIComponent(organizationId)}`),
      create: (body: unknown) => post<unknown>(`/api/community/donaciones`, body),
    },
    proyectos: {
      list: (organizationId: string) => get<unknown[]>(`/api/community/proyectos?organizationId=${encodeURIComponent(organizationId)}`),
      create: (body: unknown) => post<unknown>(`/api/community/proyectos`, body),
    },
    votaciones: {
      list: (organizationId: string) => get<unknown[]>(`/api/community/votaciones?organizationId=${encodeURIComponent(organizationId)}`),
      create: (body: unknown) => post<unknown>(`/api/community/votaciones`, body),
      votar: (id: string, userId: string, opcionId: string) => post<unknown>(`/api/community/votaciones/${encodeURIComponent(id)}/votar`, { userId, opcionId }),
    },
    reportesFinancieros: (organizationId: string, fechaDesde?: string, fechaHasta?: string) => {
      const params = new URLSearchParams({ organizationId })
      if (fechaDesde) params.append('fechaDesde', fechaDesde)
      if (fechaHasta) params.append('fechaHasta', fechaHasta)
      return get<unknown>(`/api/community/reportes-financieros?${params}`)
    },
  },
  gamificacion: {
    ranking: (periodo?: string, limite?: number) => {
      const params = new URLSearchParams()
      if (periodo) params.append('periodo', periodo)
      if (limite) params.append('limite', limite.toString())
      return get<unknown[]>(`/api/gamificacion/ranking?${params}`)
    },
    rankingServicio: (servicioId: string, limite?: number) => {
      const params = new URLSearchParams()
      if (limite) params.append('limite', limite.toString())
      return get<unknown[]>(`/api/gamificacion/ranking/${encodeURIComponent(servicioId)}?${params}`)
    },
    miPerfil: () => get<unknown>(`/api/gamificacion/mi-perfil`),
    agregarPuntos: (body: unknown) => post<unknown>(`/api/gamificacion/puntos`, body),
    logros: () => get<unknown[]>(`/api/gamificacion/logros`),
    misLogros: () => get<unknown[]>(`/api/gamificacion/mis-logros`),
    premioDiario: (dailyRewardId: string) => post<unknown>(`/api/gamificacion/premio-diario`, { dailyRewardId }),
    estadoPremioDiario: (dailyRewardId: string) => get<unknown>(`/api/gamificacion/premio-diario/estado?dailyRewardId=${encodeURIComponent(dailyRewardId)}`),
  },
  configuracion: {
    subirFotoPerfil: (file: File) => {
      const formData = new FormData()
      formData.append('foto', file)
      return postFormData<unknown>(`/api/configuracion/foto-perfil`, formData)
    },
    subirFotoPortada: (file: File) => {
      const formData = new FormData()
      formData.append('portada', file)
      return postFormData<unknown>(`/api/configuracion/foto-portada`, formData)
    },
    subirLogoOrganizacion: (organizationId: string, file: File) => {
      const formData = new FormData()
      formData.append('logo', file)
      formData.append('organizationId', organizationId)
      return postFormData<unknown>(`/api/configuracion/organizacion/logo`, formData)
    },
    subirPortadaOrganizacion: (organizationId: string, file: File) => {
      const formData = new FormData()
      formData.append('portada', file)
      formData.append('organizationId', organizationId)
      return postFormData<unknown>(`/api/configuracion/organizacion/portada`, formData)
    },
    actualizarPerfil: (body: unknown) => patch<unknown>(`/api/configuracion/perfil`, body),
    gamificacion: {
      get: (organizationId: string) => get<unknown>(`/api/configuracion/gamificacion?organizationId=${encodeURIComponent(organizationId)}`),
      update: (body: unknown) => patch<unknown>(`/api/configuracion/gamificacion`, body),
    },
  },
  interaccion: {
    foros: {
      list: (organizationId: string) => get<unknown[]>(`/api/interaccion/foros?organizationId=${encodeURIComponent(organizationId)}`),
      create: (body: unknown) => post<unknown>(`/api/interaccion/foros`, body),
      posts: (id: string, limite?: number, offset?: number) => {
        const params = new URLSearchParams()
        if (limite) params.append('limite', limite.toString())
        if (offset) params.append('offset', offset.toString())
        return get<unknown[]>(`/api/interaccion/foros/${encodeURIComponent(id)}/posts?${params}`)
      },
    },
    posts: {
      create: (body: unknown) => post<unknown>(`/api/interaccion/posts`, body),
      get: (id: string) => get<unknown>(`/api/interaccion/posts/${encodeURIComponent(id)}`),
      comentar: (id: string, body: unknown) => post<unknown>(`/api/interaccion/posts/${encodeURIComponent(id)}/comentarios`, body),
      reaccionar: (id: string, userId: string, tipo: string) => post<unknown>(`/api/interaccion/posts/${encodeURIComponent(id)}/reaccionar`, { userId, tipo }),
    },
    feed: {
      list: (organizationId: string, limite?: number, offset?: number) => {
        const params = new URLSearchParams({ organizationId })
        if (limite) params.append('limite', limite.toString())
        if (offset) params.append('offset', offset.toString())
        return get<unknown[]>(`/api/interaccion/feed?${params}`)
      },
      create: (body: unknown) => post<unknown>(`/api/interaccion/feed`, body),
    },
    grupos: {
      list: (organizationId: string, privado?: boolean) => {
        const params = new URLSearchParams({ organizationId })
        if (privado !== undefined) params.append('privado', privado.toString())
        return get<unknown[]>(`/api/interaccion/grupos?${params}`)
      },
      create: (body: unknown) => post<unknown>(`/api/interaccion/grupos`, body),
      chat: {
        list: (id: string, limite?: number, offset?: number) => {
          const params = new URLSearchParams()
          if (limite) params.append('limite', limite.toString())
          if (offset) params.append('offset', offset.toString())
          return get<unknown[]>(`/api/interaccion/grupos/${encodeURIComponent(id)}/chat?${params}`)
        },
        enviar: (id: string, body: unknown) => post<unknown>(`/api/interaccion/grupos/${encodeURIComponent(id)}/chat`, body),
      },
    },
  },
  notificaciones: {
    list: (limite?: number, offset?: number, leida?: boolean) => {
      const params = new URLSearchParams()
      if (limite) params.append('limite', limite.toString())
      if (offset) params.append('offset', offset.toString())
      if (leida !== undefined) params.append('leida', leida.toString())
      return get<unknown[]>(`/api/notificaciones?${params}`)
    },
    noLeidas: () => get<{ count: number }>(`/api/notificaciones/no-leidas`),
    marcarLeida: (notificacionId: string) => post<unknown>(`/api/notificaciones/marcar-leida`, { notificacionId }),
    marcarTodasLeidas: () => post<unknown>(`/api/notificaciones/marcar-todas-leidas`, {}),
    preferencias: {
      get: () => get<unknown>(`/api/notificaciones/preferencias`),
      update: (body: unknown) => post<unknown>(`/api/notificaciones/preferencias`, body),
    },
    push: {
      registrarToken: (token: string, preferencias?: unknown) => post<unknown>(`/api/notificaciones/push/token`, { token, preferencias }),
    },
  },
}
