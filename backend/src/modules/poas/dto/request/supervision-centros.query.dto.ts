import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const HISTORIC_LIMIT_POR_DEFECTO = 3;

export class SupervisionCentrosQueryDto {
  @ApiPropertyOptional({
    description:
      'Número máximo de años históricos (anios_historicos) a mostrar por centro',
    minimum: 1,
    maximum: 10,
    default: HISTORIC_LIMIT_POR_DEFECTO,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  historic_limit?: number = HISTORIC_LIMIT_POR_DEFECTO;
}