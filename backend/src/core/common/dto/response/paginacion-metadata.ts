import { ApiProperty } from '@nestjs/swagger';

export class PaginacionMetadata {
  @ApiProperty({
    example: 45,
    description: 'Total de registros encontrados en la base de datos',
  })
  total_registros!: number;

  @ApiProperty({
    example: 1,
    description: 'Página enviada en el get actual',
  })
  pagina_actual!: number;

  @ApiProperty({
    example: 9,
    description: 'Total de páginas en las que se dividió la respuesta',
  })
  total_paginas!: number;

  @ApiProperty({
    example: 10,
    description: 'Límite de registros por página',
    required: false,
  })
  limite?: number;
}
