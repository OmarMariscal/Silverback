import { EstadosSemaforo } from '@domain/semaforo/estados-semaforo-enum';

export interface KpiRiesgoDistribucion {
  color: EstadosSemaforo;
  cantidad: number;
  porcentaje: number;
}
