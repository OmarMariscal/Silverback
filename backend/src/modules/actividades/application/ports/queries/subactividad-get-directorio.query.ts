import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { SubActividadesDirectorioQueryDto } from '@modules/actividades/dto/request/actividades-directorio.query.dto';

export interface SubActividadDirectorioQuery {
  usuarioActual: SesionUsuario;
  dto: SubActividadesDirectorioQueryDto;
}
