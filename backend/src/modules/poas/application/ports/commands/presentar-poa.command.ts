import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface PresentarPoaCommand {
  usuarioActual: SesionUsuario;
  poaId: string;
}
