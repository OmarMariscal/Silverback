import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/domain/roles/roles.enum';

export class ActividadesDirectorioAsignacion {
  @ApiProperty({
    enum: Roles,
    enumName: 'Roles Permitidos',
    example: Roles.JEFA,
    description: 'Rol del cual viene el get',
  })
  tipo_vista!: Roles;

  @ApiProperty({
    example: 'CUCEI',
    description: 'Clave del centro universitario en caso de usarse como query',
  })
  centro_clave!: string;

  @ApiProperty({
    example: 'Mtro. Braulio Vicente',
    description: 'Nombre del Contralor principal',
  })
  contralor!: string;
}
