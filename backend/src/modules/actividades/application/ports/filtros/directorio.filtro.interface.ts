import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export interface FiltrosDirectorio {
  search?: string;
  centroUuid?: string;
  tipoActividad?: TipoSubActividad;
  estadoFlujo?: EstadosActividades;
}
