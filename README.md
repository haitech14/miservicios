# HaiCommunity

Plataforma SaaS completa y extensible para la gestión de comunidades y organizaciones. Soporta múltiples verticales (educación, empresas, comunidades, gimnasios, clínicas, facilities) con módulos personalizables y sistema de gamificación.

## Características

- **Autenticación:** Login y registro con correo @unmsm.edu.pe
- **Perfil:** Gestión de datos personales y académicos
- **Carné Virtual:** Credencial universitaria digital con QR y código de barras
- **Comedor:** Reserva de tickets por sede (Ciudad Universitaria, San Fernando, San Juan de Lurigancho, Veterinaria) y turno (Desayuno, Almuerzo, Cena)
- **Transporte:** Información de rutas
- **Gimnasio:** Reserva de turnos por ticket
- **Servicios adicionales:** Biblioteca, Clínica, SUM, Centro de Idiomas (vistas informativas)
- **Notificaciones:** Configuración de preferencias y feedback
- **PWA:** Instalable en móvil con Service Worker

## Instalación

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
```

### Configuración de Base de Datos (Supabase)

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Crea un archivo `.env` en `backend/` con tus credenciales (ver `backend/SUPABASE_SETUP.md`)
3. Ejecuta las migraciones:

```bash
cd backend
npm run db:generate
npm run db:push
npm run db:seed
```

Para más detalles, consulta [backend/SUPABASE_SETUP.md](backend/SUPABASE_SETUP.md)

## Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Vista previa del build

## Diseño

- Mobile-first
- Colores institucionales UNMSM (#1a365d, #2c5282)
- Tailwind CSS
- PWA con manifest y Service Worker
