import { ApiProperty } from '@nestjs/swagger';

export class SupervisionContralorActualDto {
  @ApiProperty({ example: 'Lic. Carlos Mendoza' })
  nombre_completo: string;

  @ApiProperty({ enum: ['Activo', 'Inactivo'], example: 'Activo' })
  estatus: 'Activo' | 'Inactivo';
}