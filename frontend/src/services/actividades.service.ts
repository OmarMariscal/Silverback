<<<<<<< HEAD
// frontend/src/services/actividades.service.ts
// Este archivo contiene funciones para interactuar con el backend de Emiliano y obtener datos relacionados con actividades, como el directorio de actividades.
// En palabras sencillas: Este archivo es como un "puente" entre tu frontend y el backend de Emiliano. Cada función hace una llamada HTTP a un endpoint específico y devuelve los datos que necesitas para mostrar en la interfaz de usuario.

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
=======
import { api } from './api';
import { ActividadesDirectorioQuery, ActividadesDirectorioResponse } from '@/types/actividades-api';
import { CentroDto } from '@/types/poa-api';

export const actividadesService = {
  obtenerDirectorio: async (
    query: ActividadesDirectorioQuery,
  ): Promise<ActividadesDirectorioResponse> => {
    const respuesta = await api.get<ActividadesDirectorioResponse>('/actividades/directorio', {
      params: query,
    });
    return respuesta.data;
  },

  obtenerCentros: async (): Promise<CentroDto> => {
    const respuesta = await api.get<CentroDto>('/catalogos/centros');
    return respuesta.data;
  },
};
>>>>>>> develop
