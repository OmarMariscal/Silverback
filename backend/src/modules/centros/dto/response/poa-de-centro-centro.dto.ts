import { ApiProperty } from '@nestjs/swagger';

export class PoaDeCentroCentroDto {
  @ApiProperty({ example: 'CUCEI' })
  clave: string;

  @ApiProperty({
    example: 'Centro Universitario de Ciencias Exactas e Ingenierías',
  })
  nombre: string;
}