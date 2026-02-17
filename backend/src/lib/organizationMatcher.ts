import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Extrae el dominio de un email
 * @param email Email del usuario (ej: "usuario@unmsm.edu.pe")
 * @returns Dominio extraído (ej: "unmsm.edu.pe")
 */
export function extraerDominio(email: string): string | null {
  const match = email.match(/@(.+)$/)
  return match ? match[1] : null
}

/**
 * Busca una organización por dominio de email
 * @param dominio Dominio a buscar (ej: "unmsm.edu.pe")
 * @returns Organización encontrada o null
 */
export async function buscarOrganizacionPorDominio(dominio: string) {
  if (!dominio) return null

  const organizacion = await prisma.organization.findFirst({
    where: {
      dominioEmail: dominio,
    },
    include: {
      config: true,
    },
  })

  return organizacion
}

/**
 * Obtiene el branding completo de una organización
 * @param orgId ID de la organización
 * @returns Objeto con datos de branding
 */
export async function obtenerBrandingOrganizacion(orgId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: { config: true },
  })

  if (!org) return null

  return {
    id: org.id,
    slug: org.slug,
    nombre: org.nombre,
    logoUrl: org.logoUrl,
    portadaUrl: org.portadaUrl,
    primaryColor: org.primaryColor,
    secondaryColor: org.secondaryColor,
    verticalSlug: org.verticalSlug,
    terminologia: org.terminologia,
    config: org.config,
  }
}

/**
 * Busca y aplica personalización automática basada en dominio de email
 * @param email Email del usuario
 * @returns Datos de organización si se encuentra, null si no
 */
export async function aplicarPersonalizacionPorDominio(email: string) {
  const dominio = extraerDominio(email)
  if (!dominio) return null

  const organizacion = await buscarOrganizacionPorDominio(dominio)
  if (!organizacion) return null

  return await obtenerBrandingOrganizacion(organizacion.id)
}
