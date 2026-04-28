/**
 * Lectura tipada de variables de entorno.
 *
 * En Vite, todas las variables expuestas al cliente DEBEN empezar con VITE_.
 * Ej: VITE_API_URL=http://localhost:3001 en .env.local
 *
 * Este wrapper tiene dos beneficios:
 *  1. Centraliza los defaults (si la variable no existe, fallback razonable).
 *  2. Te avisa con un type error si intentas usar una variable que no existe.
 */
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export const env = {
  apiUrl,
} as const
