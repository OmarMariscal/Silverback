import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface ActividadGetFichaTecnicaQuery {
  usuarioActual: SesionUsuario;
  actividadId: string;
}
