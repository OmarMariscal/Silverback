import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export interface SubActividadPoaResult {
  id: string;
  folio: string;
  descripcion: string;
  tipo: TipoSubActividad;
  fecha_inicio: Date;
  fecha_termino: Date;
  semanas: number;
}
