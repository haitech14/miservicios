import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopNav } from './TopNav'
import { SidebarServices } from './SidebarServices'
import { ChatSidebar } from './ChatSidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Web: sidebar lateral con navegación y servicios */}
      <aside className="hidden md:flex md:w-56 lg:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 bg-white border-r border-gray-200 z-40 overflow-y-auto">
        <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md">
            MI
          </div>
          <div>
            <span className="font-bold text-primary text-lg">SERVICIOS</span>
            <p className="text-xs text-gray-500">UNMSM</p>
          </div>
        </div>
        <TopNav />
        <SidebarServices />
      </aside>
      {/* Contenido principal - cada página incluye su Header */}
      <div className="flex-1 md:pl-56 lg:pl-64 flex flex-col min-h-screen">
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
