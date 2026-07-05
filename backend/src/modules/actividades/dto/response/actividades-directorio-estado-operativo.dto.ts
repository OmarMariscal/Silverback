import { ApiProperty } from '@nestjs/swagger';
import { EstadosActividades } from 'src/domain/actividad/estados-actividades.enum';

export class ActividadesDirectorioEstadoOperativo {
  @ApiProperty({
    enum: EstadosActividades,
    example: EstadosActividades.DEVUELTA,
    enumName: 'Estado de la Actividad',
    default: 'Estado actual de la sub-actividad',
  })
  codigo!: EstadosActividades;

  @ApiProperty({
    example: 'Devuleta (3 Obs)',
    description:
      'Etiqueta relevente al estado de la actividad. Puede estar vacío cuando el estado lo amerite',
  })
  etiqueta!: string | null;
}
