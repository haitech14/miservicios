import { Link } from 'react-router-dom'
import type { Servicio, ServicioClave } from '../constants/servicios'

interface ServicioContenidoProps {
  servicio: Servicio
}

const RUTAS: Partial<Record<ServicioClave, string>> = {
  comedor: '/comedor',
  transporte: '/transporte',
  gimnasio: '/gimnasio',
  biblioteca: '/biblioteca',
  clinica: '/clinica',
  sum: '/sum',
  idiomas: '/idiomas',
  tutorias: '/tutorias',
  actividades: '/actividades',
  voluntarios: '/participacion',
  proyectos: '/participacion',
}

const DETALLE: Partial<Record<ServicioClave, { items: string[]; destacado?: string }>> = {
  comedor: {
    items: ['Ciudad Universitaria', 'San Fernando', 'San Juan de Lurigancho', 'Veterinaria'],
    destacado: 'Almuerzo y cena por turnos',
  },
  transporte: {
    items: ['Ruta Norte', 'Ruta Sur', 'Ruta Este', 'Ruta Oeste'],
    destacado: 'Bus interno y externo',
  },
  clinica: {
    items: ['Chequeo médico', 'Citas programadas', 'Atención de emergencias'],
    destacado: 'Ciudad Universitaria',
  },
  biblioteca: {
    items: ['Reserva de espacios', 'Mesas de estudio', 'Catálogo de libros', 'Repositorios virtuales'],
    destacado: 'Biblioteca Central y por facultades',
  },
  sum: {
    items: ['Consulta de matrícula', 'Trámites en línea', 'Expediente académico'],
    destacado: 'Sistema integrado',
  },
  idiomas: {
    items: ['Cursos de idiomas', 'Inscripción en línea', 'Niveles disponibles'],
    destacado: 'Centro de Idiomas UNMSM',
  },
  'aula-virtual': {
    items: ['Acceso a cursos', 'Material de clases', 'Foros y tareas'],
    destacado: 'En desarrollo',
  },
  gimnasio: {
    items: ['Reserva por ticket', 'Turnos disponibles', 'Instalaciones deportivas'],
    destacado: 'Ciudad Universitaria',
  },
  mapa: {
    items: ['Guía del ingresante', 'Ubicación de facultades', 'Servicios por zona'],
    destacado: 'En desarrollo',
  },
  tutorias: {
    items: ['Solicitud de citas con tutores', 'Seguimiento académico', 'Recursos de apoyo'],
    destacado: 'HaiEduCore',
  },
  actividades: {
    items: ['Calendario de eventos', 'Espacios de descanso', 'Actividades para colaboradores'],
    destacado: 'HaiBizFlow',
  },
}

export function ServicioContenido({ servicio }: ServicioContenidoProps) {
  const ruta = RUTAS[servicio.clave]
  const detalle = DETALLE[servicio.clave]
  const enDesarrollo = servicio.clave === 'aula-virtual' || servicio.clave === 'mapa'
  const rutaTutoriasActividades = servicio.clave === 'tutorias' || servicio.clave === 'actividades'

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col lg:flex-row lg:items-stretch gap-8 p-6 lg:p-8">
        <div className="flex-shrink-0">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: `${servicio.color}25` }}
          >
            {servicio.icono}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-xl text-gray-900">{servicio.nombre}</h2>
            <p className="text-gray-600 mt-1">{servicio.descripcion}</p>
            {detalle?.destacado && (
              <span
                className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full"
                style={{ backgroundColor: `${servicio.color}20`, color: servicio.color }}
              >
                {detalle.destacado}
              </span>
            )}
          </div>
        </div>
        </div>

        {detalle?.items && detalle.items.length > 0 && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 mb-3">Incluye:</p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {detalle.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col justify-end gap-4 lg:flex-row lg:items-end">
        {enDesarrollo ? (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3 mb-4">
            Este servicio está en desarrollo y estará disponible próximamente.
          </p>
        ) : (ruta || rutaTutoriasActividades) ? (
          <Link
            to={ruta ?? (servicio.clave === 'tutorias' ? '/tutorias' : '/actividades')}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-medium text-white text-base transition-colors hover:opacity-90 min-w-[180px]"
            style={{ backgroundColor: servicio.color }}
          >
            Ir al servicio
          </Link>
        ) : null}
        </div>
      </div>
    </div>
  )
}
