import { FiltrosMiPoa } from './filtros/mi-poa.filter.interface';
import { FiltrosSupervisionCentros } from './filtros/supervision-centros.filter';
import { PoaActualResult } from './results/poa-actual.result';
import { SupervisionCentroResult } from './results/supervision-centro.result';
import { FiltrosPoaDeCentro } from '../../../centros/application/ports/filtros/poa-de-centro.filter';

export const POA_QUERY_REPOSITORY_TOKEN = Symbol('POA_QUERY_REPOSITORY_TOKEN');

export interface IPoaQueryRepository {
  /**
   * Endpoint: GET /api/v1/poas/mi-poa-actual
   * Propósito: Construir la pantalla principal del POA para el Contralor.
   * Reglas: No devuelve entidades, realiza los joins necesarios (Prisma)
   * para devolver los datos formateados exactos que requiere la vista.
   *
   * @returns El DTO con los datos del POA o null si el usuario aún no tiene uno activo.
   */
  obtenerMiPoaActual(filtros: FiltrosMiPoa): Promise<PoaActualResult | null>;

  /**
   * Endpoint: GET /api/v1/poas/supervision/centros
   * Propósito: Directorio de supervisión de la Jefatura. Un renglón por centro
   * universitario bajo su jurisdicción, con el resumen de la POA del año vigente.
   * Reglas: Solo devuelve centros que tengan al menos un contralor asignado a la Jefa.
   * Resuelve todo en un número fijo de consultas (sin N+1).
   */
  obtenerSupervisionCentros(
    filtros: FiltrosSupervisionCentros,
  ): Promise<SupervisionCentroResult[]>;


}