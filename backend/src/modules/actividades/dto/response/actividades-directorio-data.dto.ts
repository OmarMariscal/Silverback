import { ApiProperty } from '@nestjs/swagger';
import { TipoSubActividad } from 'src/domain/actividad/tipos-de-actividades.enum';
import { ActividadesDirectorioAsignacion } from './actividades-directorio-asignacion.dto';
import { ActividadesDirectorioEstadoOperativo } from './actividades-directorio-estado-operativo.dto';
import { EstadosSemaforo } from 'src/domain/semaforo/estados-semaforo-enum';

export class ActividadesDirectorioData {
  @ApiProperty({
    example: 'act-uuid-1',
    description: 'Identificador único (UUID) de la sub-actividad',
  })
  id!: string;

  @ApiProperty({
    example: 'No. 055',
    description: 'Identificador único proveniente del acta.',
  })
  identificador!: string | null;

  @ApiProperty({
    enum: TipoSubActividad,
    enumName: 'Tipo de la sub-actividad',
    example: TipoSubActividad.AUDITORIA,
    description: 'Tipo definido de la sub-actividad',
  })
  tipo!: TipoSubActividad;

  @ApiProperty({
    example:
      'Abatir el rezago en solventación de observaciones (Adquisiciones)',
    description: 'Título de la actividad en cuestión',
  })
  titulo!: string;

  @ApiProperty({
    example: 'Mar 2026',
    description: 'Fecha en formato reducido para visualización',
  })
  fecha_termino!: string;

  @ApiProperty({
    description:
      'Información sobre el tipo de la asignación relevante al centro y contralor',
    type: ActividadesDirectorioAsignacion,
  })
  asignacion!: ActividadesDirectorioAsignacion;

  @ApiProperty({
    description: 'Información del estado actual de la actividad',
    type: ActividadesDirectorioEstadoOperativo,
  })
  estado_operativo!: ActividadesDirectorioEstadoOperativo;

  @ApiProperty({
    enum: EstadosSemaforo,
    enumName: 'Semáforo',
    example: EstadosSemaforo.CRITICO,
    description: 'Estado del semáforo de la sub-actividad',
  })
  semaforo!: EstadosSemaforo;
}
