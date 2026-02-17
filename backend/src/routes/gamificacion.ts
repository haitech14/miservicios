import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import {
  agregarPuntos,
  obtenerRankingGeneral,
  obtenerRankingServicio,
  actualizarRankingServicio,
} from '../lib/gamificacion.js'

const prisma = new PrismaClient()
export const gamificacionRouter = Router()

/**
 * GET /api/gamificacion/ranking - Ranking general (top usuarios)
 */
gamificacionRouter.get('/ranking', async (req, res) => {
  try {
    const { limite = '100', periodo } = req.query

    let ranking = await obtenerRankingGeneral(parseInt(limite as string))

    // Filtrar por período si se especifica
    if (periodo) {
      const ahora = new Date()
      let fechaDesde = new Date()

      switch (periodo) {
        case 'semanal':
          fechaDesde = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'mensual':
          fechaDesde = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'anual':
          fechaDesde = new Date(ahora.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
      }

      // Filtrar por última actualización
      ranking = ranking.filter((r) => r.ultimaActualizacion >= fechaDesde)
    }

    res.json(ranking)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /api/gamificacion/ranking/:servicioId - Ranking por servicio
 */
gamificacionRouter.get('/ranking/:servicioId', async (req, res) => {
  try {
    const { limite = '100' } = req.query
    const { servicioId } = req.params

    const ranking = await obtenerRankingServicio(servicioId, parseInt(limite as string))

    res.json(ranking)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /api/gamificacion/mi-perfil - Puntuación y logros del usuario actual
 */
gamificacionRouter.get('/mi-perfil', async (req, res) => {
  try {
    // TODO: Obtener userId del token/sesión
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const userScore = await prisma.userScore.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            nombres: true,
            apellidos: true,
            fotoUrl: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
          orderBy: { fechaDesbloqueo: 'desc' },
        },
      },
    })

    if (!userScore) {
      return res.json({
        puntosTotales: 0,
        nivel: 1,
        rankingGeneral: null,
        logros: [],
      })
    }

    const serviceScores = await prisma.serviceScore.findMany({
      where: { userId },
      orderBy: { puntos: 'desc' },
    })

    res.json({
      ...userScore,
      serviceScores,
    })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/gamificacion/puntos - Agregar puntos (usado internamente por servicios)
 */
gamificacionRouter.post('/puntos', async (req, res) => {
  try {
    const { userId, puntos, razon, servicioId, servicioNombre } = req.body

    if (!userId || !puntos || !razon) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const resultado = await agregarPuntos(userId, puntos, razon, servicioId, servicioNombre)

    if (servicioId) {
      await actualizarRankingServicio(servicioId)
    }

    res.json(resultado)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /api/gamificacion/logros - Listar logros disponibles
 */
gamificacionRouter.get('/logros', async (req, res) => {
  try {
    const logros = await prisma.achievement.findMany({
      where: { activo: true },
      orderBy: { puntosRecompensa: 'desc' },
    })

    res.json(logros)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /api/gamificacion/mis-logros - Logros desbloqueados del usuario
 */
gamificacionRouter.get('/mis-logros', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const logros = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { fechaDesbloqueo: 'desc' },
    })

    res.json(logros)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * POST /api/gamificacion/premio-diario - Reclamar premio diario
 */
gamificacionRouter.post('/premio-diario', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const { dailyRewardId } = req.body

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    if (!dailyRewardId) {
      return res.status(400).json({ error: 'dailyRewardId es requerido' })
    }

    // Verificar si ya reclamó hoy
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    const yaReclamado = await prisma.userDailyReward.findFirst({
      where: {
        userId,
        dailyRewardId,
        fechaReclamacion: {
          gte: hoy,
          lt: manana,
        },
      },
    })

    if (yaReclamado) {
      return res.status(400).json({ error: 'Ya reclamaste el premio hoy' })
    }

    // Obtener configuración del premio
    const dailyReward = await prisma.dailyReward.findUnique({
      where: { id: dailyRewardId },
    })

    if (!dailyReward || !dailyReward.activo) {
      return res.status(404).json({ error: 'Premio no disponible' })
    }

    // Generar premio aleatorio según tipo
    const config = JSON.parse(dailyReward.configuracion)
    let premio: any

    if (dailyReward.tipo === 'ruleta') {
      // Seleccionar premio aleatorio de la ruleta
      const premios = config.premios || []
      const indiceAleatorio = Math.floor(Math.random() * premios.length)
      premio = premios[indiceAleatorio]
    } else if (dailyReward.tipo === 'sorteo') {
      // Sorteo aleatorio
      const premios = config.premios || []
      const indiceAleatorio = Math.floor(Math.random() * premios.length)
      premio = premios[indiceAleatorio]
    }

    // Guardar premio reclamado
    const userReward = await prisma.userDailyReward.create({
      data: {
        userId,
        dailyRewardId,
        premio: JSON.stringify(premio),
      },
    })

    // Si el premio incluye puntos, agregarlos
    if (premio?.puntos) {
      await agregarPuntos(userId, premio.puntos, 'Premio diario')
    }

    res.json({
      premio,
      userReward,
    })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/**
 * GET /api/gamificacion/premio-diario/estado - Verificar si ya reclamó hoy
 */
gamificacionRouter.get('/premio-diario/estado', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const { dailyRewardId } = req.query

    if (!userId) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    if (!dailyRewardId) {
      return res.status(400).json({ error: 'dailyRewardId es requerido' })
    }

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    const yaReclamado = await prisma.userDailyReward.findFirst({
      where: {
        userId,
        dailyRewardId: dailyRewardId as string,
        fechaReclamacion: {
          gte: hoy,
          lt: manana,
        },
      },
      include: {
        dailyReward: true,
      },
    })

    res.json({
      puedeReclamar: !yaReclamado,
      yaReclamado: yaReclamado ? JSON.parse(yaReclamado.premio) : null,
    })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})
