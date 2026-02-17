import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopNav } from './TopNav'
import { SidebarHeader } from './SidebarHeader'
import { ChatSidebar } from './ChatSidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Web: sidebar lateral con navegación y servicios */}
      <aside className="hidden md:flex md:w-52 lg:w-56 md:flex-col md:fixed md:inset-y-0 md:left-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 z-40 overflow-y-auto scrollbar-minimal">
        <SidebarHeader />
        <TopNav />
      </aside>
      {/* Contenido principal - cada página incluye su Header */}
      <div className="flex-1 md:pl-52 lg:pl-56 flex flex-col min-h-screen">
        <Outlet />
        {/* Mobile: bottom nav */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
      {/* Chat lateral derecho minimizable */}
      <ChatSidebar />
    </div>
  )
}
