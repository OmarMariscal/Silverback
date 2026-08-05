import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { CrearActividadesDto } from '@modules/poas/dto/request/poa-actividades.dto';

export interface AgregarActividadCommand {
  poaId: string;
  usuario: SesionUsuario;
  dto: CrearActividadesDto;
}
