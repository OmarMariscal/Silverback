// frontend/src/types/subactividades-api.ts
// Este archivo contiene las definiciones de tipos TypeScript para la comunicación con la API (Backend NestJS)
// del módulo de Envío de Subactividades, Buzón de Evidencias (S3) e Histórico de Versiones (Sprint: Módulo del Contralor).
// En palabras sencillas: Define los contratos de datos (DTOs de petición y respuesta) tal como viajan a través de HTTP
// entre el backend y el frontend para la entrega de evidencias, pre-firmas de S3 y consulta inmutable de versiones.

// ==========================================
// 1. ENUMS Y TIPOS BASE DE LA API
// ==========================================

/**
 * Estado dictaminado por la Jefatura para una entrega/versión específica.
 * Refleja el enum EstadoDictamen de Prisma.
 */
export type EstadoDictamenAPI =
  | 'EN_REVISION'
  | 'DEVUELTA_CON_OBSERVACIONES'
  | 'APROBADA';

/**
 * Nivel de solvencia otorgado por la Jefatura a cada observación individual.
 * Refleja el enum EstadoSolvencia de Prisma.
 */
export type EstadoSolvenciaAPI =
  | 'PENDIENTE'
  | 'NO_SOLVENTADA'
  | 'PARCIALMENTE_SOLVENTADA'
  | 'SOLVENTADA';

/**
 * Estado operativo global de la subactividad (controla el ciclo general y dashboard).
 */
export type EstadoSubActividadAPI =
  | 'EN_PROGRESO'
  | 'EN_REVISION'
  | 'DEVUELTA'
  | 'AUTORIZADA'
  | 'CONCLUIDA';

/**
 * Estado de ciclo de vida del archivo de evidencia dentro del buzón.
 */
export type EstadoArchivoAPI = 'PENDIENTE' | 'BORRADOR' | 'ENVIADO';

// =========================================================================
// 2. ENDPOINT: GET /api/v1/sub-actividades/:subActividadId/vista-entrega
// =========================================================================

export interface MetaCabeceraSubActividadDto {
  folio: string; // Ej: "05.1"
  titulo: string; // Ej: "Verificación de reportes de asistencia..."
  centro_clave: string; // Ej: "CUCEI"
  version_actual: number; // Ej: 3
  etiqueta_semaforo: string; // Ej: "Próximo a Vencer", "A tiempo", etc.
  permite_entrega: boolean; // True si el estado permite subir y enviar (EN_PROGRESO o DEVUELTA)
}

export interface ObservacionActivaDto {
  id: string; // UUID de la observación
  correlativo: string; // Ej: "Observación #2"
  estado: EstadoSolvenciaAPI; // "NO_SOLVENTADA" | "PARCIALMENTE_SOLVENTADA" | ...
  descripcion: string; // Detalle emitido por la Jefatura
}

export interface DetallesOperacionSubActividadDto {
  estado_actual: EstadoSubActividadAPI; // "DEVUELTA" | "EN_PROGRESO" | ...
  periodo_ejecucion: {
    inicio: string; // ISO 8601, ej. "2026-01-15T00:00:00Z"
    fin: string; // ISO 8601, ej. "2026-02-15T00:00:00Z"
  };
  duracion_estimada_semanas: number; // Ej: 4
  cierre_global_poa: string; // ISO 8601, ej. "2026-12-31T00:00:00Z"
}

export interface EvidenciaBorradorDto {
  id: string; // UUID del archivo
  nombre_archivo: string; // Ej: "firmas_computacionales_corregido.pdf"
  peso_mb: number; // Ej: 2.4
  url_descarga: string; // URL directa o firmada de descarga
}

export interface BuzonBorradorDto {
  evidencias: EvidenciaBorradorDto[];
  comentarios_entrega: string | null; // Comentarios redactados por el contralor
}

export interface ItemHistorialResumenDto {
  id: string; // UUID de la entrega o versión
  estado_operativo: EstadoSubActividadAPI | EstadoDictamenAPI; // Ej: "DEVUELTA" | "EN_REVISION"
  etiqueta: string; // Ej: "Devuelto con Observaciones", "Enviado a Revisión (V2)"
  fecha: string; // ISO 8601
  es_version_actual: boolean;
  tiene_observaciones?: boolean;
  tiene_archivos_subidos?: boolean;
}

/**
 * Respuesta completa de GET /api/v1/sub-actividades/:subActividadId/vista-entrega
 */
export interface VistaEntregaSubActividadResponse {
  meta_cabecera: MetaCabeceraSubActividadDto;
  observaciones_activas: ObservacionActivaDto[];
  detalles_operacion: DetallesOperacionSubActividadDto;
  buzon_borrador: BuzonBorradorDto;
  historial_versiones: ItemHistorialResumenDto[];
}

// =========================================================================
// 3. ENDPOINTS DE CARGA DE ARCHIVOS A S3 / MINIO
// =========================================================================

/**
 * POST /api/v1/sub-actividades/:subActividadId/archivos/pre-firma
 * Solicitud de URL pre-firmada para subir un archivo directamente a S3
 */
export interface GenerarPreFirmaRequest {
  nombre_archivo: string; // Nombre original con extensión, ej: "reporte.pdf"
  mime_type: string; // MIME type exacto, ej: "application/pdf"
  peso_bytes: number; // Peso en bytes (Máximo 52,428,800 bytes = 50MB)
}

/**
 * Respuesta de POST /api/v1/sub-actividades/:subActividadId/archivos/pre-firma
 */
export interface GenerarPreFirmaResponse {
  archivo_id: string; // UUID asignado en backend para este archivo
  upload_url: string; // URL pre-firmada S3 (usar con PUT)
  metodo_http: 'PUT';
  expira_en_segundos: number; // Ej: 300
  headers_requeridos: Record<string, string>; // Ej: { "Content-Type": "application/pdf" }
}

/**
 * POST /api/v1/sub-actividades/:subActividadId/archivos/:archivoId/confirmar
 * Notificación al backend de que el PUT a S3 fue exitoso
 */
export interface ConfirmarArchivoResponse {
  id: string;
  nombre_original: string;
  peso_mb: number;
  url_descarga: string;
  estado_archivo: EstadoArchivoAPI;
  mensaje: string;
}

/**
 * DELETE /api/v1/sub-actividades/:subActividadId/archivos/:archivoId
 * Eliminación de un archivo de evidencia del buzón borrador
 */
export interface EliminarArchivoResponse {
  status: boolean;
  mensaje: string;
}

// =========================================================================
// 4. ENDPOINT: POST /api/v1/sub-actividades/:subActividadId/enviar-revision
// =========================================================================

export interface EnviarSubActividadRevisionRequest {
  evidencias_ids?: string[]; // IDs de archivos a incluir en esta entrega
  comentarios_entrega?: string; // Comentarios u observaciones del Contralor
}

export interface EnviarSubActividadRevisionResponse {
  id: string;
  estado_anterior: string; // Ej: "DEVUELTA" o "EN_PROGRESO"
  estado_nuevo: string; // Ej: "EN_REVISION"
  nueva_version: number; // Ej: 4
  fecha_envio: string; // ISO 8601
  mensaje: string;
}

// =========================================================================
// 5. ENDPOINTS DE HISTORIAL Y CONSULTA DE VERSIONES INMUTABLES
// =========================================================================

/**
 * Elemento de la lista de GET /api/v1/sub-actividades/:subActividadId/historial
 */
export interface VersionHistorialItemDto {
  id_version: string;
  numero_version: number;
  titulo_evento: string; // Ej: "Devuelto con Observaciones"
  estado: string; // "DEVUELTA" | "EN_REVISION" | "APROBADA"
  fecha_evento: string; // ISO 8601
}

export interface HistorialVersionesResponse {
  data: VersionHistorialItemDto[];
}

/**
 * Evidencia archivada en una versión histórica
 */
export interface EvidenciaVersionHistoricaDto {
  id: string;
  nombre: string;
  peso_formateado: string; // Ej: "1.4 MB"
  fecha_subida: string; // ISO 8601
}

/**
 * Observación emitida en una versión histórica
 */
export interface ObservacionVersionHistoricaDto {
  id: string;
  numero: number; // Ej: 1
  texto: string; // Contenido textual de la observación
}

/**
 * Respuesta de GET /api/v1/sub-actividades/:subActividadId/versiones/:versionId
 * Detalle completo inmutable de una entrega anterior
 */
export interface DetalleVersionHistoricaResponse {
  folio: string; // Ej: "05.1"
  centro_clave: string; // Ej: "CUCEI"
  titulo_subactividad: string;
  version_visualizada: number; // Ej: 2
  es_version_actual: boolean; // false
  fecha_envio_contralor: string; // ISO 8601
  mensaje_envio: string | null;
  evidencias: EvidenciaVersionHistoricaDto[];
  resolucion_estado: string; // Ej: "DEVUELTA", "APROBADA"
  fecha_dictamen: string | null; // ISO 8601
  observaciones: ObservacionVersionHistoricaDto[];
}

/**
 * GET /api/v1/sub-actividades/:subActividadId/versiones/:versionId/evidencias/:archivoId/link-descarga
 */
export interface LinkDescargaEvidenciaResponse {
  url_descarga_efimera: string; // URL firmada GET temporal para descargar desde S3
}

