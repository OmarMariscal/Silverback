import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';

export interface SubActividadSupervisionResult {
  id: string;
  titulo: string;
  estado_resolucion: EstadosActividades;
  fecha_envio: Date;
  fecha_vencimiento_poa: Date;
}
