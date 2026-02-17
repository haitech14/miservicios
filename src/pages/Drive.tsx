import { useState } from 'react'
import { Header } from '../components/Header'

type TipoArchivo = 'carpeta' | 'documento' | 'imagen' | 'video' | 'audio' | 'pdf' | 'hoja-calculo' | 'presentacion'

interface Archivo {
  id: string
  nombre: string
  tipo: TipoArchivo
  tamaño: string
  modificado: string
  compartido: boolean
  icono: string
  color: string
}

const archivosEjemplo: Archivo[] = [
  {
    id: '1',
    nombre: 'Mis Documentos',
    tipo: 'carpeta',
    tamaño: '-',
    modificado: 'Hoy',
    compartido: false,
    icono: '📁',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: '2',
    nombre: 'Apuntes de Clase',
    tipo: 'carpeta',
    tamaño: '-',
    modificado: 'Ayer',
    compartido: true,
    icono: '📂',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: '3',
    nombre: 'Tesis - Capítulo 1.pdf',
    tipo: 'pdf',
    tamaño: '2.4 MB',
    modificado: '15 Feb',
    compartido: false,
    icono: '📄',
    color: 'from-red-400 to-pink-500',
  },
  {
    id: '4',
    nombre: 'Presentación Final.pptx',
    tipo: 'presentacion',
    tamaño: '5.8 MB',
    modificado: '12 Feb',
    compartido: true,
    icono: '📊',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: '5',
    nombre: 'Notas de Matemáticas.docx',
    tipo: 'documento',
    tamaño: '156 KB',
    modificado: '10 Feb',
    compartido: false,
    icono: '📝',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: '6',
    nombre: 'Fotos Universidad',
    tipo: 'carpeta',
    tamaño: '-',
    modificado: '8 Feb',
    compartido: false,
    icono: '🖼️',
    color: 'from-purple-400 to-pink-500',
  },
]

export function Drive() {
  const [vista, setVista] = useState<'grid' | 'lista'>('grid')
  const [archivos] = useState<Archivo[]>(archivosEjemplo)
  const [carpetaActual, setCarpetaActual] = useState<string | null>(null)

  const archivosVisibles = carpetaActual
    ? archivos.filter((a) => a.id === carpetaActual)
    : archivos

  const entrarCarpeta = (id: string) => {
    const carpeta = archivos.find((a) => a.id === id)
    if (carpeta && carpeta.tipo === 'carpeta') {
      setCarpetaActual(id)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Header title="Drive" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="max-w-xl mx-auto md:max-w-7xl px-4 py-6 md:py-8 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                ☁️
              </div>
              <div className="flex-1">
                <h1 className="font-bold text-2xl md:text-3xl mb-1">Drive</h1>
                <p className="text-white/90 text-sm md:text-base">Almacenamiento en la nube y gestión de archivos</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setVista('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    vista === 'grid' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setVista('lista')}
                  className={`p-2 rounded-lg transition-colors ${
                    vista === 'lista' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                💾 15 GB disponibles
              </div>
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                📁 {archivos.length} archivos
              </div>
              <button className="px-4 py-1.5 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
                + Subir archivo
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        {carpetaActual && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => setCarpetaActual(null)} className="hover:text-primary">
              Drive
            </button>
            <span>/</span>
            <span className="text-gray-900">
              {archivos.find((a) => a.id === carpetaActual)?.nombre}
            </span>
          </div>
        )}

        {/* Archivos Grid/Lista */}
        {vista === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {archivosVisibles.map((archivo) => (
              <div
                key={archivo.id}
                onClick={() => archivo.tipo === 'carpeta' && entrarCarpeta(archivo.id)}
                className={`bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer ${
                  archivo.tipo === 'carpeta' ? 'hover:scale-105' : ''
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${archivo.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {archivo.icono}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 text-center mb-1 truncate">
                  {archivo.nombre}
                </h3>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  {archivo.tipo !== 'carpeta' && <span>{archivo.tamaño}</span>}
                  {archivo.compartido && <span className="text-blue-500">🔗</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {archivosVisibles.map((archivo) => (
                <div
                  key={archivo.id}
                  onClick={() => archivo.tipo === 'carpeta' && entrarCarpeta(archivo.id)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${archivo.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {archivo.icono}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{archivo.nombre}</h3>
                    <p className="text-sm text-gray-500">
                      {archivo.tipo !== 'carpeta' && `${archivo.tamaño} • `}
                      Modificado {archivo.modificado}
                    </p>
                  </div>
                  {archivo.compartido && (
                    <span className="text-blue-500 text-xl">🔗</span>
                  )}
                  <button className="p-2 hover:bg-gray-200 rounded-lg">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
