import { useState } from 'react'
import { Header } from '../components/Header'

const servicios = [
  {
    id: 'reserva-espacios',
    nombre: 'Reserva de Espacios',
    desc: 'Salas de estudio, cubículos, auditorios',
    icono: '📖',
    color: 'from-green-500 to-emerald-500',
    disponible: true,
  },
  {
    id: 'catalogo',
    nombre: 'Catálogo Digital',
    desc: 'Libros, tesis, revistas y recursos digitales',
    icono: '📚',
    color: 'from-blue-500 to-cyan-500',
    disponible: true,
  },
  {
    id: 'mesas-estudio',
    nombre: 'Mesas de Estudio',
    desc: 'Reserva de mesas individuales y grupales',
    icono: '🪑',
    color: 'from-purple-500 to-pink-500',
    disponible: false,
  },
  {
    id: 'repositorio',
    nombre: 'Repositorio Virtual',
    desc: 'Acceso a tesis y publicaciones académicas',
    icono: '💾',
    color: 'from-orange-500 to-red-500',
    disponible: false,
  },
]

export function Biblioteca() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Header title="Biblioteca Universitaria" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="max-w-xl mx-auto md:max-w-6xl px-4 py-6 md:py-8 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                📚
              </div>
              <div>
                <h1 className="font-bold text-2xl md:text-3xl mb-1">Biblioteca Universitaria</h1>
                <p className="text-white/90 text-sm md:text-base">Biblioteca Central, Facultades, Repositorios Virtuales</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                📖 Miles de libros disponibles
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                🪑 Espacios de estudio
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                💻 Catálogo digital
              </div>
            </div>
          </div>
        </div>

        {/* Servicios Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 ${
                servicio.disponible
                  ? 'border-gray-100 hover:border-green-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                  : 'border-gray-100 opacity-60'
              }`}
              onClick={() => servicio.disponible && setServicioSeleccionado(servicioSeleccionado === servicio.id ? null : servicio.id)}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${servicio.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                {servicio.icono}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{servicio.nombre}</h3>
              <p className="text-sm text-gray-500 mb-3">{servicio.desc}</p>
              {servicio.disponible ? (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Disponible
                </span>
              ) : (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">
                  Próximamente
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-white">ℹ️</span>
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Información de la biblioteca</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Horario de atención: Lunes a Viernes 8:00 - 20:00</li>
                <li>• Presenta tu carnet universitario para acceder</li>
                <li>• Las reservas de espacios se realizan con 24 horas de anticipación</li>
                <li>• Consulta el catálogo digital desde cualquier dispositivo</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
