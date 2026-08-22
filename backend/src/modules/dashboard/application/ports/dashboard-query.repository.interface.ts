import { DashboardContralorResult } from './results/dashboard-contralor.result';
import { DashboardJefaResult } from './results/dashboard-jefa.result';
import { RezagoDataResult } from './results/rezago-data.result';

export const DASHBOARD_QUERY_REPOSITORY_TOKEN = Symbol('DASHBOARD_QUERY_REPOSITORY_TOKEN');

// Patrón Object Param (Queries)
export interface GetKpisDashboardQuery {
  usuarioActualId: string;
}

export interface IDashboardQueryRepository {
  obtenerKpisContralor(query: GetKpisDashboardQuery): Promise<DashboardContralorResult>;
  
  obtenerKpisJefa(query: GetKpisDashboardQuery): Promise<DashboardJefaResult>;
  
  obtenerCentrosConRezago(): Promise<RezagoDataResult>;
}