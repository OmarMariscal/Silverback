import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';
import { EstadosSemaforo } from '@domain/semaforo/estados-semaforo-enum';

export interface KpiDetalleRiesgo {
  //Resumen de Detalles
  folio: string;
  descripcion: string;
  //Atributos de la sub-actividad
  subActividadId: string;
  tipoSubActividad: TipoSubActividad;
  fechaLimite: Date;
  estadoSemaforo: EstadosSemaforo;
  etiquetaAlerta: string;
}
