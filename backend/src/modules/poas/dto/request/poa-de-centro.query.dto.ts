import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PoaDeCentroQueryDto {
  @ApiPropertyOptional({
    description: 'Año fiscal de la POA. Si se omite, se usa el año vigente.',
    minimum: 2000,
    maximum: 2100,
    example: 2026,
  })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  anio?: number;
}