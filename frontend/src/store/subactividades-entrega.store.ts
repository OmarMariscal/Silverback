// frontend/src/store/subactividades-entrega.store.ts
// Este archivo contiene el estado global de Zustand para la pantalla de Envío de Subactividades,
// Carga de Evidencias a S3 e Histórico de Versiones (Sprint: Módulo del Contralor).
// En palabras sencillas: Es el cerebro reactivo de la pantalla. Maneja la lista de archivos que se suben,
// las barras de progreso, las validaciones de peso/formato, los comentarios y la navegación por el historial.
// Sigue estrictamente la arquitectura del proyecto:
// Backend -> services/api.ts -> services/*.service.ts -> services/*.adapter.ts -> store/*.store.ts

import { create } from 'zustand';
import { subactividadesService } from '@/services/subactividades.service';
import {
  validarArchivoCarga,
  sanitizarNombreArchivo,
  adaptarCabeceraSubActividadUI,
  adaptarObservacionesActivasUI,
  adaptarDetallesOperacionUI,
  adaptarEvidenciasBorradorUI,
  determinarModoBuzonUI,
  adaptarHistorialVersionesUI,
  adaptarDetalleVersionHistoricaUI,
} from '@/services/subactividades.adapter';
import type {
  VistaEntregaSubActividadResponse,
  DetalleVersionHistoricaResponse,
} from '@/types/subactividades-api';
import type {
  CabeceraSubActividadProps,
  DetallesOperacionUI,
  ObservacionActivaUI,
  ArchivoEvidenciaUI,
  ModoBuzonEvidencias,
  NodoLineaTiempoHistorialUI,
  PanelVersionHistoricaDetalleProps,
  SubActividadEntregaViewModel,
} from '@/types/subactividades-contratos';

interface SubActividadesEntregaState {
  // --- A. IDENTIFICADOR Y ESTADOS ADAPTADOS A CONTRATOS UI ---
  subActividadId: string | null;
  vistaRaw: VistaEntregaSubActividadResponse | null; // Guardado de referencia para re-cálculos locales

  // Contratos de UI guardados directamente en el Store
  cabecera: CabeceraSubActividadProps | null;
  detallesOperacion: DetallesOperacionUI | null;
  observacionesActivas: ObservacionActivaUI[];
  archivosEnBuzon: ArchivoEvidenciaUI[];
  comentariosEntrega: string;
  modoBuzon: ModoBuzonEvidencias;
  historialNodos: NodoLineaTiempoHistorialUI[];

  // --- B. ESTADO DEL MODO HISTÓRICO (US_03) ---
  esModoHistorico: boolean;
  versionHistoricaActivaId: string | null; // null si estamos viendo la versión actual
  versionHistoricaDetalle: PanelVersionHistoricaDetalleProps | null;
  versionHistoricaDetalleRaw: DetalleVersionHistoricaResponse | null;

  // --- C. BANDERAS DE CARGA Y FEEDBACK VISUAL ---
  estaCargando: boolean;
  cargandoVersionHistorica: boolean;
  estaEnviandoRevision: boolean;
  mensajeError: string | null;
  mensajeExito: string | null;
  errorEnvioGeneral: string | null;

  // --- D. ACCIONES ---
  inicializarVista: (subActividadId: string) => Promise<void>;
  setComentariosEntrega: (comentarios: string) => void;
  agregarArchivosDropzone: (archivos: File[]) => Promise<void>;
  eliminarArchivoBuzon: (archivoId: string) => Promise<void>;
  enviarSubactividadRevision: () => Promise<boolean>;
  seleccionarVersionHistorica: (versionId: string) => Promise<void>;
  volverAVersionActual: () => void;
  descargarEvidencia: (archivoId: string) => Promise<void>;

  // --- E. GETTER COMPUTADO INTEGRAL (VIEWMODEL) ---
  obtenerViewModelUI: () => SubActividadEntregaViewModel | null;
}

export const useSubActividadEntregaStore = create<SubActividadesEntregaState>((set, get) => ({
  // Estado Inicial
  subActividadId: null,
  vistaRaw: null,

  cabecera: null,
  detallesOperacion: null,
  observacionesActivas: [],
  archivosEnBuzon: [],
  comentariosEntrega: '',
  modoBuzon: 'CARGA',
  historialNodos: [],

  esModoHistorico: false,
  versionHistoricaActivaId: null,
  versionHistoricaDetalle: null,
  versionHistoricaDetalleRaw: null,

  estaCargando: false,
  cargandoVersionHistorica: false,
  estaEnviandoRevision: false,
  mensajeError: null,
  mensajeExito: null,
  errorEnvioGeneral: null,

  // 1. Cargar la vista inicial de la subactividad: servicio -> adaptador -> set(estadoAdaptado)
  inicializarVista: async (subActividadId: string) => {
    set({
      subActividadId,
      estaCargando: true,
      mensajeError: null,
      mensajeExito: null,
      esModoHistorico: false,
      versionHistoricaActivaId: null,
      versionHistoricaDetalle: null,
      versionHistoricaDetalleRaw: null,
    });

    try {
      // 1. Servicio: llamadas HTTP en paralelo con Promise.all (Criterio Tarea-11)
      const [data, historialData] = await Promise.all([
        subactividadesService.obtenerVistaEntrega(subActividadId),
        subactividadesService.obtenerHistorial(subActividadId).catch((err) => {
          console.warn('Fallo al obtener historial independiente:', err);
          return null;
        }),
      ]);

      // 2. Adaptadores: transformación pura DTO (snake_case) -> Contrato UI (camelCase)
      const cabecera = adaptarCabeceraSubActividadUI(data.meta_cabecera, data.detalles_operacion);
      const detallesOperacion = adaptarDetallesOperacionUI(data.detalles_operacion);
      const observacionesActivas = adaptarObservacionesActivasUI(data.observaciones_activas);
      const archivosEnBuzon = adaptarEvidenciasBorradorUI(data.buzon_borrador?.evidencias || []);
      const modoBuzon = determinarModoBuzonUI(data.detalles_operacion.estado_actual);
      
      // Si el endpoint /historial devolvió datos específicos, los usamos; si no, los de la vista entrega
      const listaHistorial = historialData?.data
        ? historialData.data.map((h) => ({
            id: h.id_version,
            estado_operativo: h.estado as any,
            etiqueta: h.titulo_evento,
            fecha: h.fecha_evento,
            es_version_actual: h.numero_version === data.meta_cabecera.version_actual,
          }))
        : data.historial_versiones;

      const historialNodos = adaptarHistorialVersionesUI(
        listaHistorial,
        null,
        (versionId) => void get().seleccionarVersionHistorica(versionId),
      );

      // 3. Set: guardar estado adaptado tipado con contratos UI
      set({
        vistaRaw: data,
        cabecera,
        detallesOperacion,
        observacionesActivas,
        archivosEnBuzon,
        comentariosEntrega: data.buzon_borrador?.comentarios_entrega || '',
        modoBuzon,
        historialNodos,
        estaCargando: false,
      });
    } catch (error) {
      console.error('Error al inicializar vista de subactividad:', error);
      set({
        estaCargando: false,
        mensajeError: 'No fue posible cargar los detalles de la subactividad.',
      });
    }
  },

  // 2. Actualizar comentarios del Contralor
  setComentariosEntrega: (comentarios: string) => {
    set({ comentariosEntrega: comentarios });
  },

  // 3. Orquestador de subida directa a S3 (US_02)
  agregarArchivosDropzone: async (archivosNuevos: File[]) => {
    const { subActividadId } = get();
    if (!subActividadId) return;

    for (const file of archivosNuevos) {
      // 1. Validación en memoria instantánea (Máx 50MB y MIME permitido)
      const validacion = validarArchivoCarga(file);
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const nombreLimpio = sanitizarNombreArchivo(file.name);

      if (!validacion.esValido) {
        // Se agrega con estado de error visual para informar al usuario
        const itemInvalido: ArchivoEvidenciaUI = {
          id: tempId,
          nombreOriginal: file.name,
          nombreSanitizado: nombreLimpio,
          pesoFormateado: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          pesoBytes: file.size,
          tipoMime: file.type || 'application/octet-stream',
          progresoPorcentaje: 0,
          estadoCarga: 'ERROR_CARGA',
          mensajeError: validacion.error,
        };

        set((state) => ({
          archivosEnBuzon: [itemInvalido, ...state.archivosEnBuzon],
        }));
        continue;
      }

      // 2. Elemento temporal en cola de carga con 0% de progreso
      const itemCargando: ArchivoEvidenciaUI = {
        id: tempId,
        nombreOriginal: file.name,
        nombreSanitizado: nombreLimpio,
        pesoFormateado: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pesoBytes: file.size,
        tipoMime: file.type || 'application/pdf',
        progresoPorcentaje: 0,
        estadoCarga: 'SUBIENDO_S3',
      };

      set((state) => ({
        archivosEnBuzon: [itemCargando, ...state.archivosEnBuzon],
      }));

      try {
        // A. Solicitar Pre-Firma a NestJS
        const preFirma = await subactividadesService.generarPreFirma(subActividadId, {
          nombre_archivo: nombreLimpio,
          mime_type: itemCargando.tipoMime,
          peso_bytes: file.size,
        });

        // B. Transmitir binario crudo a S3 con PUT y reporte de progreso
        await subactividadesService.subirArchivoS3(
          preFirma.upload_url,
          file,
          itemCargando.tipoMime,
          (porcentaje) => {
            set((state) => ({
              archivosEnBuzon: state.archivosEnBuzon.map((a) =>
                a.id === tempId ? { ...a, progresoPorcentaje: porcentaje } : a,
              ),
            }));
          },
        );

        // C. Confirmar a NestJS para vincularlo en PostgreSQL
        set((state) => ({
          archivosEnBuzon: state.archivosEnBuzon.map((a) =>
            a.id === tempId ? { ...a, estadoCarga: 'CONFIRMANDO', progresoPorcentaje: 100 } : a,
          ),
        }));

        const confirmacion = await subactividadesService.confirmarArchivo(
          subActividadId,
          preFirma.archivo_id,
        );

        // D. Consolidar archivo en estado final "BORRADOR_CONFIRMADO"
        set((state) => ({
          archivosEnBuzon: state.archivosEnBuzon.map((a) =>
            a.id === tempId
              ? {
                  ...a,
                  id: confirmacion.id,
                  estadoCarga: 'BORRADOR_CONFIRMADO',
                  urlDescarga: confirmacion.url_descarga,
                  pesoFormateado: `${confirmacion.peso_mb} MB`,
                }
              : a,
          ),
        }));
      } catch (err) {
        console.error(`Error al subir archivo ${file.name} a S3:`, err);
        set((state) => ({
          archivosEnBuzon: state.archivosEnBuzon.map((a) =>
            a.id === tempId
              ? {
                  ...a,
                  estadoCarga: 'ERROR_CARGA',
                  mensajeError: 'Ocurrió un fallo de red al subir a S3. Reintenta.',
                }
              : a,
          ),
        }));
      }
    }
  },

  // 4. Eliminar un archivo del buzón
  eliminarArchivoBuzon: async (archivoId: string) => {
    const { subActividadId } = get();
    // Si era un archivo con error local que no llegó al backend, solo se filtra del array
    if (archivoId.startsWith('temp-')) {
      set((state) => ({
        archivosEnBuzon: state.archivosEnBuzon.filter((a) => a.id !== archivoId),
      }));
      return;
    }

    if (!subActividadId) return;

    try {
      await subactividadesService.eliminarArchivo(subActividadId, archivoId);
      set((state) => ({
        archivosEnBuzon: state.archivosEnBuzon.filter((a) => a.id !== archivoId),
      }));
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
    }
  },

  // 5. Enviar formalmente la subactividad a revisión de Jefatura (US_02)
  enviarSubactividadRevision: async () => {
    const { subActividadId, archivosEnBuzon, comentariosEntrega, vistaRaw } = get();
    if (!subActividadId) return false;

    // Solo se envían los archivos confirmados con éxito en S3
    const idsConfirmados = archivosEnBuzon
      .filter((a) => a.estadoCarga === 'BORRADOR_CONFIRMADO')
      .map((a) => a.id);

    set({ estaEnviandoRevision: true, errorEnvioGeneral: null });

    try {
      const resp = await subactividadesService.enviarRevision(subActividadId, {
        evidencias_ids: idsConfirmados,
        comentarios_entrega: comentariosEntrega,
      });

      // Actualizar el estado adaptado local para reflejar "EN_REVISION"
      if (vistaRaw) {
        const rawActualizado: VistaEntregaSubActividadResponse = {
          ...vistaRaw,
          meta_cabecera: {
            ...vistaRaw.meta_cabecera,
            version_actual: resp.nueva_version,
            permite_entrega: false,
          },
          detalles_operacion: {
            ...vistaRaw.detalles_operacion,
            estado_actual: 'EN_REVISION',
          },
        };

        const cabeceraActualizada = adaptarCabeceraSubActividadUI(
          rawActualizado.meta_cabecera,
          rawActualizado.detalles_operacion,
        );
        const detallesActualizados = adaptarDetallesOperacionUI(rawActualizado.detalles_operacion);
        const modoBuzonActualizado = determinarModoBuzonUI('EN_REVISION');

        set({
          vistaRaw: rawActualizado,
          cabecera: cabeceraActualizada,
          detallesOperacion: detallesActualizados,
          modoBuzon: modoBuzonActualizado,
        });
      }

      set({
        estaEnviandoRevision: false,
        mensajeExito: '¡Subactividad enviada a revisión de Jefatura con éxito!',
      });
      return true;
    } catch (error) {
      console.error('Error al enviar a revisión:', error);
      set({
        estaEnviandoRevision: false,
        errorEnvioGeneral: 'Ocurrió un error al enviar a revisión. Intenta nuevamente.',
      });
      return false;
    }
  },

  // 6. Seleccionar y cargar una versión histórica inmutable (US_03): servicio -> adaptador -> set(estadoAdaptado)
  seleccionarVersionHistorica: async (versionId: string) => {
    const { subActividadId, historialNodos, vistaRaw } = get();
    if (!subActividadId) return;

    set({
      versionHistoricaActivaId: versionId,
      cargandoVersionHistorica: true,
      mensajeError: null,
    });

    try {
      // 1. Servicio HTTP
      const detalleRaw = await subactividadesService.obtenerDetalleVersionHistorica(
        subActividadId,
        versionId,
      );

      // 2. Adaptador
      const versionHistoricaDetalle = adaptarDetalleVersionHistoricaUI(
        detalleRaw,
        (archivoId) => get().descargarEvidencia(archivoId),
      );

      // Actualizar nodos en la línea de tiempo
      const nodosActualizados = historialNodos.map((n) => ({
        ...n,
        estaSeleccionadaEnVista: n.idVersion === versionId,
      }));

      // Adaptar cabecera al modo histórico
      let cabeceraHistorica = get().cabecera;
      if (vistaRaw) {
        cabeceraHistorica = adaptarCabeceraSubActividadUI(
          vistaRaw.meta_cabecera,
          vistaRaw.detalles_operacion,
          true,
          detalleRaw.version_visualizada,
        );
      }

      // 3. Set con estado adaptado
      set({
        esModoHistorico: true,
        versionHistoricaDetalle,
        versionHistoricaDetalleRaw: detalleRaw,
        cabecera: cabeceraHistorica,
        historialNodos: nodosActualizados,
        modoBuzon: 'OCULTO',
        cargandoVersionHistorica: false,
      });
    } catch (error) {
      console.error('Error al cargar versión histórica:', error);
      set({
        cargandoVersionHistorica: false,
        mensajeError: 'No se pudo cargar la versión histórica seleccionada.',
      });
    }
  },

  // 7. Volver del modo histórico a la versión actual
  volverAVersionActual: () => {
    const { vistaRaw, historialNodos } = get();
    if (!vistaRaw) return;

    const cabeceraNormal = adaptarCabeceraSubActividadUI(
      vistaRaw.meta_cabecera,
      vistaRaw.detalles_operacion,
      false,
    );

    const nodosActualizados = historialNodos.map((n) => ({
      ...n,
      estaSeleccionadaEnVista: n.esVersionActual,
    }));

    set({
      esModoHistorico: false,
      versionHistoricaActivaId: null,
      versionHistoricaDetalle: null,
      versionHistoricaDetalleRaw: null,
      cabecera: cabeceraNormal,
      historialNodos: nodosActualizados,
      modoBuzon: determinarModoBuzonUI(vistaRaw.detalles_operacion.estado_actual),
    });
  },

  // 8. Descargar una evidencia (con enlace temporal de S3 - Criterios Tarea-12)
  descargarEvidencia: async (archivoId: string) => {
    const { subActividadId, versionHistoricaActivaId, versionHistoricaDetalle } = get();
    if (!subActividadId || !versionHistoricaActivaId) return;

    // 1. Mostrar spinner/loader en el icono del archivo
    if (versionHistoricaDetalle) {
      set({
        versionHistoricaDetalle: {
          ...versionHistoricaDetalle,
          evidencias: versionHistoricaDetalle.evidencias.map((e) =>
            e.id === archivoId ? { ...e, estaDescargando: true } : e,
          ),
        },
      });
    }

    try {
      // 2. Fetch al endpoint link-descarga
      const link = await subactividadesService.obtenerLinkDescargaEvidencia(
        subActividadId,
        versionHistoricaActivaId,
        archivoId,
      );

      // 3. Forzar descarga nativa mediante un elemento <a> dinámico inyectado en el DOM con target="_blank"
      if (link.url_descarga_efimera && typeof window !== 'undefined') {
        const elementoA = document.createElement('a');
        elementoA.href = link.url_descarga_efimera;
        elementoA.target = '_blank';
        elementoA.rel = 'noopener noreferrer';
        document.body.appendChild(elementoA);
        elementoA.click();
        document.body.removeChild(elementoA);
      }
    } catch (error: any) {
      console.error('Error al descargar evidencia histórica:', error);
      // 4. Manejo graceful de error 403 (autorización) u otros
      const es403 = error?.response?.status === 403;
      set({
        mensajeError: es403
          ? 'Acceso denegado (403): Solo puedes descargar evidencias pertenecientes a tu centro universitario.'
          : 'Ocurrió un error al generar el enlace de descarga.',
      });
    } finally {
      // Remover spinner/loader
      const { versionHistoricaDetalle: vActual } = get();
      if (vActual) {
        set({
          versionHistoricaDetalle: {
            ...vActual,
            evidencias: vActual.evidencias.map((e) =>
              e.id === archivoId ? { ...e, estaDescargando: false } : e,
            ),
          },
        });
      }
    }
  },

  // 9. Getter computado para conectar directamente a los componentes React
  obtenerViewModelUI: (): SubActividadEntregaViewModel | null => {
    const state = get();
    const {
      subActividadId,
      cabecera,
      detallesOperacion,
      observacionesActivas,
      archivosEnBuzon,
      comentariosEntrega,
      modoBuzon,
      historialNodos,
      esModoHistorico,
      versionHistoricaActivaId,
      versionHistoricaDetalle,
      estaCargando,
      cargandoVersionHistorica,
      estaEnviandoRevision,
      errorEnvioGeneral,
      mensajeError,
    } = state;

    if (!subActividadId || !cabecera || !detallesOperacion) {
      return null;
    }

    return {
      subActividadId,
      versionHistoricaSeleccionadaId: versionHistoricaActivaId,
      estaCargandoVista: estaCargando,
      estaCargandoVersionHistorica: cargandoVersionHistorica,
      mensajeError,
      cabecera,
      detallesOperacion,
      observacionesActivas,
      buzon: {
        modo: modoBuzon,
        archivos: archivosEnBuzon,
        comentariosEntrega,
        estaEnviandoRevision,
        errorEnvioGeneral,
        onArchivosSeleccionados: (files) => void state.agregarArchivosDropzone(files),
        onEliminarArchivo: (id) => void state.eliminarArchivoBuzon(id),
        onChangeComentarios: (c) => state.setComentariosEntrega(c),
        onConfirmarEnvioRevision: () => state.enviarSubactividadRevision(),
      },
      historialNodos,
      esModoHistorico,
      versionHistoricaDetalle: versionHistoricaDetalle || undefined,
      onSeleccionarVersionHistorica: (id) => state.seleccionarVersionHistorica(id),
      onVolverAVersionActual: () => state.volverAVersionActual(),
    };
  },
}));
