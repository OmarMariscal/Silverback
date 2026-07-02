import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubActividadDetalles } from './sub-actividades-detalles.dto';

export class SubActividadesBulkRequest {
  @ApiProperty({
    description: 'Array de subactividades y sus características',
    type: [SubActividadDetalles],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubActividadDetalles)
  sub_actividades!: SubActividadDetalles[];
}
