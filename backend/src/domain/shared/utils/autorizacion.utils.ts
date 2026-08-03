import { Actor } from '../../roles/actor.interface';
import { Permisos } from '../../roles/permisos.enum';
import { ReglaNegocioException } from '../../excepciones/regla-negocio.exception';
import { CodigoDeViolacion } from '../../codigos/codigo-violado.enum';

export function validarPermisoDeDominio(
  actor: Actor,
  permisoRequerido: Permisos,
  accion: string,
): void {
  const tienePermiso = actor.permisos.includes(permisoRequerido);

  if (tienePermiso) {
    return;
  }

  throw new ReglaNegocioException(
    `El actor con rol ${actor.rol} no cuenta con el permiso requerido (${permisoRequerido}) para ${accion}.`,
    CodigoDeViolacion.ROL_INVALIDO,
  );
}
