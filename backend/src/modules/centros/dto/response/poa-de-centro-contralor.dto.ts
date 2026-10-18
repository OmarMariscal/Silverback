import { ApiProperty } from '@nestjs/swagger';

export class PoaDeCentroContralorDto {
  @ApiProperty({ example: 'Mtro. Braulio Vicente' })
  nombre_completo: string;
}