import { AuditoresDataResult } from './results/auditores.result';

export const AUDITORES_QUERY_REPOSITORY_TOKEN = Symbol('AUDITORES_QUERY_REPOSITORY_TOKEN');

export interface IAuditoresQueryRepository {
  /**
   * Endpoint: GET /auditores
   * Propósito: Obtener el listado completo de auditores disponibles para registro.
   */
  obtenerAuditores(): Promise<AuditoresDataResult>;
}