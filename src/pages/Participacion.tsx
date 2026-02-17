import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

type TabType = 'grupos' | 'debates' | 'encuestas'

export function Participacion() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('grupos')
  const [loading, setLoading] = useState(true)
  
  // Grupos
  const [grupos, setGrupos] = useState<any[]>([])
  const [crearGrupo, setCrearGrupo] = useState(false)
  const [nuevoGrupo, setNuevoGrupo] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'tematico',
    privado: false,
  })

  // Debates
  const [debates, setDebates] = useState<any[]>([])
  const [crearDebate, setCrearDebate] = useState(false)
  const [nuevoDebate, setNuevoDebate] = useState({
    titulo: '',
    descripcion: '',
    tema: '',
  })

  // Encuestas
  const [encuestas, setEncuestas] = useState<any[]>([])
  const [crearEncuesta, setCrearEncuesta] = useState(false)
  const [nuevaEncuesta, setNuevaEncuesta] = useState({
    titulo: '',
    descripcion: '',
    anonima: false,
    preguntas: [{ texto: '', tipo: 'opcion_multiple', opciones: [''] }],
  })

  useEffect(() => {
    if (user?.organizationId) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const [gruposData] = await Promise.all([
        api.interaccion.grupos.list(user?.organizationId || ''),
      ])
      setGrupos(gruposData as any[])
      
      // Simular debates y encuestas
      setDebates([
        {
          id: '1',
          titulo: 'Mejoras en el comedor',
          descripcion: '¿Qué cambios propones para mejorar el servicio de comedor?',
          tema: 'Servicios',
          estado: 'activo',
          totalArgumentos: 24,
          fechaInicio: new Date().toISOString(),
        },
      ])
      setEncuestas([
        {
          id: '1',
          titulo: 'Preferencia de actividades recreativas',
          descripcion: 'Ayúdanos a planificar las próximas actividades',
          estado: 'activa',
          totalRespuestas: 45,
          fechaInicio: new Date().toISOString(),
          fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
    } catch (error) {
      console.error('Error cargando datos de participación:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrearGrupo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return
    try {
      await api.interaccion.grupos.create({
        organizationId: user.organizationId,
        ...nuevoGrupo,
        creadorId: user.id,
      })
      setNuevoGrupo({ nombre: '', descripcion: '', tipo: 'tematico', privado: false })
      setCrearGrupo(false)
      loadData()
    } catch (error: any) {
      alert(error.message || 'Error al crear grupo')
    }
  }

  const handleCrearDebate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return
    try {
      const nuevo = {
        id: Date.now().toString(),
        ...nuevoDebate,
        estado: 'activo',
        totalArgumentos: 0,
        fechaInicio: new Date().toISOString(),
      }
      setDebates([nuevo, ...debates])
      setNuevoDebate({ titulo: '', descripcion: '', tema: '' })
      setCrearDebate(false)
    } catch (error: any) {
      alert(error.message || 'Error al crear debate')
    }
  }

  const handleCrearEncuesta = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId) return
    try {
      const nueva = {
        id: Date.now().toString(),
        ...nuevaEncuesta,
        estado: 'activa',
        totalRespuestas: 0,
        fechaInicio: new Date().toISOString(),
        fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
      setEncuestas([nueva, ...encuestas])
      setNuevaEncuesta({
        titulo: '',
        descripcion: '',
        anonima: false,
        preguntas: [{ texto: '', tipo: 'opcion_multiple', opciones: [''] }],
      })
      setCrearEncuesta(false)
    } catch (error: any) {
      alert(error.message || 'Error al crear encuesta')
    }
  }

  const handleUnirseGrupo = async (_grupoId: string) => {
    if (!user) return
    try {
      alert(`Te has unido al grupo`)
    } catch (error: any) {
      alert(error.message || 'Error al unirse al grupo')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Participación" showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Tabs */}
        <div className="flex mb-4 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('grupos')}
            className={`flex-shrink-0 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'grupos'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👥 Grupos
          </button>
          <button
            onClick={() => setActiveTab('debates')}
            className={`flex-shrink-0 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'debates'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💬 Debates
          </button>
          <button
            onClick={() => setActiveTab('encuestas')}
            className={`flex-shrink-0 px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'encuestas'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Encuestas
          </button>
        </div>

        {/* Contenido por tab */}
        {activeTab === 'grupos' && (
          <>
            <div className="mb-4">
              <button
                onClick={() => setCrearGrupo(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                + Crear Grupo
              </button>
            </div>

            {crearGrupo && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Grupo</h3>
                <form onSubmit={handleCrearGrupo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Grupo</label>
                    <input
                      type="text"
                      value={nuevoGrupo.nombre}
                      onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, nombre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={nuevoGrupo.descripcion}
                      onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, descripcion: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                      <select
                        value={nuevoGrupo.tipo}
                        onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, tipo: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="tematico">Temático</option>
                        <option value="proyecto">Proyecto</option>
                        <option value="interes">Interés</option>
                      </select>
                    </div>
                    <label className="flex items-center justify-center gap-2 h-full">
                      <input
                        type="checkbox"
                        checked={nuevoGrupo.privado}
                        onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, privado: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Privado</span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCrearGrupo(false)
                        setNuevoGrupo({ nombre: '', descripcion: '', tipo: 'tematico', privado: false })
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500">Cargando grupos...</div>
            ) : grupos.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-gray-500">No hay grupos disponibles</p>
                <p className="text-sm text-gray-400 mt-2">Crea un nuevo grupo para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {grupos.map((grupo: any) => (
                  <div key={grupo.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{grupo.nombre}</h3>
                        {grupo.descripcion && (
                          <p className="text-gray-700 mb-3">{grupo.descripcion}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>👥 {grupo.miembros?.length || 0} miembros</span>
                          <span className="capitalize">{grupo.tipo}</span>
                          {grupo.privado && <span>🔒 Privado</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnirseGrupo(grupo.id)}
                        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Unirse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'debates' && (
          <>
            <div className="mb-4">
              <button
                onClick={() => setCrearDebate(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                + Crear Debate
              </button>
            </div>

            {crearDebate && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Debate</h3>
                <form onSubmit={handleCrearDebate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <input
                      type="text"
                      value={nuevoDebate.titulo}
                      onChange={(e) => setNuevoDebate({ ...nuevoDebate, titulo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={nuevoDebate.descripcion}
                      onChange={(e) => setNuevoDebate({ ...nuevoDebate, descripcion: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                    <input
                      type="text"
                      value={nuevoDebate.tema}
                      onChange={(e) => setNuevoDebate({ ...nuevoDebate, tema: e.target.value })}
                      placeholder="Ej: Educación, Medio Ambiente, Servicios"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCrearDebate(false)
                        setNuevoDebate({ titulo: '', descripcion: '', tema: '' })
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500">Cargando debates...</div>
            ) : debates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-500">No hay debates disponibles</p>
                <p className="text-sm text-gray-400 mt-2">Crea un nuevo debate para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {debates.map((debate: any) => (
                  <div key={debate.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{debate.titulo}</h3>
                        {debate.descripcion && (
                          <p className="text-gray-700 mb-3">{debate.descripcion}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>📅 {new Date(debate.fechaInicio).toLocaleDateString()}</span>
                          <span>💬 {debate.totalArgumentos || 0} argumentos</span>
                          {debate.tema && <span>🏷️ {debate.tema}</span>}
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        debate.estado === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : debate.estado === 'finalizado'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {debate.estado === 'activo' ? 'Activo' : debate.estado === 'finalizado' ? 'Finalizado' : 'Programado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'encuestas' && (
          <>
            <div className="mb-4">
              <button
                onClick={() => setCrearEncuesta(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                + Crear Encuesta
              </button>
            </div>

            {crearEncuesta && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Encuesta</h3>
                <form onSubmit={handleCrearEncuesta} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <input
                      type="text"
                      value={nuevaEncuesta.titulo}
                      onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, titulo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={nuevaEncuesta.descripcion}
                      onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, descripcion: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nuevaEncuesta.anonima}
                      onChange={(e) => setNuevaEncuesta({ ...nuevaEncuesta, anonima: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Encuesta anónima</span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCrearEncuesta(false)
                        setNuevaEncuesta({
                          titulo: '',
                          descripcion: '',
                          anonima: false,
                          preguntas: [{ texto: '', tipo: 'opcion_multiple', opciones: [''] }],
                        })
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500">Cargando encuestas...</div>
            ) : encuestas.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-500">No hay encuestas disponibles</p>
                <p className="text-sm text-gray-400 mt-2">Crea una nueva encuesta para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {encuestas.map((encuesta: any) => (
                  <div key={encuesta.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{encuesta.titulo}</h3>
                        {encuesta.descripcion && (
                          <p className="text-gray-700 mb-3">{encuesta.descripcion}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>📅 {new Date(encuesta.fechaInicio).toLocaleDateString()} - {new Date(encuesta.fechaFin).toLocaleDateString()}</span>
                          <span>📝 {encuesta.totalRespuestas || 0} respuestas</span>
                          {encuesta.anonima && <span>🔒 Anónima</span>}
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        encuesta.estado === 'activa'
                          ? 'bg-green-100 text-green-700'
                          : encuesta.estado === 'finalizada'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {encuesta.estado === 'activa' ? 'Activa' : encuesta.estado === 'finalizada' ? 'Finalizada' : 'Programada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
