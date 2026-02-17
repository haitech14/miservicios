import express from 'express'
import cors from 'cors'
import { verticalesRouter } from './routes/verticales.js'
import { organizacionesRouter } from './routes/organizaciones.js'
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
app.use('/api/edu', eduModule)
app.use('/api/biz', bizModule)
app.use('/api/active', activeModule)
app.use('/api/care', careModule)
app.use('/api/community', communityModule)
app.use('/api/facility', facilityModule)

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(`Backend HaiServices escuchando en http://localhost:${PORT}`)
})
