import { ApiProperty } from '@nestjs/swagger';
import { SupervisionContralorActualDto } from './supervision-contralor-actual.dto';
import { SupervisionPoaResumenDto } from './supervision-poa-resumen.dto';

export class SupervisionCentroDto {
  @ApiProperty({ example: 'centro-uuid-cucei' })
  id: string;

  @ApiProperty({ example: 'CUCEI' })
  clave: string;

  @ApiProperty({
    example: 'Centro Universitario de Ciencias Exactas e Ingenierías',
  })
  nombre: string;

  @ApiProperty({
    description:
      'Contralor vigente del centro. Null si el centro no tiene uno activo.',
    type: SupervisionContralorActualDto,
    nullable: true,
  })
  contralor_actual: SupervisionContralorActualDto | null;

  @ApiProperty({
    description:
      'Años con POA, del más reciente al más antiguo (limitado por historic_limit)',
    type: [Number],
    example: [2026, 2025, 2024],
  })
  anios_historicos: number[];

  @ApiProperty({
    description:
      'Resumen de la POA del año vigente. Null si el centro no tiene POA este año.',
    type: SupervisionPoaResumenDto,
    nullable: true,
  })
  poa_resumen_anio_actual: SupervisionPoaResumenDto | null;
}