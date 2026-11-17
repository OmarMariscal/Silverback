import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface SubActividadConfirmarArchivoCommand {
  usuarioActual: SesionUsuario;
  subActividadId: string;
  archivoId: string;
}
