import { ApiProperty } from '@nestjs/swagger';

export class ActividadesGetRangoFechas {
  @ApiProperty({
    example: '2026-03-30',
    description: 'Fecha de inicio de la sub-actividad',
  })
  inicio!: string;

  @ApiProperty({
    example: '2026-05-23',
    description: 'Fecha de término de la sub-actividad',
  })
  fin!: string;
}
