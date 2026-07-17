// frontend/src/services/poa.service.ts
import { api } from './api';
import { adaptarPoaActual } from './poa.adapter';
// Importamos los modelos de datos directamente de nuestra especificación de API (TODO agrupado bajo el namespace 'PoaApi')
import * as PoaApi from '../types/poa-api';

export const poaService = {
  
  // 1. Obtener el POA actual (Mapeado y traducido a través de tu adaptador BFF)
  obtenerMiPoaActual: async () => {
    try {
      const respuesta = await api.get('/poas/mi-poa-actual'); // GET /api/v1/poas/mi-poa-actual
      return adaptarPoaActual(respuesta.data);
    } catch (error) {
      console.error("Error al obtener el POA actual:", error);
      throw error; 
    }
  },

  // 2. Presentar POA a revisión (Pantalla 1 - Botón "Enviar a Revisión")
  presentarPoa: async (poaId: string): Promise<PoaApi.PresentarPoasDto> => {
    try {
      const respuesta = await api.post(`/poas/${poaId}/presentar`); // POST /api/v1/poas/{poaid}/presentar
      return respuesta.data;
    } catch (error) {
      console.error("Error al presentar el POA:", error);
      throw error;
    }
  },

  // 3. Cancelar envío del POA (Pantalla 1 - Botón "Cancelar Envío")
  cancelarEnvioPoa: async (poaId: string): Promise<PoaApi.CancelarPoaDataDto> => {
    try {
      const respuesta = await api.post(`/poas/${poaId}/cancelar-envio`); // POST /api/v1/poas/{poaid}/cancelar-envio
      return respuesta.data;
    } catch (error) {
      console.error("Error al cancelar el envío del POA:", error);
      throw error;
    }
  },

  // 4. Obtener la Ficha Técnica de una actividad (Pantalla 3 - Detalles/Edición)
  obtenerFichaTecnica: async (actividadId: string): Promise<PoaApi.ActividadesFichaTecnicaResponse> => {
    try {
      const respuesta = await api.get(`/actividades/${actividadId}/ficha-tecnica`); // GET /api/v1/actividades/{actividadId}/ficha-tecnica
      return respuesta.data;
    } catch (error) {
      console.error(`Error al obtener la ficha técnica de la actividad ${actividadId}:`, error);
      throw error;
    }
  },

  // 5. Editar campos de la Ficha Técnica (Pantalla 3 - Guardar cambios)
  editarFichaTecnica: async (actividadId: string, datosEditados: any): Promise<PoaApi.ActividadesFichaTecnicaResponse> => {
    try {
      const respuesta = await api.patch(`/actividades/${actividadId}/ficha-tecnica`, datosEditados); // PATCH /api/v1/actividades/{actividadId}/ficha-tecnica
      return respuesta.data;
    } catch (error) {
      console.error(`Error al actualizar la ficha técnica de la actividad ${actividadId}:`, error);
      throw error;
    }
  },

  // 6. Obtener listado de subactividades del POA (Pantalla 1 - Al expandir tarjeta colapsable)
  obtenerSubactividadesPoa: async (actividadId: string): Promise<PoaApi.SubActividadesPoaResponse> => {
    try {
      const respuesta = await api.get(`/actividades/${actividadId}/sub-actividades-poa`); // GET /api/v1/actividades/{actividadId}/sub-actividades-poa
      return respuesta.data;
    } catch (error) {
      console.error(`Error al obtener subactividades para la actividad ${actividadId}:`, error);
      throw error;
    }
  },

  // 7. Sincronizar subactividades en lote (Pantalla 5 - Sincronizar cambios, adiciones y borrados)
  sincronizarSubactividades: async (actividadId: string, payloadSync: any): Promise<PoaApi.SubActividadesSyncResponse> => {
    try {
      const respuesta = await api.put(`/actividades/${actividadId}/sub-actividades/sync`, payloadSync); // PUT /api/v1/actividades/{actividadId}/sub-actividades/sync
      return respuesta.data;
    } catch (error) {
      console.error(`Error al sincronizar subactividades para la actividad ${actividadId}:`, error);
      throw error;
    }
  },

  // 8. Obtener lista de banco de actividades (Pantalla 2)
  obtenerBancoActividades: async (): Promise<PoaApi.BancoActividadesDto> => {
    try {
      const respuesta = await api.get('/catalogos/banco-actividades');
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener el banco de actividades:", error);
      throw error;
    }
  },

  // 9. Obtener detalles de una actividad del banco (Pantalla 3)
  obtenerDetalleBancoActividad: async (idBanco: string): Promise<PoaApi.BancoldDto> => {
    try {
      const respuesta = await api.get(`/catalogos/banco-actividades/${idBanco}`);
      return respuesta.data;
    } catch (error) {
      console.error(`Error al obtener detalles del banco para ${idBanco}:`, error);
      throw error;
    }
  },

  // 10. Obtener lista de auditores disponibles (Pantalla 3)
  obtenerAuditores: async (): Promise<PoaApi.AuditoresDto> => {
    try {
      const respuesta = await api.get('/auditores');
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener auditores:", error);
      throw error;
    }
  },

  // 11. Obtener sugerencias de subactividades del banco (Pantalla 4)
  obtenerSubactividadesSugeridas: async (idBanco: string): Promise<PoaApi.ActividadSugeridaDto> => {
    try {
      const respuesta = await api.get(`/catalogos/banco-actividades/${idBanco}/sub-actividades-sugeridas`);
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener subactividades sugeridas:", error);
      throw error;
    }
  },

  // 12. Crear una nueva actividad (Desde cero o desde el banco)
  crearActividad: async (poaId: string, datosActividad: PoaApi.CrearActividadesDto): Promise<PoaApi.CrearActividadesResponseDto> => {
    try {
      const respuesta = await api.post(`/poas/${poaId}/actividades`, datosActividad);
      return respuesta.data;
    } catch (error) {
      console.error("Error al crear la actividad:", error);
      throw error;
    }
  },

  // 13. Obtener subactividades seleccionadas
  obtenerSubactividadesSelect: async (actividadId: string): Promise<PoaApi.SubActividadesSelectResponse> => {
    try {
      const respuesta = await api.get(`/actividades/${actividadId}/sub-actividades-select`);
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener subactividades select:", error);
      throw error;
    }
  },

  // 14. Creación masiva de subactividades (Bulk)
  crearSubactividadesBulk: async (actividadId: string, payload: PoaApi.SubActividadesBulkRequest): Promise<PoaApi.SubActividadesBulkResponse> => {
    try {
      const respuesta = await api.post(`/actividades/${actividadId}/sub-actividades/bulk`, payload);
      return respuesta.data;
    } catch (error) {
      console.error("Error en creación masiva de subactividades:", error);
      throw error;
    }
  },

  // 15. Eliminar una actividad (Y recorrer folios)
  eliminarActividad: async (actividadId: string): Promise<PoaApi.EliminacionCorrecta> => {
    try {
      const respuesta = await api.delete(`/actividades/${actividadId}`);
      return respuesta.data;
    } catch (error) {
      console.error("Error al eliminar la actividad:", error);
      throw error;
    }
  }
};