import { ApiProperty } from '@nestjs/swagger';
import { ActividadesGetRangoFechas } from './actividades-get-rango-fechas.dto';
import { ActividadesGetEstadoEjecucion } from './actividades-get-estado-ejecucion.dto';

export class ActividadesGetData {
  @ApiProperty({
    example: 'act-uuid-1',
    description: 'Identificador único (UUID) de la sub-actividad',
  })
  id!: string;

  @ApiProperty({
    example: 'Auditorias pendientes de concluir de ejercicios anteriores',
    description: 'Título de la sub-actividad',
  })
  titulo!: string;

  @ApiProperty({
    default: 'Rango de fechas en registro de la sub-actividad',
    type: ActividadesGetRangoFechas,
  })
  rango_fechas!: ActividadesGetRangoFechas;

  @ApiProperty({
    description: 'Información relevante al estado actual de la sub-actividad',
    type: ActividadesGetEstadoEjecucion,
  })
  estado_ejecucion!: ActividadesGetEstadoEjecucion;
}
