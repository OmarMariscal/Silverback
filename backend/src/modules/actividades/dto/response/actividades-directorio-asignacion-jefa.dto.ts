import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@domain/roles/roles.enum';

export class ActividadesDirectorioAsignacionJefa {
  @ApiProperty({ enum: Roles, example: Roles.JEFA })
  tipo_vista!: Roles.JEFA;

  @ApiProperty({ example: 'CUCEI' })
  centro_clave!: string;

  @ApiProperty({ example: 'Mtro. Braulio Vicente' })
  contralor!: string;
}
