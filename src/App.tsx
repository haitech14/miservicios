import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { OrgProvider } from './context/OrgContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { CarnetVirtual } from './pages/CarnetVirtual'
import { Servicios } from './pages/Servicios'
import { Comedor } from './pages/Comedor'
import { ComedorTurnos } from './pages/ComedorTurnos'
import { TicketEmitido } from './pages/TicketEmitido'
import { Transporte } from './pages/Transporte'
import { Gimnasio } from './pages/Gimnasio'
import { Noticias } from './pages/Noticias'
import { Comunidad } from './pages/Comunidad'
import { OlvideContrasena } from './pages/OlvideContrasena'
import { Biblioteca } from './pages/Biblioteca'
import { Clinica } from './pages/Clinica'
import { Sum } from './pages/Sum'
import { Idiomas } from './pages/Idiomas'
import { Notificaciones } from './pages/Notificaciones'
import { AppLayout } from './components/AppLayout'
import { Landing } from './pages/Landing'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <OrgProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
              <Route path="/" element={<Landing />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/inicio" element={<Home />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/carnet" element={<CarnetVirtual />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/comedor" element={<Comedor />} />
                <Route path="/comedor/turnos" element={<ComedorTurnos />} />
                <Route path="/ticket" element={<TicketEmitido />} />
                <Route path="/transporte" element={<Transporte />} />
                <Route path="/gimnasio" element={<Gimnasio />} />
                <Route path="/biblioteca" element={<Biblioteca />} />
                <Route path="/clinica" element={<Clinica />} />
                <Route path="/sum" element={<Sum />} />
                <Route path="/idiomas" element={<Idiomas />} />
                <Route path="/notificaciones" element={<Notificaciones />} />
                <Route path="/noticias" element={<Noticias />} />
                <Route path="/comunidad" element={<Comunidad />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </OrgProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
