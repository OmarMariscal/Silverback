import { PaginacionMetadata } from '@core/common/dto/response/paginacion-metadata';
import { ActividadesDirectorioData } from '@modules/actividades/dto/response/actividades-directorio-data.dto';
import { ActividadesSupervisionSubActividadInfo } from '@modules/actividades/dto/response/actividades-supervision-sub-actividad-info.dto';
import { SubActividadesSelectData } from '@modules/actividades/dto/response/sub--actividades-select-data.dto';
import { SubActividadesPoaData } from '@modules/actividades/dto/response/sub-actividades-poa-data.dto';
import { SubActividadesProximasAVencerResumen } from '@modules/actividades/dto/response/sub-actividades-proximas-a-vencer-resumen.dto';
import { FiltrosDirectorio } from './filtros/directorio.filtro.interface';
import { PaginacionParams } from './filtros/paginacion-params.filtro.interface';
import { FiltrosSupervision } from './filtros/supervision.filtro.interface';

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
    limite: number,
    usuarioUuid: string,
  ): Promise<SubActividadesProximasAVencerResumen[]>;

  /*
   * Endpoint: GET /api/v1/actividades/supervision
   * Propósito: Tabla de rechazos y seguimientos
   */
  obtenerSupervision(
    filtros: FiltrosSupervision,
    paginacion: PaginacionParams,
  ): Promise<{
    meta: PaginacionMetadata;
    data: ActividadesSupervisionSubActividadInfo[];
  }>;

  /**
   * Endpoint: GET /api/v1/actividades/directorio
   * Propósito: Buscador central del sistema.
   * Reglas: Debe soportar paginación concurrente y filtros dinámicos (CQRS).
   */
  obtenerDirectorio(
    filtros: FiltrosDirectorio,
    paginacion: PaginacionParams,
  ): Promise<{ meta: PaginacionMetadata; data: ActividadesDirectorioData[] }>;

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/sub-actividades-poa
   * Propósito: Vista de generación del POA.
   * Reglas: Retorna la estructura exacta de folios y fechas anidadas.
   */
  obtenerPorActividadIdParaPoa(
    actividadId: string,
  ): Promise<SubActividadesPoaData[]>;

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/sub-actividades-select
   * Propósito: Vista de las sub-actividades totales y seleccionadas una POA y su banco
   * Reglas: Retorna la estructura exacta de folios, fechas anidades y un booleano de selección
   */
  obtenerPorActividadIdParaPoaSeleccionadas(
    actividadId: string,
  ): Promise<SubActividadesSelectData[]>;
}
