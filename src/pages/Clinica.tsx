import { useState } from 'react'
import { Header } from '../components/Header'

const servicios = [
  {
    id: 'citas',
    nombre: 'Agendar Cita',
    desc: 'Reserva tu cita médica',
    icono: '📅',
    color: 'from-red-500 to-pink-500',
    disponible: false,
  },
  {
    id: 'autoseguro',
    nombre: 'Autoseguro',
    desc: 'Consulta tu cobertura y beneficios',
    icono: '🛡️',
    color: 'from-blue-500 to-cyan-500',
    disponible: false,
  },
  {
    id: 'emergencias',
    nombre: 'Emergencias',
    desc: 'Información de emergencias 24/7',
    icono: '🚨',
    color: 'from-orange-500 to-red-500',
    disponible: true,
  },
  {
    id: 'chequeos',
    nombre: 'Chequeos Médicos',
    desc: 'Programa de chequeos preventivos',
    icono: '🏥',
    color: 'from-green-500 to-emerald-500',
    disponible: false,
  },
]

export function Clinica() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Header title="Clínica Universitaria" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="max-w-xl mx-auto md:max-w-6xl px-4 py-6 md:py-8 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-red-500 via-pink-600 to-rose-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                🏥
              </div>
              <div>
                <h1 className="font-bold text-2xl md:text-3xl mb-1">Clínica Universitaria</h1>
                <p className="text-white/90 text-sm md:text-base">Chequeos, autoseguro, citas, emergencias - Ciudad Universitaria</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                🚨 Emergencias 24/7
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                🛡️ Autoseguro incluido
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                👨‍⚕️ Personal especializado
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
                  ? 'border-gray-100 hover:border-red-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                  : 'border-gray-100 opacity-60'
              }`}
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
        <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xl text-white">ℹ️</span>
            </div>
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Información importante</h3>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Horario de atención: Lunes a Viernes 8:00 - 18:00</li>
                <li>• Emergencias: Disponible 24/7 en la clínica</li>
                <li>• Presenta tu carnet universitario y DNI</li>
                <li>• El autoseguro cubre consultas y medicamentos básicos</li>
                <li>• Para emergencias, llama al: (01) 619-7000 ext. 5000</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
