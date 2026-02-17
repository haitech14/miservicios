import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Calcula el nivel basado en puntos totales
 * Fórmula: nivel = floor(sqrt(puntos / 100)) + 1
 */
export function calcularNivel(puntos: number): number {
  return Math.floor(Math.sqrt(puntos / 100)) + 1
}

/**
 * Agrega puntos a un usuario y actualiza su score
 */
export async function agregarPuntos(
  userId: string,
  puntos: number,
  razon: string,
  servicioId?: string,
  servicioNombre?: string
) {
  // Obtener o crear UserScore
  let userScore = await prisma.userScore.findUnique({
    where: { userId },
  })

  if (!userScore) {
    userScore = await prisma.userScore.create({
      data: {
        userId,
        puntosTotales: 0,
        nivel: 1,
      },
    })
  }

  // Actualizar puntos totales
  const nuevosPuntos = userScore.puntosTotales + puntos
  const nuevoNivel = calcularNivel(nuevosPuntos)

  await prisma.userScore.update({
    where: { userId },
    data: {
      puntosTotales: nuevosPuntos,
      nivel: nuevoNivel,
      ultimaActualizacion: new Date(),
    },
  })

  // Si hay servicio, actualizar ServiceScore
  if (servicioId && servicioNombre) {
    const serviceScore = await prisma.serviceScore.findUnique({
      where: {
        userId_servicioId: {
          userId,
          servicioId,
        },
      },
    })

    if (serviceScore) {
      await prisma.serviceScore.update({
        where: {
          userId_servicioId: {
            userId,
            servicioId,
          },
        },
        data: {
          puntos: serviceScore.puntos + puntos,
          ultimaActividad: new Date(),
        },
      })
    } else {
      await prisma.serviceScore.create({
        data: {
          userId,
          servicioId,
          servicioNombre,
          puntos,
        },
      })
    }
  }

  // Verificar logros
  await verificarLogros(userId)

  // Actualizar ranking
  await actualizarRanking(userId)

  return { puntos: nuevosPuntos, nivel: nuevoNivel }
}

/**
 * Verifica si el usuario desbloqueó nuevos logros
 */
export async function verificarLogros(userId: string) {
  const userScore = await prisma.userScore.findUnique({
    where: { userId },
  })

  if (!userScore) return

  // Obtener logros disponibles
  const logros = await prisma.achievement.findMany({
    where: { activo: true },
  })

  // Obtener logros ya desbloqueados
  const logrosDesbloqueados = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  })

  const idsDesbloqueados = new Set(logrosDesbloqueados.map((l) => l.achievementId))

  // Verificar logros basados en puntos
  for (const logro of logros) {
    if (idsDesbloqueados.has(logro.id)) continue

    // Logros predefinidos (se pueden expandir)
    let desbloqueado = false

    if (logro.clave === 'primer_paso' && userScore.puntosTotales >= 10) {
      desbloqueado = true
    } else if (logro.clave === 'principiante' && userScore.puntosTotales >= 100) {
      desbloqueado = true
    } else if (logro.clave === 'experto' && userScore.puntosTotales >= 1000) {
      desbloqueado = true
    } else if (logro.clave === 'maestro' && userScore.puntosTotales >= 5000) {
      desbloqueado = true
    } else if (logro.clave === 'nivel_5' && userScore.nivel >= 5) {
      desbloqueado = true
    } else if (logro.clave === 'nivel_10' && userScore.nivel >= 10) {
      desbloqueado = true
    }

    if (desbloqueado) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: logro.id,
        },
      })

      // Agregar puntos del logro si tiene
      if (logro.puntosRecompensa > 0) {
        await agregarPuntos(userId, logro.puntosRecompensa, `Logro: ${logro.nombre}`)
      }
    }
  }
}

/**
 * Actualiza la posición en el ranking general
 */
export async function actualizarRanking(userId: string) {
  // Obtener todos los usuarios ordenados por puntos
  const usuarios = await prisma.userScore.findMany({
    orderBy: { puntosTotales: 'desc' },
    select: { userId: true, puntosTotales: true },
  })

  // Actualizar ranking de cada usuario
  for (let i = 0; i < usuarios.length; i++) {
    await prisma.userScore.update({
      where: { userId: usuarios[i].userId },
      data: { rankingGeneral: i + 1 },
    })
  }
}

/**
 * Actualiza el ranking de un servicio específico
 */
export async function actualizarRankingServicio(servicioId: string) {
  const serviceScores = await prisma.serviceScore.findMany({
    where: { servicioId },
    orderBy: { puntos: 'desc' },
    select: { id: true, puntos: true },
  })

  for (let i = 0; i < serviceScores.length; i++) {
    await prisma.serviceScore.update({
      where: { id: serviceScores[i].id },
      data: { rankingEnServicio: i + 1 },
    })
  }
}

/**
 * Obtiene el ranking general
 */
export async function obtenerRankingGeneral(limite: number = 100) {
  return await prisma.userScore.findMany({
    include: {
      user: {
        select: {
          id: true,
          nombres: true,
          apellidos: true,
          fotoUrl: true,
        },
      },
      achievements: {
        include: {
          achievement: true,
        },
        take: 3,
      },
    },
    orderBy: { puntosTotales: 'desc' },
    take: limite,
  })
}

/**
 * Obtiene el ranking por servicio
 */
export async function obtenerRankingServicio(servicioId: string, limite: number = 100) {
  return await prisma.serviceScore.findMany({
    where: { servicioId },
    include: {
      user: {
        select: {
          id: true,
          nombres: true,
          apellidos: true,
          fotoUrl: true,
        },
      },
    },
    orderBy: { puntos: 'desc' },
    take: limite,
  })
}
