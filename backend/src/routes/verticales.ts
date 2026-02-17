import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const verticalesRouter = Router()

/** GET /api/verticales - Listar todas las verticales */
verticalesRouter.get('/', async (_req, res) => {
  try {
    const verticales = await prisma.vertical.findMany({
      orderBy: { slug: 'asc' },
    })
    res.json(verticales)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

/** GET /api/verticales/:slug/modulos - Módulos de una vertical (base + adicionales) */
verticalesRouter.get('/:slug/modulos', async (req, res) => {
  try {
    const vertical = await prisma.vertical.findUnique({
      where: { slug: req.params.slug },
      include: { modulos: { orderBy: [{ esBase: 'desc' }, { clave: 'asc' }] } },
    })
    if (!vertical) {
      return res.status(404).json({ error: 'Vertical no encontrada' })
    }
    const base = vertical.modulos.filter((m) => m.esBase)
    const adicionales = vertical.modulos.filter((m) => !m.esBase)
    res.json({ vertical, base, adicionales })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})
