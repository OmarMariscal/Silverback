import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { SubActividadesGetQueryDto } from '@modules/actividades/dto/request/actividades-get.query.dto';

export interface SubActividadGetQuery {
  usuarioActual: SesionUsuario;
  dto: SubActividadesGetQueryDto;
}
