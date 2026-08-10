import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SubActividadesProximasAVencerQueryDto {
  @ApiPropertyOptional({
    example: 4,
    description: 'Cantidad máxima de actividades a retornar para la interfaz',
    default: 4,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un entero' })
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(20, { message: 'El límite máximo es 20' })
  limit: number = 4;
}
