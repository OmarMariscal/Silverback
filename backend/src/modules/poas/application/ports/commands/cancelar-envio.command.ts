import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface CancelarEnvioCommand {
  usuarioActual: SesionUsuario;
  poaId: string;
}
