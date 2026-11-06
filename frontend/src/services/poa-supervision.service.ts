// frontend/src/services/poa-supervision.service.ts
// Este archivo contiene los servicios que se comunican con el backend de Emiliano para la supervisión y dictamen de POAs (Rol: Jefa).
// En palabras sencillas: Es el puente HTTP para que la Jefa consulte los centros universitarios con su histórico de POAs,
// inspeccione las actividades de cada centro y emita dictámenes de autorización o devolución con observaciones.

import { api } from './api';
import * as PoaApi from '../types/poa-api';

export const poaSupervisionService = {
  /**
   * 1. GET /api/v1/poas/supervision/centros
   * Obtiene los KPIs globales de dictamen y la lista de todos los centros universitarios
   * con su resumen de POA del año en curso y su histórico de años disponibles.
   * @param historicLimit Límite de años a mostrar en anios_historicos (por defecto 3)
   */
  obtenerCentrosSupervision: async (
    historicLimit = 3
  ): Promise<PoaApi.SupervisionCentrosPoaResponseDto> => {
    try {
      const respuesta = await api.get<PoaApi.SupervisionCentrosPoaResponseDto>(
        `/poas/supervision/centros?historic_limit=${historicLimit}`
      );
      return respuesta.data;
    } catch (error) {
      console.error('Error al obtener centros para supervisión de POAs:', error);
      throw error;
    }
  },

  /**
   * 2. GET /api/v1/centros/:centroId/poa
   * Obtiene la información detallada del POA de un centro universitario para un año fiscal específico,
   * incluyendo su lista de actividades principales resumidas.
   * @param centroId Identificador único (UUID) del centro universitario
   * @param anio Año fiscal a consultar (opcional, ej. 2026)
   */
  obtenerPoaPorCentro: async (
    centroId: string,
    anio?: number
  ): Promise<PoaApi.CentroPoaDetalleResponseDto> => {
    try {
      const queryAnio = anio ? `?anio=${anio}` : '';
      const respuesta = await api.get<PoaApi.CentroPoaDetalleResponseDto>(
        `/centros/${centroId}/poa${queryAnio}`
      );
      return respuesta.data;
    } catch (error) {
      console.error(`Error al obtener POA del centro ${centroId} (año: ${anio}):`, error);
      throw error;
    }
  },

  /**
   * 3. GET /api/v1/actividades/:actividadId/ficha-tecnica
   * Reutiliza el endpoint existente para cargar perezosamente (lazy load) la ficha técnica de una actividad.
   */
  obtenerFichaTecnicaActividad: async (
    actividadId: string
  ): Promise<PoaApi.ActividadesFichaTecnicaResponse> => {
    try {
      const respuesta = await api.get<PoaApi.ActividadesFichaTecnicaResponse>(
        `/actividades/${actividadId}/ficha-tecnica`
      );
      return respuesta.data;
    } catch (error) {
      console.error(`Error al obtener ficha técnica para actividad ${actividadId}:`, error);
      throw error;
    }
  },

  /**
   * 4. GET /api/v1/actividades/:actividadId/sub-actividades-poa
   * Reutiliza el endpoint existente para cargar perezosamente (lazy load) las subactividades de una actividad.
   */
  obtenerSubactividadesPoa: async (
    actividadId: string
  ): Promise<PoaApi.SubActividadesPoaResponse> => {
    try {
      const respuesta = await api.get<PoaApi.SubActividadesPoaResponse>(
        `/actividades/${actividadId}/sub-actividades-poa`
      );
      return respuesta.data;
    } catch (error) {
      console.error(`Error al obtener subactividades para actividad ${actividadId}:`, error);
      throw error;
    }
  },

  /**
   * 5. POST /api/v1/poas/:poaId/devolver
   * Dictamina y devuelve el POA al contralor indicando las observaciones correspondientes.
   */
  devolverPoaConObservaciones: async (
    poaId: string,
    payload: PoaApi.DevolverPoaRequestDto
  ): Promise<PoaApi.DevolverPoaResponseDto> => {
    try {
      const respuesta = await api.post<PoaApi.DevolverPoaResponseDto>(
        `/poas/${poaId}/devolver`,
        payload
      );
      return respuesta.data;
    } catch (error) {
      console.error(`Error al devolver POA ${poaId} con observaciones:`, error);
      throw error;
    }
  },

  /**
   * 6. POST /api/v1/poas/:poaId/autorizar
   * Dictamina y aprueba oficialmente el POA de un centro universitario.
   */
  autorizarPoa: async (
    poaId: string
  ): Promise<PoaApi.AutorizarPoaResponseDto> => {
    try {
      const respuesta = await api.post<PoaApi.AutorizarPoaResponseDto>(
        `/poas/${poaId}/autorizar`
      );
      return respuesta.data;
    } catch (error) {
      console.error(`Error al autorizar POA ${poaId}:`, error);
      throw error;
    }
  },
};

