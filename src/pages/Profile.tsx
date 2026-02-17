import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Header } from '../components/Header'
import { useOrg } from '../context/OrgContext'
import { api } from '../services/api'
import { LazyImage } from '../components/LazyImage'

export function Profile() {
  const { user, updateUser, logout } = useAuth()
  const { t } = useOrg()
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [uploadingPortada, setUploadingPortada] = useState(false)
  const fotoInputRef = useRef<HTMLInputElement>(null)
  const portadaInputRef = useRef<HTMLInputElement>(null)

  if (!user) return null

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingFoto(true)
      const result = await api.configuracion.subirFotoPerfil(file)
      const fotoUrl = (result as any).fotoUrl
      updateUser({ fotoUrl })
    } catch (error: any) {
      alert(error.message || 'Error al subir foto')
    } finally {
      setUploadingFoto(false)
      if (fotoInputRef.current) fotoInputRef.current.value = ''
    }
  }

  const handlePortadaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingPortada(true)
      const result = await api.configuracion.subirFotoPortada(file)
      const portadaUrl = (result as any).portadaUrl
      updateUser({ portadaUrl })
    } catch (error: any) {
      alert(error.message || 'Error al subir portada')
    } finally {
      setUploadingPortada(false)
      if (portadaInputRef.current) portadaInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      <Header title="Perfil" showBack showLogo={false} />
      <main className="max-w-xl mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {/* Portada */}
          <div
            className="h-32 bg-gradient-to-br from-primary to-primary-dark relative bg-cover bg-center"
            style={{
              backgroundImage: user.portadaUrl ? `url(${user.portadaUrl})` : undefined,
            }}
          >
            <input
              ref={portadaInputRef}
              type="file"
              accept="image/*"
              onChange={handlePortadaChange}
              className="hidden"
            />
            <button
              onClick={() => portadaInputRef.current?.click()}
              disabled={uploadingPortada}
              className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
              aria-label="Cambiar portada"
            >
              {uploadingPortada ? '⏳' : '📷'}
            </button>
          </div>

          {/* Foto de perfil */}
          <div className="relative px-4 pb-4 -mt-12">
            <div className="relative inline-block">
              {user.fotoUrl ? (
                <LazyImage
                  src={user.fotoUrl}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-3xl">
                  {user.nombres?.[0] || user.email[0].toUpperCase()}
                </div>
              )}
              <input
                ref={fotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
              <button
                onClick={() => fotoInputRef.current?.click()}
                disabled={uploadingFoto}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm hover:bg-primary-700 disabled:opacity-50"
                aria-label="Cambiar foto"
              >
                {uploadingFoto ? '⏳' : '📷'}
              </button>
            </div>
            <div className="mt-2">
              <h2 className="font-semibold text-lg">
                {user.nombres} {user.apellidos}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Información personal */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">Información Personal</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {user.codigoBeneficiario && (
              <>
                <span className="text-gray-500">{t('codigo')}:</span>
                <span>{user.codigoBeneficiario}</span>
              </>
            )}
            {user.dni && (
              <>
                <span className="text-gray-500">DNI:</span>
                <span>{user.dni}</span>
              </>
            )}
            <span className="text-gray-500">Apellidos:</span>
            <span>{user.apellidos || '-'}</span>
            <span className="text-gray-500">Nombres:</span>
            <span>{user.nombres || '-'}</span>
            {user.facultadOuArea && (
              <>
                <span className="text-gray-500">{t('facultad')}:</span>
                <span>{user.facultadOuArea}</span>
              </>
            )}
            {user.carreraOuCargo && (
              <>
                <span className="text-gray-500">{t('carrera')}:</span>
                <span>{user.carreraOuCargo}</span>
              </>
            )}
            <span className="text-gray-500">Correo:</span>
            <span className="truncate">{user.email}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-2">
          <Link
            to="/carnet"
            className="block w-full py-3 rounded-xl bg-primary text-white font-medium text-center min-h-[44px]"
          >
            Ver Carné Virtual
          </Link>
          <Link
            to="/gamificacion"
            className="block w-full py-3 rounded-xl bg-primary text-white font-medium text-center min-h-[44px]"
          >
            Gamificación
          </Link>
          <Link
            to="/ranking"
            className="block w-full py-3 rounded-xl bg-primary text-white font-medium text-center min-h-[44px]"
          >
            Ranking
          </Link>
          <Link
            to="/configuracion"
            className="block w-full py-3 rounded-xl border-2 border-primary text-primary font-medium text-center min-h-[44px]"
          >
            Configuración
          </Link>
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl bg-red-500 text-white font-medium min-h-[44px]"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </main>
    </div>
  )
}
