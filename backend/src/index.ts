import express from 'express'
import cors from 'cors'
import os from 'os'
import { verticalesRouter } from './routes/verticales.js'
import { organizacionesRouter } from './routes/organizaciones.js'
import { authRouter } from './routes/auth.js'
import { gamificacionRouter } from './routes/gamificacion.js'
import { configuracionRouter } from './routes/configuracion.js'
import { interaccionRouter } from './routes/interaccion.js'
import { notificacionesRouter } from './routes/notificaciones.js'
import { eduModule } from './modules/edu/index.js'
import { bizModule } from './modules/biz/index.js'
import { activeModule } from './modules/active/index.js'
import { careModule } from './modules/care/index.js'
import { communityModule } from './modules/community/index.js'
import { facilityModule } from './modules/facility/index.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/verticales', verticalesRouter)
app.use('/api/organizaciones', organizacionesRouter)
app.use('/api/auth', authRouter)
app.use('/api/gamificacion', gamificacionRouter)
app.use('/api/configuracion', configuracionRouter)
app.use('/api/interaccion', interaccionRouter)
app.use('/api/notificaciones', notificacionesRouter)
app.use('/api/edu', eduModule)
app.use('/api/biz', bizModule)
app.use('/api/active', activeModule)
app.use('/api/care', careModule)
app.use('/api/community', communityModule)
app.use('/api/facility', facilityModule)

const PORT = process.env.PORT ?? 3001
const HOST = process.env.HOST ?? '0.0.0.0'

// Función para obtener la IP local
function getLocalIP(): string {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

app.listen(PORT, HOST, () => {
  const localIP = getLocalIP()
  console.log('\n🚀 Backend HaiCommunity iniciado')
  console.log(`📍 Local:    http://localhost:${PORT}`)
  console.log(`🌐 Red:      http://${localIP}:${PORT}`)
  console.log('')
})
