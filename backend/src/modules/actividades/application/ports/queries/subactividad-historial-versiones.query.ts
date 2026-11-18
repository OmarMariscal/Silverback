// [TASK-06] Query objects para historial de versiones y descarga de archivos
import type { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface SubActividadHistorialQuery {
  usuarioActual: SesionUsuario;
  subActividadId: string;
}

export interface SubActividadVersionDetalleQuery {
  usuarioActual: SesionUsuario;
  subActividadId: string;
  versionId: string;
}

export interface SubActividadLinkDescargaQuery {
  usuarioActual: SesionUsuario;
  subActividadId: string;
  versionId: string;
  archivoId: string;
}
