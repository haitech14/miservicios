import { useState } from 'react'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DIAS_SEM = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

const eventosEjemplo = [
  { id: 1, titulo: 'Taller de tesis', fecha: '18 Feb', hora: '10:00', tipo: 'Académico' },
  { id: 2, titulo: 'Examen parcial', fecha: '20 Feb', hora: '14:00', tipo: 'Evaluación' },
  { id: 3, titulo: 'Reunión tutoría', fecha: '22 Feb', hora: '09:00', tipo: 'Asesoría' },
]

const noticiasEjemplo = [
  { id: 1, titulo: 'UNMSM lidera ranking de universidades', fuente: 'UNMSM', fecha: '15 Feb' },
  { id: 2, titulo: 'Investigación sanmarquina gana premio internacional', fuente: 'International', fecha: '14 Feb' },
  { id: 3, titulo: 'Nuevos programas de posgrado', fuente: 'UNMSM', fecha: '12 Feb' },
]

const recomendacionesIA = [
  { id: 1, texto: 'Te recomendamos el curso de idiomas según tu nivel actual', icono: '🌐' },
  { id: 2, texto: 'Hay lugares disponibles en la biblioteca para estudiar hoy', icono: '📚' },
  { id: 3, texto: 'Próxima clase de gimnasio en 2 horas', icono: '🏃' },
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
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">Calendario</h3>
        <span className="text-xs text-gray-500">{MESES[month]} {year}</span>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {DIAS_SEM.map((d) => (
          <span key={d} className="py-1 text-gray-500 font-medium">{d}</span>
        ))}
        {dias.map((d, i) => (
          <span
            key={i}
            className={`py-1 rounded ${d === hoy ? 'bg-primary text-white' : d ? 'text-gray-700' : 'text-transparent'}`}
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

      <section>
        <h3 className="font-semibold text-gray-900 text-sm mb-2">Eventos agendados en cola</h3>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {eventosEjemplo.map((e) => (
            <div key={e.id} className="p-3 hover:bg-gray-50">
              <p className="font-medium text-sm text-gray-900">{e.titulo}</p>
              <p className="text-xs text-gray-500">
                {e.fecha} · {e.hora} · {e.tipo}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-gray-900 text-sm mb-2">Noticias UNMSM / Internacional</h3>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {noticiasEjemplo.map((n) => (
            <div key={n.id} className="p-3 hover:bg-gray-50">
              <p className="font-medium text-sm text-gray-900">{n.titulo}</p>
              <p className="text-xs text-gray-500">
                {n.fuente} · {n.fecha}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-gray-900 text-sm mb-2">Recomendaciones IA</h3>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {recomendacionesIA.map((r) => (
            <div key={r.id} className="p-3 flex gap-3 hover:bg-gray-50">
              <span className="text-lg flex-shrink-0">{r.icono}</span>
              <p className="text-sm text-gray-700">{r.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
