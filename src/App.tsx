import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { OrgProvider } from './context/OrgContext'
import { ConfiguracionProvider } from './context/ConfiguracionContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/AppLayout'
import { AdminLayout } from './components/AdminLayout'

// Componente de carga
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
)

// Lazy loading de páginas públicas
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })))
import { Login } from './pages/Login'
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })))
const OlvideContrasena = lazy(() => import('./pages/OlvideContrasena').then(m => ({ default: m.OlvideContrasena })))

// Lazy loading de páginas protegidas (carga bajo demanda)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })))
const CarnetVirtual = lazy(() => import('./pages/CarnetVirtual').then(m => ({ default: m.CarnetVirtual })))
const Servicios = lazy(() => import('./pages/Servicios').then(m => ({ default: m.Servicios })))
const Comedor = lazy(() => import('./pages/Comedor').then(m => ({ default: m.Comedor })))
const ComedorTurnos = lazy(() => import('./pages/ComedorTurnos').then(m => ({ default: m.ComedorTurnos })))
const TicketEmitido = lazy(() => import('./pages/TicketEmitido').then(m => ({ default: m.TicketEmitido })))
const Transporte = lazy(() => import('./pages/Transporte').then(m => ({ default: m.Transporte })))
const Gimnasio = lazy(() => import('./pages/Gimnasio').then(m => ({ default: m.Gimnasio })))
const Biblioteca = lazy(() => import('./pages/Biblioteca').then(m => ({ default: m.Biblioteca })))
const Clinica = lazy(() => import('./pages/Clinica').then(m => ({ default: m.Clinica })))
const Sum = lazy(() => import('./pages/Sum').then(m => ({ default: m.Sum })))
const Idiomas = lazy(() => import('./pages/Idiomas').then(m => ({ default: m.Idiomas })))
const Notificaciones = lazy(() => import('./pages/Notificaciones').then(m => ({ default: m.Notificaciones })))
const Noticias = lazy(() => import('./pages/Noticias').then(m => ({ default: m.Noticias })))
const Comunidad = lazy(() => import('./pages/Comunidad').then(m => ({ default: m.Comunidad })))
const Tutorias = lazy(() => import('./pages/verticales/edu/Tutorias').then(m => ({ default: m.Tutorias })))
const Entretenimiento = lazy(() => import('./pages/verticales/biz/Entretenimiento').then(m => ({ default: m.Entretenimiento })))
const Drive = lazy(() => import('./pages/Drive').then(m => ({ default: m.Drive })))
const CuadernoVirtual = lazy(() => import('./pages/CuadernoVirtual').then(m => ({ default: m.CuadernoVirtual })))
const Calendario = lazy(() => import('./pages/Calendario').then(m => ({ default: m.Calendario })))
const Ranking = lazy(() => import('./pages/Ranking').then(m => ({ default: m.Ranking })))
const Gamificacion = lazy(() => import('./pages/Gamificacion').then(m => ({ default: m.Gamificacion })))
const Configuracion = lazy(() => import('./pages/Configuracion').then(m => ({ default: m.Configuracion })))
const Feed = lazy(() => import('./pages/Feed').then(m => ({ default: m.Feed })))
const Foros = lazy(() => import('./pages/Foros').then(m => ({ default: m.Foros })))
const Socios = lazy(() => import('./pages/verticales/community/Socios').then(m => ({ default: m.Socios })))
const Cuotas = lazy(() => import('./pages/verticales/community/Cuotas').then(m => ({ default: m.Cuotas })))
const Eventos = lazy(() => import('./pages/verticales/community/Eventos').then(m => ({ default: m.Eventos })))
const Comunicaciones = lazy(() => import('./pages/verticales/community/Comunicaciones').then(m => ({ default: m.Comunicaciones })))
const Voluntarios = lazy(() => import('./pages/verticales/community/Voluntarios').then(m => ({ default: m.Voluntarios })))
const Donaciones = lazy(() => import('./pages/verticales/community/Donaciones').then(m => ({ default: m.Donaciones })))
const Proyectos = lazy(() => import('./pages/verticales/community/Proyectos').then(m => ({ default: m.Proyectos })))
const Votaciones = lazy(() => import('./pages/verticales/community/Votaciones').then(m => ({ default: m.Votaciones })))
const Encuestas = lazy(() => import('./pages/verticales/community/Encuestas').then(m => ({ default: m.Encuestas })))
const Grupos = lazy(() => import('./pages/verticales/community/Grupos').then(m => ({ default: m.Grupos })))
const Debates = lazy(() => import('./pages/verticales/community/Debates').then(m => ({ default: m.Debates })))

// Nuevos módulos fusionados
const Actividades = lazy(() => import('./pages/Actividades').then(m => ({ default: m.Actividades })))
const Participacion = lazy(() => import('./pages/Participacion').then(m => ({ default: m.Participacion })))
const Documentos = lazy(() => import('./pages/Documentos').then(m => ({ default: m.Documentos })))
const Marketplace = lazy(() => import('./pages/Marketplace').then(m => ({ default: m.Marketplace })))
// Lazy loading de admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const NuevaOrganizacionWizard = lazy(() => import('./pages/admin/NuevaOrganizacionWizard').then(m => ({ default: m.NuevaOrganizacionWizard })))
const GestionModulos = lazy(() => import('./pages/admin/GestionModulos').then(m => ({ default: m.GestionModulos })))

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <OrgProvider>
            <ConfiguracionProvider>
            <ThemeProvider>
              <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
                <Route path="/" element={<Landing />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="nueva-organizacion" element={<NuevaOrganizacionWizard />} />
                  <Route path="organizacion/:slug/modulos" element={<GestionModulos />} />
                </Route>
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/inicio" element={<Home />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/configuracion" element={<Configuracion />} />
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
                  <Route path="/ranking" element={<Ranking />} />
                  <Route path="/gamificacion" element={<Gamificacion />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/foros" element={<Foros />} />
                  <Route path="/comunidad/socios" element={<Socios />} />
                  <Route path="/comunidad/cuotas" element={<Cuotas />} />
                  <Route path="/comunidad/eventos" element={<Eventos />} />
                  <Route path="/comunidad/comunicaciones" element={<Comunicaciones />} />
                  <Route path="/comunidad/voluntarios" element={<Voluntarios />} />
                  <Route path="/comunidad/donaciones" element={<Donaciones />} />
                  <Route path="/comunidad/proyectos" element={<Proyectos />} />
                  <Route path="/comunidad/votaciones" element={<Votaciones />} />
                  <Route path="/comunidad/encuestas" element={<Encuestas />} />
                  <Route path="/comunidad/grupos" element={<Grupos />} />
                  <Route path="/comunidad/debates" element={<Debates />} />
                  <Route path="/tutorias" element={<Tutorias />} />
                  <Route path="/entretenimiento" element={<Entretenimiento />} />
                  <Route path="/drive" element={<Drive />} />
                  <Route path="/cuaderno-virtual" element={<CuadernoVirtual />} />
                  <Route path="/calendario" element={<Calendario />} />
                  {/* Nuevos módulos fusionados */}
                  <Route path="/actividades" element={<Actividades />} />
                  <Route path="/participacion" element={<Participacion />} />
                  <Route path="/documentos" element={<Documentos />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </Suspense>
            </ThemeProvider>
            </ConfiguracionProvider>
          </OrgProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
