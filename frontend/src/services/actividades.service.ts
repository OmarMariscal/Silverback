// frontend/src/services/actividades.service.ts
// Este archivo contiene funciones para interactuar con el backend y obtener datos relacionados con actividades, como el directorio de actividades y los centros asociados. Estas funciones hacen llamadas HTTP a endpoints específicos y devuelven los datos necesarios para la aplicación.
// En palabras sencillas: Este archivo es como un "puente" entre tu frontend y el backend. Cada función hace una llamada a un endpoint y devuelve los datos que necesitas para mostrar en la interfaz de usuario.

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
