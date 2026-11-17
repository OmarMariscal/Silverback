import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';
import { GenerarPreFirmaRequestDto } from '@modules/actividades/dto/request/generar-pre-firma.request.dto';

export interface SubActividadGenerarPreFirmaCommand {
  usuarioActual: SesionUsuario;
  subActividadId: string;
  dto: GenerarPreFirmaRequestDto;
}
