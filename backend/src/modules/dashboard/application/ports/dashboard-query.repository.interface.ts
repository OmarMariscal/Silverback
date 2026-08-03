import { DashboardContralorResult } from './results/dashboard-contralor.result';
import { DashboardJefaResult } from './results/dashboard-jefa.result';
import { RezagoDataResult } from './results/rezago-data.result';

export const DASHBOARD_QUERY_REPOSITORY_TOKEN = Symbol('DASHBOARD_QUERY_REPOSITORY_TOKEN');

export interface IDashboardQueryRepository {
  obtenerKpisContralor(contralorId: string): Promise<DashboardContralorResult>;
  
  obtenerKpisJefa(): Promise<DashboardJefaResult>;
  
  obtenerCentrosConRezago(): Promise<RezagoDataResult>;
}