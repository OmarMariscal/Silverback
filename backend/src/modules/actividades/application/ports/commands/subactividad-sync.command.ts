import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { SubActividadesSyncRequest } from '@modules/actividades/dto/request/sub-actividades-sync.request.dto';

export interface SubActividadSyncQuery {
  usuarioActual: SesionUsuario;
  actividadId: string;
  dto: SubActividadesSyncRequest;
}
