import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class GenerarPreFirmaRequestDto {
  @ApiProperty({
    description: 'Nombre original del archivo con extensión',
    example: 'reporte_asistencia_marzo.pdf',
  })
  @IsString()
  nombre_archivo!: string;

  @ApiProperty({
    description:
      'MIME type del archivo para asegurar la validación en S3/SeaweedFS',
    example: 'application/pdf',
  })
  @IsString()
  mime_type!: string;

  @ApiProperty({
    description: 'Peso del archivo en bytes (Máximo 50MB / 52,428,800 bytes',
    example: 2500000,
  })
  @IsNumber()
  @Min(1)
  @Max(52428800) // 50MB
  peso_bytes!: number;
}
