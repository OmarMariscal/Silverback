import { ApiProperty } from '@nestjs/swagger';
import { SupervisionCentroDto } from '../../../poas/dto/response/supervision-centro.dto';
import { SupervisionKpisGlobalesDto } from '../../../poas/dto/response/supervision-kpis-globales.dto';

export class SupervisionCentrosResponseDto {
  @ApiProperty({ type: SupervisionKpisGlobalesDto })
  kpis_globales: SupervisionKpisGlobalesDto;

  @ApiProperty({ type: [SupervisionCentroDto] })
  centros: SupervisionCentroDto[];
}