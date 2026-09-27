// frontend/src/types/actividades-contratos.ts
// Este archivo contiene definiciones de tipos TypeScript para las actividades y contratos en el sistema. Los tipos ayudan a garantizar que los datos que se manejan en la aplicación sean consistentes y correctos, proporcionando autocompletado y verificación de errores durante el desarrollo.
// En palabras sencillas: Este archivo es como un "manual de instrucciones" para los datos relacionados con actividades y contratos. Define cómo deben lucir los objetos de datos, qué propiedades tienen y qué tipos de valores se esperan. Esto ayuda a los desarrolladores a evitar errores al trabajar con estos datos en la aplicación.

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
