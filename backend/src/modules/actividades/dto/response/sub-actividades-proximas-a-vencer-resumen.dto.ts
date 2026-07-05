import { ApiProperty } from '@nestjs/swagger';
import { EstadosSemaforo } from 'src/domain/semaforo/estados-semaforo-enum';

export class SubActividadesProximasAVencerResumen {
  @ApiProperty({
    example: 'sub-act-uuid-1',
    description: 'Identificador único (UUID) de la actividad',
  })
  id!: string;

  @ApiProperty({
    example: 'Auditoría de Ingresos Autogenerados',
    description: 'Título de la sub-actividad próxima a vencer',
  })
  titulo!: string;

  @ApiProperty({
    example: '2026-06-19',
    description: 'Date-string con la fecha en la que se vence la sub-actividad',
  })
  fecha_vencimiento!: string;

  @ApiProperty({
    example: EstadosSemaforo.A_TIEMPO,
    description: 'Estado del semaforo en la que se encuentra la sub-actividad',
  })
  estado_semaforo!: EstadosSemaforo;

  @ApiProperty({
    example: 'Faltan 2 días',
    description: 'Descripción relevante sobre la cuota de tiempo',
  })
  etiqueta_tiempo!: string;
}
