import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const organizacionesRouter = Router()

/** GET /api/organizaciones - Listar organizaciones */
organizacionesRouter.get('/', async (_req, res) => {
  try {
    const orgs = await prisma.organization.findMany({
      include: { config: true },
      orderBy: { nombre: 'asc' },
    })
    res.json(orgs)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/organizaciones - Crear organización con config (paso 1: datos básicos + vertical + adicionales) */
organizacionesRouter.post('/', async (req, res) => {
  try {
    const {
      slug,
      nombre,
      logoUrl,
      primaryColor,
      secondaryColor,
      dominioEmail,
      verticalSlug,
      productSlug,
      modulosAdicionales,
    } = req.body as {
      slug: string
      nombre: string
      logoUrl?: string
      primaryColor?: string
      secondaryColor?: string
      dominioEmail?: string
      verticalSlug: string
      productSlug?: string
      modulosAdicionales: string[]
    }

    if (!slug || !nombre || !verticalSlug) {
      return res.status(400).json({ error: 'Faltan slug, nombre o verticalSlug' })
    }

    const vertical = await prisma.vertical.findUnique({
      where: { slug: verticalSlug },
      include: { modulos: true },
    })
    if (!vertical) {
      return res.status(400).json({ error: 'Vertical no válida' })
    }

    const baseClaves = vertical.modulos.filter((m) => m.esBase).map((m) => m.clave)
    const adicionales = Array.isArray(modulosAdicionales)
      ? modulosAdicionales.filter((c) => vertical.modulos.some((m) => !m.esBase && m.clave === c))
      : []

    const org = await prisma.organization.create({
      data: {
        slug,
        nombre,
        logoUrl: logoUrl ?? null,
        primaryColor: primaryColor ?? '#1a365d',
        secondaryColor: secondaryColor ?? null,
        dominioEmail: dominioEmail ?? null,
        terminologia: vertical.perfil,
        verticalSlug,
        productSlug: productSlug ?? null,
        config: {
          create: {
            modulosBase: JSON.stringify(baseClaves),
            modulosAdicionales: JSON.stringify(adicionales),
          },
        },
      },
      include: { config: true },
    })

    res.status(201).json(org)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** GET /api/organizaciones/:slug - Obtener una organización con su config */
organizacionesRouter.get('/:slug', async (req, res) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { slug: req.params.slug },
      include: { config: true },
    })
    if (!org) return res.status(404).json({ error: 'Organización no encontrada' })
    const config = org.config
    const modulosActivos = [
      ...(config ? (JSON.parse(config.modulosBase) as string[]) : []),
      ...(config ? (JSON.parse(config.modulosAdicionales) as string[]) : []),
    ]
    res.json({ ...org, modulosActivos })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})
