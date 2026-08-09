import { KpiCentroDistribucion } from './kpi-centro-distribucion.interface';

export interface KpiCentroRezagoResult {
  centro_id: string;
  centro_clave: string;
  centro_nombre: string;
  distribucion: KpiCentroDistribucion;
}
