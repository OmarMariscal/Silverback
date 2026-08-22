//import { ActividadesGetData } from '@modules/actividades/dto/response/actividades-get-data.dto';
import { ActividadResumenResult } from './results/actividad-resumen.result';
import { ActividadFichaTecnicaResult } from './results/actividad-ficha-tecnica.result';
import { FiltroActividadResumen } from './filtros/actividad-resumen.filtro';
import { FiltroActividadFichaTecnica } from './filtros/actividad-ficha-tecnica.filtro';
import { ActividadContarRezagoHistoricoQuery } from './queries/actividad-contar-rezago-historico.query';

export const ACTIVIDADES_QUERY_REPOSITORY_TOKEN = Symbol(
  'ACTIVIDADES_QUERY_REPOSITORY_TOKEN',
);

export interface IActividadesQueryRepository {
  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/resumen
   * Propósito: Construir las vistas de las fichas técnicas
   * Reglas: Debe devolver toda la lista formateada lista para pintar la pantalla
   */
  obtenerResumenPorId(
    filtro: FiltroActividadResumen,
  ): Promise<ActividadResumenResult | null>;

  /**
   * Endpoint: GET /api/v1/actividades/{actividadId}/ficha-tecnica
   * Propósito: Construir la vista completa de una actividad guardada en la base de datos
   * Reglas: Devolver una instancia con todos los datos de una actividad
   */
  obtenerPorIdFichaTecnica(
    filtro: FiltroActividadFichaTecnica,
  ): Promise<ActividadFichaTecnicaResult | null>;

  /**
   * Endpoint: N/A (Uso interno de Servicios)
   * Propósito: Calcular cuántas actividades de años anteriores no fueron concluidas
   * y por lo tanto es OBLIGATORIO que se presenten como "rezago" en el POA actual.
   *
   * @param contralorId UUID del contralor dueño del POA
   * @param anioFiscalActual El año fiscal del POA que se está intentando presentar
   */
  contarRezagosHistoricos(
    query: ActividadContarRezagoHistoricoQuery,
  ): Promise<number>;
}
