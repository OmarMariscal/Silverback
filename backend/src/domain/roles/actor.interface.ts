import { Roles } from './roles.enum';

export interface Actor {
  rol: Roles;
  tienePermisos: boolean;
}
