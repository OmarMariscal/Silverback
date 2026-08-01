import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { TipoSubActividad } from '@domain/actividad/tipos-de-actividades.enum';

export interface SubActividadesDirectorioResult {
  id: string;
  identificador: string | null;
  tipo: TipoSubActividad;
  titulo: string;
  fecha_termino: Date;

  // Atributos que varían según la vista (null es más seguro para Prisma)
  centro_clave: string | null;
  contralor: string | null;
  participacion_porcentaje: number | null;
  auditor_apoyo: string | null;

  // Atributos del estado operativo
  codigo_estado: EstadosActividades;

  // Ingrediente vital para calcular la etiqueta: 'Devuelta (3 Obs)'
  cantidad_observaciones: number;
}
