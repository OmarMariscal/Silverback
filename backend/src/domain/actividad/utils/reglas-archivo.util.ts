import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';
import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';
import { ConstruirObjectKeyEvidenciaParams } from '../interfaces/construir-object-key-evidencia-params.interface';

export const MAX_PESO_ARCHIVO_BYTES = 52428800; // 50 MB (50 * 1024 * 1024)
const LONGITUD_PREFIJO_VERSION = 2;

export const MIME_TYPES_PERMITIDOS: ReadonlyMap<string, string[]> = new Map([
  ['application/pdf', ['.pdf']],
  ['application/msword', ['.doc']],
  [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ['.docx'],
  ],
  ['application/vnd.ms-excel', ['.xls']],
  [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ['.xlsx'],
  ],
  ['application/vnd.ms-powerpoint', ['.ppt']],
  [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ['.pptx'],
  ],
  ['application/zip', ['.zip']],
  ['application/x-zip-compressed', ['.zip']],
]);

/**
 * Sanitiza el nombre del archivo eliminando tildes, eñes y caracteres especiales
 * para garantizar su lectura futura (Content-Disposition) sin errores de codificación.
 */
export function sanitizarNombreArchivo(nombreOriginal: string): string {
  const limpio = nombreOriginal.trim();
  if (!limpio) {
    throw new ReglaNegocioException(
      'El nombre del archivo no puede estar vacío.',
      CodigoDeViolacion.ARCHIVO_INVALIDO,
    );
  }

  const ultimoPunto = limpio.lastIndexOf('.');
  const tieneExtension = ultimoPunto > 0 && ultimoPunto < limpio.length - 1;

  const baseRaw = tieneExtension ? limpio.slice(0, ultimoPunto) : limpio;
  const extensionRaw = tieneExtension ? limpio.slice(ultimoPunto) : '';

  const baseSanitizada = baseRaw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (áéíóú, ñ -> aeiou, n)
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Reemplaza espacios y símbolos por guion bajo
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  const extensionSanitizada = extensionRaw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^.a-z0-9]/g, '');

  const nombreBaseFinal =
    baseSanitizada.length > 0 ? baseSanitizada : 'archivo';

  return `${nombreBaseFinal}${extensionSanitizada}`;
}

/**
 * Valida peso (1 byte a 50MB) y lista blanca estricta de formatos MIME + extensión.
 */
export function validarMetadatosArchivo(
  nombreOriginal: string,
  mimeType: string,
  pesoBytes: number,
): void {
  if (!Number.isFinite(pesoBytes) || pesoBytes <= 0) {
    throw new ReglaNegocioException(
      'El peso del archivo debe ser mayor a 0 bytes.',
      CodigoDeViolacion.ARCHIVO_INVALIDO,
    );
  }

  if (pesoBytes > MAX_PESO_ARCHIVO_BYTES) {
    throw new ReglaNegocioException(
      `El archivo excede el límite máximo permitido de 50MB (${MAX_PESO_ARCHIVO_BYTES} bytes).`,
      CodigoDeViolacion.ARCHIVO_INVALIDO,
    );
  }

  const mimeNormalizado = mimeType.trim().toLowerCase();
  const extensionesValidas = MIME_TYPES_PERMITIDOS.get(mimeNormalizado);

  if (!extensionesValidas) {
    throw new ReglaNegocioException(
      `El formato MIME '${mimeType}' no está autorizado. Solo se soportan archivos PDF, Word, DOCX, Excel, PPTX y ZIP.`,
      CodigoDeViolacion.ARCHIVO_INVALIDO,
    );
  }

  const nombreSanitizado = sanitizarNombreArchivo(nombreOriginal).toLowerCase();
  const coincideExtension = extensionesValidas.some((ext) =>
    nombreSanitizado.endsWith(ext),
  );

  if (!coincideExtension) {
    throw new ReglaNegocioException(
      `La extensión del archivo '${nombreOriginal}' no coincide con el tipo MIME declarado (${mimeType}).`,
      CodigoDeViolacion.ARCHIVO_INVALIDO,
    );
  }
}

/**
 * Sanitiza un segmento de ruta S3 (ej. clave de centro universitario) evitando
 * separadores de carpeta ('/'), tildes o caracteres inválidos.
 */
export function sanitizarSegmentoRuta(
  segmento: string,
  fallback: string,
): string {
  const limpio = segmento
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return limpio.length > 0 ? limpio : fallback;
}

/**
 * Formatea el número de versión con zero-padding (v01, v02, ..., v10) para
 * mantener orden lexicográfico consistente en consolas S3 y SeaweedFS.
 */
export function formatearPrefijoVersion(version: number): string {
  if (!Number.isInteger(version) || version < 1) {
    throw new ReglaNegocioException(
      `El número de versión de entrega debe ser un entero positivo (recibido: ${version}).`,
      CodigoDeViolacion.DATOS_INSUFICIENTES,
    );
  }

  return `v${String(version).padStart(LONGITUD_PREFIJO_VERSION, '0')}`;
}

/**
 * Construye de forma determinista e inmutable la llave de almacenamiento (objectKey)
 * pre-asignada a la versión destino de la entrega.
 */
export function construirObjectKeyEvidencia(
  params: ConstruirObjectKeyEvidenciaParams,
): string {
  if (!Number.isInteger(params.anioFiscal) || params.anioFiscal < 2000) {
    throw new ReglaNegocioException(
      `El año fiscal para la ruta de almacenamiento es inválido (${params.anioFiscal}).`,
      CodigoDeViolacion.FECHA_INVALIDA,
    );
  }

  const subActividadId = params.subActividadId.trim();
  const archivoId = params.archivoId.trim();
  const nombreSanitizado = params.nombreSanitizado.trim();

  if (!subActividadId || !archivoId || !nombreSanitizado) {
    throw new ReglaNegocioException(
      'Faltan identificadores obligatorios para construir la ruta del archivo en el almacenamiento.',
      CodigoDeViolacion.DATOS_INSUFICIENTES,
    );
  }

  const claveCentro = sanitizarSegmentoRuta(params.centroClave, 'general');
  const prefijoVersion = formatearPrefijoVersion(params.versionDestino);

  return `${claveCentro}/${params.anioFiscal}/subactividades/${subActividadId}/${prefijoVersion}/${archivoId}-${nombreSanitizado}`;
}
