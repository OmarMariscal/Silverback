import { EstadosPoa } from '@domain/poa/estados-poa.enum';
import { PoaActividadResumenResult } from './poa-actividad-resumen.result';

export interface PoaActualResult {
  id: string;
  estado: EstadosPoa;
  anioFiscal: number;
  fechaInicio: Date | null;
  fechaTermino: Date | null;

  //Resumen de las actividades
  actividadesResumen: PoaActividadResumenResult[];
}
