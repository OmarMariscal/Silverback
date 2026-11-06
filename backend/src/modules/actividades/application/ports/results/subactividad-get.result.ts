import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';

export interface SubActividadGetResult {
  id: string;
  titulo: string;
  fechaInicio: Date;
  fechaTermino: Date;
  estado: EstadosActividades;
}
