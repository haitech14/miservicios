import { useState } from 'react'

interface Benefit {
  nombre: string
  descripcion: string
  impacto: 'alto' | 'medio' | 'bajo'
}

export function ROICalculator() {
  const [usuarios, setUsuarios] = useState<number>(100)
  const [horasAhorradas, setHorasAhorradas] = useState<number>(2)
  const [costoHora, setCostoHora] = useState<number>(15)

  const beneficios: Benefit[] = [
    {
      nombre: 'Reducción de tiempos administrativos',
      descripcion: 'Gestión centralizada de todos los servicios en un solo lugar',
      impacto: 'alto'
    },
    {
      nombre: 'Mejora en satisfacción de colaboradores',
      descripcion: 'Acceso fácil y transparente a todos los beneficios',
      impacto: 'alto'
    },
    {
      nombre: 'Reducción de consultas a RRHH',
      descripcion: 'Auto-servicio para consultas frecuentes',
      impacto: 'medio'
    },
    {
      nombre: 'Mayor adopción de beneficios',
      descripcion: 'Mayor visibilidad y uso de los servicios disponibles',
      impacto: 'alto'
    },
  ]

  const calcularROI = () => {
    const ahorroAnual = usuarios * horasAhorradas * costoHora * 12
    const inversionInicial = usuarios * 50 // Costo estimado por usuario de setup
    const roi = ((ahorroAnual - inversionInicial) / inversionInicial) * 100
    return {
      ahorroAnual,
      inversionInicial,
      roi: Math.max(0, roi),
      mesesRecuperacion: inversionInicial / (ahorroAnual / 12)
    }
  }

  const roi = calcularROI()

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculadora de ROI</h2>
      
      <p className="text-gray-600 mb-6">
        Calcula el retorno de inversión de implementar HaiCommunity en tu organización
      </p>

      {/* Inputs */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de colaboradores</label>
          <input
            type="number"
            value={usuarios}
            onChange={(e) => setUsuarios(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            min="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Horas ahorradas por colaborador al mes</label>
          <input
            type="number"
            value={horasAhorradas}
            onChange={(e) => setHorasAhorradas(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            min="1"
          />
          <p className="text-sm text-gray-500 mt-1">Tiempo ahorrado en gestión administrativa y consultas</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Costo promedio por hora de trabajo</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={costoHora}
              onChange={(e) => setCostoHora(Number(e.target.value))}
              className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min="5"
            />
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-2">Ahorro Anual</div>
          <div className="text-3xl font-bold text-primary">
            ${roi.ahorroAnual.toLocaleString('es-ES')}
          </div>
          <p className="text-xs text-gray-500 mt-2">Total ahorrado por año</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-2">ROI</div>
          <div className={`text-3xl font-bold ${
            roi.roi > 50 ? 'text-green-600' : roi.roi > 0 ? 'text-blue-600' : 'text-red-600'
          }`}>
            {roi.roi.toFixed(0)}%
          </div>
          <p className="text-xs text-gray-500 mt-2">Retorno sobre inversión</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-2">Meses para Recuperar</div>
          <div className="text-3xl font-bold text-purple-600">
            {roi.mesesRecuperacion.toFixed(1)}
          </div>
          <p className="text-xs text-gray-500 mt-2">Tiempo de recuperación</p>
        </div>
      </div>

      {/* Beneficios */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Beneficios Esperados</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {beneficios.map((beneficio, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                  beneficio.impacto === 'alto' ? 'bg-green-100' : 
                  beneficio.impacto === 'medio' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  ✓
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{beneficio.nombre}</h4>
                  <p className="text-sm text-gray-600">{beneficio.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <button className="px-8 py-4 bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all">
          Solicitar Demo Personalizada
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Descubre cómo HaiCommunity puede transformar la gestión de beneficios de tu organización
        </p>
      </div>
    </div>
  )
}
