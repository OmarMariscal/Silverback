import { Roles } from '@domain/roles/roles.enum';

export class JwtPayloadDto {
  usuario_id: string;
  rol: Roles;
  centro_id?: string | null;
  perfil_id: string;
}
