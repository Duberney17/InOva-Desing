# ANALISIS.md — Estado del proyecto inOvaDesign Server

## ¿Qué es este proyecto?

Es el **backend de una plataforma para crear OVAs** (Objetos Virtuales de Aprendizaje) llamada **inOvaDesign**. Está construido con NestJS + MongoDB Atlas y sigue el modelo pedagógico **ADDIE** para estructurar el ciclo de vida de un OVA.

---

## Estructura del dominio

```
OVA (objeto central)
 ├── Fases ADDIE
 │    ├── analysis-phase    → problema, objetivos, contexto
 │    ├── design-phase      → diseño instruccional
 │    ├── development-phase → desarrollo de contenido
 │    ├── implentation-phase → despliegue  ⚠️ typo en el nombre
 │    └── evaluation-phase  → evaluación
 │
 ├── Recursos
 │    ├── resource-ova      → archivos multimedia ligados al OVA
 │    └── lom-metadata      → metadatos estándar LOM
 │
 ├── Evaluación / Formularios
 │    ├── form              → formulario ligado a una fase
 │    ├── question          → pregunta dentro del formulario
 │    └── answer            → respuesta de un usuario a una pregunta
 │
 ├── Usuarios
 │    ├── users             → cuentas con roles (rol: string[])
 │    ├── user-progress     → progreso por OVA y fase (%)
 │    └── instructor-eval   → evaluación del instructor sobre el OVA
 │
 └── Empaquetado SCORM
      ├── scorm-package     → paquete ZIP exportable
      ├── scorm-manifest    → imsmanifest.xml
      ├── scorm-organization → organización del contenido
      ├── sco               → Sharable Content Object
      └── scorm-resource    → recurso dentro del SCO
```

---

## ¿Qué está funcionando bien?

- **Todos los módulos tienen CRUD completo** (POST, GET, GET/:id, PATCH/:id, DELETE/:id) implementado y conectado a MongoDB Atlas.
- **Swagger está configurado** en `/api` — puedes probar todos los endpoints sin frontend.
- La **base de datos está conectada** y activa (MongoDB Atlas).
- El **modelo de datos es coherente**: todas las relaciones entre documentos usan campos `idOVA`, `idUser`, `idForm`, etc. (referencias manuales por string).

---

## ¿Qué NO está listo aún?

### Críticos (bloquean el frontend)

| Problema | Detalle |
|---|---|
| **DTOs vacíos** | `CreateOvaDto`, `CreateAnalysisPhaseDto`, etc. están vacíos. El backend acepta cualquier JSON sin validación. El frontend no tiene contrato claro de qué campos enviar. |
| **Sin autenticación** | No hay JWT, guards, ni login. Cualquiera puede hacer CRUD sobre cualquier recurso. |
| **Sin CORS configurado** | `main.ts` no tiene `app.enableCors()`. El frontend (en otro puerto/dominio) recibirá bloqueos de CORS. |
| **Conexión MongoDB hardcodeada** | Las credenciales de la BD están en texto plano en `app.module.ts`. Riesgo de seguridad si sube a un repositorio público. |

### Importantes (afectan calidad)

| Problema | Detalle |
|---|---|
| **No hay filtros por OVA** | `findAll()` en todos los módulos devuelve **todos** los registros de la BD. El frontend necesita consultas como `GET /analysis-phase?idOVA=xxx`. |
| **Swagger sin decoradores** | Los controladores no tienen `@ApiTags`, `@ApiBody`, `@ApiResponse`, etc. El Swagger generado está casi vacío — no sirve como documentación real. |
| **`entities/` vacías** | Las clases entity son placeholders vacíos, nunca se usan. |
| **Typo en módulo** | `implentation-phase` debería ser `implementation-phase` — conviene corregirlo antes de que el frontend lo codifique. |

---

## Recomendación — Pasos antes del frontend

**El backend no está listo para frontend todavía**, pero le faltan pasos cortos. El orden sugerido:

1. **Llenar los DTOs** con los campos de cada schema (los schemas ya están bien definidos).
2. **Habilitar CORS** en `main.ts` (`app.enableCors()`).
3. **Agregar filtros por `idOVA`** en los `findAll()` de las fases y recursos.
4. **Autenticación básica** (JWT con `@nestjs/passport`) — al menos login y protección de rutas.
5. **Mover la cadena de MongoDB a `.env`** con `@nestjs/config`.

Con esos 5 pasos el backend estará suficientemente sólido para construir el frontend en paralelo.
