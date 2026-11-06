import { ApiProperty } from '@nestjs/swagger';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';

export class AutorizarPoaResponseDto {
  @ApiProperty({
    description: 'UUID de la POA',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  poa_id: string;

  @ApiProperty({
    description: 'Estado nterior de la POA',
    example: EstadosPoa.EN_REVISION,
  })
  estado_anterior: EstadosPoa;

  @ApiProperty({
    description: 'Estado actual de la POA',
    example: EstadosPoa.AUTORIZADA,
  })
  estado_nuevo: EstadosPoa;

  @ApiProperty({
    description: 'Fecha de autorización de la POA (Fecha de Ejecución)',
    example: '2026-08-10T09:30:00.000Z',
  })
  fecha_autorizacion: string;

  @ApiProperty({
    description: 'Mensaje de la operación',
    example: 'El POA ha sido autorizado correctamente',
  })
  mensaje: string;
}
