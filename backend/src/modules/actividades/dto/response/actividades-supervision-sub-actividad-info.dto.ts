import { ApiProperty } from '@nestjs/swagger';

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
}
