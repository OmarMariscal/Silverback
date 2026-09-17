import { ActividadesDirectorioData, ActividadesDirectorioQuery } from './actividades-api';
import { CentroDataDto } from './poa-api';

export interface ActividadDirectorioItemProps {
  actividad: ActividadesDirectorioData;
  onSeleccionar: (id: string) => void;
}

export interface ActividadesDirectorioFiltros {
  busqueda: string;
  centroUuid: string;
  tipoActividad: string;
  estadoFlujo: string;
  ordenarPor: ActividadesDirectorioQuery['sort_by'];
  semaforo: string;
}

export interface ActividadesDirectorioViewModel {
  actividades: ActividadesDirectorioData[];
  centros: CentroDataDto[];
  filtros: ActividadesDirectorioFiltros;
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  limite: number;
  estaCargando: boolean;
  mensajeError: string | null;
}
