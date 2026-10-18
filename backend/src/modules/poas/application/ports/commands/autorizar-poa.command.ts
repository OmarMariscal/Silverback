import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface AutorizarPoaCommand {
  usuarioActual: SesionUsuario;
  poaId: string;
}
