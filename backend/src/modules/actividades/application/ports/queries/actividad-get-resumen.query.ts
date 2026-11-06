import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface ActividadGetResumenQuery {
  usuarioActual: SesionUsuario;
  actividadId: string;
}
