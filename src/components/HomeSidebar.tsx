import { useState } from 'react'
import { Link } from 'react-router-dom'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DIAS_SEM = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

const eventosEjemplo = [
  { id: 1, titulo: 'Taller de tesis', fecha: '18 Feb', hora: '10:00', tipo: 'Académico', icono: '📝' },
  { id: 2, titulo: 'Examen parcial', fecha: '20 Feb', hora: '14:00', tipo: 'Evaluación', icono: '📊' },
  { id: 3, titulo: 'Reunión tutoría', fecha: '22 Feb', hora: '09:00', tipo: 'Asesoría', icono: '👨‍🏫' },
]

const noticiasEjemplo = [
  { id: 1, titulo: 'UNMSM lidera ranking de universidades', fuente: 'UNMSM', fecha: '15 Feb', icono: '🏆' },
  { id: 2, titulo: 'Investigación sanmarquina gana premio internacional', fuente: 'International', fecha: '14 Feb', icono: '🌍' },
  { id: 3, titulo: 'Nuevos programas de posgrado', fuente: 'UNMSM', fecha: '12 Feb', icono: '🎓' },
]

const recomendacionesIA = [
  { id: 1, texto: 'Te recomendamos el curso de idiomas según tu nivel actual', icono: '🌐', color: 'from-blue-400 to-cyan-500' },
  { id: 2, texto: 'Hay lugares disponibles en la biblioteca para estudiar hoy', icono: '📚', color: 'from-green-400 to-emerald-500' },
  { id: 3, texto: 'Próxima clase de gimnasio en 2 horas', icono: '🏃', color: 'from-orange-400 to-red-500' },
]

function MiniCalendario() {
  const [fecha] = useState(new Date())
  const year = fecha.getFullYear()
  const month = fecha.getMonth()
  const hoy = fecha.getDate()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1
  const dias = Array.from({ length: offset }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  )

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Calendario</h3>
        <span className="text-sm text-gray-500 font-medium">{MESES[month]} {year}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DIAS_SEM.map((d) => (
          <span key={d} className="py-2 text-gray-500 font-semibold text-[10px]">{d}</span>
        ))}
        {dias.map((d, i) => (
          <span
            key={i}
            className={`py-2 rounded-lg transition-all ${
              d === hoy
                ? 'bg-gradient-to-br from-primary to-indigo-600 text-white font-bold shadow-lg scale-110'
                : d
                  ? 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                  : 'text-transparent'
            }`}
          >
            {d || ''}
          </span>
        ))}
      </div>
    </div>
  )
}

export function HomeSidebar() {
  return (
    <div className="space-y-6">
      <MiniCalendario />

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-indigo-50">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <span className="text-lg">📅</span>
            Eventos agendados
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {eventosEjemplo.map((e) => (
            <Link
              key={e.id}
              to="/servicios"
              className="block p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  {e.icono}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">
                    {e.titulo}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">{e.fecha}</p>
                    <span className="text-gray-300">•</span>
                    <p className="text-xs text-gray-500">{e.hora}</p>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                      {e.tipo}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <span className="text-lg">📰</span>
              Noticias
            </h3>
            <Link to="/noticias" className="text-xs text-primary font-medium hover:underline">
              Ver todas
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {noticiasEjemplo.map((n) => (
            <Link
              key={n.id}
              to="/noticias"
              className="block p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                  {n.icono}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {n.titulo}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                      {n.fuente}
                    </span>
                    <span className="text-xs text-gray-400">{n.fecha}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <span className="text-lg">🤖</span>
            Recomendaciones IA
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recomendacionesIA.map((r) => (
            <div
              key={r.id}
              className="p-4 flex gap-3 hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                {r.icono}
              </div>
              <p className="text-sm text-gray-700 flex-1 pt-1">{r.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
