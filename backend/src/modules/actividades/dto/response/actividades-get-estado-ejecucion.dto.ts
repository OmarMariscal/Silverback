import { ApiProperty } from '@nestjs/swagger';
import { EstadosActividades } from 'src/domain/actividad/estados-actividades.enum';

export class ActividadesGetEstadoEjecucion {
  @ApiProperty({
    enum: EstadosActividades,
    enumName: 'Estado',
    example: EstadosActividades.CONCLUIDA,
    description: 'Estado actual de la subactividad',
  })
  estado!: EstadosActividades;

  @ApiProperty({
    example: 'Fin: `2026-03-19`',
    description: 'Etiqueta relevante al estado de la sub-actividad',
  })
  etiqueta!: string;
}
