import { ApiProperty } from '@nestjs/swagger';

export class SubActividadesResumen {
  @ApiProperty({
    example: 'sub-op-uuid-1',
    description: 'Identificador único (UUID) de la subactividad registrada',
  })
  id!: string;

  @ApiProperty({
    example: '1.1',
    description: 'Número de orden individual de la subactividad',
  })
  numero_orden!: string;

  @ApiProperty({
    example: 8,
    description: 'Cálculo de las semanas totales que toma la subactividad',
  })
  semanas_totales!: number;
}
