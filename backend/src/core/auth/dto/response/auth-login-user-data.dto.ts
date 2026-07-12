import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@domain/roles/roles.enum';

export class AuthLoginUserData {
  @ApiProperty({
    example: 'uuid-usuario-123',
    description: 'ID general del usuario',
  })
  id: string;

  @ApiProperty({
    example: 'Mtro. Braulio Vicente',
    description: 'Nombre para mostrar en la UI',
  })
  nombre_completo: string;

  @ApiProperty({
    example: Roles.CONTRALOR,
    enum: Roles,
    enumName: 'Rol',
    description: 'Rol de la sesión inciada',
  })
  rol: Roles;

  @ApiProperty({
    example: 'uuid-cucei',
    description: 'UID del centro universitario',
    nullable: true,
  })
  centro_id?: string | null;

  @ApiProperty({
    example: 'uuid-perfil-456',
    description: 'El ID de su perfil específico',
  })
  perfil_id: string;
}
