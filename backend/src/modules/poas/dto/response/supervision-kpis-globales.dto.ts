import { ApiProperty } from '@nestjs/swagger';

export class SupervisionKpisGlobalesDto {
  @ApiProperty({
    description: 'Centros bajo la jurisdicción de la Jefa',
    example: 15,
  })
  total_centros: number;

  @ApiProperty({
    description: 'Centros con POA del año vigente en revisión',
    example: 3,
  })
  por_autorizar: number;

  @ApiProperty({
    description: 'Centros con POA del año vigente devuelta',
    example: 2,
  })
  devueltas: number;

  @ApiProperty({
    description: 'Centros con POA del año vigente autorizada',
    example: 9,
  })
  autorizadas: number;
}