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
