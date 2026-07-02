import { ApiProperty } from '@nestjs/swagger';

export class FichaTecnicaResponse {
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
    example: 'Conclusión de la verificación de los procesos',
    description: 'Objetivos particulares de la actividad principal',
  })
  objetivos_particulares!: string;
}
