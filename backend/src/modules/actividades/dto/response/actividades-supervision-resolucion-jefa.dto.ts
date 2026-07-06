import { ApiProperty } from '@nestjs/swagger';
import { EstadosActividades } from '@domain/actividad/estados-actividades.enum';
import { EstadosSemaforo } from '@domain/semaforo/estados-semaforo-enum';

export class ActividadesSupervisionResolucionJefa {
  @ApiProperty({
    example: EstadosActividades.DEVUELTA,
    description: 'Estado actual de la sub-actividad',
  })
  estado!: EstadosActividades;

  @ApiProperty({
    example: 'Devuelto con 3 observaciones',
    description: 'Mensaje relevante al por qué de la devolución',
  })
  mensaje!: string;

  @ApiProperty({
    example: EstadosSemaforo.CRITICO,
    description: 'Estado actual del semaforo de la sub-actividad',
  })
  semaforo!: EstadosSemaforo;
}
