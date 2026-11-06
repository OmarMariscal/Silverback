import { ApiProperty } from '@nestjs/swagger';
import { ActividadesSupervisionResolucionJefa } from './actividades-supervision-resolucion-jefa.dto';
import { ActividadesSupervicionVencimientoPoa } from './actividades-supervision-vencimiento-poa.dto';

export class ActividadesSupervisionSubActividadInfo {
  @ApiProperty({
    example: 'sub-act-1',
    description: 'Identificador único (UUID) de la sub-actividad',
  })
  id!: string;

  @ApiProperty({
    example: 'Auditoría no. 055/2025 de Adquisiciones de Bienes',
    description: 'Título de la sub-actividad',
  })
  titulo!: string;

  @ApiProperty({
    example: 'Enviada hace 2 días',
    description: 'Etiqueta sobre el estado de la sub-actividad devuelta',
  })
  enviada_hace!: string;

  @ApiProperty({
    description: 'Información sobre la resolución de la jefa',
    type: ActividadesSupervisionResolucionJefa,
  })
  resolucion_jefa!: ActividadesSupervisionResolucionJefa;

  @ApiProperty({
    example: 'Fecha y etiqueta relevante a la información de la POA',
    type: ActividadesSupervicionVencimientoPoa,
  })
  vencimiento_poa!: ActividadesSupervicionVencimientoPoa;
}
