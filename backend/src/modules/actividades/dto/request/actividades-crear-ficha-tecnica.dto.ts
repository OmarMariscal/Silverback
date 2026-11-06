import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActividadesCrearFichaTecnica {
  @ApiProperty({
    example: 'Revisión al rubro de obra pública',
    description: 'Titulo central de la actividad',
  })
  @IsNotEmpty()
  @IsString()
  titulo!: string;

  @ApiProperty({
    example: 'Concluir y cerrar la revisión de la auditoria No. 055',
    description: 'Justificación general adjunto a la ficha técnica',
  })
  @IsNotEmpty()
  @IsString()
  justificacion!: string;

  @ApiProperty({
    example: 'Verificar el adecuado comportamiento de ...',
    description: 'Objetivo general de la actividad principal',
  })
  @IsNotEmpty()
  @IsString()
  objetivo_general!: string;

  @ApiProperty({
    example: '1. Revisión de bitácoras. 2. Comprobación física de medidas',
    description: 'Objetivos particulares de la actividad principal',
  })
  @IsNotEmpty()
  @IsString()
  objetivos_particulares!: string;

  @ApiProperty({
    example: 'Cumplimiento del estatuto 23 del acuerdo con Hacienda',
    description: 'Meta general de la actividad principal',
  })
  @IsNotEmpty()
  @IsString()
  meta_del_proyecto!: string;

  @ApiProperty({
    example:
      '1. Reducción del 23% de costos de medición. 2. Cumplimiento de los estándares de Hacienda',
    description: 'Indicadores de la actividad principal',
  })
  @IsNotEmpty()
  @IsString()
  indicadores!: string;
}
