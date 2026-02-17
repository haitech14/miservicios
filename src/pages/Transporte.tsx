import { useState } from 'react'
import { Header } from '../components/Header'

const rutas = [
  { 
    id: 'cu',
    nombre: 'Ciudad Universitaria', 
    desc: 'Ruta principal - Campus central',
    icono: '🏛️',
    color: 'from-blue-500 to-cyan-500',
    horarios: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    estado: 'activo',
    capacidad: '45 pasajeros'
  },
  { 
    id: 'norte',
    nombre: 'Ruta Norte', 
    desc: 'Zona norte - Independencia, Los Olivos',
    icono: '🚌',
    color: 'from-green-500 to-emerald-500',
    horarios: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'],
    estado: 'activo',
    capacidad: '40 pasajeros'
  },
  { 
    id: 'sur',
    nombre: 'Ruta Sur', 
    desc: 'Zona sur - San Juan de Miraflores, Villa El Salvador',
    icono: '🚐',
    color: 'from-orange-500 to-red-500',
    horarios: ['06:30', '08:30', '10:30', '12:30', '14:30', '16:30'],
    estado: 'activo',
    capacidad: '35 pasajeros'
  },
  { 
    id: 'este',
    nombre: 'Ruta Este', 
    desc: 'Zona este - San Juan de Lurigancho, Ate',
    icono: '🚎',
    color: 'from-purple-500 to-pink-500',
    horarios: ['07:30', '09:30', '11:30', '13:30', '15:30', '17:30'],
    estado: 'activo',
    capacidad: '42 pasajeros'
  },
  { 
    id: 'oeste',
    nombre: 'Ruta Oeste', 
    desc: 'Zona oeste - Callao, La Perla',
    icono: '🚍',
    color: 'from-indigo-500 to-blue-500',
    horarios: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    estado: 'activo',
    capacidad: '38 pasajeros'
  },
]

export function Transporte() {
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Header title="Servicio de Transporte" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="max-w-xl mx-auto md:max-w-6xl px-4 py-6 md:py-8 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                🚌
              </div>
              <div>
                <h1 className="font-bold text-2xl md:text-3xl mb-1">Servicio de Transporte</h1>
                <p className="text-white/90 text-sm md:text-base">Rutas internas y externas de la universidad</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                🗺️ 5 Rutas disponibles
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                ⏰ Múltiples horarios
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                ✅ Gratuito para estudiantes
              </div>
            </div>
          </div>
        </div>

        {/* Rutas Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rutas.map((ruta) => (
            <div
              key={ruta.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                rutaSeleccionada === ruta.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-100 hover:border-blue-200'
              }`}
              onClick={() => setRutaSeleccionada(rutaSeleccionada === ruta.id ? null : ruta.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${ruta.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {ruta.icono}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  ruta.estado === 'activo'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {ruta.estado === 'activo' ? '● Activo' : 'Inactivo'}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-gray-900 mb-1">{ruta.nombre}</h3>
              <p className="text-sm text-gray-500 mb-4">{ruta.desc}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>👥</span>
                  <span>{ruta.capacidad}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>⏰</span>
                  <span>{ruta.horarios.length} salidas diarias</span>
                </div>
              </div>

              {rutaSeleccionada === ruta.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Horarios de salida:</p>
                  <div className="flex flex-wrap gap-2">
                    {ruta.horarios.map((h, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-white">ℹ️</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Información del servicio</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• El servicio es gratuito para estudiantes y personal de la universidad</li>
                <li>• Presenta tu carnet universitario al abordar</li>
                <li>• Los horarios pueden variar en días festivos</li>
                <li>• Para más información, contacta a la oficina de transporte</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
