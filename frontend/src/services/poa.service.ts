// frontend/src/services/poa.service.ts
// Este archivo contiene los servicios que se comunican con el backend de Emiliano para todo lo relacionado con el POA. Cada función corresponde a un endpoint específico y devuelve los datos en el formato que Rogelio espera, usando adaptadores si es necesario.
// En palabras sencillas: Este archivo es como un "puente" entre la UI y el backend. Cada función es un camino que lleva datos desde la API hasta los componentes de la UI, y viceversa. Si los datos vienen en un formato raro, usamos adaptadores para traducirlos a algo que la UI pueda entender fácilmente.

import { api } from './api';
import { adaptarPoaActual } from './poa.adapter';
import * as PoaApi from '../types/poa-api';

export const poaService = {
  
  // 1. Obtener el POA actual
  obtenerMiPoaActual: async () => {
    try {
      // 💡 GENÉRICO AÑADIDO <PoaApi.PoaActualDto>
      const respuesta = await api.get<PoaApi.PoaActualDto>('/poas/mi-poa-actual');
      const adaptado = adaptarPoaActual(respuesta.data);
      return {
        poaId: respuesta.data.id,
        ...adaptado
      };
    } catch (error) {
      console.error("Error al obtener el POA actual:", error);
      throw error; 
    }
  },

  // 2. Presentar POA a revisión
  presentarPoa: async (poaId: string): Promise<PoaApi.PresentarPoasDto> => {
    try {
      const respuesta = await api.post<PoaApi.PresentarPoasDto>(`/poas/${poaId}/presentar`);
      return respuesta.data;
    } catch (error) {
      console.error("Error al presentar el POA:", error);
      throw error;
    }
  },

  // 3. Cancelar envío del POA
  cancelarEnvioPoa: async (poaId: string): Promise<PoaApi.CancelarPoaDataDto> => {
    try {
      const respuesta = await api.post<PoaApi.CancelarPoaDataDto>(`/poas/${poaId}/cancelar-envio`);
      return respuesta.data;
    } catch (error) {
      console.error("Error al cancelar el envío del POA:", error);
      throw error;
    }
  },

  // 4. Obtener la Ficha Técnica de una actividad
  obtenerFichaTecnica: async (actividadId: string): Promise<PoaApi.ActividadesFichaTecnicaResponse> => {
    try {
      const respuesta = await api.get<PoaApi.ActividadesFichaTecnicaResponse>(`/actividades/${actividadId}/ficha-tecnica`);
      return respuesta.data;
    } catch (error) {
      console.error(`Error al obtener la ficha técnica de ${actividadId}:`, error);
      throw error;
    }
  },

  // 5. Editar campos de la Ficha Técnica
  editarFichaTecnica: async (
    actividadId: string, 
    datosEditados: PoaApi.ActividadesPatchFichaTecnicaRequest
  ): Promise<PoaApi.ActividadesFichaTecnicaResponse> => {
    try {
      const respuesta = await api.patch<PoaApi.ActividadesFichaTecnicaResponse>(
        `/actividades/${actividadId}/ficha-tecnica`, 
        datosEditados
      );
      return respuesta.data;
    } catch (error) {
      console.error(`Error al actualizar la ficha técnica de ${actividadId}:`, error);
      throw error;
    }
  },

  // 6. Obtener listado de subactividades del POA
  obtenerSubactividadesPoa: async (actividadId: string): Promise<PoaApi.SubActividadesPoaResponse> => {
    try {
      const respuesta = await api.get<PoaApi.SubActividadesPoaResponse>(`/actividades/${actividadId}/sub-actividades-poa`);
      return respuesta.data;
    } catch (error) {
      console.error(`Error al obtener subactividades para ${actividadId}:`, error);
      throw error;
    }
  },

  // 7. Sincronizar subactividades en lote
  sincronizarSubactividades: async (
    actividadId: string, 
    payloadSync: PoaApi.SubActividadesSyncRequest
  ): Promise<PoaApi.SubActividadesSyncResponse> => {
    try {
      const respuesta = await api.put<PoaApi.SubActividadesSyncResponse>(
        `/actividades/${actividadId}/sub-actividades/sync`, 
        payloadSync
      );
      return respuesta.data;
    } catch (error) {
      console.error(`Error al sincronizar subactividades para ${actividadId}:`, error);
      throw error;
    }
  },

  // 8. Obtener lista de banco de actividades
  obtenerBancoActividades: async (): Promise<PoaApi.BancoActividadesDto> => {
    try {
      const respuesta = await api.get<PoaApi.BancoActividadesDto>('/catalogos/banco-actividades');
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener el banco de actividades:", error);
      throw error;
    }
  },

  // 9. Obtener detalles de una actividad del banco
  obtenerDetalleBancoActividad: async (idBanco: string): Promise<PoaApi.BancoIdDto> => {
    try {
      const respuesta = await api.get<PoaApi.BancoIdDto>(`/catalogos/banco-actividades/${idBanco}`);
      return respuesta.data;
    } catch (error) {
      console.error(`Error al obtener detalles del banco para ${idBanco}:`, error);
      throw error;
    }
  },

  // 10. Obtener lista de auditores disponibles
  obtenerAuditores: async (): Promise<PoaApi.AuditoresDto> => {
    try {
      const respuesta = await api.get<PoaApi.AuditoresDto>('/auditores');
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener auditores:", error);
      throw error;
    }
  },

  // 11. Obtener sugerencias de subactividades del banco
  obtenerSubactividadesSugeridas: async (idBanco: string): Promise<PoaApi.ActividadSugeridaDto> => {
    try {
      const respuesta = await api.get<PoaApi.ActividadSugeridaDto>(`/catalogos/banco-actividades/${idBanco}/sub-actividades-sugeridas`);
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener subactividades sugeridas:", error);
      throw error;
    }
  },

  // 12. Crear una nueva actividad
  crearActividad: async (poaId: string, datosActividad: PoaApi.CrearActividadesDto): Promise<PoaApi.CrearActividadesResponseDto> => {
    try {
      const respuesta = await api.post<PoaApi.CrearActividadesResponseDto>(`/poas/${poaId}/actividades`, datosActividad);
      return respuesta.data;
    } catch (error) {
      console.error("Error al crear la actividad:", error);
      throw error;
    }
  },

  // 13. Obtener subactividades seleccionadas
  obtenerSubactividadesSelect: async (actividadId: string): Promise<PoaApi.SubActividadesSelectResponse> => {
    try {
      const respuesta = await api.get<PoaApi.SubActividadesSelectResponse>(`/actividades/${actividadId}/sub-actividades-select`);
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener subactividades select:", error);
      throw error;
    }
  },

  // 14. Creación masiva de subactividades (Bulk)
  crearSubactividadesBulk: async (
    actividadId: string, 
    payload: PoaApi.SubActividadesBulkRequest
  ): Promise<PoaApi.SubActividadesBulkResponse> => {
    try {
      const respuesta = await api.post<PoaApi.SubActividadesBulkResponse>(`/actividades/${actividadId}/sub-actividades/bulk`, payload);
      return respuesta.data;
    } catch (error) {
      console.error("Error en creación masiva de subactividades:", error);
      throw error;
    }
  },

  // 15. Eliminar una actividad
  eliminarActividad: async (actividadId: string): Promise<PoaApi.EliminacionCorrecta> => {
    try {
      const respuesta = await api.delete<PoaApi.EliminacionCorrecta>(`/actividades/${actividadId}`);
      return respuesta.data;
    } catch (error) {
      console.error("Error al eliminar la actividad:", error);
      throw error;
    }
  },

  // 16. Obtener catálogo de centros universitarios
  obtenerCentros: async (): Promise<PoaApi.CentroDto> => {
    try {
      const respuesta = await api.get<PoaApi.CentroDto>('/catalogos/centros');
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener catálogo de centros:", error);
      throw error;
    }
  }
};