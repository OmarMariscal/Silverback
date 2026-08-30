import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';
import { EstadosSemaforo } from '@domain/semaforo/estados-semaforo-enum';

export interface FiltrosDirectorio {
  search?: string;
  usuarioUuid: string;
  centroUuid?: string;
  tipoActividad?: TipoSubActividad[];
  estadoFlujo?: EstadosActividades[];
  semaforo?: EstadosSemaforo;
  fechaInicio?: Date;
  fechaFin?: Date;
}
