import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface SubActividadEliminarArchivoCommand {
  usuarioActual: SesionUsuario;
  subActividadId: string;
  archivoId: string;
}
