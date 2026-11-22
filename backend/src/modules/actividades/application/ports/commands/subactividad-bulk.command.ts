import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { SubActividadesBulkRequest } from '@modules/actividades/dto/request/sub-actividades-bulk.request.dto';

export interface SubActividadBulkQuery {
  usuarioActual: SesionUsuario;
  actividadId: string;
  dto: SubActividadesBulkRequest;
}
