import { PaginacionQueryDto } from '@core/common/dto/request/paginacion.query.dto';
import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface SubActividadGetSupervisionQuery {
  usuarioActual: SesionUsuario;
  paginacionDto: PaginacionQueryDto;
}
