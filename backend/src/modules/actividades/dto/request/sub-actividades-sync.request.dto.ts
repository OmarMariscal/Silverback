import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubActividadDetallesSync } from './sub-actividades-detalles-sync.dto';

export class SubActividadesSyncRequest {
  @ApiProperty({
    description:
      'Arreglo de sub-actividades para crear y editar simultáneamente',
    type: [SubActividadDetallesSync],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubActividadDetallesSync)
  sub_actividades!: SubActividadDetallesSync[];
}
