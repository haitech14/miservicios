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

/** POST /api/organizaciones/buscar - Buscar comunidades por nombre/slug */
organizacionesRouter.post('/buscar', async (req, res) => {
  try {
    const { query, verticalSlug } = req.body as {
      query?: string
      verticalSlug?: string
    }

    const where: any = {}
    
    if (query) {
      where.OR = [
        { nombre: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (verticalSlug) {
      where.verticalSlug = verticalSlug
    }

    const orgs = await prisma.organization.findMany({
      where,
      include: { config: true },
      take: 20,
      orderBy: { nombre: 'asc' },
    })

    res.json(orgs)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** GET /api/organizaciones/publicas - Listar comunidades públicas para unirse */
organizacionesRouter.get('/publicas', async (req, res) => {
  try {
    const orgs = await prisma.organization.findMany({
      where: {
        // Por ahora todas son públicas, se puede agregar campo 'publica' en el futuro
      },
      select: {
        id: true,
        slug: true,
        nombre: true,
        logoUrl: true,
        descripcion: true,
        verticalSlug: true,
        dominioEmail: true,
      },
      take: 50,
      orderBy: { nombre: 'asc' },
    })

    res.json(orgs)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/organizaciones/:slug/usuarios - Agregar usuario a organización */
organizacionesRouter.post('/:slug/usuarios', async (req, res) => {
  try {
    const { userId } = req.body as { userId: string }

    if (!userId) {
      return res.status(400).json({ error: 'userId es requerido' })
    }

    const org = await prisma.organization.findUnique({
      where: { slug: req.params.slug },
    })

    if (!org) {
      return res.status(404).json({ error: 'Organización no encontrada' })
    }

    // Verificar si el usuario ya está en la organización
    const usuarioExistente = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: org.id,
      },
    })

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El usuario ya pertenece a esta organización' })
    }

    // Actualizar organización del usuario
    const usuario = await prisma.user.update({
      where: { id: userId },
      data: { organizationId: org.id },
      include: {
        organization: {
          include: { config: true },
        },
      },
    })

    res.json(usuario)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** PATCH /api/organizaciones/:slug/modulos - Actualizar módulos adicionales */
organizacionesRouter.patch('/:slug/modulos', async (req, res) => {
  try {
    const { modulosAdicionales } = req.body as { modulosAdicionales: string[] }

    if (!Array.isArray(modulosAdicionales)) {
      return res.status(400).json({ error: 'modulosAdicionales debe ser un array' })
    }

    const org = await prisma.organization.findUnique({
      where: { slug: req.params.slug },
      include: {
        config: true,
        vertical: {
          include: { modulos: true },
        },
      },
    })

    if (!org) {
      return res.status(404).json({ error: 'Organización no encontrada' })
    }

    // Validar que los módulos adicionales pertenezcan a la vertical
    const modulosValidos = org.vertical.modulos
      .filter((m) => !m.esBase)
      .map((m) => m.clave)

    const modulosFiltrados = modulosAdicionales.filter((c) => modulosValidos.includes(c))

    // Actualizar configuración
    const config = await prisma.orgConfig.update({
      where: { organizationId: org.id },
      data: {
        modulosAdicionales: JSON.stringify(modulosFiltrados),
      },
    })

    res.json({
      ...org,
      config,
      modulosActivos: [
        ...(JSON.parse(config.modulosBase) as string[]),
        ...modulosFiltrados,
      ],
    })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})
