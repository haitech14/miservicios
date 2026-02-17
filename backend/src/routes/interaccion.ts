import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const interaccionRouter = Router()

// ============================================
// FOROS
// ============================================

/** GET /api/interaccion/foros - Listar foros */
interaccionRouter.get('/foros', async (req, res) => {
  try {
    const { organizationId } = req.query

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId es requerido' })
    }

    const foros = await prisma.foro.findMany({
      where: {
        organizationId: organizationId as string,
        activo: true,
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(foros)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/interaccion/foros - Crear foro */
interaccionRouter.post('/foros', async (req, res) => {
  try {
    const { organizationId, nombre, descripcion, categoria } = req.body

    if (!organizationId || !nombre) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const foro = await prisma.foro.create({
      data: {
        organizationId,
        nombre,
        descripcion: descripcion || null,
        categoria: categoria || null,
        activo: true,
      },
    })

    res.status(201).json(foro)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** GET /api/interaccion/foros/:id/posts - Posts de un foro */
interaccionRouter.get('/foros/:id/posts', async (req, res) => {
  try {
    const { limite = '20', offset = '0' } = req.query

    const posts = await prisma.post.findMany({
      where: {
        foroId: req.params.id,
        estado: 'publicado',
      },
      include: {
        _count: {
          select: { comentarios: true, reacciones: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limite as string),
      skip: parseInt(offset as string),
    })

    res.json(posts)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// POSTS
// ============================================

/** POST /api/interaccion/posts - Crear post */
interaccionRouter.post('/posts', async (req, res) => {
  try {
    const { foroId, userId, titulo, contenido, tipo } = req.body

    if (!foroId || !userId || !titulo || !contenido) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const post = await prisma.post.create({
      data: {
        foroId,
        userId,
        titulo,
        contenido,
        tipo: tipo || 'texto',
        estado: 'publicado',
      },
    })

    res.status(201).json(post)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** GET /api/interaccion/posts/:id - Obtener post con comentarios */
interaccionRouter.get('/posts/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: { comentarios: true, reacciones: true },
        },
        comentarios: {
          include: {
            _count: {
              select: { reacciones: true },
            },
            respuestas: {
              include: {
                _count: {
                  select: { reacciones: true },
                },
              },
            },
          },
          where: {
            comentarioPadreId: null, // Solo comentarios principales
          },
          orderBy: { createdAt: 'desc' },
        },
        reacciones: {
          groupBy: {
            tipo: true,
          },
        },
      },
    })

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }

    res.json(post)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/interaccion/posts/:id/comentarios - Comentar en post */
interaccionRouter.post('/posts/:id/comentarios', async (req, res) => {
  try {
    const { userId, contenido, comentarioPadreId } = req.body

    if (!userId || !contenido) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const comentario = await prisma.comentario.create({
      data: {
        postId: req.params.id,
        userId,
        contenido,
        comentarioPadreId: comentarioPadreId || null,
      },
    })

    res.status(201).json(comentario)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/interaccion/posts/:id/reaccionar - Reaccionar a post */
interaccionRouter.post('/posts/:id/reaccionar', async (req, res) => {
  try {
    const { userId, tipo } = req.body

    if (!userId || !tipo) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Verificar si ya reaccionó con este tipo
    const reaccionExistente = await prisma.reaccion.findFirst({
      where: {
        postId: req.params.id,
        userId,
        tipo,
      },
    })

    if (reaccionExistente) {
      // Eliminar reacción (toggle)
      await prisma.reaccion.delete({
        where: { id: reaccionExistente.id },
      })
      return res.json({ accion: 'eliminada' })
    }

    // Crear reacción
    const reaccion = await prisma.reaccion.create({
      data: {
        postId: req.params.id,
        userId,
        tipo,
      },
    })

    res.status(201).json(reaccion)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// FEED DE ACTIVIDADES
// ============================================

/** GET /api/interaccion/feed - Feed de actividades */
interaccionRouter.get('/feed', async (req, res) => {
  try {
    const { organizationId, limite = '50', offset = '0' } = req.query

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId es requerido' })
    }

    const actividades = await prisma.feedActividad.findMany({
      where: {
        organizationId: organizationId as string,
      },
      orderBy: { fecha: 'desc' },
      take: parseInt(limite as string),
      skip: parseInt(offset as string),
    })

    res.json(actividades)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/interaccion/feed - Crear actividad en feed */
interaccionRouter.post('/feed', async (req, res) => {
  try {
    const { organizationId, userId, tipo, contenido } = req.body

    if (!organizationId || !userId || !tipo || !contenido) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const actividad = await prisma.feedActividad.create({
      data: {
        organizationId,
        userId,
        tipo,
        contenido: JSON.stringify(contenido),
      },
    })

    res.status(201).json(actividad)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// ============================================
// GRUPOS
// ============================================

/** GET /api/interaccion/grupos - Listar grupos */
interaccionRouter.get('/grupos', async (req, res) => {
  try {
    const { organizationId, privado } = req.query

    const where: any = {}
    if (organizationId) where.organizationId = organizationId as string
    if (privado !== undefined) where.privado = privado === 'true'

    const grupos = await prisma.grupo.findMany({
      where,
      include: {
        _count: {
          select: { miembros: true, chatMensajes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(grupos)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/interaccion/grupos - Crear grupo */
interaccionRouter.post('/grupos', async (req, res) => {
  try {
    const { organizationId, nombre, descripcion, tipo, privado } = req.body

    if (!organizationId || !nombre) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const grupo = await prisma.grupo.create({
      data: {
        organizationId,
        nombre,
        descripcion: descripcion || null,
        tipo: tipo || null,
        privado: privado === true,
      },
    })

    res.status(201).json(grupo)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** GET /api/interaccion/grupos/:id/chat - Mensajes del grupo */
interaccionRouter.get('/grupos/:id/chat', async (req, res) => {
  try {
    const { limite = '50', offset = '0' } = req.query

    const mensajes = await prisma.chatMensaje.findMany({
      where: {
        grupoId: req.params.id,
      },
      include: {
        user: {
          select: {
            nombres: true,
            apellidos: true,
            fotoUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: parseInt(limite as string),
      skip: parseInt(offset as string),
    })

    res.json(mensajes)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** POST /api/interaccion/grupos/:id/chat - Enviar mensaje al grupo */
interaccionRouter.post('/grupos/:id/chat', async (req, res) => {
  try {
    const { userId, contenido, tipo } = req.body

    if (!userId || !contenido) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    const mensaje = await prisma.chatMensaje.create({
      data: {
        grupoId: req.params.id,
        userId,
        contenido,
        tipo: tipo || 'texto',
      },
    })

    res.status(201).json(mensaje)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})
