import { ApiProperty } from '@nestjs/swagger';

export class SubActividadesPoaFechas {
  @ApiProperty({
    example: '2026-03-20',
    description: 'Fecha de inicio previamente establecida',
  })
  fecha_inicio: string;

  @ApiProperty({
    example: '2026-05-12',
    description: 'Fecha de término previamente establecida',
  })
  fecha_termino: string;

  @ApiProperty({
    example: 7,
    description:
      'Número de semanas que hay entre la fecha de inicio y la fecha de término',
  })
  semanas: number;
}
