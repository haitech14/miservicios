import { useState } from 'react'
import { Header } from '../components/Header'

type TipoBloque = 'texto' | 'titulo' | 'lista' | 'codigo' | 'cita' | 'divisor'

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
      { id: 'b3', tipo: 'codigo', contenido: 'f\'(x) = lim(h->0) [f(x+h) - f(x)] / h', orden: 3 },
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

export function CuadernoVirtual() {
  const [paginas, setPaginas] = useState<Pagina[]>(paginasEjemplo)
  const [paginaSeleccionada, setPaginaSeleccionada] = useState<Pagina | null>(null)
  const [nuevoBloque, setNuevoBloque] = useState('')
  // Reservado para futuro formulario de bloques
  void nuevoBloque; void setNuevoBloque

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
      <Header title="Cuaderno Virtual" sectionTitle="SERVICIOS" showBack showLogo />
      <main className="max-w-xl mx-auto md:max-w-7xl px-4 py-6 md:py-8 lg:px-8">
        {!paginaSeleccionada ? (
          <>
            {/* Hero Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl md:text-4xl shadow-lg">
                    📝
                  </div>
                  <div className="flex-1">
                    <h1 className="font-bold text-2xl md:text-3xl mb-1">Cuaderno Virtual</h1>
                    <p className="text-white/90 text-sm md:text-base">Organiza tus apuntes tipo Notion</p>
                  </div>
                  <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                    + Nueva página
                  </button>
                </div>
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
              {/* Header de la página */}
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
      </main>
    </div>
  )
}
