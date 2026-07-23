import { PoaActualDto } from '@modules/poas/dto/response/poa-actual.dto';
import { FiltrosMiPoa } from './filtros/mi-poa.filter.interface';

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
  obtenerMiPoaActual(filtros: FiltrosMiPoa): Promise<PoaActualDto | null>;
}
