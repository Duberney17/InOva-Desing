# Configurar Cloudflare R2 para InOva Design

R2 es el servicio de almacenamiento S3-compatible de Cloudflare. Cuesta **$0/mes** hasta 10 GB y **0 USD de egreso** (a diferencia de S3, que cobra por descarga).

## 1. Crear cuenta y bucket

1. Crea cuenta gratis en https://dash.cloudflare.com
2. En el menú lateral: **R2 Object Storage → Create bucket**
3. Nombre sugerido: `inova-design`. Región: **Automatic**.
4. Click **Create bucket**.

## 2. Activar acceso público (URL para servir archivos)

Sin esto, las URLs no funcionan desde el navegador.

1. Entra al bucket → tab **Settings**
2. Sección **Public access** → en **R2.dev subdomain** click **Allow access**
3. Copia la URL pública que te da. Algo como:
   ```
   https://pub-1a2b3c4d5e6f7g8h.r2.dev
   ```
   Esta va en `R2_PUBLIC_URL` del `.env`.

> En producción real querrías un dominio custom (`files.tudominio.com`). Para MVP la URL `pub-xxxxx.r2.dev` está perfecta.

## 3. Generar credenciales (Access Key + Secret)

1. En la página principal de R2: **Manage R2 API Tokens** (botón arriba a la derecha)
2. Click **Create API token**
3. Configuración:
   - **Token name**: `inova-design-backend`
   - **Permissions**: **Object Read & Write**
   - **Specify bucket**: marca solo `inova-design`
   - **TTL**: deja en blanco (sin expiración)
4. Click **Create API Token**.
5. **¡COPIA INMEDIATAMENTE LAS DOS CLAVES!** Cloudflare las muestra una sola vez:
   - **Access Key ID** → va en `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → va en `R2_SECRET_ACCESS_KEY`

## 4. Tu Account ID

1. En el dashboard de Cloudflare, columna derecha verás **Account ID** (32 chars hex).
2. Copia → va en `R2_ACCOUNT_ID`.

## 5. Pegarlo todo en `.env`

```env
R2_ACCOUNT_ID=1a2b3c4d5e6f7890abcdef1234567890
R2_ACCESS_KEY_ID=tu-access-key-id
R2_SECRET_ACCESS_KEY=tu-secret-access-key-largo
R2_BUCKET_NAME=inova-design
R2_PUBLIC_URL=https://pub-1a2b3c4d5e6f7g8h.r2.dev
```

## 6. Instalar la dependencia y reiniciar

En la carpeta del backend:
```bash
npm install
npm run start:dev
```

## 7. Probar

Logueado como estudiante, abre cualquier fase de un OVA. Abajo verás "Archivos de esta fase" con el botón para subir. El archivo aparece con preview (si es imagen) o ícono. Click en el nombre lo abre en una pestaña nueva.

## Costos reales

- **Almacenamiento**: $0.015/GB-mes después de 10 GB free.
- **Operaciones**: 1M Class A (PUT/POST/DELETE) y 10M Class B (GET) gratis al mes.
- **Egreso**: **$0**, sin importar cuánto descarguen.

Para una app educativa con 100 estudiantes y 50 MB cada uno = 5 GB → **$0/mes**.

## Seguridad — siguiente paso (no incluido en MVP)

El bucket actualmente es público: cualquiera con la URL exacta puede ver el archivo. Las URLs son impredecibles (UUID), pero NO es seguridad real.

Para mayor seguridad, en lugar de URLs públicas se generan **signed URLs** con expiración (5 minutos), y el bucket queda privado. Es ~10 líneas adicionales en `R2Service` cuando lo necesites.
