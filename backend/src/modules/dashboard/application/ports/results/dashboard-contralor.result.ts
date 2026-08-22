import { KpiSubActividadPayLoad } from '@domain/kpi/interfaces/kpi-actividad-payload.interface';

export interface DashboardContralorResult {
  payloads: KpiSubActividadPayLoad[];
}