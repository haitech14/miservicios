import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/noticias', icon: '📰', label: 'Noticias' },
  { to: '/comunidad', icon: '👥', label: 'Comunidad' },
  { to: '/inicio', icon: '🏠', label: 'Inicio' },
  { to: '/servicios', icon: '📋', label: 'Servicios' },
  { to: '/perfil', icon: '👤', label: 'Perfil' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 min-h-[44px] gap-0.5 transition-colors ${
                isActive ? 'text-primary font-medium' : 'text-gray-500'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
