import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export interface FiltroActividades {
  usuarioUuid: string;
  contralorId?: string;
  centroUuid?: string;
  estado?: EstadosActividades;
  tipo?: TipoSubActividad;
}
