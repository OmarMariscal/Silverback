import { AuditoresDataResult } from './results/auditores.result';

export const AUDITORES_QUERY_REPOSITORY_TOKEN = Symbol('AUDITORES_QUERY_REPOSITORY_TOKEN');

// Patrón Object Param (Requisito de tu equipo)
export interface GetAuditoresQuery {
  usuarioActualId: string;
}

export interface IAuditoresQueryRepository {
  /**
   * Endpoint: GET /auditores
   * Propósito: Obtener el listado completo de auditores disponibles para registro.
   */
  obtenerAuditores(query: GetAuditoresQuery): Promise<AuditoresDataResult>;
}