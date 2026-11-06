import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ActividadesCrearFichaTecnica } from './actividades-crear-ficha-tecnica.dto';

export class ActividadesPatchFichaTecnicaRequest extends PartialType(
  ActividadesCrearFichaTecnica,
) {
  @ApiPropertyOptional({
    description:
      'Array con los intificadores únicos (UUID) de los auditores asociados',
    example: ['auditor-uuid-1', 'auditor-uuid-2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  auditores_ids?: string[];
}
