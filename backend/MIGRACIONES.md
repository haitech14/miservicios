# Guía de Migraciones de Base de Datos

Esta guía te ayudará a conectar con Supabase y crear todas las tablas necesarias para HaiCommunity.

## Paso 1: Configurar Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta o inicia sesión
2. Crea un nuevo proyecto
3. Anota tu **Project URL** y **API Keys**

## Paso 2: Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase API (para storage y funciones)
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Server Configuration
PORT=3001
HOST=0.0.0.0
```

**Nota:** Reemplaza `[YOUR-PASSWORD]` y `[YOUR-PROJECT-REF]` con tus valores reales.

## Paso 3: Instalar dependencias

```bash
cd backend
npm install
```

## Paso 4: Generar cliente de Prisma

```bash
npm run db:generate
```

## Paso 5: Aplicar migraciones a Supabase

Tienes dos opciones:

### Opción A: Usar `db:push` (recomendado para desarrollo)

```bash
npm run db:push
```

Esto sincronizará el schema directamente con la base de datos.

### Opción B: Crear migración formal (recomendado para producción)

```bash
npm run db:migrate
```

Esto creará una migración formal que puedes versionar y aplicar en diferentes entornos.

## Paso 6: Poblar datos iniciales (opcional)

```bash
npm run db:seed
```

Esto creará las verticales y módulos base en la base de datos.

## Tablas creadas

El schema incluye las siguientes tablas:

### Tablas base:
- `Vertical` - Verticales de producto (HaiEduCore, HaiCommunity, etc.)
- `Modulo` - Módulos disponibles por vertical
- `Organization` - Organizaciones/comunidades
- `OrgConfig` - Configuración de módulos por organización
- `User` - Usuarios del sistema

### Tablas de gamificación:
- `UserScore` - Puntuación total y nivel del usuario
- `ServiceScore` - Puntuación por servicio
- `Achievement` - Logros/insignias disponibles
- `UserAchievement` - Logros desbloqueados por usuario
- `DailyReward` - Configuración de premios diarios
- `UserDailyReward` - Premios reclamados por usuario

### Tablas de comunidad (HaiCommunity):
- `Socio` - Socios de la comunidad
- `Cuota` - Cuotas y aportes
- `Evento` - Eventos de la comunidad
- `Comunicacion` - Comunicaciones masivas
- `Voluntario` - Voluntarios
- `Donacion` - Donaciones
- `Proyecto` - Proyectos sociales
- `Votacion` - Votaciones digitales
- `OpcionVotacion` - Opciones de votación
- `Voto` - Votos emitidos

## Personalización automática por dominio

El sistema detecta automáticamente la organización basándose en el dominio del email al iniciar sesión:

1. Al hacer login, se extrae el dominio del email (ej: `@unmsm.edu.pe`)
2. Se busca una organización con ese dominio en `Organization.dominioEmail`
3. Si se encuentra, se aplica automáticamente:
   - Logo de la organización
   - Imagen de portada
   - Colores primarios y secundarios
   - Configuración de módulos

**Para configurar una organización con dominio:**
- Al crear la organización, establece el campo `dominioEmail` con el dominio (ej: `unmsm.edu.pe`)
- Sube el `logoUrl` y `portadaUrl` de la organización
- Configura los `primaryColor` y `secondaryColor`

## Solución de problemas

### Error de conexión
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que tu IP esté permitida en Supabase (Settings > Database > Connection Pooling)

### Error en migraciones
- Usa `DIRECT_URL` para migraciones, no `DATABASE_URL`
- Verifica que tengas permisos de administrador en la base de datos
- Si hay conflictos, puedes resetear la base de datos (solo en desarrollo):
  ```bash
  npx prisma migrate reset
  ```

### Error de tipos TypeScript
- Ejecuta `npm run db:generate` después de cambiar el schema
- Reinicia el servidor TypeScript si es necesario
