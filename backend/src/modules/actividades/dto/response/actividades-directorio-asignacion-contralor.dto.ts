import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@domain/roles/roles.enum';

export class ActividadesDirectorioAsignacionContralor {
  @ApiProperty({
    enum: Roles,
    example: Roles.CONTRALOR,
    enumName: 'Rol',
    description: 'Rol del usuario',
  })
  tipo_vista!: Roles.CONTRALOR;

  @ApiProperty({
    example: 100,
    description: 'Porcentaje de participación asignado',
  })
  participacion_porcentaje!: number;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Auditor de apoyo',
    type: 'string',
  })
  auditor_apoyo!: string | null;
}
