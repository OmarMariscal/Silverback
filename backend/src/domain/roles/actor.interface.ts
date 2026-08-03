import { Permisos } from './permisos.enum';
import { Roles } from './roles.enum';

export interface Actor {
  rol: Roles;
  permisos: Permisos[];
}
