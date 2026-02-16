import { useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Header } from '../components/Header'
import { QRCodeSVG } from 'qrcode.react'
import JsBarcode from 'jsbarcode'

export function CarnetVirtual() {
  const { user } = useAuth()
  const barcodeRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (barcodeRef.current && user) {
      try {
        JsBarcode(barcodeRef.current, user.codigoBeneficiario, {
          format: 'CODE128',
          width: 2,
          height: 40,
        })
      } catch {
        // Fallback si JsBarcode falla
      }
    }
  }, [user])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <Header title="Carné Universitario Virtual" showBack showLogo={false} />
      <main className="max-w-md mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 text-4xl font-bold" style={{ transform: 'rotate(-30deg)' }}>
              SUNEDU
            </div>
            <p className="text-xs text-center">República del Perú</p>
            <p className="text-xs text-center">Superintendencia Nacional de Educación Superior Universitaria</p>
            <p className="text-sm font-bold text-center mt-1">UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS</p>
            <div className="flex gap-4 mt-4">
              <div className="w-24 h-28 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="flex-1 text-xs space-y-0.5">
                <p><span className="text-gray-500">Código:</span> {user.codigoBeneficiario}</p>
                <p><span className="text-gray-500">DNI:</span> {user.dni}</p>
                <p><span className="text-gray-500">Apellidos:</span> {user.apellidos}</p>
                <p><span className="text-gray-500">Nombres:</span> {user.nombres}</p>
                <p><span className="text-gray-500">Facultad:</span> {user.facultad}</p>
                <p><span className="text-gray-500">Carrera:</span> {user.carrera}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center bg-primary text-white px-3 py-1 rounded">
              <span className="text-xs font-medium">CARNÉ UNIVERSITARIO</span>
              <span className="text-xs">2019</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 text-2xl" style={{ transform: 'rotate(30deg)' }}>
              UNMSM SUNEDU
            </div>
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-1">
                <span className="text-red-600 font-bold text-sm">SU</span>
                <span className="text-purple-600 font-bold text-sm">NE</span>
                <span className="text-blue-600 font-bold text-sm">DU</span>
              </div>
            </div>
            <p className="text-[10px] text-center text-gray-500 mb-4">
              Superintendencia Nacional de Educación Superior Universitaria
            </p>
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={user.codigoBeneficiario} size={120} level="H" />
            </div>
            <div className="flex justify-center">
              <canvas ref={barcodeRef} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
