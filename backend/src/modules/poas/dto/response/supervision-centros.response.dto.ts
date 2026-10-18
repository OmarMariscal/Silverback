import { ApiProperty } from '@nestjs/swagger';
import { SupervisionCentroDto } from './supervision-centro.dto';
import { SupervisionKpisGlobalesDto } from './supervision-kpis-globales.dto';

export class SupervisionCentrosResponseDto {
  @ApiProperty({ type: SupervisionKpisGlobalesDto })
  kpis_globales: SupervisionKpisGlobalesDto;

  @ApiProperty({ type: [SupervisionCentroDto] })
  centros: SupervisionCentroDto[];
}