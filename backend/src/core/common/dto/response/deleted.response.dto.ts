import { ApiProperty } from '@nestjs/swagger';

export class EliminacionCorrecta {
  @ApiProperty({
    example: true,
    description: 'Define si la eliminacion fue correctamente ejecutada',
  })
  status: boolean;

  @ApiProperty({
    example: 'Eliminacion realizada correctamente',
    description: 'Mensaje relativo a la operacion',
  })
  mensaje: string;
}
