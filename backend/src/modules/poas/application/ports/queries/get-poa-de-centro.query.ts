import { SesionUsuario } from '@core/interfaces/sesion-usuario.interface';

export interface GetPoaDeCentroQuery {
  usuarioActual: SesionUsuario;
  centroId: string;
  /** Si no se envía, se usa el año fiscal vigente */
  anio?: number;
}