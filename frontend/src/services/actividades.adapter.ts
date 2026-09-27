// frontend/src/services/actividades.adapter.ts
// Este archivo contiene funciones para adaptar los datos de actividades obtenidos del backend a un formato que sea más conveniente para la interfaz de usuario. Estas funciones transforman los datos crudos en estructuras que los componentes de React pueden utilizar directamente.
// En palabras sencillas: Este archivo es como un "traductor" que toma los datos del backend y los convierte en un idioma que la interfaz de usuario entiende mejor. Esto facilita la construcción de componentes y la presentación de información al usuario final.

import { ActividadesDirectorioData } from '@/types/actividades-api';
import { ActividadDirectorioItemProps } from '@/types/actividades-contratos';

export const adaptarDirectorioActividadesUI = (
  actividades: ActividadesDirectorioData[],
  onSeleccionar: (id: string) => void,
): ActividadDirectorioItemProps[] => actividades.map((actividad) => ({
  actividad,
  onSeleccionar,
}));
