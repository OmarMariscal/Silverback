import { ApiProperty } from '@nestjs/swagger';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';

export class DevolverPoaResponseDto {
  @ApiProperty({
    description: 'UUID de la POA devuelta',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  poa_id: string;

  @ApiProperty({
    description: 'Estado anterior de la POA',
    example: EstadosPoa.EN_REVISION,
  })
  estado_anterior: EstadosPoa;

  @ApiProperty({
    description: 'Estado actual de la POA',
    example: EstadosPoa.DEVUELTA,
  })
  estado_nuevo: EstadosPoa;

  @ApiProperty({
    description: 'Fecha de la devolución de la POA (Fecha de Ejecución)',
    example: '2026-08-11T16:15:00.000Z',
  })
  fecha_devolucion: string;

  @ApiProperty({
    description: 'Mensaje de estado del endpoint',
    example: 'El POA ha sido devuelto al contralor con observaciones',
  })
  mensaje: string;
}
