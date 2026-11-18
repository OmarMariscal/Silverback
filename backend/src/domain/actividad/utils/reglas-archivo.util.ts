import { CodigoDeViolacion } from '@domain/codigos/codigo-violado.enum';
import { ReglaNegocioException } from '@domain/excepciones/regla-negocio.exception';

export const MAX_PESO_ARCHIVO_BYTES = 52428800; // 50 MB (50 * 1024 * 1024)

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
