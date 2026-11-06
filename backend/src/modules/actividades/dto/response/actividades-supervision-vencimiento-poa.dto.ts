import { ApiProperty } from '@nestjs/swagger';

export class ActividadesSupervicionVencimientoPoa {
  @ApiProperty({
    example: '2026-01-29',
    description: 'Fecha de finalización estipulada en la POA',
  })
  fecha_texto!: string;

  @ApiProperty({
    example: 'Faltan 2 días',
    description:
      'Etiqueta relevante a la fecha de finalización en contraste con la fecha actual',
  })
  etiqueta!: string;
}
