import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export interface SubActividadSelectResult {
  id: string;
  folio: string;
  descripcion: string;
  tipo: TipoSubActividad;

  //Fechas son opcionales, solo si est;an ligadas a la POA cona nterioridad, las que vienen del banco vienen sin ellas.
  seleccionada: boolean;
  fecha_inicio?: Date;
  fecha_termino?: Date;
}
