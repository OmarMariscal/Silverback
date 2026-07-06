import { ApiProperty } from '@nestjs/swagger';
import { SubActividadesResumen } from './sub-actividades-resumen.dto';

export class SubActividadesBulkResponse {
  @ApiProperty({
    example: 'Se agregaron 2 sub-actividades exitosamente',
    description: 'Información relevante al resultado del proceso de bulk',
  })
  mensaje!: string;

  @ApiProperty({
    description: 'Array con el resumen de las sub-actividades agregadas',
    type: [SubActividadesResumen],
  })
  data!: SubActividadesResumen[];
}
