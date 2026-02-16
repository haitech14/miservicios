import { Header } from '../components/Header'
export function Noticias() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Noticias" showBack showLogo={false} />
      <main className="max-w-xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-center py-8">No hay noticias recientes</p>
        </div>
      </main>
    </div>
  )
}
