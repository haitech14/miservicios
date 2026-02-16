import { Link } from 'react-router-dom'
import type { Servicio } from '../constants/servicios'

interface ServiceCardProps {
  servicio: Servicio
}

export function ServiceCard({ servicio }: ServiceCardProps) {
  const isActivo = servicio.activo
  const ServiceContent = (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl shadow-sm border transition-all ${
        isActivo ? 'bg-white border-gray-200 hover:shadow-md' : 'bg-gray-50 border-gray-100 opacity-75'
      }`}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: `${servicio.color}20` }}
      >
        {servicio.icono}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">{servicio.nombre}</h3>
        <p className="text-sm text-gray-500 truncate">{servicio.descripcion}</p>
      </div>
      <button
        className={`px-4 py-2 rounded-lg font-medium text-white text-sm min-w-[44px] min-h-[44px] flex items-center justify-center ${
          isActivo ? 'opacity-100' : 'opacity-60'
        }`}
        style={{ backgroundColor: servicio.color }}
      >
        Ir al servicio
      </button>
    </div>
  )

  if (isActivo && servicio.clave === 'comedor') {
    return <Link to="/comedor">{ServiceContent}</Link>
  }
  if (isActivo && servicio.clave === 'transporte') {
    return <Link to="/transporte">{ServiceContent}</Link>
  }
  if (isActivo && servicio.clave === 'gimnasio') {
    return <Link to="/gimnasio">{ServiceContent}</Link>
  }
  if (servicio.clave === 'biblioteca') return <Link to="/biblioteca">{ServiceContent}</Link>
  if (servicio.clave === 'clinica') return <Link to="/clinica">{ServiceContent}</Link>
  if (servicio.clave === 'sum') return <Link to="/sum">{ServiceContent}</Link>
  if (servicio.clave === 'idiomas') return <Link to="/idiomas">{ServiceContent}</Link>
  if (servicio.clave === 'aula-virtual') return <Link to="/servicios" state={{ servicio: 'aula-virtual' }}>{ServiceContent}</Link>
  if (servicio.clave === 'mapa') return <Link to="/servicios" state={{ servicio: 'mapa' }}>{ServiceContent}</Link>

  return ServiceContent
}
