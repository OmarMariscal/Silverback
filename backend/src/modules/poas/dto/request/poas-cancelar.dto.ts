import { ApiProperty } from '@nestjs/swagger';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';

export class CancelarPoaDto {
  @ApiProperty({
    description: 'ID de la POA a cancelar',
    type: String,
    example: 'uuid-poa-1234',
  })
  poa_id: string;

  @ApiProperty({
    description: 'Estado anterior de la POA',
    example: EstadosPoa.EN_REVISION,
  })
  estado_anterior: EstadosPoa;

  @ApiProperty({
    description: 'Estado nuevo de la POA',
    example: EstadosPoa.BORRADOR,
  })
  estado_nuevo: EstadosPoa;

  @ApiProperty({
    description: 'Fecha de cancelación de la POA',
    type: String,
    example: '2026-06-28T19:45:00Z',
  })
  fecha_cancelacion: string;

  @ApiProperty({
    description: 'Mensaje de cancelación de la POA',
    type: String,
    example:
      'El envío ha sido cancelado. El POA vuelve a estar disponible para su edición.',
  })
  mensaje: string;
}
