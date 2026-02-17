import { useState } from 'react'
import { Header } from '../components/Header'

type TabType = 'archivos' | 'notas'
type TipoArchivo = 'carpeta' | 'documento' | 'imagen' | 'video' | 'audio' | 'pdf' | 'hoja-calculo' | 'presentacion'
type TipoBloque = 'texto' | 'titulo' | 'lista' | 'codigo' | 'cita' | 'divisor'

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

interface Bloque {
  id: string
  tipo: TipoBloque
  contenido: string
  orden: number
}

interface Pagina {
  id: string
  titulo: string
  icono: string
  color: string
  bloques: Bloque[]
  fechaCreacion: string
  fechaModificacion: string
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

const paginasEjemplo: Pagina[] = [
  {
    id: '1',
    titulo: 'Apuntes de Matemáticas',
    icono: '📐',
    color: 'from-blue-500 to-cyan-500',
    fechaCreacion: '15 Feb',
    fechaModificacion: 'Hoy',
    bloques: [
      { id: 'b1', tipo: 'titulo', contenido: 'Derivadas', orden: 1 },
      { id: 'b2', tipo: 'texto', contenido: 'Las derivadas son una herramienta fundamental en cálculo...', orden: 2 },
      { id: 'b3', tipo: 'codigo', contenido: "f'(x) = lim(h->0) [f(x+h) - f(x)] / h", orden: 3 },
    ],
  },
  {
    id: '2',
    titulo: 'Notas de Literatura',
    icono: '📖',
    color: 'from-purple-500 to-pink-500',
    fechaCreacion: '12 Feb',
    fechaModificacion: 'Ayer',
    bloques: [
      { id: 'b4', tipo: 'titulo', contenido: 'Movimiento Romántico', orden: 1 },
      { id: 'b5', tipo: 'texto', contenido: 'Características principales del romanticismo...', orden: 2 },
    ],
  },
  {
    id: '3',
    titulo: 'Ideas de Proyecto',
    icono: '💡',
    color: 'from-yellow-500 to-orange-500',
    fechaCreacion: '10 Feb',
    fechaModificacion: '10 Feb',
    bloques: [
      { id: 'b6', tipo: 'lista', contenido: 'Idea 1\nIdea 2\nIdea 3', orden: 1 },
    ],
  },
]

export function Documentos() {
  const [activeTab, setActiveTab] = useState<TabType>('archivos')
  
  // Archivos
  const [vistaArchivos, setVistaArchivos] = useState<'grid' | 'lista'>('grid')
  const [archivos, setArchivos] = useState<Archivo[]>(archivosEjemplo)
  const [carpetaActual, setCarpetaActual] = useState<string | null>(null)

  // Notas
  const [paginas, setPaginas] = useState<Pagina[]>(paginasEjemplo)
  const [paginaSeleccionada, setPaginaSeleccionada] = useState<Pagina | null>(null)
  const [nuevoBloque, setNuevoBloque] = useState('')

  const archivosVisibles = carpetaActual
    ? archivos.filter((a) => a.id === carpetaActual)
    : archivos

  const entrarCarpeta = (id: string) => {
    const carpeta = archivos.find((a) => a.id === id)
    if (carpeta && carpeta.tipo === 'carpeta') {
      setCarpetaActual(id)
    }
  }

  const agregarBloque = (tipo: TipoBloque) => {
    if (!paginaSeleccionada) return
    const bloque: Bloque = {
      id: `b${Date.now()}`,
      tipo,
      contenido: '',
      orden: paginaSeleccionada.bloques.length + 1,
    }
    setPaginas((prev) =>
      prev.map((p) =>
        p.id === paginaSeleccionada.id
          ? { ...p, bloques: [...p.bloques, bloque], fechaModificacion: 'Ahora' }
          : p
      )
    )
    setPaginaSeleccionada((prev) =>
      prev ? { ...prev, bloques: [...prev.bloques, bloque], fechaModificacion: 'Ahora' } : null
    )
  }

  const renderBloque = (bloque: Bloque) => {
    switch (bloque.tipo) {
      case 'titulo':
        return (
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{bloque.contenido || 'Título'}</h2>
        )
      case 'texto':
        return (
          <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">
            {bloque.contenido || 'Escribe tu texto aquí...'}
          </p>
        )
      case 'lista':
        return (
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            {bloque.contenido.split('\n').map((item, i) => (
              <li key={i}>{item || 'Elemento de lista'}</li>
            ))}
          </ul>
        )
      case 'codigo':
        return (
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm">
            {bloque.contenido || '// Código aquí'}
          </pre>
        )
      case 'cita':
        return (
          <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 mb-4">
            {bloque.contenido || 'Cita aquí...'}
          </blockquote>
        )
      case 'divisor':
        return <hr className="my-6 border-gray-300" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20 md:pb-0">
      <Header title="Documentos" showBack showLogo={false} />
      <main className="max-w-xl mx-auto md:max-w-7xl px-4 py-6">
        {/* Tabs */}
        <div className="flex mb-4 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('archivos')}
            className={`flex-shrink-0 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'archivos'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ☁️ Archivos
          </button>
          <button
            onClick={() => setActiveTab('notas')}
            className={`flex-shrink-0 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'notas'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📝 Notas
          </button>
        </div>

        {/* Contenido Archivos */}
        {activeTab === 'archivos' && (
          <>
            {/* Hero */}
            <div className="mb-6 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
                    ☁️
                  </div>
                  <div>
                    <h1 className="font-bold text-2xl mb-1">Almacenamiento</h1>
                    <p className="text-white/90 text-sm">Gestiona tus archivos en la nube</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                  + Subir archivo
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                  💾 15 GB disponibles
                </div>
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                  📁 {archivos.length} archivos
                </div>
              </div>
            </div>

            {/* Breadcrumb */}
            {carpetaActual && (
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                <button onClick={() => setCarpetaActual(null)} className="hover:text-primary">
                  Archivos
                </button>
                <span>/</span>
                <span className="text-gray-900">
                  {archivos.find((a) => a.id === carpetaActual)?.nombre}
                </span>
              </div>
            )}

            {/* Grid/Lista de archivos */}
            {vistaArchivos === 'grid' ? (
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Contenido Notas */}
        {activeTab === 'notas' && (
          <>
            {!paginaSeleccionada ? (
              <>
                {/* Hero */}
                <div className="mb-6 bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
                        📝
                      </div>
                      <div>
                        <h1 className="font-bold text-2xl mb-1">Notas</h1>
                        <p className="text-white/90 text-sm">Organiza tus apuntes tipo Notion</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                      + Nueva página
                    </button>
                  </div>
                </div>

                {/* Grid de Páginas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paginas.map((pagina) => (
                    <div
                      key={pagina.id}
                      onClick={() => setPaginaSeleccionada(pagina)}
                      className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pagina.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                        {pagina.icono}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{pagina.titulo}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{pagina.bloques.length} bloques</span>
                        <span>•</span>
                        <span>Modificado {pagina.fechaModificacion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Editor de Página */}
                <div className="mb-6 flex items-center justify-between">
                  <button
                    onClick={() => setPaginaSeleccionada(null)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver
                  </button>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                      Compartir
                    </button>
                    <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600">
                      Guardar
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${paginaSeleccionada.color} p-6 text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{paginaSeleccionada.icono}</span>
                      <input
                        type="text"
                        value={paginaSeleccionada.titulo}
                        onChange={(e) => {
                          setPaginaSeleccionada({ ...paginaSeleccionada, titulo: e.target.value })
                        }}
                        className="bg-transparent border-none text-2xl font-bold text-white placeholder-white/70 focus:outline-none"
                        placeholder="Título de la página"
                      />
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="border-b border-gray-200 p-3 flex items-center gap-2 overflow-x-auto">
                    <button
                      onClick={() => agregarBloque('titulo')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Título
                    </button>
                    <button
                      onClick={() => agregarBloque('texto')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Texto
                    </button>
                    <button
                      onClick={() => agregarBloque('lista')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Lista
                    </button>
                    <button
                      onClick={() => agregarBloque('codigo')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Código
                    </button>
                    <button
                      onClick={() => agregarBloque('cita')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cita
                    </button>
                    <button
                      onClick={() => agregarBloque('divisor')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Divisor
                    </button>
                  </div>

                  {/* Contenido */}
                  <div className="p-8 min-h-[500px]">
                    {paginaSeleccionada.bloques.map((bloque) => (
                      <div key={bloque.id} className="mb-4">
                        {renderBloque(bloque)}
                      </div>
                    ))}
                    {paginaSeleccionada.bloques.length === 0 && (
                      <div className="text-center text-gray-400 py-20">
                        <p className="text-lg mb-2">Página vacía</p>
                        <p className="text-sm">Usa la barra de herramientas para agregar contenido</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
