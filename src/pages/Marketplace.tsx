import { useState } from 'react'
import { Header } from '../components/Header'

type Categoria = 'todos' | 'libros' | 'electronica' | 'ropa' | 'servicios' | 'otros'

interface Producto {
  id: string
  titulo: string
  descripcion: string
  precio: string
  categoria: Categoria
  vendedor: string
  imagen?: string
  icono: string
  fecha: string
  ubicacion: string
}

const CATEGORIAS: { clave: Categoria; label: string; icono: string }[] = [
  { clave: 'todos', label: 'Todos', icono: '🛒' },
  { clave: 'libros', label: 'Libros', icono: '📚' },
  { clave: 'electronica', label: 'Electrónica', icono: '📱' },
  { clave: 'ropa', label: 'Ropa y accesorios', icono: '👕' },
  { clave: 'servicios', label: 'Servicios', icono: '🛠️' },
  { clave: 'otros', label: 'Otros', icono: '📦' },
]

const PRODUCTOS_EJEMPLO: Producto[] = [
  {
    id: '1',
    titulo: 'Cálculo de Stewart - 9na edición',
    descripcion: 'Libro en buen estado, poco uso. Incluye solucionario.',
    precio: 'S/ 80',
    categoria: 'libros',
    vendedor: 'María G.',
    icono: '📚',
    fecha: 'Hoy',
    ubicacion: 'Ciudad Universitaria',
  },
  {
    id: '2',
    titulo: 'Laptop Dell Inspiron 15',
    descripcion: 'i5, 8GB RAM, 256GB SSD. Perfecto para estudiantes.',
    precio: 'S/ 1,200',
    categoria: 'electronica',
    vendedor: 'Carlos L.',
    icono: '💻',
    fecha: 'Ayer',
    ubicacion: 'San Fernando',
  },
  {
    id: '3',
    titulo: 'Polos universidad talla M',
    descripcion: 'Pack de 3 polos oficiales, nuevos con etiqueta.',
    precio: 'S/ 45',
    categoria: 'ropa',
    vendedor: 'Ana P.',
    icono: '👕',
    fecha: 'Hoy',
    ubicacion: 'Ciudad Universitaria',
  },
  {
    id: '4',
    titulo: 'Clases de matemáticas',
    descripcion: 'Tutoría personalizada, cálculo y álgebra. S/ 25/hora.',
    precio: 'S/ 25/h',
    categoria: 'servicios',
    vendedor: 'Prof. Martínez',
    icono: '✏️',
    fecha: 'Hoy',
    ubicacion: 'Virtual',
  },
  {
    id: '5',
    titulo: 'Bicicleta urbana',
    descripcion: 'Rodado 26, frenos mecánicos, lista para usar.',
    precio: 'S/ 350',
    categoria: 'otros',
    vendedor: 'Luis R.',
    icono: '🚲',
    fecha: 'Ayer',
    ubicacion: 'SJL',
  },
  {
    id: '6',
    titulo: 'Física Universitaria - Sears',
    descripcion: 'Volumen 1 y 2. Algunas marcas de lápiz.',
    precio: 'S/ 120',
    categoria: 'libros',
    vendedor: 'Pedro S.',
    icono: '📖',
    fecha: 'Hace 2 días',
    ubicacion: 'Ciudad Universitaria',
  },
]

export function Marketplace() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>('todos')
  const [busqueda, setBusqueda] = useState('')

  const productosFiltrados = PRODUCTOS_EJEMPLO.filter((p) => {
    const coincideCategoria = categoriaActiva === 'todos' || p.categoria === categoriaActiva
    const coincideBusqueda =
      !busqueda.trim() ||
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Marketplace" sectionTitle="MARKETPLACE" showBack showLogo={false} />
      <main className="max-w-6xl mx-auto px-4 py-4">
        {/* Búsqueda */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar productos o servicios..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          </div>
        </div>

        {/* Categorías */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-minimal -mx-4 px-4">
          {CATEGORIAS.map((c) => (
            <button
              key={c.clave}
              onClick={() => setCategoriaActiva(c.clave)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                categoriaActiva === c.clave
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span>{c.icono}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Publicar */}
        <div className="mt-4 mb-6">
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="text-xl">➕</span>
            Publicar anuncio
          </button>
        </div>

        {/* Listado de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productosFiltrados.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl">
                {p.icono}
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 truncate">{p.titulo}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{p.descripcion}</p>
                <p className="font-bold text-primary text-lg mt-2">{p.precio}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span>{p.vendedor}</span>
                  <span>{p.ubicacion}</span>
                </div>
              </div>
              <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors">
                Ver más
              </button>
            </article>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">🛒</p>
            <p className="font-medium">No hay anuncios que coincidan</p>
            <p className="text-sm mt-1">Prueba con otra categoría o búsqueda</p>
          </div>
        )}
      </main>
    </div>
  )
}
