import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'os'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin para mostrar la IP local al iniciar
    {
      name: 'show-local-ip',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const localIP = getLocalIP()
          const address = server.httpServer?.address()
          if (address && typeof address === 'object') {
            console.log('\n🚀 Frontend iniciado')
            console.log(`📍 Local:    http://localhost:${address.port}`)
            console.log(`🌐 Red:      http://${localIP}:${address.port}`)
            console.log('')
          }
        })
      },
    },
  ],
  server: {
    host: '0.0.0.0', // Permite acceso desde cualquier IP
    port: 3000, // Puerto fijo para desarrollo
    strictPort: true, // Si está ocupado, falla en lugar de cambiar
    open: false, // No abrir automáticamente
  },
})
