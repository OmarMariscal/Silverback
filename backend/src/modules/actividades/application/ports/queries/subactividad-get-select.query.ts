import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface SubActividadGetSelectQuery {
  usuarioActual: SesionUsuario;
  actividadId: string;
}
