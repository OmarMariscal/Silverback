import { FiltrosPoaDeCentro } from './filtros/poa-de-centro.filter';
import { PoaDeCentroResult } from './results/poa-de-centro.result';

export const CENTROS_QUERY_REPOSITORY_TOKEN = Symbol(
  'CENTROS_QUERY_REPOSITORY_TOKEN',
);

export interface ICentrosQueryRepository {
  /**
   * Endpoint: GET /api/v1/centros/:centroId/poa
   * Propósito: Detalle de la POA de un centro (por año) para la Jefatura.
   * Reglas: Solo si el centro tiene un contralor asignado a la Jefa; si no,
   * devuelve null igual que cuando no existe (no revela qué centros existen).
   *
   * @returns La POA con sus actividades o null si no existe / no es de su jurisdicción.
   */
  obtenerPoaDeCentro(
    filtros: FiltrosPoaDeCentro,
  ): Promise<PoaDeCentroResult | null>;
}