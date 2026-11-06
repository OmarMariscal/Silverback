import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { SubActividadesProximasAVencerQueryDto } from '@modules/actividades/dto/request/sub-actividades-proximas-a-vencer.query.dto';

export interface SubActividadProximasAVencerQuery {
  usuarioActual: SesionUsuario;
  dto: SubActividadesProximasAVencerQueryDto;
}
