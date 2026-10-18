import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface GetSupervisionCentrosQuery {
  usuarioActual: SesionUsuario;
  historicLimit: number;
}