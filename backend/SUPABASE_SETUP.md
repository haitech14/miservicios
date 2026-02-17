# Configuración de Supabase

Esta guía te ayudará a conectar tu aplicación con Supabase.

## Paso 1: Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta o inicia sesión
2. Crea un nuevo proyecto
3. Anota tu **Project URL** y **API Keys**

## Paso 2: Obtener las credenciales de conexión

1. En el dashboard de Supabase, ve a **Settings** > **Database**
2. Busca la sección **Connection string**
3. Selecciona **URI** y copia la cadena de conexión
4. Reemplaza `[YOUR-PASSWORD]` con la contraseña de tu base de datos

## Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase API (opcional, para usar funciones de Supabase)
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Server Configuration
PORT=3001
HOST=0.0.0.0
```

### Explicación de las variables:

- **DATABASE_URL**: URL de conexión con connection pooling (usar para Prisma)
- **DIRECT_URL**: URL de conexión directa (necesaria para migraciones)
- **SUPABASE_URL**: URL de tu proyecto Supabase
- **SUPABASE_ANON_KEY**: Clave pública (segura para usar en frontend)
- **SUPABASE_SERVICE_ROLE_KEY**: Clave de servicio (solo backend, acceso completo)

## Paso 4: Ejecutar migraciones

Una vez configurado el `.env`, ejecuta:

```bash
# Generar el cliente de Prisma
npm run db:generate

# Aplicar el schema a la base de datos
npm run db:push

# O crear una migración
npm run db:migrate
```

## Paso 5: (Opcional) Poblar datos iniciales

```bash
npm run db:seed
```

## Notas importantes

- **DATABASE_URL** usa `pgbouncer=true` para connection pooling (recomendado para Prisma)
- **DIRECT_URL** es necesaria para operaciones como migraciones que requieren conexión directa
- Nunca compartas tu **SUPABASE_SERVICE_ROLE_KEY** públicamente
- El archivo `.env` debe estar en `.gitignore` (no subirlo a git)

## Solución de problemas

### Error de conexión
- Verifica que las credenciales sean correctas
- Asegúrate de que tu IP esté permitida en Supabase (Settings > Database > Connection Pooling)

### Error en migraciones
- Usa `DIRECT_URL` para migraciones, no `DATABASE_URL`
- Verifica que tengas permisos de administrador en la base de datos
