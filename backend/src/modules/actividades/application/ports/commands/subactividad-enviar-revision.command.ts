import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { EnviarSubActividadRevisionRequestDto } from '@modules/actividades/dto/request/enviar-subactividad-revision.request.dto';

export interface SubActividadEnviarRevisionCommand {
  usuarioActual: SesionUsuario;
  subActividadId: string;
  dto: EnviarSubActividadRevisionRequestDto;
}
