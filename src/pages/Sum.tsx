import { Header } from '../components/Header'
export function Sum() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Sistema Único de Matrícula" showBack showLogo />
      <main className="max-w-xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <h2 className="font-bold text-lg">Sistema Único de Matrícula (SUM)</h2>
              <p className="text-sm text-gray-500">Consulta información en línea, matrícula, trámites</p>
            </div>
          </div>
          <p className="text-gray-500 text-center py-8">Consulta de matrícula y trámites - Próximamente</p>
        </div>
      </main>
    </div>
  )
}
