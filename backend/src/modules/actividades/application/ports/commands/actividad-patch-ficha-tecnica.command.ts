import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { ActividadesPatchFichaTecnicaRequest } from '@modules/actividades/dto/request/actividades-path-ficha-tecnica.request.dto';

export interface ActividadPatchFichaTecnicaCommand {
  usuarioActual: SesionUsuario;
  actividadId: string;
  dto: ActividadesPatchFichaTecnicaRequest;
}
