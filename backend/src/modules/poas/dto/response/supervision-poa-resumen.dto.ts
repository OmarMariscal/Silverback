import { ApiProperty } from '@nestjs/swagger';
import { EstadosPoa } from '@domain/poa/estados-poa.enum';

export class SupervisionPoaResumenDto {
  @ApiProperty({ example: 'poa-uuid-cucei-2026' })
  id: string;

  @ApiProperty({ example: 2026 })
  anio_fiscal: number;

  @ApiProperty({ enum: EstadosPoa, example: EstadosPoa.EN_REVISION })
  estado: EstadosPoa;

  @ApiProperty({
    description:
      'Momento en que el contralor presentó la POA (ISO 8601). Null si nunca se ha enviado.',
    type: String,
    nullable: true,
    example: '2026-09-11T09:30:00.000Z',
  })
  fecha_envio: string | null;

  @ApiProperty({
    description:
      'Promedio de avance de las actividades. Solo se calcula para POAs autorizadas.',
    type: Number,
    nullable: true,
    example: 68.0,
  })
  porcentaje_avance_global: number | null;
}