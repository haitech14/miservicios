import { Header } from '../components/Header'
const rutas = [
  { nombre: 'Ciudad Universitaria', desc: 'Ruta principal' },
  { nombre: 'Ruta Norte', desc: 'Zona norte' },
  { nombre: 'Ruta Sur', desc: 'Zona sur' },
  { nombre: 'Ruta Este', desc: 'Zona este' },
  { nombre: 'Ruta Oeste', desc: 'Zona oeste' },
]

export function Transporte() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Servicio de Transporte" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="max-w-xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              🚌
            </div>
            <div>
              <h2 className="font-bold text-lg">Servicio de Transporte</h2>
              <p className="text-sm text-gray-500">Bus interno y externo de la universidad</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Rutas disponibles:</p>
            {rutas.map((r) => (
              <div
                key={r.nombre}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{r.nombre}</p>
                  <p className="text-xs text-gray-500">{r.desc}</p>
                </div>
                <span className="text-sm text-accent-green font-medium">Activo</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
