// frontend/src/types/actividades-contratos.ts
// Este archivo contiene definiciones de tipos TypeScript para las actividades y contratos en el sistema. Los tipos ayudan a garantizar que los datos que se manejan en la aplicación sean consistentes y correctos, proporcionando autocompletado y verificación de errores durante el desarrollo.
// En palabras sencillas: Este archivo es como un "manual de instrucciones" para los datos relacionados con actividades y contratos. Define cómo deben lucir los objetos de datos, qué propiedades tienen y qué tipos de valores se esperan. Esto ayuda a los desarrolladores a evitar errores al trabajar con estos datos en la aplicación.

import type { ActividadesDirectorioQuery } from './actividades-api';
import type { EstadoActividadAPI, TipoActividadAPI } from './poa-api';

export interface ActividadDirectorioUI {
  id: string;
  identificador: string;
  tipoActividad: TipoActividadAPI;
  tipoEtiqueta: string;
  titulo: string;
  fechaTermino: string;
  asignacionPrincipal: string;
  asignacionSecundaria: string;
  estadoCodigo: EstadoActividadAPI;
  estadoEtiqueta: string;
  estadoClase: string;
  semaforoCodigo: string;
  semaforoEtiqueta: string;
  semaforoClase: string;
}

export interface CentroUI {
  id: string;
  clave: string;
  nombre: string;
  subtituloInterfaz: string;
}

export interface ActividadResumenUI {
  id: string;
  titulo: string;
  justificacion: string;
  objetivoGeneral: string;
  objetivosParticulares: string;
  metaDelProyecto: string;
  indicadores: string;
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
  actividades: ActividadDirectorioUI[];
  centros: CentroUI[];
  filtros: ActividadesDirectorioFiltros;
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  limite: number;
  estaCargando: boolean;
  mensajeError: string | null;
}
