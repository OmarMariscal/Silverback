import { PaginacionMetadata } from '@core/common/dto/response/paginacion-metadata';
import { FiltrosDirectorio } from './filtros/directorio.filtro.interface';
import { PaginacionParams } from './filtros/paginacion-params.filtro.interface';
import { FiltrosSupervision } from './filtros/supervision.filtro.interface';
import { SubActividadPoaResult } from './results/subactividad-para-poa.result';
import { SubActividadProximaVencerResult } from './results/subactividad-proxima-a-vencer.result';
import { SubActividadSelectResult } from './results/subactividad-select.result';
import { SubActividadSupervisionResult } from './results/subactividad-supervision.result';
import { SubActividadesDirectorioResult } from './results/subactividades-directorio.result';
import { FiltroProximasAVencer } from './filtros/proximas-a-vencer.filtro.interface';

export const SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN = Symbol(
  'SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN',
);

export interface ISubactividadesQueryRepository {
  /**
   * Endpoint: GET /api/v1/actividades/proximas-vencer
   * Propósito: Dashboard - Alertas rápidas.
   * Reglas: No devuelve entidades, solo fechas y textos crudos para ser
   * evaluados por el SemaforoService en la capa de aplicación.
   */
  obtenerProximasAVencer(
    filtros: FiltroProximasAVencer,
  ): Promise<SubActividadProximaVencerResult[]>;

  /*
   * Endpoint: GET /api/v1/actividades/supervision
   * Propósito: Tabla de rechazos y seguimientos
   */
  obtenerSupervision(
    filtros: FiltrosSupervision,
    paginacion: PaginacionParams,
  ): Promise<{
    meta: PaginacionMetadata;
    data: SubActividadSupervisionResult[];
  }>;

  /**
   * Endpoint: GET /api/v1/actividades/directorio
   * Propósito: Buscador central del sistema.
   * Reglas: Debe soportar paginación concurrente y filtros dinámicos (CQRS).
   */
  obtenerDirectorio(
    filtros: FiltrosDirectorio,
    paginacion: PaginacionParams,
  ): Promise<{
    meta: PaginacionMetadata;
    data: SubActividadesDirectorioResult[];
  }>;

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/sub-actividades-poa
   * Propósito: Vista de generación del POA.
   * Reglas: Retorna la estructura exacta de folios y fechas anidadas.
   */
  obtenerPorActividadIdParaPoa(
    actividadId: string,
  ): Promise<SubActividadPoaResult[]>;

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/sub-actividades-select
   * Propósito: Vista de las sub-actividades totales y seleccionadas una POA y su banco
   * Reglas: Retorna la estructura exacta de folios, fechas anidades y un booleano de selección
   */
  obtenerPorActividadIdParaPoaSeleccionadas(
    actividadId: string,
  ): Promise<SubActividadSelectResult[]>;
}
