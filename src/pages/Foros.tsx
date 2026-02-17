import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export function Foros() {
  const { user } = useAuth()
  const [foros, setForos] = useState<any[]>([])
  const [foroSeleccionado, setForoSeleccionado] = useState<string | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [crearPost, setCrearPost] = useState(false)
  const [nuevoPost, setNuevoPost] = useState({ titulo: '', contenido: '' })

  useEffect(() => {
    if (user?.organizationId) {
      loadForos()
    }
  }, [user])

  useEffect(() => {
    if (foroSeleccionado) {
      loadPosts()
    }
  }, [foroSeleccionado])

  const loadForos = async () => {
    try {
      setLoading(true)
      const data = await api.interaccion.foros.list(user?.organizationId || '')
      setForos(data as any[])
    } catch (error) {
      console.error('Error cargando foros:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async () => {
    if (!foroSeleccionado) return
    try {
      const data = await api.interaccion.foros.posts(foroSeleccionado)
      setPosts(data as any[])
    } catch (error) {
      console.error('Error cargando posts:', error)
    }
  }

  const handleCrearPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!foroSeleccionado || !user) return

    try {
      await api.interaccion.posts.create({
        foroId: foroSeleccionado,
        userId: user.id,
        titulo: nuevoPost.titulo,
        contenido: nuevoPost.contenido,
      })
      setNuevoPost({ titulo: '', contenido: '' })
      setCrearPost(false)
      loadPosts()
    } catch (error: any) {
      alert(error.message || 'Error al crear post')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        <Header title="Foros" showBack showLogo={false} />
        <main className="max-w-4xl mx-auto px-4 py-4">
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        </main>
      </div>
    )
  }

  if (!foroSeleccionado) {
    return (
      <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        <Header title="Foros" showBack showLogo={false} />
        <main className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Foros Disponibles</h2>
            {foros.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay foros disponibles</p>
            ) : (
              <div className="space-y-3">
                {foros.map((foro: any) => (
                  <button
                    key={foro.id}
                    onClick={() => setForoSeleccionado(foro.id)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 text-left transition-colors"
                  >
                    <div className="font-semibold text-gray-900">{foro.nombre}</div>
                    {foro.descripcion && (
                      <div className="text-sm text-gray-600 mt-1">{foro.descripcion}</div>
                    )}
                    {foro._count && (
                      <div className="text-xs text-gray-500 mt-2">
                        {foro._count.posts} posts
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  const foroActual = foros.find((f: any) => f.id === foroSeleccionado)

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title={foroActual?.nombre || 'Foro'} showBack showLogo={false} />
      <main className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-4">
          <button
            onClick={() => setForoSeleccionado(null)}
            className="text-primary hover:underline"
          >
            ← Volver a foros
          </button>
        </div>

        {crearPost ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Post</h3>
            <form onSubmit={handleCrearPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={nuevoPost.titulo}
                  onChange={(e) => setNuevoPost({ ...nuevoPost, titulo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                <textarea
                  value={nuevoPost.contenido}
                  onChange={(e) => setNuevoPost({ ...nuevoPost, contenido: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCrearPost(false)
                    setNuevoPost({ titulo: '', contenido: '' })
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mb-4">
            <button
              onClick={() => setCrearPost(true)}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700"
            >
              + Crear Post
            </button>
          </div>
        )}

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No hay posts en este foro</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{post.titulo}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{post.contenido}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>💬 {post._count?.comentarios || 0} comentarios</span>
                  <span>👍 {post._count?.reacciones || 0} reacciones</span>
                </div>
                <Link
                  to={`/foros/post/${post.id}`}
                  className="text-primary text-sm mt-3 inline-block hover:underline"
                >
                  Ver más →
                </Link>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
