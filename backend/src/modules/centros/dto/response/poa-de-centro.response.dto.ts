import { ApiProperty } from '@nestjs/swagger';
import { PoaDeCentroActividadDto } from './poa-de-centro-actividad.dto';
import { PoaDeCentroPoaDto } from './poa-de-centro-poa.dto';

export class PoaDeCentroResponseDto {
  @ApiProperty({ type: PoaDeCentroPoaDto })
  poa: PoaDeCentroPoaDto;

  @ApiProperty({ type: [PoaDeCentroActividadDto] })
  actividades: PoaDeCentroActividadDto[];
}