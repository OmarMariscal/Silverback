import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface SubActividadGetPoaQuery {
  usuarioActual: SesionUsuario;
  actividadId: string;
}
