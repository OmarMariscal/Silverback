import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { DevolverPoaDto } from '@modules/poas/dto/request/poas-devolver.dto';

export interface DevolverPoaCommand {
  usuarioActual: SesionUsuario;
  poaId: string;
  dto: DevolverPoaDto;
}
