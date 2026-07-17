import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';

export interface KpiDistribucionPastel {
  estado: EstadosActividades;
  cantidad: number;
  porcentaje: number;
}
