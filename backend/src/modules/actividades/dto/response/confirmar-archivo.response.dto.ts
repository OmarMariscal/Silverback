import { ApiProperty } from '@nestjs/swagger';
import { EstadosArchivoEvidencia } from '@domain/actividad/estados-archivo-evidencia.enum';

export class ConfirmarArchivoResponseDto {
  @ApiProperty({
    description: 'UUID único de la evidencia confirmada',
    example: 'uuid-generado-por-el-backend',
  })
  id!: string;

  @ApiProperty({
    description: 'Nombre original sanitizado del archivo',
    example: 'reporte_asistencia_marzo.pdf',
  })
  nombre_original!: string;

  @ApiProperty({
    description: 'Peso formateado del archivo en megabytes',
    example: 2.38,
  })
  peso_mb!: number;

  @ApiProperty({
    description:
      'URL efímero o de descarga segura para visualizar el documento desde el buzón',
    example:
      'https://storage.midominio.com/poa/subactividades/sub-act-uuid/uuid-generado-por-tu-backend.pdf',
  })
  url_descarga!: string;

  @ApiProperty({
    enum: EstadosArchivoEvidencia,
    example: EstadosArchivoEvidencia.BORRADOR,
  })
  estado_archivo!: EstadosArchivoEvidencia;

  @ApiProperty({
    description: 'Mensaje descriptivo del éxito de la consolidación',
    example: 'Archivo xonsolidado correctamente en el buzón de evidencias',
  })
  mensaje!: string;
}
