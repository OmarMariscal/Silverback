import { ApiProperty } from '@nestjs/swagger';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';
import { PoaDeCentroCentroDto } from './poa-de-centro-centro.dto';
import { PoaDeCentroContralorDto } from './poa-de-centro-contralor.dto';

export class PoaDeCentroPoaDto {
  @ApiProperty({ example: 'poa-uuid-cucei-2026' })
  id: string;

  @ApiProperty({ example: 2026 })
  anio_fiscal: number;

  @ApiProperty({ enum: EstadosPoa, example: EstadosPoa.EN_REVISION })
  estado: EstadosPoa;

  @ApiProperty({
    description: 'Mensaje de la Jefatura al devolver o autorizar la POA',
    type: String,
    nullable: true,
    example: null,
  })
  mensaje_resolucion: string | null;

  @ApiProperty({
    description:
      'Momento en que el contralor presentó la POA (ISO 8601). Null si nunca se ha enviado.',
    type: String,
    nullable: true,
    example: '2026-01-01T09:30:00.000Z',
  })
  fecha_envio: string | null;

  @ApiProperty({ type: PoaDeCentroCentroDto })
  centro: PoaDeCentroCentroDto;

  @ApiProperty({
    description: 'Contralor dueño de la POA',
    type: PoaDeCentroContralorDto,
  })
  contralor: PoaDeCentroContralorDto;
}