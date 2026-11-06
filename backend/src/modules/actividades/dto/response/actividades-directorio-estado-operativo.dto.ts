import { ApiProperty } from '@nestjs/swagger';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';

export class ActividadesDirectorioEstadoOperativo {
  @ApiProperty({
    enum: EstadosActividades,
    example: EstadosActividades.DEVUELTA,
    enumName: 'EstadoActividad',
    description: 'Estado actual de la sub-actividad',
  })
  codigo!: EstadosActividades;

  @ApiProperty({
    example: 'Devuelta (3 Obs)',
    description:
      'Etiqueta relevente al estado de la actividad. Puede estar vacío cuando el estado lo amerite',
    nullable: true,
    type: 'string',
  })
  etiqueta!: string | null;
}
