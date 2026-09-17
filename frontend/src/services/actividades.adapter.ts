import { ActividadesDirectorioData } from '@/types/actividades-api';
import { ActividadDirectorioItemProps } from '@/types/actividades-contratos';

export const adaptarDirectorioActividadesUI = (
  actividades: ActividadesDirectorioData[],
  onSeleccionar: (id: string) => void,
): ActividadDirectorioItemProps[] => actividades.map((actividad) => ({
  actividad,
  onSeleccionar,
}));
