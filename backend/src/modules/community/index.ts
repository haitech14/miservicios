/**
 * HaiCommunity - Módulos para ONG, asociaciones, cooperativas.
 * Servicios: socios, cuotas, eventos, voluntarios, donaciones, etc.
 */
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { agregarPuntos } from '../../lib/gamificacion.js'

const prisma = new PrismaClient()
const router = Router()

// ============================================
// SOCIOS
// ============================================

/** GET /api/community/socios - Listar socios */
router.get('/socios', async (req, res) => {
  try {
    const { organizationId } = req.query

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId es requerido' })
    }

    const socios = await prisma.socio.findMany({
      where: { organizationId: organizationId as string },
      include: {
        cuotas: {
          take: 5,
          orderBy: { fechaVencimiento: 'desc' },
        },
      },
      orderBy: { fechaIngreso: 'desc' },
    })

    res.json(socios)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/community/socios - Crear/registrar socio */
router.post('/socios', async (req, res) => {
  try {
    const {
      organizationId,
      nombres,
      apellidos,
      email,
      telefono,
      codigoSocio,
      userId,
    } = req.body

    if (!organizationId || !nombres || !apellidos) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const socio = await prisma.socio.create({
      data: {
        organizationId,
        nombres,
        apellidos,
        email: email || null,
        telefono: telefono || null,
        codigoSocio: codigoSocio || null,
        userId: userId || null,
        estado: 'activo',
      },
    })

    res.status(201).json(socio)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// CUOTAS
// ============================================

/** GET /api/community/cuotas - Listar cuotas */
router.get('/cuotas', async (req, res) => {
  try {
    const { organizationId, socioId, estado } = req.query

    const where: any = {}
    if (organizationId) where.organizationId = organizationId as string
    if (socioId) where.socioId = socioId as string
    if (estado) where.estado = estado as string

    const cuotas = await prisma.cuota.findMany({
      where,
      include: {
        socio: {
          select: {
            nombres: true,
            apellidos: true,
            codigoSocio: true,
          },
        },
      },
      orderBy: { fechaVencimiento: 'asc' },
    })

    res.json(cuotas)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/community/cuotas - Crear cuota */
router.post('/cuotas', async (req, res) => {
  try {
    const {
      organizationId,
      socioId,
      monto,
      concepto,
      fechaVencimiento,
    } = req.body

    if (!organizationId || !socioId || !monto || !concepto || !fechaVencimiento) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const cuota = await prisma.cuota.create({
      data: {
        organizationId,
        socioId,
        monto: parseFloat(monto),
        concepto,
        fechaVencimiento: new Date(fechaVencimiento),
        estado: 'pendiente',
      },
      include: {
        socio: true,
      },
    })

    res.status(201).json(cuota)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** PATCH /api/community/cuotas/:id/pagar - Marcar cuota como pagada */
router.patch('/cuotas/:id/pagar', async (req, res) => {
  try {
    const { metodoPago } = req.body

    const cuota = await prisma.cuota.update({
      where: { id: req.params.id },
      data: {
        estado: 'pagada',
        fechaPago: new Date(),
        metodoPago: metodoPago || null,
      },
      include: {
        socio: true,
      },
    })

    // Agregar puntos por pagar cuota
    if (cuota.socio.userId) {
      await agregarPuntos(cuota.socio.userId, 20, 'Pagar cuota', 'cuotas', 'Cuotas').catch(console.error)
    }

    res.json(cuota)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// EVENTOS
// ============================================

/** GET /api/community/eventos - Listar eventos */
router.get('/eventos', async (req, res) => {
  try {
    const { organizationId, estado, fechaDesde, fechaHasta } = req.query

    const where: any = {}
    if (organizationId) where.organizationId = organizationId as string
    if (estado) where.estado = estado as string

    if (fechaDesde || fechaHasta) {
      where.fechaInicio = {}
      if (fechaDesde) where.fechaInicio.gte = new Date(fechaDesde as string)
      if (fechaHasta) where.fechaInicio.lte = new Date(fechaHasta as string)
    }

    const eventos = await prisma.evento.findMany({
      where,
      orderBy: { fechaInicio: 'asc' },
    })

    res.json(eventos)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/community/eventos - Crear evento */
router.post('/eventos', async (req, res) => {
  try {
    const {
      organizationId,
      titulo,
      descripcion,
      fechaInicio,
      fechaFin,
      ubicacion,
      tipo,
      capacidadMaxima,
    } = req.body

    if (!organizationId || !titulo || !fechaInicio) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const evento = await prisma.evento.create({
      data: {
        organizationId,
        titulo,
        descripcion: descripcion || null,
        fechaInicio: new Date(fechaInicio),
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        ubicacion: ubicacion || null,
        tipo: tipo || 'social',
        capacidadMaxima: capacidadMaxima ? parseInt(capacidadMaxima) : null,
        estado: 'programado',
        inscripcionesAbiertas: true,
      },
    })

    // Agregar puntos por crear evento (si hay userId en el body)
    const { userId } = req.body
    if (userId) {
      await agregarPuntos(userId, 15, 'Crear evento', 'eventos', 'Eventos').catch(console.error)
    }

    res.status(201).json(evento)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// COMUNICACIONES
// ============================================

/** GET /api/community/comunicaciones - Listar comunicaciones */
router.get('/comunicaciones', async (req, res) => {
  try {
    const { organizationId, estado } = req.query

    const where: any = {}
    if (organizationId) where.organizationId = organizationId as string
    if (estado) where.estado = estado as string

    const comunicaciones = await prisma.comunicacion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json(comunicaciones)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/community/comunicaciones - Enviar comunicación masiva */
router.post('/comunicaciones', async (req, res) => {
  try {
    const {
      organizationId,
      titulo,
      contenido,
      tipo,
      destinatarios,
      fechaEnvio,
    } = req.body

    if (!organizationId || !titulo || !contenido || !tipo) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const comunicacion = await prisma.comunicacion.create({
      data: {
        organizationId,
        titulo,
        contenido,
        tipo,
        destinatarios: Array.isArray(destinatarios)
          ? JSON.stringify(destinatarios)
          : destinatarios || 'todos',
        fechaEnvio: fechaEnvio ? new Date(fechaEnvio) : null,
        estado: fechaEnvio ? 'programada' : 'borrador',
      },
    })

    // TODO: Implementar envío real según tipo (email, SMS, push)

    res.status(201).json(comunicacion)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// VOLUNTARIOS
// ============================================

/** GET /api/community/voluntarios - Listar voluntarios */
router.get('/voluntarios', async (req, res) => {
  try {
    const { organizationId, estado } = req.query

    const where: any = {}
    if (organizationId) where.organizationId = organizationId as string
    if (estado) where.estado = estado as string

    const voluntarios = await prisma.voluntario.findMany({
      where,
      orderBy: { horasAcumuladas: 'desc' },
    })

    res.json(voluntarios)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/community/voluntarios - Registrar voluntario */
router.post('/voluntarios', async (req, res) => {
  try {
    const {
      organizationId,
      nombres,
      apellidos,
      email,
      telefono,
      areaVoluntariado,
      userId,
    } = req.body

    if (!organizationId || !nombres || !apellidos) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const voluntario = await prisma.voluntario.create({
      data: {
        organizationId,
        nombres,
        apellidos,
        email: email || null,
        telefono: telefono || null,
        areaVoluntariado: areaVoluntariado || null,
        userId: userId || null,
        estado: 'activo',
        horasAcumuladas: 0,
      },
    })

    res.status(201).json(voluntario)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// DONACIONES
// ============================================

/** GET /api/community/donaciones - Listar donaciones */
router.get('/donaciones', async (req, res) => {
  try {
    const { organizationId, estado, donanteId } = req.query

    const where: any = {}
    if (organizationId) where.organizationId = organizationId as string
    if (estado) where.estado = estado as string
    if (donanteId) where.donanteId = donanteId as string

    const donaciones = await prisma.donacion.findMany({
      where,
      orderBy: { fechaDonacion: 'desc' },
    })

    res.json(donaciones)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/community/donaciones - Registrar donación */
router.post('/donaciones', async (req, res) => {
  try {
    const {
      organizationId,
      donanteId,
      monto,
      concepto,
      metodoPago,
    } = req.body

    if (!organizationId || !monto || !metodoPago) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const donacion = await prisma.donacion.create({
      data: {
        organizationId,
        donanteId: donanteId || null,
        monto: parseFloat(monto),
        concepto: concepto || null,
        metodoPago,
        estado: 'pendiente',
      },
    })

    // Agregar puntos por donar (si se completa)
    if (donanteId && estado === 'completada') {
      await agregarPuntos(donanteId, 50, 'Donación', 'donaciones', 'Donaciones').catch(console.error)
    }

    res.status(201).json(donacion)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// PROYECTOS
// ============================================

/** GET /api/community/proyectos - Listar proyectos */
router.get('/proyectos', async (req, res) => {
  try {
    const { organizationId, estado } = req.query

    const where: any = {}
    if (organizationId) where.organizationId = organizationId as string
    if (estado) where.estado = estado as string

    const proyectos = await prisma.proyecto.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json(proyectos)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/community/proyectos - Crear proyecto */
router.post('/proyectos', async (req, res) => {
  try {
    const {
      organizationId,
      nombre,
      descripcion,
      objetivo,
      presupuesto,
      fechaInicio,
      fechaFin,
      responsableId,
    } = req.body

    if (!organizationId || !nombre) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const proyecto = await prisma.proyecto.create({
      data: {
        organizationId,
        nombre,
        descripcion: descripcion || null,
        objetivo: objetivo || null,
        presupuesto: presupuesto ? parseFloat(presupuesto) : null,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        responsableId: responsableId || null,
        estado: 'planificacion',
      },
    })

    res.status(201).json(proyecto)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// VOTACIONES
// ============================================

/** GET /api/community/votaciones - Listar votaciones */
router.get('/votaciones', async (req, res) => {
  try {
    const { organizationId, estado } = req.query

    const where: any = {}
    if (organizationId) where.organizationId = organizationId as string
    if (estado) where.estado = estado as string

    const votaciones = await prisma.votacion.findMany({
      where,
      include: {
        opciones: {
          include: {
            votos: true,
          },
        },
      },
      orderBy: { fechaInicio: 'desc' },
    })

    res.json(votaciones)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/community/votaciones - Crear votación */
router.post('/votaciones', async (req, res) => {
  try {
    const {
      organizationId,
      titulo,
      descripcion,
      tipo,
      fechaInicio,
      fechaFin,
      opciones,
      resultadosPublicos,
    } = req.body

    if (!organizationId || !titulo || !tipo || !fechaInicio || !fechaFin || !opciones) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const votacion = await prisma.votacion.create({
      data: {
        organizationId,
        titulo,
        descripcion: descripcion || null,
        tipo,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        resultadosPublicos: resultadosPublicos !== false,
        estado: 'programada',
        opciones: {
          create: opciones.map((op: string, index: number) => ({
            texto: op,
            orden: index,
          })),
        },
      },
      include: {
        opciones: true,
      },
    })

    res.status(201).json(votacion)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/community/votaciones/:id/votar - Emitir voto */
router.post('/votaciones/:id/votar', async (req, res) => {
  try {
    const { userId, opcionId } = req.body

    if (!userId || !opcionId) {
      return res.status(400).json({ error: 'userId y opcionId son requeridos' })
    }

    // Verificar que no haya votado antes
    const votoExistente = await prisma.voto.findFirst({
      where: {
        votacionId: req.params.id,
        userId,
      },
    })

    if (votoExistente) {
      return res.status(400).json({ error: 'Ya has votado en esta votación' })
    }

    const voto = await prisma.voto.create({
      data: {
        votacionId: req.params.id,
        opcionId,
        userId,
      },
    })

    // Agregar puntos por participar en votación
    await agregarPuntos(userId, 10, 'Participar en votación', 'votaciones', 'Votaciones').catch(console.error)

    res.status(201).json(voto)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// REPORTES FINANCIEROS
// ============================================

/** GET /api/community/reportes-financieros - Generar reportes financieros */
router.get('/reportes-financieros', async (req, res) => {
  try {
    const { organizationId, fechaDesde, fechaHasta } = req.query

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId es requerido' })
    }

    const fechaDesdeDate = fechaDesde ? new Date(fechaDesde as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const fechaHastaDate = fechaHasta ? new Date(fechaHasta as string) : new Date()

    // Cuotas
    const cuotas = await prisma.cuota.findMany({
      where: {
        organizationId: organizationId as string,
        createdAt: {
          gte: fechaDesdeDate,
          lte: fechaHastaDate,
        },
      },
    })

    // Donaciones
    const donaciones = await prisma.donacion.findMany({
      where: {
        organizationId: organizationId as string,
        fechaDonacion: {
          gte: fechaDesdeDate,
          lte: fechaHastaDate,
        },
      },
    })

    const totalCuotas = cuotas.filter((c) => c.estado === 'pagada').reduce((sum, c) => sum + c.monto, 0)
    const totalDonaciones = donaciones.filter((d) => d.estado === 'completada').reduce((sum, d) => sum + d.monto, 0)
    const cuotasPendientes = cuotas.filter((c) => c.estado === 'pendiente').reduce((sum, c) => sum + c.monto, 0)

    res.json({
      periodo: {
        desde: fechaDesdeDate,
        hasta: fechaHastaDate,
      },
      ingresos: {
        cuotas: totalCuotas,
        donaciones: totalDonaciones,
        total: totalCuotas + totalDonaciones,
      },
      pendientes: {
        cuotas: cuotasPendientes,
      },
      resumen: {
        totalCuotas: cuotas.length,
        cuotasPagadas: cuotas.filter((c) => c.estado === 'pagada').length,
        totalDonaciones: donaciones.length,
        donacionesCompletadas: donaciones.filter((d) => d.estado === 'completada').length,
      },
    })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

export const communityModule = router
