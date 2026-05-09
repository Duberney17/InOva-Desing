import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

/**
 * Wrapper sobre Supabase Storage.
 *
 * Variables de entorno necesarias:
 *   SUPABASE_URL          — URL del proyecto (https://xxxxx.supabase.co)
 *   SUPABASE_SERVICE_KEY  — service_role key (NO la anon key — la service salta RLS)
 *   SUPABASE_BUCKET       — nombre del bucket (ej: "ova-files")
 *
 * Por compatibilidad histórica el archivo se llama r2.service.ts y la clase
 * StorageService — la lógica es la misma, solo cambia el proveedor.
 */
@Injectable()
export class R2Service implements OnModuleInit {
  private supabase: SupabaseClient;
  private bucket = '';
  private readonly logger = new Logger(R2Service.name);

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    // trim() defensivo por si el .env tiene espacios al final/comillas raras
    let url = this.config.get<string>('SUPABASE_URL')?.trim().replace(/['"]/g, '');
    const serviceKey = this.config
      .get<string>('SUPABASE_SERVICE_KEY')
      ?.trim()
      .replace(/['"]/g, '');
    this.bucket = (this.config.get<string>('SUPABASE_BUCKET') ?? '')
      .trim()
      .replace(/['"]/g, '');

    if (!url || !serviceKey || !this.bucket) {
      this.logger.warn(
        'Supabase Storage no está configurado. Define SUPABASE_URL, SUPABASE_SERVICE_KEY y SUPABASE_BUCKET en .env',
      );
      return;
    }

    // Quitar slash final si lo hay
    url = url.replace(/\/+$/, '');

    // Validar formato de URL: debe ser https://xxx.supabase.co (sin path)
    const urlValid = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url);
    if (!urlValid) {
      this.logger.error(
        `❌ SUPABASE_URL no tiene el formato correcto. Esperado: https://xxxxx.supabase.co · Recibido: "${url}"`,
      );
    }

    // Validar formato de la key
    const isNewKey = serviceKey.startsWith('sb_secret_');
    const isLegacyKey = serviceKey.startsWith('eyJ');
    if (!isNewKey && !isLegacyKey) {
      this.logger.error(
        `❌ SUPABASE_SERVICE_KEY no parece válida. Debe empezar con "sb_secret_" (nuevo sistema) o "eyJ" (legacy JWT). Recibido: "${serviceKey.slice(0, 15)}..."`,
      );
    }

    this.supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    this.logger.log(
      `Supabase Storage init · bucket="${this.bucket}" · url=${url} · keyType=${isNewKey ? 'sb_secret' : isLegacyKey ? 'legacy_jwt' : 'desconocida'}`,
    );

    // ── PRUEBA DE CONEXIÓN ──
    // Intentamos listar los buckets. Si falla aquí, NO es el path: es auth/config.
    try {
      const { data: buckets, error } = await this.supabase.storage.listBuckets();
      if (error) {
        this.logger.error(`❌ No pudimos listar buckets: ${error.message}`);
        return;
      }
      const names = (buckets ?? []).map((b) => b.name);
      this.logger.log(`Buckets visibles en Supabase: [${names.join(', ')}]`);
      if (!names.includes(this.bucket)) {
        this.logger.error(
          `❌ El bucket "${this.bucket}" NO existe en Supabase. Buckets disponibles: ${names.join(', ') || '(ninguno)'}`,
        );
      } else {
        this.logger.log(`✅ Bucket "${this.bucket}" encontrado y accesible`);
      }
    } catch (err) {
      this.logger.error(`❌ Error probando conexión: ${(err as Error).message}`);
    }
  }

  /** Tira un error claro si las vars no están seteadas */
  private assertConfigured() {
    if (!this.supabase || !this.bucket) {
      throw new InternalServerErrorException(
        'Supabase Storage no está configurado. Define SUPABASE_URL, SUPABASE_SERVICE_KEY y SUPABASE_BUCKET en el archivo .env y reinicia el servidor. Guía: docs/SUPABASE_STORAGE_SETUP.md',
      );
    }
  }

  /**
   * Sube un archivo a Supabase Storage y devuelve la metadata para guardar en Mongo.
   *
   * @param folder ruta lógica dentro del bucket (ej: "ova/<id>/analisis")
   * @param file objeto Multer (buffer + originalname + mimetype)
   */
  async uploadFile(
    folder: string,
    file: { originalname: string; mimetype: string; buffer: Buffer; size: number },
  ): Promise<{ storageKey: string; url: string }> {
    this.assertConfigured();

    // Limpiamos el nombre original para que sea seguro como segmento de URL.
    // Supabase exige ASCII + algunos especiales; quitamos acentos, ñ, espacios.
    const safeName =
      file.originalname
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // strip diacríticos
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.\-_]/g, '')
        .slice(0, 80) || 'archivo';

    // Sanitizamos también el folder por si el idOVA tuviera algo raro
    const safeFolder = folder
      .split('/')
      .map((seg) => seg.replace(/[^a-zA-Z0-9_-]/g, ''))
      .filter(Boolean)
      .join('/');

    const storageKey = `${safeFolder}/${randomUUID()}-${safeName}`;

    this.logger.log(`[R2] Subiendo · bucket="${this.bucket}" · key="${storageKey}" · mime=${file.mimetype} · size=${file.size}`);

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(storageKey, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      this.logger.error(
        `[R2] Falló upload · bucket="${this.bucket}" · key="${storageKey}" · error=${error.message}`,
      );
      throw new InternalServerErrorException(
        `No se pudo subir el archivo: ${error.message}`,
      );
    }

    // URL pública (el bucket debe estar en modo público)
    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(storageKey);

    return { storageKey, url: data.publicUrl };
  }

  /**
   * Borra un archivo por su key.
   * No falla si el archivo ya no existe.
   */
  async deleteFile(storageKey: string): Promise<void> {
    this.assertConfigured();
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([storageKey]);
    if (error) {
      this.logger.warn(`No se pudo borrar ${storageKey}: ${error.message}`);
    }
  }
}
