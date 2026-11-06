import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export interface SubActividadSupervisionResult {
  id: string;
  titulo: string;
  tipo: TipoSubActividad;
  estado_resolucion: EstadosActividades;
  fecha_envio: Date;
  fecha_vencimiento_poa: Date;
  conteo_observaciones: number;
}
