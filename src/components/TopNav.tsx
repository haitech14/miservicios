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
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive 
                ? 'bg-gradient-to-r from-primary/20 to-indigo-500/20 text-white font-medium border-l-2 border-primary shadow-lg' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
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
