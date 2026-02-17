import { Header } from '../../../components/Header'

/**
 * HaiBizFlow - Entretenimiento (eventos, descanso, actividades para empleados).
 * Módulo adicional para empresas.
 */
export function Entretenimiento() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Entretenimiento" sectionTitle="HAIBIZFLOW" showBack showLogo />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Entretenimiento y bienestar</h2>
          <p className="text-gray-600 text-sm">
            Actividades, eventos y espacios de descanso para fortalecer el ambiente laboral y la comunidad entre colaboradores.
          </p>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm text-amber-800">
            Módulo en desarrollo. Próximamente: calendario de eventos, reserva de espacios de descanso e inscripción a actividades.
          </div>
        </div>
      </main>
    </div>
  )
}
