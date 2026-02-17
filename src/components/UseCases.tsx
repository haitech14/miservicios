import { useState } from 'react'

interface UseCase {
  vertical: string
  nombre: string
  icono: string
  descripcion: string
  caracteristicas: string[]
  color: string
}

const useCases: UseCase[] = [
  {
    vertical: 'HaiEduCore',
    nombre: 'Educación',
    icono: '🎓',
    descripcion: 'Universidades, institutos y academias que necesitan gestionar estudiantes, servicios y recursos.',
    caracteristicas: [
      'Gestión de estudiantes y docentes',
      'Reservas de comedores y transporte',
      'Control de asistencia y credenciales',
      'Biblioteca virtual y recursos académicos',
      'Tutorías y seguimiento académico',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    vertical: 'HaiBizFlow',
    nombre: 'Empresas',
    icono: '💼',
    descripcion: 'Corporaciones, pymes y startups que buscan optimizar beneficios para empleados.',
    caracteristicas: [
      'Gestión de beneficios y nómina',
      'Reservas de espacios y servicios',
      'Comunicación interna efectiva',
      'Programa de bienestar corporativo',
      'Reportes de uso y satisfacción',
    ],
    color: 'from-indigo-500 to-purple-500',
  },
  {
    vertical: 'HaiActive',
    nombre: 'Gimnasio y Deporte',
    icono: '🏋️',
    descripcion: 'Gimnasios, clubes deportivos y academias de fitness con múltiples socios.',
    caracteristicas: [
      'Gestión de membresías y pagos',
      'Reserva de clases y espacios',
      'Seguimiento de asistencia',
      'Planificación de actividades',
      'Integración con control de acceso',
    ],
    color: 'from-orange-500 to-red-500',
  },
  {
    vertical: 'HaiCare',
    nombre: 'Salud',
    icono: '🏥',
    descripcion: 'Clínicas, centros médicos y servicios de salud que atienden pacientes.',
    caracteristicas: [
      'Gestión de citas y agenda',
      'Historia clínica electrónica',
      'Seguimiento de tratamientos',
      'Gestión de especialistas',
      'Notificaciones de recordatorios',
    ],
    color: 'from-green-500 to-emerald-500',
  },
  {
    vertical: 'HaiCommunity',
    nombre: 'Comunidades y ONG',
    icono: '👥',
    descripcion: 'ONGs, asociaciones, cooperativas y comunidades sin fines de lucro.',
    caracteristicas: [
      'Gestión de socios y cuotas',
      'Organización de eventos y voluntariado',
      'Comunicaciones masivas',
      'Sistema de votaciones y encuestas',
      'Transparencia financiera',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    vertical: 'HaiFacility',
    nombre: 'Vecindarios',
    icono: '🏢',
    descripcion: 'Vecindarios, coworkings, centros comerciales y parques empresariales.',
    caracteristicas: [
      'Gestión de espacios y reservas',
      'Control de accesos',
      'Facturación automática',
      'Gestión de incidencias',
      'Comunicación con residentes',
    ],
    color: 'from-cyan-500 to-blue-500',
  },
]

export function UseCases() {
  const [activeCase, setActiveCase] = useState<string | null>(null)

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Soluciones para cada tipo de organización
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            HaiCommunity se adapta a las necesidades específicas de tu industria o sector
          </p>
        </div>

        {/* Tabs de verticales */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {useCases.map((useCase) => (
            <button
              key={useCase.vertical}
              onClick={() => setActiveCase(activeCase === useCase.vertical ? null : useCase.vertical)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-sm ${
                activeCase === useCase.vertical
                  ? 'bg-primary text-white scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              <span className="mr-2">{useCase.icono}</span>
              {useCase.nombre}
            </button>
          ))}
        </div>

        {/* Detalle del caso de uso seleccionado */}
        {activeCase ? (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {useCases.filter((uc) => uc.vertical === activeCase).map((useCase) => (
              <div key={useCase.vertical}>
                {/* Header del caso */}
                <div className={`bg-gradient-to-br ${useCase.color} p-8 md:p-12 text-white`}>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-lg">
                      {useCase.icono}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-4xl font-bold mb-2">{useCase.nombre}</h3>
                      <p className="text-white/90 text-lg">{useCase.descripcion}</p>
                    </div>
                  </div>
                </div>

                {/* Características */}
                <div className="p-8 md:p-12">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">
                    Funcionalidades Incluidas
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {useCase.caracteristicas.map((caracteristica, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${useCase.color} flex items-center justify-center text-white flex-shrink-0`}>
                          ✓
                        </div>
                        <span className="text-gray-700">{caracteristica}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-8 md:p-12 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      ¿Quieres ver cómo {useCase.nombre} funciona?
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-primary to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all">
                      Solicitar Demo de {useCase.nombre}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid de casos cuando no hay selección */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase) => (
              <div
                key={useCase.vertical}
                onClick={() => setActiveCase(useCase.vertical)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer group overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${useCase.color}`} />
                <div className="p-6 md:p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center text-4xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {useCase.icono}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.nombre}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">{useCase.descripcion}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Principales funcionalidades:</p>
                    <ul className="space-y-1">
                      {useCase.caracteristicas.slice(0, 3).map((caracteristica, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {caracteristica}
                        </li>
                      ))}
                      {useCase.caracteristicas.length > 3 && (
                        <li className="text-sm text-primary font-medium">
                          +{useCase.caracteristicas.length - 3} más
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Todos los casos */}
        {!activeCase && (
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ¿No encuentras tu tipo de organización?
            </h3>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              HaiCommunity es altamente personalizable. Contáctanos para crear una solución a medida para tus necesidades específicas.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all">
              Contar con un Especialista
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
