import { ApiProperty } from '@nestjs/swagger';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';

export class PresentarPoasDto {
  @ApiProperty({
    description: 'ID de la POA a presentar',
    type: String,
    example: 'uuid-poa-1234',
  })
  poa_id: string;

  @ApiProperty({
    description: 'Estado anterior de la POA',
    example: EstadosPoa.BORRADOR,
  })
  estado_anterior: EstadosPoa;

  @ApiProperty({
    description: 'Estado nuevo de la POA',
    example: EstadosPoa.EN_REVISION,
  })
  estado_nuevo: EstadosPoa;

  @ApiProperty({
    description: 'Fecha y hora en la que se envio la POA',
    type: String,
    example: '2026-06-28T19:30:00Z',
  })
  fecha_envio: string;

  @ApiProperty({
    description: 'ID de la POA a presentar',
    type: String,
    example: 'uuid-poa-1234',
  })
  mensaje: string;
}
