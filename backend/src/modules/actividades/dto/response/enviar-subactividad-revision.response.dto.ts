import { ApiProperty } from '@nestjs/swagger';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';

export class EnviarSubActividadRevisionResponseDto {
  @ApiProperty({
    description: 'UUID de la sub-actividad procesada',
    example: 'sub-act-uuid',
  })
  id!: string;

  @ApiProperty({
    enum: EstadosActividades,
    example: EstadosActividades.DEVUELTA,
    description: 'Estado operativo anterior antes de la transición',
  })
  estado_anterior!: EstadosActividades;

  @ApiProperty({
    enum: EstadosActividades,
    example: EstadosActividades.EN_REVISION,
    description: 'Nuevo estado operativo alcanzado',
  })
  estado_nuevo!: EstadosActividades;

  @ApiProperty({
    description: 'Número de versión secuencial incrementado',
    example: 4,
  })
  nueva_version!: number;

  @ApiProperty({
    description:
      'Fecha y hora ISO 8601 en que se registró formalmente la entrega',
    example: '2026-10-30T19:54:00Z',
  })
  fecha_envio!: string;

  @ApiProperty({
    description: 'Mensaje descriptivo de confirmación',
    example:
      'La sub-actividad ha sido enviada exitosamente a la Jefatura para su revisión.',
  })
  mensaje!: string;
}
