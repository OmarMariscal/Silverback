import { PoaActividadResumenResult } from './poa-actividad-resumen.result';

export interface PoaActualResult {
  id: string;
  anio_fiscal: number;
  fecha_inicio: Date;
  fecha_termino: Date;

  //Resumen de las actividades
  actividades_resumen: PoaActividadResumenResult[];
}
