import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Header } from '../components/Header'
import { useOrg } from '../context/OrgContext'
import { getStoredTickets } from '../store/ticketStore'

export function Profile() {
  const { user, logout } = useAuth()
  const { t } = useOrg()
  const tickets = getStoredTickets()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Ajustes" showBack showLogo={false} />
      <main className="max-w-xl mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-br from-primary to-primary-dark relative">
            <button
              className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
              aria-label="Cambiar portada"
            >
              📷
            </button>
          </div>
          <div className="relative px-4 pb-4 -mt-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-3xl">
                👤
              </div>
              <button
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm"
                aria-label="Cambiar foto"
              >
                📷
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <h2 className="font-semibold text-lg">
                {user.nombres} {user.apellidos}
              </h2>
              {user.alias && (
                <span className="text-gray-500 text-sm">({user.alias})</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {user.presentacion || 'Agrega una breve presentación para que las personas sepan más sobre ti.'}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-500">{t.codigo}:</span>
            <span>{user.codigoBeneficiario}</span>
            <span className="text-gray-500">DNI:</span>
            <span>{user.dni}</span>
            <span className="text-gray-500">Apellidos:</span>
            <span>{user.apellidos}</span>
            <span className="text-gray-500">Nombres:</span>
            <span>{user.nombres}</span>
            <span className="text-gray-500">{t.facultad}:</span>
            <span>{user.facultad}</span>
            <span className="text-gray-500">{t.carrera}:</span>
            <span>{user.carrera}</span>
            <span className="text-gray-500">Correo:</span>
            <span className="truncate">{user.email}</span>
            <span className="text-gray-500">Celular:</span>
            <span>{user.celular}</span>
            <span className="text-gray-500">Fijo:</span>
            <span>{user.fijo}</span>
          </div>
        </div>
        {tickets.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Historial de tickets</h3>
            <div className="space-y-2">
              {tickets.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">{t.sedeNombre} - {t.tipoTurno}</span>
                  <span className="text-xs text-gray-500">{t.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Link
            to="/carnet"
            className="block w-full py-3 rounded-xl bg-primary text-white font-medium text-center min-h-[44px]"
          >
            Ver Carné Virtual
          </Link>
          <Link
            to="/notificaciones"
            className="block w-full py-3 rounded-xl bg-primary text-white font-medium text-center min-h-[44px]"
          >
            Notificaciones
          </Link>
          <button className="w-full py-3 rounded-xl bg-primary text-white font-medium min-h-[44px]">
            Cambiar Contraseña
          </button>
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl bg-accent-red text-white font-medium min-h-[44px]"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </main>
    </div>
  )
}
