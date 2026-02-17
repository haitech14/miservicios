import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import multer from 'multer'
import { subirFotoPerfil, subirFotoPortada, subirLogoOrganizacion, subirPortadaOrganizacion, validarImagen } from '../lib/storage.js'

const prisma = new PrismaClient()
export const configuracionRouter = Router()

// Configurar multer para manejar archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

/**
 * POST /api/configuracion/foto-perfil - Subir foto de perfil
 */
configuracionRouter.post('/foto-perfil', upload.single('foto'), async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    // Validar imagen
    const validacion = validarImagen(req.file)
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.error })
    }

    // Subir a Supabase Storage
    const fotoUrl = await subirFotoPerfil(userId, req.file.buffer)

    // Actualizar usuario
    const usuario = await prisma.user.update({
      where: { id: userId },
      data: { fotoUrl },
    })

    res.json({ fotoUrl, usuario })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/configuracion/foto-portada - Subir foto de portada
 */
configuracionRouter.post('/foto-portada', upload.single('portada'), async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    // Validar imagen
    const validacion = validarImagen(req.file)
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.error })
    }

    // Subir a Supabase Storage
    const portadaUrl = await subirFotoPortada(userId, req.file.buffer)

    // Actualizar usuario
    const usuario = await prisma.user.update({
      where: { id: userId },
      data: { portadaUrl },
    })

    res.json({ portadaUrl, usuario })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/configuracion/organizacion/logo - Subir logo de organización
 */
configuracionRouter.post('/organizacion/logo', upload.single('logo'), async (req, res) => {
  try {
    const { organizationId } = req.body

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId es requerido' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    // Validar imagen
    const validacion = validarImagen(req.file)
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.error })
    }

    // Subir a Supabase Storage
    const logoUrl = await subirLogoOrganizacion(organizationId, req.file.buffer)

    // Actualizar organización
    const org = await prisma.organization.update({
      where: { id: organizationId },
      data: { logoUrl },
    })

    res.json({ logoUrl, organizacion: org })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/configuracion/organizacion/portada - Subir portada de organización
 */
configuracionRouter.post('/organizacion/portada', upload.single('portada'), async (req, res) => {
  try {
    const { organizationId } = req.body

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId es requerido' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    // Validar imagen
    const validacion = validarImagen(req.file)
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.error })
    }

    // Subir a Supabase Storage
    const portadaUrl = await subirPortadaOrganizacion(organizationId, req.file.buffer)

    // Actualizar organización
    const org = await prisma.organization.update({
      where: { id: organizationId },
      data: { portadaUrl },
    })

    res.json({ portadaUrl, organizacion: org })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * PATCH /api/configuracion/perfil - Actualizar perfil
 */
configuracionRouter.patch('/perfil', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const { nombres, apellidos, celular, fijo, facultadOuArea, carreraOuCargo } = req.body

    const usuario = await prisma.user.update({
      where: { id: userId },
      data: {
        nombres: nombres || undefined,
        apellidos: apellidos || undefined,
        celular: celular || undefined,
        fijo: fijo || undefined,
        facultadOuArea: facultadOuArea || undefined,
        carreraOuCargo: carreraOuCargo || undefined,
      },
    })

    res.json(usuario)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /api/configuracion/gamificacion - Obtener configuración de gamificación
 */
configuracionRouter.get('/gamificacion', async (req, res) => {
  try {
    const { organizationId } = req.query

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId es requerido' })
    }

    const dailyReward = await prisma.dailyReward.findFirst({
      where: {
        organizationId: organizationId as string,
      },
    })

    if (!dailyReward) {
      return res.json({
        premiosDiariosActivos: false,
        tipoPremio: 'ruleta',
        premios: [],
      })
    }

    const config = JSON.parse(dailyReward.configuracion)

    res.json({
      premiosDiariosActivos: dailyReward.activo,
      tipoPremio: dailyReward.tipo,
      premios: config.premios || [],
    })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * PATCH /api/configuracion/gamificacion - Actualizar configuración de gamificación
 */
configuracionRouter.patch('/gamificacion', async (req, res) => {
  try {
    const { organizationId, premiosDiariosActivos, tipoPremio, premios } = req.body

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId es requerido' })
    }

    // Buscar o crear DailyReward
    let dailyReward = await prisma.dailyReward.findFirst({
      where: { organizationId },
    })

    if (dailyReward) {
      dailyReward = await prisma.dailyReward.update({
        where: { id: dailyReward.id },
        data: {
          activo: premiosDiariosActivos !== false,
          tipo: tipoPremio || 'ruleta',
          configuracion: JSON.stringify({ premios: premios || [] }),
        },
      })
    } else {
      dailyReward = await prisma.dailyReward.create({
        data: {
          organizationId,
          activo: premiosDiariosActivos !== false,
          tipo: tipoPremio || 'ruleta',
          configuracion: JSON.stringify({ premios: premios || [] }),
        },
      })
    }

    res.json(dailyReward)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})
