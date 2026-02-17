import { memo, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/noticias', icon: '📰', label: 'Noticias' },
  { to: '/comunidad', icon: '👥', label: 'Comunidad' },
  { to: '/inicio', icon: '🏠', label: 'Inicio' },
  { to: '/servicios', icon: '📋', label: 'Servicios' },
  { to: '/configuracion', icon: '⚙️', label: 'Config' },
]

const NavItem = memo(({ to, icon, label, isActive }: { to: string; icon: string; label: string; isActive: boolean }) => (
  <NavLink
    to={to}
    className="flex flex-col items-center justify-center flex-1 min-h-[44px] gap-0.5 transition-all duration-200 active:scale-90 touch-target relative"
  >
    <span className="text-xl leading-none relative z-10">{icon}</span>
    <span className="text-xs leading-tight relative z-10">{label}</span>
    {isActive && (
      <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary rounded-full" />
    )}
  </NavLink>
))

NavItem.displayName = 'NavItem'

export const BottomNav = memo(function BottomNav() {
  const location = useLocation()
  const { user } = useAuth()
  const [notificacionesPendientes, setNotificacionesPendientes] = useState(0)

  useEffect(() => {
    if (!user) return

    let isMounted = true

    const loadNoLeidas = async () => {
      try {
        const data = await api.notificaciones.noLeidas().catch(() => ({ count: 0 }))
        if (!isMounted) return
        setNotificacionesPendientes((data as any).count || 0)
      } catch (error) {
        console.error('Error cargando notificaciones no leídas:', error)
      }
    }

    loadNoLeidas()

    const interval = setInterval(loadNoLeidas, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [user])
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 pb-safe shadow-lg supports-[backdrop-filter]:bg-white/80">
      <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
        {navItems.map((item, index) => (
          <div key={item.to} className="relative">
            <NavItem
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
            />
            {/* Badge de notificaciones en el ítem de noticias */}
            {index === 0 && notificacionesPendientes > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                {notificacionesPendientes > 9 ? '9+' : notificacionesPendientes}
              </span>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
})
