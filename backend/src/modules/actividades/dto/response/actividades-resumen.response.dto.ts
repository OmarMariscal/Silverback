import { ApiProperty } from '@nestjs/swagger';

export class ActividadesResumenResponse {
  @ApiProperty({
    example: 'act-uuid-1',
    description: 'Identificador único (UUID) de la actividad principal',
  })
  id!: string;

  @ApiProperty({
    example: 'Revisión al rubro de obra pública',
    description: 'Título de la actividad general',
  })
  titulo!: string;

  @ApiProperty({
    example: 'Concluir y cerrar la revisión de la auditoría no. 055/2025...',
    description: 'Justificación técnica de la actividad principal',
  })
  justificacion!: string;

  @ApiProperty({
    example: 'Verificar el adecuado cumplimiento en la integración...',
    description: 'Objetivo general de la actividad principal',
  })
  objetivo_general!: string;

  @ApiProperty({
    example:
      '1. Revisión de bitácoras de obra y estimaciones pagadas. 2. Comprobación física de los avances de obra contra lo reportado en los informes financieros. 3. Validación de contratos y licitaciones.',
    description: 'Objetivos particulares de la actividad principal',
  })
  objetivos_particulares!: string;

  @ApiProperty({
    example:
      'Emisión de Cédula de Observaciones y Recomendaciones del rubro de obra pública.',
    description: 'Meta registrada en la actividad principal',
  })
  meta_del_proyecto!: string;

  @ApiProperty({
    example:
      'Número de obras revisadas física y documentalmente / Número de obras ejecutadas en el periodo',
    description: 'Indicadores descritos en la actividad principal',
  })
  indicadores!: string;
}
