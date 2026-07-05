import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/domain/roles/roles.enum';

export class ActividadesDirectorioAsignacionJefa {
  @ApiProperty({ enum: Roles, example: Roles.JEFA })
  tipo_vista!: Roles.JEFA;

  @ApiProperty({ example: 'CUCEI' })
  centro_clave!: string;

  @ApiProperty({ example: 'Mtro. Braulio Vicente' })
  contralor!: string;
}

// actividades-directorio-asignacion-contralor.dto.ts
export class ActividadesDirectorioAsignacionContralor {
  @ApiProperty({ enum: Roles, example: Roles.CONTRALOR })
  tipo_vista!: Roles.CONTRALOR;

  @ApiProperty({ example: 100 })
  participacion_porcentaje!: number;

  @ApiProperty({ example: null, nullable: true })
  auditor_apoyo!: string | null;
}
