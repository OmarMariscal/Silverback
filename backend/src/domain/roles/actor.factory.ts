import { Roles } from './roles.enum';
import { Actor } from './actor.interface';

export function crearActor(rolSolicitado: Roles, permisos?: boolean): Actor {
  return {
    rol: rolSolicitado,
    tienePermisos:
      rolSolicitado === Roles.JEFA || rolSolicitado === Roles.CONTRALOR
        ? true
        : (permisos ?? false),
  };
}
