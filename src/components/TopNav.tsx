import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/inicio', icon: '🏠', label: 'Inicio' },
  { to: '/servicios', icon: '📋', label: 'Servicios' },
  { to: '/noticias', icon: '📰', label: 'Noticias' },
  { to: '/comunidad', icon: '👥', label: 'Comunidad' },
  { to: '/perfil', icon: '👤', label: 'Perfil' },
]

export function TopNav() {
  return (
    <nav className="flex-1 py-4 px-2 space-y-1">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
