import { ApiProperty } from '@nestjs/swagger';

export class PoaDeCentroActividadDto {
  @ApiProperty({ example: 'act-uuid-05' })
  id: string;

  @ApiProperty({ example: '05' })
  folio: string;

  @ApiProperty({ example: 'Revisión de asistencia del Personal Académico' })
  titulo: string;

  @ApiProperty({
    description: 'Formato AAAA-MM-DD',
    type: String,
    nullable: true,
    example: '2026-01-15',
  })
  fecha_inicio: string | null;

  @ApiProperty({
    description: 'Formato AAAA-MM-DD',
    type: String,
    nullable: true,
    example: '2026-12-31',
  })
  fecha_termino: string | null;

  @ApiProperty({
    description: 'Avance global de la actividad (0 a 100)',
    example: 50.0,
  })
  porcentaje_global: number;

  @ApiProperty({ type: [String], example: ['Lic. Auditor Auxiliar'] })
  auditores: string[];
}