// frontend/src/services/actividades.service.ts
import { api } from './api';
import * as DashApi from '../types/dashboard-api';
import { FiltrosDirectorio } from '../types/actividades-contratos';

export const actividadesService = {
  obtenerDirectorio: async (filtros: FiltrosDirectorio = {}): Promise<DashApi.DirectorioResponseDto> => {
    try {
      const params = new URLSearchParams();

      if (filtros.page) params.append('page', filtros.page.toString());
      if (filtros.limit) params.append('limit', filtros.limit.toString());
      if (filtros.order) params.append('order', filtros.order);
      if (filtros.sortBy) params.append('sort_by', filtros.sortBy);
      if (filtros.search) params.append('search', filtros.search);
      if (filtros.centroUuid) params.append('centro_uuid', filtros.centroUuid);
      if (filtros.tipoActividad) params.append('tipo_actividad', filtros.tipoActividad);
      if (filtros.estadoFlujo) params.append('estado_flujo', filtros.estadoFlujo);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const respuesta = await api.get<DashApi.DirectorioResponseDto>(`/actividades/directorio${queryString}`);
      return respuesta.data;
    } catch (error) {
      console.error('Error al obtener el directorio de actividades:', error);
      throw error;
    }
  }
};