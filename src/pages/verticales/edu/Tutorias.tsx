import { Header } from '../../../components/Header'

/**
 * HaiEduCore - Tutorías y seguimiento académico.
 * Módulo adicional para universidades e institutos.
 */
export function Tutorias() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Tutorías" sectionTitle="HAIEDUCORE" showBack showLogo />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Tutorías y seguimiento académico</h2>
          <p className="text-gray-600 text-sm">
            Aquí podrás agendar tutorías con tus docentes, ver el seguimiento de tu avance académico
            y acceder a recursos de apoyo. Este módulo fortalece la comunidad y el acompañamiento entre estudiantes y docentes.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
            Módulo en desarrollo. Próximamente: solicitud de citas con tutores, historial de tutorías y recomendaciones.
          </div>
        </div>
      </main>
    </div>
  )
}
