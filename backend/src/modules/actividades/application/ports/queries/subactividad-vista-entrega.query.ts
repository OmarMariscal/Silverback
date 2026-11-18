// [TASK-04] Query object para obtener la vista de entrega de una sub-actividad
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface SubActividadVistaEntregaQuery {
  usuarioActual: SesionUsuario;
  subActividadId: string;
}
