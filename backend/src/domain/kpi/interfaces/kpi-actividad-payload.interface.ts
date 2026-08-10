import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';

export interface KpiSubActividadPayLoad {
  id: string;
  estado: EstadosActividades;
  fechaTermino: Date;
  centroUniversitario?: {
    id: string;
    clave: string;
    nombre: string;
  };
}
