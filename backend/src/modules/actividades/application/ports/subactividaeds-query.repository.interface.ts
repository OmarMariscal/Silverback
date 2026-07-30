import { PaginacionMetadata } from '@core/common/dto/response/paginacion-metadata';
import { FiltrosDirectorio } from './filtros/subactividaddirectorio.filtro.interface';
import { PaginacionParams } from './filtros/paginacion-params.filtro.interface';
import { FiltrosSupervision } from './filtros/subactividad-supervision.filtro.interface';
import { SubActividadPoaResult } from './results/subactividad-para-poa.result';
import { SubActividadProximaVencerResult } from './results/subactividad-proxima-a-vencer.result';
import { SubActividadSelectResult } from './results/subactividad-select.result';
import { SubActividadSupervisionResult } from './results/subactividad-supervision.result';
import { SubActividadesDirectorioResult } from './results/subactividades-directorio.result';
import { FiltroProximasAVencer } from './filtros/subactividad-proximas-a-vencer.filtro.interface';
import { FiltroObtenerPorActividadId } from './filtros/subactividad-obtener-por-actividad.filtro';
import { FiltroSeleccionadas } from './filtros/subactividad-seleccionadas.filtro';
import { FiltroActividades } from './filtros/subactividad-get-actividades.filtro.interface';
import { SubActividadGetResult } from './results/subactividad-get.result';

export const SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN = Symbol(
  'SUBACTIVIDADES_QUERY_REPOSITORY_TOKEN',
);

export interface ISubactividadesQueryRepository {
  /**
   * Endpoint: GET /api/v1/actividades
   * Propósito: Construir la tabla de las actividades completas para las vistas de la Jefa y Contralor
   * Reglas: Debe devolvar un arrays con las actividades filtradas
   */
  obtenerActividades(
    filtros: FiltroActividades,
  ): Promise<SubActividadGetResult[]>;

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
    filtro: FiltroObtenerPorActividadId,
  ): Promise<SubActividadPoaResult[]>;

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/sub-actividades-select
   * Propósito: Vista de las sub-actividades totales y seleccionadas una POA y su banco
   * Reglas: Retorna la estructura exacta de folios, fechas anidades y un booleano de selección
   */
  obtenerPorActividadIdParaPoaSeleccionadas(
    filtro: FiltroSeleccionadas,
  ): Promise<SubActividadSelectResult[]>;
}
