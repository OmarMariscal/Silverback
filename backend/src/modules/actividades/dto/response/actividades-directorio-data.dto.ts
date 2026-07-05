import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { TipoSubActividad } from 'src/domain/actividad/tipos-de-actividades.enum';
import { ActividadesDirectorioAsignacionJefa } from './actividades-directorio-asignacion-jefa.dto';
import { ActividadesDirectorioAsignacionContralor } from './actividades-directorio-asignacion-jefa.dto';
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
    example: '2026-05-23',
    description: 'Fecha en formato reducido para visualización',
  })
  fecha_termino!: string;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ActividadesDirectorioAsignacionJefa) },
      { $ref: getSchemaPath(ActividadesDirectorioAsignacionContralor) },
    ],
    discriminator: {
      propertyName: 'tipo_vista',
      mapping: {
        JEFA: getSchemaPath(ActividadesDirectorioAsignacionJefa),
        CONTRALOR: getSchemaPath(ActividadesDirectorioAsignacionContralor),
      },
    },
  })
  asignacion!:
    | ActividadesDirectorioAsignacionJefa
    | ActividadesDirectorioAsignacionContralor;

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
