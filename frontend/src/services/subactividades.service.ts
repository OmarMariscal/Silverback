// frontend/src/services/subactividades.service.ts
// Este archivo contiene las llamadas HTTP (vía Axios) hacia los endpoints del backend para el módulo
// de entrega de subactividades, pre-firmas de S3, confirmación de evidencias e histórico de versiones.
// En palabras sencillas: Es el puente que conecta el frontend con el servidor de NestJS y con el almacenamiento S3.
// Incluye datos de prueba simulados (Mock Fallback) para que el frontend pueda maquetar y probar de inmediato
// aun cuando el backend se encuentre en desarrollo.

import axios from 'axios';
import { api } from './api';
import type {
  VistaEntregaSubActividadResponse,
  GenerarPreFirmaRequest,
  GenerarPreFirmaResponse,
  ConfirmarArchivoResponse,
  EliminarArchivoResponse,
  EnviarSubActividadRevisionRequest,
  EnviarSubActividadRevisionResponse,
  HistorialVersionesResponse,
  DetalleVersionHistoricaResponse,
  LinkDescargaEvidenciaResponse,
} from '@/types/subactividades-api';

// =========================================================================
// DATOS MOCK DE RESERVA (Basados en el Sprint Planning oficial)
// Permiten al frontend renderizar exactamente como el prototipo de Tailwind
// =========================================================================
const MOCK_VISTA_ENTREGA: VistaEntregaSubActividadResponse = {
  meta_cabecera: {
    folio: '05.1',
    titulo: 'Verificación de reportes de asistencia en formato físico y digital',
    centro_clave: 'CUCEI',
    version_actual: 3,
    etiqueta_semaforo: 'Próximo a Vencer',
    permite_entrega: true,
  },
  observaciones_activas: [
    {
      id: 'obs-uuid-1',
      correlativo: 'Observación #2',
      estado: 'NO_SOLVENTADA',
      descripcion:
        'No se adjuntaron las firmas físicas del departamento de Ciencias Computacionales. Las actas carecen de validez sin la firma del coordinador correspondiente.',
    },
    {
      id: 'obs-uuid-2',
      correlativo: 'Observación #3',
      estado: 'PARCIALMENTE_SOLVENTADA',
      descripcion:
        'Se subieron los documentos correctos, pero las fechas de corte en la pestaña 3 del Excel no coinciden con el calendario estipulado. Se requiere ajustar el rango al periodo enero-marzo.',
    },
  ],
  detalles_operacion: {
    estado_actual: 'DEVUELTA',
    periodo_ejecucion: {
      inicio: '2026-01-15T00:00:00Z',
      fin: '2026-02-15T00:00:00Z',
    },
    duracion_estimada_semanas: 4,
    cierre_global_poa: '2026-12-31T00:00:00Z',
  },
  buzon_borrador: {
    evidencias: [
      {
        id: 'archivo-uuid-1',
        nombre_archivo: 'firmas_computacionales_corregido.pdf',
        peso_mb: 2.4,
        url_descarga: '#',
      },
    ],
    comentarios_entrega:
      'Se adjuntan las firmas solicitadas en la observación 2 y se ajustó el excel de la observación 3.',
  },
  historial_versiones: [
    {
      id: 'hist-uuid-3',
      estado_operativo: 'DEVUELTA',
      etiqueta: 'Devuelto con Observaciones',
      fecha: '2026-10-14T16:30:00Z',
      es_version_actual: true,
      tiene_observaciones: true,
    },
    {
      id: 'hist-uuid-2',
      estado_operativo: 'EN_REVISION',
      etiqueta: 'Enviado a Revisión (V2)',
      fecha: '2026-10-12T09:15:00Z',
      es_version_actual: false,
      tiene_archivos_subidos: true,
    },
    {
      id: 'hist-uuid-1',
      estado_operativo: 'DEVUELTA',
      etiqueta: 'Devuelto con Observaciones (V1)',
      fecha: '2026-10-10T11:00:00Z',
      es_version_actual: false,
      tiene_observaciones: true,
    },
  ],
};

const MOCK_VERSION_HISTORICA_1: DetalleVersionHistoricaResponse = {
  folio: '05.1',
  centro_clave: 'CUCEI',
  titulo_subactividad: 'Verificación de reportes de asistencia en formato físico y digital',
  version_visualizada: 1,
  es_version_actual: false,
  fecha_envio_contralor: '2026-10-08T12:00:00Z',
  mensaje_envio:
    'Se adjuntan las actas constitutivas del departamento y los excels de asistencia correspondientes al primer trimestre.',
  evidencias: [
    {
      id: 'file-uuid-001',
      nombre: 'actas_departamentales_v1.pdf',
      peso_formateado: '1.2 MB',
      fecha_subida: '2026-10-08T11:55:00Z',
    },
    {
      id: 'file-uuid-002',
      nombre: 'asistencias_trimestre_1.xlsx',
      peso_formateado: '450 KB',
      fecha_subida: '2026-10-08T11:58:00Z',
    },
  ],
  resolucion_estado: 'DEVUELTA',
  fecha_dictamen: '2026-10-10T11:00:00Z',
  observaciones: [
    {
      id: 'obs-v1-1',
      numero: 1,
      texto: 'Falta incluir la portada institucional en las actas departamentales.',
    },
    {
      id: 'obs-v1-2',
      numero: 2,
      texto:
        'No se adjuntaron las firmas físicas del departamento de Ciencias Computacionales. Las actas carecen de validez sin la firma del coordinador correspondiente.',
    },
    {
      id: 'obs-v1-3',
      numero: 3,
      texto: 'Las fechas de corte en la pestaña 3 del Excel no coinciden con el calendario estipulado.',
    },
  ],
};

// =========================================================================
// SERVICIO DE SUBACTIVIDADES
// =========================================================================

export const subactividadesService = {
  /**
   * 1. GET /api/v1/sub-actividades/:subActividadId/vista-entrega
   * Obtiene la vista integral de la subactividad (cabecera, observaciones, periodo, evidencias en borrador e historial).
   */
  obtenerVistaEntrega: async (
    subActividadId: string,
  ): Promise<VistaEntregaSubActividadResponse> => {
    try {
      const response = await api.get<VistaEntregaSubActividadResponse>(
        `/sub-actividades/${subActividadId}/vista-entrega`,
      );
      return response.data;
    } catch (error) {
      console.warn(
        `[subactividadesService] API no disponible para /vista-entrega de ${subActividadId}. Usando mock de desarrollo.`,
        error,
      );
      return MOCK_VISTA_ENTREGA;
    }
  },

  /**
   * 2. POST /api/v1/sub-actividades/:subActividadId/archivos/pre-firma
   * Solicita al backend la URL firmada para subir el archivo directamente a S3/MinIO.
   */
  generarPreFirma: async (
    subActividadId: string,
    payload: GenerarPreFirmaRequest,
  ): Promise<GenerarPreFirmaResponse> => {
    try {
      const response = await api.post<GenerarPreFirmaResponse>(
        `/sub-actividades/${subActividadId}/archivos/pre-firma`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.warn(
        `[subactividadesService] API no disponible para /pre-firma. Generando pre-firma mock.`,
        error,
      );
      return {
        archivo_id: `mock-file-${Date.now()}`,
        upload_url: 'https://mock-s3-upload.local',
        metodo_http: 'PUT',
        expira_en_segundos: 300,
        headers_requeridos: {
          'Content-Type': payload.mime_type,
        },
      };
    }
  },

  /**
   * 3. SUBIDA DIRECTA A S3 CON PUT (Binario crudo, NO multipart/form-data)
   * Realiza la transmisión directa del archivo Blob/File hacia S3 reportando el progreso porcentual.
   */
  subirArchivoS3: async (
    uploadUrl: string,
    archivo: File,
    mimeType: string,
    onProgreso?: (porcentaje: number) => void,
  ): Promise<void> => {
    // Si estamos en modo mock local, simulamos el progreso sin enviar red real
    if (uploadUrl.includes('mock-s3-upload.local')) {
      for (let p = 10; p <= 100; p += 25) {
        await new Promise((res) => setTimeout(res, 80));
        onProgreso?.(p);
      }
      return;
    }

    // Petición real directa a AWS S3 / MinIO (sin pasar por NestJS)
    await axios.put(uploadUrl, archivo, {
      headers: {
        'Content-Type': mimeType,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgreso?.(pct);
        }
      },
    });
  },

  /**
   * 4. POST /api/v1/sub-actividades/:subActividadId/archivos/:archivoId/confirmar
   * Notifica a NestJS que el binario ya se encuentra en S3 para registrarlo en PostgreSQL como BORRADOR.
   */
  confirmarArchivo: async (
    subActividadId: string,
    archivoId: string,
  ): Promise<ConfirmarArchivoResponse> => {
    try {
      const response = await api.post<ConfirmarArchivoResponse>(
        `/sub-actividades/${subActividadId}/archivos/${archivoId}/confirmar`,
      );
      return response.data;
    } catch (error) {
      console.warn(
        `[subactividadesService] API no disponible para /confirmar. Simulando confirmación exitosa.`,
        error,
      );
      return {
        id: archivoId,
        nombre_original: 'archivo_subido.pdf',
        peso_mb: 1.5,
        url_descarga: '#',
        estado_archivo: 'BORRADOR',
        mensaje: 'Archivo consolidado correctamente en el buzón de evidencias (Mock).',
      };
    }
  },

  /**
   * 5. DELETE /api/v1/sub-actividades/:subActividadId/archivos/:archivoId
   * Elimina un archivo de evidencia del buzón borrador.
   */
  eliminarArchivo: async (
    subActividadId: string,
    archivoId: string,
  ): Promise<EliminarArchivoResponse> => {
    try {
      const response = await api.delete<EliminarArchivoResponse>(
        `/sub-actividades/${subActividadId}/archivos/${archivoId}`,
      );
      return response.data;
    } catch (error) {
      console.warn(
        `[subactividadesService] API no disponible para DELETE /archivos. Simulando eliminación exitosa.`,
        error,
      );
      return {
        status: true,
        mensaje: 'El archivo de evidencia fue eliminado correctamente del buzón.',
      };
    }
  },

  /**
   * 6. POST /api/v1/sub-actividades/:subActividadId/enviar-revision
   * Entrega formal de la subactividad a la Jefatura con los archivos y comentarios consolidados.
   */
  enviarRevision: async (
    subActividadId: string,
    payload: EnviarSubActividadRevisionRequest,
  ): Promise<EnviarSubActividadRevisionResponse> => {
    try {
      const response = await api.post<EnviarSubActividadRevisionResponse>(
        `/sub-actividades/${subActividadId}/enviar-revision`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.warn(
        `[subactividadesService] API no disponible para /enviar-revision. Simulando entrega exitosa.`,
        error,
      );
      return {
        id: subActividadId,
        estado_anterior: 'DEVUELTA',
        estado_nuevo: 'EN_REVISION',
        nueva_version: 4,
        fecha_envio: new Date().toISOString(),
        mensaje: 'La sub-actividad ha sido enviada exitosamente a la Jefatura para su revisión.',
      };
    }
  },

  /**
   * 7. GET /api/v1/sub-actividades/:subActividadId/historial
   * Consulta la lista cronológica de eventos y versiones de la subactividad.
   */
  obtenerHistorial: async (subActividadId: string): Promise<HistorialVersionesResponse> => {
    try {
      const response = await api.get<HistorialVersionesResponse>(
        `/sub-actividades/${subActividadId}/historial`,
      );
      return response.data;
    } catch (error) {
      console.warn(
        `[subactividadesService] API no disponible para /historial. Usando mock.`,
        error,
      );
      return {
        data: [
          {
            id_version: 'hist-uuid-3',
            numero_version: 3,
            titulo_evento: 'Devuelto con Observaciones',
            estado: 'DEVUELTA',
            fecha_evento: '2026-10-14T16:30:00Z',
          },
          {
            id_version: 'hist-uuid-2',
            numero_version: 2,
            titulo_evento: 'Enviado a Revisión (V2)',
            estado: 'EN_REVISION',
            fecha_evento: '2026-10-12T09:15:00Z',
          },
          {
            id_version: 'hist-uuid-1',
            numero_version: 1,
            titulo_evento: 'Devuelto con Observaciones (V1)',
            estado: 'DEVUELTA',
            fecha_evento: '2026-10-10T11:00:00Z',
          },
        ],
      };
    }
  },

  /**
   * 8. GET /api/v1/sub-actividades/:subActividadId/versiones/:versionId
   * Consulta el registro inmutable de una versión histórica de la subactividad.
   */
  obtenerDetalleVersionHistorica: async (
    subActividadId: string,
    versionId: string,
  ): Promise<DetalleVersionHistoricaResponse> => {
    try {
      const response = await api.get<DetalleVersionHistoricaResponse>(
        `/sub-actividades/${subActividadId}/versiones/${versionId}`,
      );
      return response.data;
    } catch (error) {
      console.warn(
        `[subactividadesService] API no disponible para /versiones/${versionId}. Usando mock de versión histórica.`,
        error,
      );
      return MOCK_VERSION_HISTORICA_1;
    }
  },

  /**
   * 9. GET /api/v1/sub-actividades/:subActividadId/versiones/:versionId/evidencias/:archivoId/link-descarga
   * Obtiene una URL firmada GET temporal para descargar un archivo de evidencia archivado en S3.
   */
  obtenerLinkDescargaEvidencia: async (
    subActividadId: string,
    versionId: string,
    archivoId: string,
  ): Promise<LinkDescargaEvidenciaResponse> => {
    try {
      const response = await api.get<LinkDescargaEvidenciaResponse>(
        `/sub-actividades/${subActividadId}/versiones/${versionId}/evidencias/${archivoId}/link-descarga`,
      );
      return response.data;
    } catch (error) {
      console.warn(
        `[subactividadesService] API no disponible para /link-descarga. Retornando enlace mock.`,
        error,
      );
      return {
        url_descarga_efimera: '#descarga-mock',
      };
    }
  },
};

