import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROICalculator } from '../components/ROICalculator'
import { Testimonials } from '../components/Testimonials'
import { UseCases } from '../components/UseCases'

const features = [
  {
    icon: '🍽️',
    title: 'Comedor y Cafetería',
    desc: 'Gestión de turnos, tickets y menús para comedores universitarios y corporativos.',
    color: 'from-orange-400 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    icon: '🚌',
    title: 'Transporte',
    desc: 'Rutas, horarios y reservas de transporte interno y shuttle.',
    color: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
  },
  {
    icon: '📚',
    title: 'Biblioteca y Espacios',
    desc: 'Reserva de mesas, salas de estudio y catálogo de recursos.',
    color: 'from-emerald-400 to-green-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    icon: '🏥',
    title: 'Salud y Bienestar',
    desc: 'Agenda de citas médicas, autoseguro y gimnasio.',
    color: 'from-rose-400 to-pink-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  {
    icon: '📋',
    title: 'Trámites y Matrícula',
    desc: 'Consultas en línea, matrícula y gestión de expedientes.',
    color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    icon: '📱',
    title: 'Todo en una app',
    desc: 'Acceso móvil, credencial virtual y notificaciones en tiempo real.',
    color: 'from-indigo-400 to-primary-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
]

const plans = [
  {
    name: 'Básico',
    basePrice: 49.90,
    includedUsers: 10,
    pricePerAdditional: 5.90,
    desc: 'Ideal para centros pequeños',
    features: ['Comedor y Transporte', 'Soporte por email'],
    highlight: false,
    gradient: 'from-sky-500 to-blue-600',
    accent: 'text-sky-600',
  },
  {
    name: 'Estándar',
    basePrice: 129,
    includedUsers: 100,
    pricePerAdditional: 4.90,
    desc: 'Para equipos en crecimiento',
    features: ['Más módulos', 'Credencial virtual', 'Soporte prioritario'],
    highlight: true,
    gradient: 'from-indigo-500 via-primary-500 to-violet-600',
    accent: 'text-primary',
  },
  {
    name: 'Profesional',
    basePrice: 299,
    includedUsers: 300,
    pricePerAdditional: 5.90,
    desc: 'Para universidades y empresas medianas',
    features: ['Todos los módulos', 'Personalización de marca', 'Soporte dedicado'],
    highlight: false,
    gradient: 'from-violet-500 to-purple-600',
    accent: 'text-violet-600',
  },
  {
    name: 'Enterprise',
    basePrice: 499,
    includedUsers: 1000,
    pricePerAdditional: 4.90,
    desc: 'Solución completa a medida',
    features: ['Integración con sistemas existentes', 'API dedicada', 'Gerente de cuenta', 'SLA garantizado'],
    highlight: false,
    gradient: 'from-amber-500 to-orange-600',
    accent: 'text-amber-600',
  },
]

const demoVerticales = [
  {
    id: 'HaiEduCore',
    label: 'Educación',
    chipColor: 'bg-vertical-edu-100 text-vertical-edu-700',
    gradient: 'from-vertical-edu-primary to-vertical-edu-500',
    items: ['Comedor universitario', 'Biblioteca y salas', 'Transporte interno', 'Cuaderno virtual'],
  },
  {
    id: 'HaiBizFlow',
    label: 'Empresas',
    chipColor: 'bg-vertical-biz-100 text-vertical-biz-700',
    gradient: 'from-vertical-biz-primary to-vertical-biz-500',
    items: ['Beneficios corporativos', 'Eventos internos', 'Wellness laboral', 'Transporte colaboradores'],
  },
  {
    id: 'HaiCommunity',
    label: 'Comunidades',
    chipColor: 'bg-vertical-community-100 text-vertical-community-700',
    gradient: 'from-vertical-community-primary to-vertical-community-500',
    items: ['Gestión de socios', 'Cuotas y donaciones', 'Actividades y voluntariado', 'Comunicaciones'],
  },
]

export function Landing() {
  const [verticalActiva, setVerticalActiva] = useState(demoVerticales[0])

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/30">
              HC
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">HaiCommunity</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-primary font-medium transition-colors">Características</a>
            <a href="#pricing" className="text-slate-600 hover:text-primary font-medium transition-colors">Planes</a>
            <Link to="/login" className="text-primary font-semibold hover:underline">Ingresar</Link>
            <Link
              to="/login"
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Comenzar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero - Gradient background */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-violet-50 to-amber-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(249,115,22,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(139,92,246,0.2),transparent)]" />
        <div className="absolute top-10 left-[10%] w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-32 right-[5%] w-96 h-96 bg-amber-400/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-[20%] w-72 h-72 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[25%] w-64 h-64 bg-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        </div>
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-center">
          {/* Texto hero */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-slate-900">Plataforma SaaS para </span>
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-600 bg-clip-text text-transparent">comunidades</span>
            <span className="text-slate-900"> y </span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">organizaciones</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl">
            Gestiona socios, eventos, cuotas, comunicaciones y más. 
            Para comunidades, ONGs, universidades y empresas.
          </p>
          {/* Animación ligera de beneficios en acción */}
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              +30% uso de servicios
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              -40% tiempo en trámites
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              +25% participación en actividades
            </span>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Solicitar demostración
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              Ya tengo cuenta
            </Link>
          </div>

          {/* Demo interactiva */}
          <div className="mt-10 lg:mt-0">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Demo interactiva
                  </span>
                </div>
                <span className="text-xs text-slate-400">Vista simulada</span>
              </div>

              {/* Selector de vertical */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {demoVerticales.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVerticalActiva(v)}
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                      verticalActiva.id === v.id
                        ? `${v.chipColor} border-transparent shadow-sm`
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Tarjeta principal de demo */}
              <div className="rounded-xl bg-slate-900 text-white p-4 sm:p-5 relative overflow-hidden">
                <div className={`absolute inset-0 opacity-60 bg-gradient-to-br ${verticalActiva.gradient}`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/70">
                        Panel de servicios
                      </p>
                      <p className="text-lg font-semibold">Organización demo</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <span className="px-2 py-1 rounded-full bg-black/30 border border-white/10">
                        {verticalActiva.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                    {verticalActiva.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-lg bg-black/20 border border-white/10 px-3 py-3 flex flex-col gap-1"
                      >
                        <span className="text-xs text-white/60">Módulo</span>
                        <span className="text-sm font-medium leading-snug">{item}</span>
                        <span className="mt-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                          <span className="block h-full w-[70%] bg-gradient-to-r from-emerald-400 to-lime-300" />
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-white/80">
                    <span>Tiempo de adopción estimado: 2-4 semanas</span>
                    <span className="font-semibold">+30% uso de servicios</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badge - colorful */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-8 border border-indigo-100 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Primera implementación
            </p>
            <p className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Universidad Nacional Mayor de San Marcos (UNMSM)
            </p>
          </div>
        </div>
      </section>

      {/* Features - Colorful cards */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Todo lo que tu organización necesita
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Módulos flexibles que se adaptan a universidades, institutos y empresas
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group p-6 rounded-2xl border-2 ${f.bg} ${f.border} hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{f.title}</h3>
                <p className="mt-2 text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Colorful cards */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Planes mensuales
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Escalables según el tamaño de tu organización
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-6 lg:p-8 ${
                  p.highlight
                    ? 'bg-gradient-to-br from-primary via-indigo-600 to-violet-700 text-white shadow-2xl shadow-primary/40 scale-105 ring-4 ring-primary/20'
                    : 'bg-white border-2 border-slate-200 hover:border-primary/30 hover:shadow-xl transition-all'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                    Recomendado
                  </span>
                )}
                <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${p.gradient} mb-4`} />
                <h3 className={`font-bold text-xl ${p.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {p.name}
                </h3>
                <p className={`mt-1 text-sm ${p.highlight ? 'text-white/80' : 'text-slate-500'}`}>
                  {p.desc}
                </p>
                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl lg:text-4xl font-bold ${p.highlight ? 'text-white' : p.accent}`}>
                      ${p.basePrice.toFixed(p.basePrice % 1 === 0 ? 0 : 2)}
                    </span>
                    <span className={p.highlight ? 'text-white/70' : 'text-slate-500'}>/mes</span>
                  </div>
                  <p className={`mt-1 text-sm ${p.highlight ? 'text-white/80' : 'text-slate-600'}`}>
                    {p.includedUsers.toLocaleString()} usuarios incluidos
                  </p>
                  <p className={`text-sm font-medium mt-0.5 ${p.highlight ? 'text-white' : 'text-slate-700'}`}>
                    + ${p.pricePerAdditional}/usuario adicional
                  </p>
                </div>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${p.highlight ? 'text-white/90' : 'text-slate-600'}`}>
                      <span className="text-emerald-500 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`mt-8 block w-full py-3.5 text-center font-semibold rounded-xl transition-all ${
                    p.highlight
                      ? 'bg-white text-primary hover:bg-slate-100 shadow-lg'
                      : `bg-gradient-to-r ${p.gradient} text-white hover:shadow-lg`
                  }`}
                >
                  Comenzar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-gray-50">
        <UseCases />
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <Testimonials />
      </section>

      {/* ROI Calculator */}
      <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-indigo-50">
        <ROICalculator />
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre HaiCommunity
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                pregunta: '¿Qué es HaiCommunity?',
                respuesta: 'HaiCommunity es una plataforma SaaS completa para la gestión de comunidades y organizaciones. Permite gestionar socios, eventos, cuotas, comunicaciones y más en un solo lugar, con soporte para múltiples verticales como educación, empresas, gimnasios, clínicas y comunidades sin fines de lucro.'
              },
              {
                pregunta: '¿Cuánto tiempo toma implementar la plataforma?',
                respuesta: 'La implementación inicial puede completarse en 1-2 semanas según el tamaño de tu organización. Incluye configuración de módulos, importación de datos y capacitación de administradores. Los usuarios pueden empezar a usar la plataforma inmediatamente después de la activación.'
              },
              {
                pregunta: '¿Qué verticales soporta HaiCommunity?',
                respuesta: 'HaiCommunity soporta 6 verticales: HaiEduCore (educación), HaiBizFlow (empresas), HaiActive (deportes), HaiCare (salud), HaiCommunity (comunidades) y HaiFacility (coworkings). Cada vertical tiene módulos y funcionalidades específicas adaptadas a sus necesidades.'
              },
              {
                pregunta: '¿Puedo personalizar la plataforma con mi marca?',
                respuesta: 'Sí, HaiCommunity permite personalización completa de marca: colores, logo, nombre de dominio, correos personalizados y más. El plan Profesional y Enterprise incluyen personalización avanzada con ajustes específicos por organización.'
              },
              {
                pregunta: '¿Qué tipo de soporte ofrecen?',
                respuesta: 'Ofrecemos soporte por email en el plan Básico, soporte prioritario en Estándar, y soporte dedicado con gerente de cuenta en los planes Profesional y Enterprise. También disponemos de base de conocimientos, tutoriales en video y documentación completa.'
              },
              {
                pregunta: '¿Tienen integraciones con otros sistemas?',
                respuesta: 'El plan Enterprise incluye integraciones con sistemas existentes como CRM, ERP, sistemas de nómina, plataformas de pago y más. También ofrecemos API para desarrolladores que deseen crear integraciones personalizadas.'
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    const element = document.getElementById(`faq-${index}`)
                    element?.classList.toggle('hidden')
                  }}
                >
                  <span className="font-semibold text-gray-900 text-lg">{item.pregunta}</span>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div id={`faq-${index}`} className="hidden px-6 pb-6 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed">{item.respuesta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Vibrant gradient */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-600 to-violet-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            ¿Listo para optimizar los servicios de tu organización?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Contáctanos para una demostración personalizada
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-amber-50 hover:shadow-xl transition-all"
            >
              Solicitar demo
            </Link>
            <a
              href="mailto:contacto@haicommunity.com"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              Escribir
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
              HC
            </div>
            <span className="font-semibold">HaiCommunity</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <Link to="/login" className="hover:text-white transition-colors">Ingresar</Link>
            <Link to="/registro" className="hover:text-white transition-colors">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
