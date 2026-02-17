import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const notificacionesRouter = Router()

/**
 * GET /api/notificaciones - Listar notificaciones del usuario
 */
notificacionesRouter.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const { limite = '50', offset = '0', leida } = req.query

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const where: any = { userId }
    if (leida !== undefined) {
      where.leida = leida === 'true'
    }

    const notificaciones = await prisma.notificacion.findMany({
      where,
      orderBy: { fecha: 'desc' },
      take: parseInt(limite as string),
      skip: parseInt(offset as string),
    })

    res.json(notificaciones)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /api/notificaciones/no-leidas - Contador de no leídas
 */
notificacionesRouter.get('/no-leidas', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const count = await prisma.notificacion.count({
      where: {
        userId,
        leida: false,
      },
    })

    res.json({ count })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/notificaciones/marcar-leida - Marcar como leída
 */
notificacionesRouter.post('/marcar-leida', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const { notificacionId } = req.body

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    if (!notificacionId) {
      return res.status(400).json({ error: 'notificacionId es requerido' })
    }

    const notificacion = await prisma.notificacion.update({
      where: { id: notificacionId },
      data: { leida: true },
    })

    res.json(notificacion)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/notificaciones/marcar-todas-leidas - Marcar todas como leídas
 */
notificacionesRouter.post('/marcar-todas-leidas', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    await prisma.notificacion.updateMany({
      where: {
        userId,
        leida: false,
      },
      data: {
        leida: true,
      },
    })

    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /api/notificaciones/preferencias - Obtener preferencias
 */
notificacionesRouter.get('/preferencias', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    let preferencias = await prisma.preferenciasNotificacion.findUnique({
      where: { userId },
    })

    if (!preferencias) {
      // Crear preferencias por defecto
      preferencias = await prisma.preferenciasNotificacion.create({
        data: {
          userId,
          emailActivo: true,
          pushActivo: true,
          tiposNotificacion: JSON.stringify({
            evento: true,
            mensaje: true,
            logro: true,
            sistema: true,
          }),
        },
      })
    }

    res.json({
      ...preferencias,
      tiposNotificacion: JSON.parse(preferencias.tiposNotificacion),
    })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/notificaciones/preferencias - Actualizar preferencias
 */
notificacionesRouter.post('/preferencias', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const { emailActivo, pushActivo, tiposNotificacion } = req.body

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const preferencias = await prisma.preferenciasNotificacion.upsert({
      where: { userId },
      create: {
        userId,
        emailActivo: emailActivo !== false,
        pushActivo: pushActivo !== false,
        tiposNotificacion: JSON.stringify(tiposNotificacion || {}),
      },
      update: {
        emailActivo: emailActivo !== undefined ? emailActivo : undefined,
        pushActivo: pushActivo !== undefined ? pushActivo : undefined,
        tiposNotificacion: tiposNotificacion ? JSON.stringify(tiposNotificacion) : undefined,
      },
    })

    res.json({
      ...preferencias,
      tiposNotificacion: JSON.parse(preferencias.tiposNotificacion),
    })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/notificaciones/push/token - Registrar token push
 */
notificacionesRouter.post('/push/token', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const { token, preferencias } = req.body

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    if (!token) {
      return res.status(400).json({ error: 'token es requerido' })
    }

    const pushConfig = await prisma.notificacionPush.upsert({
      where: { userId },
      create: {
        userId,
        token,
        activo: true,
        preferencias: preferencias ? JSON.stringify(preferencias) : null,
      },
      update: {
        token,
        activo: true,
        preferencias: preferencias ? JSON.stringify(preferencias) : null,
      },
    })

    res.json(pushConfig)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})
