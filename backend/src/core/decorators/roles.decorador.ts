import { SetMetadata } from '@nestjs/common';
import { Permisos } from '../../domain/roles/permisos.enum';

export const PERMISOS_KEY = 'permisos';

// Acepta uno o varios permisos.
export const RequirePermissions = (...permisos: Permisos[]) =>
  SetMetadata(PERMISOS_KEY, permisos);
