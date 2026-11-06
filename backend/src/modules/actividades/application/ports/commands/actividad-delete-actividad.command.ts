import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface ActividadDeleteActividadCommand {
  usuarioActual: SesionUsuario;
  actividadId: string;
}
