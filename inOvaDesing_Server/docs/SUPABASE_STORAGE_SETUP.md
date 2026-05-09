# Configurar Supabase Storage para InOva Design

Supabase Storage es el almacenamiento de archivos de Supabase (S3-style con su API). El **free tier** da 1 GB de storage + 2 GB de bandwidth/mes y **NO pide tarjeta de crédito** para registrarse.

## 1. Crear cuenta y proyecto

1. Entra a **https://supabase.com** y haz click en *Start your project*.
2. Regístrate con GitHub o correo. **No piden tarjeta**.
3. **New Project**:
   - **Name**: `inova-design`
   - **Database Password**: cualquiera fuerte (la guarda él)
   - **Region**: la más cercana (ej: `South America (São Paulo)`)
   - Plan: **Free**
4. Click *Create new project*. Espera ~2 minutos (te muestra "Setting up project").

## 2. Crear el bucket

1. En el menú lateral del proyecto: **Storage**.
2. **New bucket**:
   - **Name**: `ova-files`
   - **Public bucket**: ✅ **MÁRCALO** (sin esto las URLs no son accesibles desde el navegador)
   - File size limit: deja el default (50 MB es plenty)
3. Click *Save*.

## 3. Sacar las credenciales

1. En el menú lateral: **Project Settings** (engranaje abajo).
2. Sub-menú: **API**.
3. Verás dos cosas que necesitas:
   - **Project URL** (algo como `https://xxxxxxxxxxxx.supabase.co`) → copia a `SUPABASE_URL`
   - **Project API keys** → busca `service_role` (NO `anon`) → click en el ojito para mostrar → copia el `eyJhbGciOi...` largo a `SUPABASE_SERVICE_KEY`

> ⚠️ **NUNCA expongas la `service_role` key en el frontend**. Es una llave maestra que salta todas las políticas. Solo va en el backend (`.env` del server).

## 4. Pegarlo en `.env`

Edita `inOvaDesing_Server/.env` y agrega:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOi...tu-key-completa
SUPABASE_BUCKET=ova-files
```

## 5. Reinstalar deps + reiniciar

```bash
cd inOvaDesing_Server
npm install            # instala @supabase/supabase-js
npm run start:dev      # NestJS lee el .env solo al arrancar
```

## 6. Probar

Logueado como estudiante en el frontend → entra a una fase → "Subir archivo" → arrastra un PDF o imagen → debe aparecer en la lista con preview/link.

## Costos reales para tu caso

- **Free tier**: 1 GB almacenamiento + 2 GB de bandwidth de descarga/mes.
- Una clase de 30 estudiantes con 10 archivos × 2 MB = ~600 MB. **Cabe.**
- Si superas el free tier: $0.021/GB extra de storage, $0.09/GB extra bandwidth (similar a S3).

## ⚠️ El "auto-pause"

Si el proyecto NO se usa por **7 días**, Supabase lo pausa automáticamente. Para reactivarlo: entras al dashboard y click *Restore*. Tarda 1-2 min. Es un truquillo molesto pero vivible para una demo.

## Si decides migrar después

Como el bucket es S3-compatible, el día que crezcas puedes migrar a R2 / S3 / Backblaze cambiando solo `r2.service.ts`. La firma `uploadFile` / `deleteFile` queda igual.
