import { ApiProperty } from '@nestjs/swagger';

export class SubActividadesSyncResume {
  @ApiProperty({
    example: 1,
    description: 'Número de sub-actividades creadas en la base de datos',
  })
  creadas!: number;

  @ApiProperty({
    example: 1,
    description: 'Número de sub-actividades editadas en la base de datos',
  })
  actualizadas!: number;

  @ApiProperty({
    example: 1,
    description: 'Número de sub-actividades eliminadas en la base de datos',
  })
  eliminadas!: number;
}
