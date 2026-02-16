# Mi Servicios - UNMSM

Plataforma SaaS para la gestión de servicios universitarios de la UNMSM (Universidad Nacional Mayor de San Marcos).

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

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Vista previa del build

## Diseño

- Mobile-first
- Colores institucionales UNMSM (#1a365d, #2c5282)
- Tailwind CSS
- PWA con manifest y Service Worker
