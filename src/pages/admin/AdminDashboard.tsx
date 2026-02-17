import { Link } from 'react-router-dom'

export function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Panel de administración</h1>
      <p className="text-gray-600 mb-8">
        Gestión de organizaciones y configuración de HaiServices.
      </p>

      <div className="grid gap-4">
        <Link
          to="/admin/nueva-organizacion"
          className="block p-6 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-800 font-medium"
        >
          + Crear nueva organización
        </Link>
        <div className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
          <p className="font-medium text-gray-800">Organizaciones existentes</p>
          <p className="text-sm mt-1">
            Conecte el backend (npm run dev en /backend) y use la API para listar organizaciones.
            Desde aquí podrá en el futuro ver la lista y editar cada una.
          </p>
        </div>
      </div>
    </div>
  )
}
