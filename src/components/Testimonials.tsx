import { useState } from 'react'

interface Testimonial {
  nombre: string
  cargo: string
  empresa: string
  vertical: string
  testimonio: string
  rating: number
  tiempo: string
}

const verticalLabel: Record<string, string> = {
  HaiEduCore: 'Educación',
  HaiBizFlow: 'Empresas',
  HaiActive: 'Gimnasio y Deporte',
  HaiCare: 'Salud',
  HaiCommunity: 'Comunidades y ONG',
  HaiFacility: 'Vecindarios',
}

const testimonios: Testimonial[] = [
  {
    nombre: 'María García',
    cargo: 'Directora de RRHH',
    empresa: 'TecnoPerú S.A.C.',
    vertical: 'HaiBizFlow',
    testimonio: 'Desde que implementamos HaiCommunity, el tiempo que dedicamos a gestionar beneficios se redujo en un 60%. Nuestros colaboradores están mucho más satisfechos y usan la app diariamente.',
    rating: 5,
    tiempo: '8 meses'
  },
  {
    nombre: 'Carlos Mendoza',
    cargo: 'Vicerrector Académico',
    empresa: 'Universidad Nacional San Luis Gonzaga',
    vertical: 'HaiEduCore',
    testimonio: 'HaiCommunity nos permitió centralizar todos los servicios en una sola plataforma. La adopción fue increíblemente rápida y el soporte técnico es excelente.',
    rating: 5,
    tiempo: '1 año'
  },
  {
    nombre: 'Ana Rodríguez',
    cargo: 'Gerente de Operaciones',
    empresa: 'FitLife Gym',
    vertical: 'HaiActive',
    testimonio: 'La gestión de reservas y el seguimiento de membresías nunca ha sido tan fácil. Nuestros socios aman la nueva app y la usan constantemente.',
    rating: 4.5,
    tiempo: '6 meses'
  },
  {
    nombre: 'Jorge Torres',
    cargo: 'Director General',
    empresa: 'Clínica Bienestar Integral',
    vertical: 'HaiCare',
    testimonio: 'HaiCare transformó completamente nuestra gestión de citas y seguimiento de pacientes. La integración con nuestros sistemas existentes fue fluida.',
    rating: 5,
    tiempo: '1.5 años'
  },
  {
    nombre: 'Patricia López',
    cargo: 'Presidenta',
    empresa: 'Asociación Vecinal San Borja',
    vertical: 'HaiCommunity',
    testimonio: 'Como organización sin fines de lucro, necesitábamos algo accesible y potente. HaiCommunity fue la solución perfecta para gestionar socios, cuotas y eventos.',
    rating: 4.5,
    tiempo: '1 año'
  },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre cómo organizaciones de diversos sectores han transformado su gestión de beneficios con HaiCommunity
          </p>
        </div>

        {/* Testimonios principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonios.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {testimonial.nombre.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{testimonial.nombre}</h3>
                  <p className="text-sm text-gray-600">{testimonial.cargo}</p>
                  <p className="text-sm text-primary font-medium">{testimonial.empresa}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  testimonial.vertical === 'HaiBizFlow' ? 'bg-blue-100 text-blue-700' :
                  testimonial.vertical === 'HaiEduCore' ? 'bg-green-100 text-green-700' :
                  testimonial.vertical === 'HaiActive' ? 'bg-orange-100 text-orange-700' :
                  testimonial.vertical === 'HaiCare' ? 'bg-red-100 text-red-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {verticalLabel[testimonial.vertical] ?? testimonial.vertical}
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.testimonio}"</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(testimonial.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                        ★
                      </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">Cliente desde {testimonial.tiempo}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel de testimonios adicionales */}
        <div className="bg-gradient-to-r from-primary via-indigo-600 to-violet-700 rounded-2xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Más testimonios
              </h3>
              <div className="flex gap-2">
                {testimonios.slice(3).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeIndex === index ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonios.slice(3).map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">
                          {testimonial.nombre.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg">{testimonial.nombre}</h4>
                          <p className="text-white/90 text-sm">{testimonial.cargo}</p>
                        </div>
                      </div>
                      <p className="text-white/90 mb-4">"{testimonial.testimonio}"</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < Math.floor(testimonial.rating) ? 'text-yellow-300' : 'text-white/30'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
              Ver Todos los Testimonios
            </button>
          </div>
        </div>

        {/* Stats de satisfacción */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: '500+', value: 'Organizaciones', icon: '🏢' },
            { label: '95%', value: 'Satisfacción', icon: '⭐' },
            { label: '60%', value: 'Tiempo Ahorrado', icon: '⏱️' },
            { label: '24/7', value: 'Soporte', icon: '🎧' },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
