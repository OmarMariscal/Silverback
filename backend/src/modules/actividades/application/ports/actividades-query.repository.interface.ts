import { ActividadesFichaTecnicaResponse } from '@modules/actividades/dto/response/actividades-ficha-tecnica.response.dto';
import { ActividadesGetData } from '@modules/actividades/dto/response/actividades-get-data.dto';
import { ActividadesResumenResponse } from '@modules/actividades/dto/response/actividades-resumen.response.dto';
import { FiltroActividades } from './filtros/get-actividades.filtro.interface';

export interface IActividadesQueryRepository {
  /**
   * Endpoint: GET /api/v1/actividades
   * Propósito: Construir la tabla de las actividades completas para las vistas de la Jefa y Contralor
   * Reglas: Debe devolvar un arrays con las actividades filtradas
   */
  obtenerActividades(filtros: FiltroActividades): Promise<ActividadesGetData[]>;

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/resumen
   * Propósito: Construir las vistas de las fichas técnicas
   * Reglas: Debe devolver toda la lista formateada lista para pintar la pantalla
   */
  obtenerResumenPorId(actividadId: string): Promise<ActividadesResumenResponse>;

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/ficha-tecnica
   * Propósito: Construir la vista completa de una actividad guardada en la base de datos
   * Reglas: Devolver una instancia con todos los datos de una actividad
   */
  obtenerPorIdFichaTecnica(
    actividadId: string,
  ): Promise<ActividadesFichaTecnicaResponse>;
}
