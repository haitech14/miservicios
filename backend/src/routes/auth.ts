import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { aplicarPersonalizacionPorDominio } from '../lib/organizationMatcher.js'

const prisma = new PrismaClient()
export const authRouter = Router()

/**
 * POST /api/auth/register - Registro de usuario
 * Soporta registro con creación/unión de comunidad
 */
authRouter.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      nombres,
      apellidos,
      dni,
      organizationId, // Opcional: si se une a una existente
      createOrganization, // Opcional: datos para crear nueva organización
    } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.user.findFirst({
      where: { email },
    })

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    let finalOrganizationId = organizationId

    // Si se crea una nueva organización
    if (createOrganization) {
      const { nombre, slug, verticalSlug, modulosAdicionales } = createOrganization

      if (!nombre || !slug || !verticalSlug) {
        return res.status(400).json({ error: 'Faltan datos para crear la organización' })
      }

      // Buscar vertical
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

      // Extraer dominio del email para la organización
      const dominio = email.match(/@(.+)$/)?.[1] || null

      // Crear organización
      const nuevaOrg = await prisma.organization.create({
        data: {
          slug,
          nombre,
          dominioEmail: dominio,
          verticalSlug,
          terminologia: vertical.perfil,
          config: {
            create: {
              modulosBase: JSON.stringify(baseClaves),
              modulosAdicionales: JSON.stringify(adicionales),
            },
          },
        },
      })

      finalOrganizationId = nuevaOrg.id
    } else if (!finalOrganizationId) {
      // Si no se proporciona organización, buscar por dominio
      const orgPorDominio = await aplicarPersonalizacionPorDominio(email)
      if (orgPorDominio) {
        finalOrganizationId = orgPorDominio.id
      } else {
        return res.status(400).json({ error: 'Debe proporcionar una organización o crear una nueva' })
      }
    }

    // Crear usuario
    const usuario = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nombres: nombres || null,
        apellidos: apellidos || null,
        dni: dni || null,
        organizationId: finalOrganizationId,
        rol: 'beneficiario',
      },
      include: {
        organization: {
          include: {
            config: true,
          },
        },
      },
    })

    // Obtener datos de branding de la organización
    const branding = await aplicarPersonalizacionPorDominio(email)

    // Crear UserScore inicial
    await prisma.userScore.create({
      data: {
        userId: usuario.id,
        puntosTotales: 0,
        nivel: 1,
      },
    })

    // Retornar datos sin passwordHash
    const { passwordHash: _, ...usuarioSinPassword } = usuario

    res.status(201).json({
      user: usuarioSinPassword,
      organization: branding || {
        id: usuario.organization.id,
        nombre: usuario.organization.nombre,
        slug: usuario.organization.slug,
        logoUrl: usuario.organization.logoUrl,
        portadaUrl: usuario.organization.portadaUrl,
        primaryColor: usuario.organization.primaryColor,
        secondaryColor: usuario.organization.secondaryColor,
        verticalSlug: usuario.organization.verticalSlug,
        terminologia: usuario.organization.terminologia,
      },
    })
  } catch (e) {
    console.error('Error en registro:', e)
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/auth/login - Inicio de sesión
 * Aplica personalización automática basada en dominio
 */
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    // Buscar usuario
    const usuario = await prisma.user.findFirst({
      where: { email },
      include: {
        organization: {
          include: {
            config: true,
          },
        },
        userScore: true,
      },
    })

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    if (!usuario.passwordHash) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const passwordValido = await bcrypt.compare(password, usuario.passwordHash)
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Aplicar personalización automática basada en dominio
    const branding = await aplicarPersonalizacionPorDominio(email)

    // Si se encontró una organización diferente por dominio, actualizar
    if (branding && branding.id !== usuario.organizationId) {
      // Opcional: actualizar organización del usuario si es necesario
      // Por ahora solo retornamos la organización detectada
    }

    // Retornar datos sin passwordHash
    const { passwordHash: _, ...usuarioSinPassword } = usuario

    res.json({
      user: usuarioSinPassword,
      organization: branding || {
        id: usuario.organization.id,
        nombre: usuario.organization.nombre,
        slug: usuario.organization.slug,
        logoUrl: usuario.organization.logoUrl,
        portadaUrl: usuario.organization.portadaUrl,
        primaryColor: usuario.organization.primaryColor,
        secondaryColor: usuario.organization.secondaryColor,
        verticalSlug: usuario.organization.verticalSlug,
        terminologia: usuario.organization.terminologia,
        config: usuario.organization.config,
      },
    })
  } catch (e) {
    console.error('Error en login:', e)
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /api/auth/me - Obtener usuario actual (requiere autenticación)
 */
authRouter.get('/me', async (req, res) => {
  try {
    // TODO: Implementar autenticación con JWT o sesión
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: {
          include: {
            config: true,
          },
        },
        userScore: true,
      },
    })

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const branding = await aplicarPersonalizacionPorDominio(usuario.email)

    const { passwordHash: _, ...usuarioSinPassword } = usuario

    res.json({
      user: usuarioSinPassword,
      organization: branding || {
        id: usuario.organization.id,
        nombre: usuario.organization.nombre,
        slug: usuario.organization.slug,
        logoUrl: usuario.organization.logoUrl,
        portadaUrl: usuario.organization.portadaUrl,
        primaryColor: usuario.organization.primaryColor,
        secondaryColor: usuario.organization.secondaryColor,
        verticalSlug: usuario.organization.verticalSlug,
        terminologia: usuario.organization.terminologia,
        config: usuario.organization.config,
      },
    })
  } catch (e) {
    console.error('Error en /me:', e)
    res.status(500).json({ error: String(e) })
  }
})
