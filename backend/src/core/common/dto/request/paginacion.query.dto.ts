import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsOptional, IsEnum } from 'class-validator';
import { OrdenamientoEnum } from './ordenamiento-enum';

export class PaginacionQueryDto {
  @ApiPropertyOptional({ description: 'Página actual', minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página',
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: OrdenamientoEnum,
    default: OrdenamientoEnum.DESC,
  })
  @IsOptional()
  @IsEnum(OrdenamientoEnum)
  order?: OrdenamientoEnum = OrdenamientoEnum.DESC;
}
